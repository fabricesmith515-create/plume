// Menu mobile
const boutonMenu = document.querySelector('.bouton-menu');
const navigation = document.querySelector('.navigation');

function fermerMenu() {
  navigation?.classList.remove('ouverte');
  boutonMenu?.setAttribute('aria-expanded', 'false');
}

boutonMenu?.addEventListener('click', () => {
  const ouvert = navigation.classList.toggle('ouverte');
  boutonMenu.setAttribute('aria-expanded', String(ouvert));
});
navigation?.querySelectorAll('a').forEach(lien => lien.addEventListener('click', fermerMenu));
document.addEventListener('keydown', evenement => { if (evenement.key === 'Escape') fermerMenu(); });

// Année du pied de page
document.querySelectorAll('.annee').forEach(element => { element.textContent = new Date().getFullYear(); });

// Formulaires Netlify (lettre d'information)
document.querySelectorAll('.formulaire-netlify').forEach(formulaire => {
  const statut = formulaire.querySelector('.statut');
  formulaire.addEventListener('submit', async evenement => {
    evenement.preventDefault();
    const bouton = formulaire.querySelector('button[type="submit"]');
    statut.classList.remove('erreur', 'envoye');
    bouton.disabled = true;
    statut.textContent = 'Envoi en cours…';
    try {
      const reponse = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(formulaire)).toString()
      });
      if (!reponse.ok) throw new Error(String(reponse.status));
      if (formulaire.dataset.redirection) {
        window.location.href = formulaire.dataset.redirection;
        return;
      }
      formulaire.reset();
      statut.classList.add('envoye');
      statut.textContent = formulaire.dataset.succes;
    } catch (erreur) {
      // Le code (404, 405…) aide à diagnostiquer : 404 signifie que Netlify ne connaît pas le formulaire
      const code = /^\d+$/.test(erreur.message) ? ` (code ${erreur.message})` : ' (réseau)';
      statut.classList.add('erreur');
      statut.textContent = `L’envoi n’a pas abouti${code}. Réessayez dans un instant.`;
    }
    bouton.disabled = false;
  });
});

// Avis : on répète les cartes jusqu'à remplir l'écran, puis on double la rangée
// pour que le défilement boucle sans coupure, quel que soit le nombre d'avis
document.querySelectorAll('.defile-piste').forEach(piste => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const originaux = [...piste.children];
  if (!originaux.length) return;
  const ajouterCopies = cartes => cartes.forEach(carte => {
    const copie = carte.cloneNode(true);
    copie.setAttribute('aria-hidden', 'true');
    piste.appendChild(copie);
  });
  const largeurVisee = Math.max(window.innerWidth, 1600);
  while (piste.scrollWidth < largeurVisee) ajouterCopies(originaux);
  ajouterCopies([...piste.children]);
  // Vitesse constante : environ 7 secondes par carte
  piste.style.setProperty('--duree', `${piste.children.length / 2 * 7}s`);
});
