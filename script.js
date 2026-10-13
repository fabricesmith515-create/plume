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

// Année
const annee = String(new Date().getFullYear());
document.querySelectorAll('.annee, #feuille-annee').forEach(element => { element.textContent = annee; });

// Page de titre : le nom et le genre choisis s'affichent sur la couverture
const champNom = document.querySelector('#nom-couverture');
const feuilleNom = document.querySelector('#feuille-nom');
const feuilleGenre = document.querySelector('#feuille-genre');
const choixProjet = document.querySelector('#projet');

champNom?.addEventListener('input', () => {
  const nom = champNom.value.trim();
  feuilleNom.textContent = nom || 'Votre nom';
  feuilleNom.classList.toggle('vide', !nom);
});

function choisirGenre(genre) {
  if (choixProjet) choixProjet.value = genre;
}

document.querySelectorAll('input[name="genre-couverture"]').forEach(option => {
  option.addEventListener('change', () => {
    feuilleGenre.textContent = option.dataset.titre;
    choisirGenre(option.value);
  });
});

// Les liens « Parler d'une biographie »… préremplissent le formulaire
document.querySelectorAll('a[data-genre]').forEach(lien => {
  lien.addEventListener('click', () => choisirGenre(lien.dataset.genre));
});

// Formulaire de contact (Formspree)
const formulaire = document.querySelector('#formulaire-contact');
const statut = document.querySelector('#statut');

formulaire?.addEventListener('submit', async evenement => {
  evenement.preventDefault();
  const bouton = formulaire.querySelector('button[type="submit"]');
  statut.className = 'statut';

  if (formulaire.action.includes('VOTRE_ID_FORMSPREE')) {
    statut.classList.add('erreur');
    statut.textContent = 'Le formulaire n’est pas encore relié à une boîte de réception.';
    return;
  }

  bouton.disabled = true;
  statut.textContent = 'Envoi en cours…';
  try {
    const reponse = await fetch(formulaire.action, {
      method: 'POST',
      body: new FormData(formulaire),
      headers: { Accept: 'application/json' }
    });
    if (!reponse.ok) throw new Error(String(reponse.status));
    formulaire.reset();
    statut.classList.add('envoye');
    statut.textContent = 'Demande envoyée. Je vous réponds par e-mail.';
  } catch {
    statut.classList.add('erreur');
    statut.textContent = 'L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez.';
  } finally {
    bouton.disabled = false;
  }
});
