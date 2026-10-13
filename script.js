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

// Les liens « Parler d'une biographie »… préremplissent le type de projet
const choixProjet = document.querySelector('#projet');
document.querySelectorAll('a[data-genre]').forEach(lien => {
  lien.addEventListener('click', () => { if (choixProjet) choixProjet.value = lien.dataset.genre; });
});

// Formulaire de contact (Netlify Forms)
const formulaire = document.querySelector('#formulaire-contact');
const statut = document.querySelector('#statut');

formulaire?.addEventListener('submit', async evenement => {
  evenement.preventDefault();
  const bouton = formulaire.querySelector('button[type="submit"]');
  statut.className = 'statut large';
  bouton.disabled = true;
  statut.textContent = 'Envoi en cours…';
  try {
    const reponse = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(formulaire)).toString()
    });
    if (!reponse.ok) throw new Error(String(reponse.status));
    window.location.href = 'merci.html';
  } catch {
    statut.classList.add('erreur');
    statut.textContent = 'L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez dans un instant.';
    bouton.disabled = false;
  }
});
