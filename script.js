// Inicializa AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true
});

// Funcionalidad del botón del menú
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('show');
    });
  }
});
