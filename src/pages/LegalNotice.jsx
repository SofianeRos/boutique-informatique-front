import React from 'react';

const LegalNotice = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-4xl font-black text-center mb-12 uppercase tracking-tighter text-white">
        📝 <span className="text-purple-500">Mentions Légales</span>
      </h2>

      <div className="bg-slate-900 border border-slate-800 p-8 flex flex-col gap-8 rounded-2xl shadow-2xl text-slate-300">
        
        <section>
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-purple-400">1. Éditeur du site</h3>
          <p className="mb-2">Le site Boutique Informatique est édité par :</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
            <li><strong>Nom de l'entreprise :</strong> Boutique Hardware E-sport SAS</li>
            <li><strong>Siège social :</strong> 123 Rue de la République, 75001 Paris, France</li>
            <li><strong>RCS :</strong> Paris B 123 456 789</li>
            <li><strong>Capital social :</strong> 10 000€</li>
            <li><strong>Téléphone :</strong> +33 (0)1 23 45 67 89</li>
            <li><strong>Email de contact :</strong> contact@boutique-informatique.fr</li>
            <li><strong>Directeur de la publication :</strong> Team Boutique Informatique</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-purple-400">2. Hébergement</h3>
          <p className="mb-2">Ce site est hébergé par :</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
            <li><strong>Hébergeur :</strong> Vercel Inc.</li>
            <li><strong>Adresse :</strong> 340 S Lemon Ave #4133 Walnut, CA 91789, USA</li>
            <li><strong>Site web :</strong> https://vercel.com</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-purple-400">3. Propriété intellectuelle</h3>
          <p className="text-slate-400">
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-purple-400">4. Données personnelles</h3>
          <p className="text-slate-400">
            Les informations collectées lors de l'inscription ou du processus de paiement sont strictement confidentielles. Conformément à la loi « Informatique et Libertés » et au RGPD, vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données.
            Pour exercer ce droit, veuillez nous contacter via l'adresse email mentionnée ci-dessus.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-purple-400">5. Cookies</h3>
          <p className="text-slate-400">
            Boutique Informatique utilise des tokens (localStorage) pour gérer l'authentification des utilisateurs. Nous ne déployons pas de cookies publicitaires ou de suivi intrusif à des fins commerciales sans votre consentement exprès.
          </p>
        </section>

      </div>
    </div>
  );
};

export default LegalNotice;