// Initialize Animations
AOS.init({
    duration: 1000,
    once: true,
    mirror: false
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            new bootstrap.Collapse(navbarCollapse).toggle();
        }
    });
});

function openPopupPage(url) {
  window.open(url, 'popupWindowName', 'width=600,height=400,scrollbars=yes,resizable=yes');
  return false; // Prevents the default anchor link behavior
}