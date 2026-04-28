# 🔐 INSTRUCTIONS BACKEND - Sécurité Password & JWT

**⚠️ ATTENTION CRITIQUE ⚠️**
Sans cette configuration, l'authentification ne fonctionnera PAS correctement.

---

## 1️⃣ Installation des Dépendances Symfony

```bash
composer require symfony/security symfony/security-bundle
composer require lexik/jwt-authentication-bundle
```

---

## 2️⃣ Configuration JWT (.env)

Générer les clés JWT:

```bash
mkdir -p config/jwt
openssl genrsa -out config/jwt/private.pem 4096
openssl rsa -in config/jwt/private.pem -pubout -out config/jwt/public.pem
```

Ajouter dans `.env`:

```env
###> lexik/jwt-authentication-bundle ###
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=
###< lexik/jwt-authentication-bundle ###
```

---

## 3️⃣ Entité User avec Password Hashé

```php
// src/Entity/User.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $username = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private ?string $password = null; // ⚠️ TOUJOURS HASHÉ!

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $firstName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $lastName = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'json')]
    private array $roles = ['ROLE_USER'];

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    // Getters / Setters
    public function getId(): ?int { return $this->id; }

    public function getUsername(): ?string { return $this->username; }
    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getPassword(): ?string { return $this->password; }
    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function getFirstName(): ?string { return $this->firstName; }
    public function setFirstName(?string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string { return $this->lastName; }
    public function setLastName(?string $lastName): self
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }

    // UserInterface requirements
    public function getRoles(): array { return $this->roles; }
    public function getSalt(): ?string { return null; } // Argon2 n'a pas besoin de salt
    public function eraseCredentials(): void {}
    public function getUserIdentifier(): string { return $this->username; }
}
```

---

## 4️⃣ Controller Register - HACHAGE OBLIGATOIRE

```php
// src/Controller/UserController.php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\PasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private PasswordHasherInterface $passwordHasher,  // ✅ Injecter le hasher
        private JWTTokenManagerInterface $jwtManager,
        private ValidatorInterface $validator,
    ) {}

    #[Route('/api/users', name: 'user_create', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation basique
        if (!isset($data['username'], $data['email'], $data['password'])) {
            return new JsonResponse(['error' => 'Missing required fields'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Vérifier que l'user n'existe pas
        $existing = $this->em->getRepository(User::class)
            ->findOneBy(['email' => $data['email']]);

        if ($existing) {
            return new JsonResponse(['error' => 'Email already exists'], JsonResponse::HTTP_CONFLICT);
        }

        // Créer le nouvel utilisateur
        $user = new User();
        $user->setUsername($data['username']);
        $user->setEmail($data['email']);
        $user->setFirstName($data['firstName'] ?? null);
        $user->setLastName($data['lastName'] ?? null);

        // ✅ HACHAGE DU PASSWORD - ÉTAPE CRITIQUE
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $data['password']
        );
        $user->setPassword($hashedPassword);

        // Sauvegarder
        $this->em->persist($user);
        $this->em->flush();

        // Générer le JWT token
        $token = $this->jwtManager->create($user);

        return new JsonResponse([
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
            ]
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/api/user/profile', name: 'user_profile', methods: ['GET'])]
    public function getProfile(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'createdAt' => $user->getCreatedAt()?->format('Y-m-d\TH:i:s\Z'),
        ]);
    }
}
```

---

## 5️⃣ Controller Login

```php
// Le JWT bundle gère automatiquement /api/login_check

// Juste vérifier que la route est configurée dans security.yaml:
```

Vérifier dans `config/packages/security.yaml`:

```yaml
security:
  password_hashers:
    Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface: "auto"

  providers:
    app_user_provider:
      entity:
        class: App\Entity\User
        property: username

  firewalls:
    login:
      pattern: ^/api/login
      stateless: true
      json_login:
        check_path: /api/login_check
        username_path: username
        password_path: password
        success_handler: lexik_jwt_authentication.handler.authentication_success
        failure_handler: lexik_jwt_authentication.handler.authentication_failure

    api:
      pattern: ^/api/
      stateless: true
      jwt: ~

  access_control:
    - { path: ^/api/login, roles: PUBLIC_ACCESS }
    - { path: ^/api/users, roles: PUBLIC_ACCESS }
    - { path: ^/api/products, roles: PUBLIC_ACCESS }
    - { path: ^/api/admin, roles: ROLE_ADMIN }
    - { path: ^/api/, roles: ROLE_USER }
```

---

## 6️⃣ Migration de la DB

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

---

## 7️⃣ Test avec Postman/Curl

### 1. Register

```bash
curl -X POST http://127.0.0.1:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "email": "demo@test.com",
    "password": "password123",
    "firstName": "Demo",
    "lastName": "User"
  }'
```

**✅ Réponse attendue:**

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "demo",
    "email": "demo@test.com",
    "firstName": "Demo",
    "lastName": "User"
  }
}
```

### 2. Login

```bash
curl -X POST http://127.0.0.1:8000/api/login_check \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "password": "password123"
  }'
```

**✅ Réponse attendue:**

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Profile (Avec token)

```bash
TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://127.0.0.1:8000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

**✅ Réponse attendue:**

```json
{
  "id": 1,
  "username": "demo",
  "email": "demo@test.com",
  "firstName": "Demo",
  "lastName": "User",
  "createdAt": "2024-04-28T10:30:00Z"
}
```

### 4. Vérifier le Password Hashé en DB

```bash
php bin/console doctrine:query:sql "SELECT username, password FROM \`user\` LIMIT 1"
```

**✅ Le password DOIT ressembler à:**

```
$2y$13$KqYoL2x0v.EwDyXiF.qUge6N5AE2Z5hSE7Y9yQwKqPqKfL0Qh8ggK
```

**❌ Le password ne DOIT PAS être:**

```
password123
```

---

## ⚠️ Checkpoint - Avant de Continuer

Cocher les boxes avant de lancer le Frontend :

- [ ] JWT bundle installé et configuré
- [ ] Entité User avec hashage de password
- [ ] Controller Register qui crée les users avec password hashé
- [ ] Controller Login qui retourne le token JWT
- [ ] Controller Profile protégé par JWT
- [ ] Migration appliquée à la DB
- [ ] Testé Register avec Postman → Token généré
- [ ] Testé Login avec Postman → Token généré
- [ ] Testé Profile avec Postman → Retourne les infos user
- [ ] Vérifié en DB que password est hashé ✅

**UNE FOIS QUE TOUS LES TESTS PASSENT:**
→ Lancer le frontend avec `npm run dev`
→ Tester l'inscription depuis le navigateur
→ Tester la connexion depuis le navigateur
→ Vérifier que le token est stocké et utilisé automatiquement

---

## 🔗 Ressources

- [Symfony Security](https://symfony.com/doc/current/security.html)
- [Password Hashing - Argon2](https://symfony.com/doc/current/security/passwords.html)
- [LexikJWTAuthenticationBundle](https://github.com/lexik/LexikJWTAuthenticationBundle)
- [JWT.io - Decode/Inspect Tokens](https://jwt.io)

---

💡 **Note Importante**

Le Frontend attend:

```
POST /api/users → Retourne {"token": "...", "user": {...}}
POST /api/login_check → Retourne {"token": "..."}
GET /api/user/profile → Retourne les infos user
```

Si le backend retourne autre chose, adaptez les réponses JSON à ces formats.
