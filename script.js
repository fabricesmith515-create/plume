const button = document.querySelector('.menu');
const menu = document.querySelector('nav');
button?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  button.setAttribute('aria-expanded', isOpen);
});
menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu.classList.remove('open');
  button?.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

const homeNav = document.querySelector('nav');
if (homeNav && !homeNav.querySelector('[href="qui-suis-je.html"]')) {
  homeNav.insertAdjacentHTML('afterbegin', '<a href="qui-suis-je.html">Qui suis-je ?</a><a href="blog.html">Blog</a>');
}
