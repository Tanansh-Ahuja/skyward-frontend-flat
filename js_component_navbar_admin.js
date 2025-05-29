document.addEventListener('DOMContentLoaded', async () => {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  const res = await fetch('navbar_admin.html');
  const html = await res.text();
  placeholder.innerHTML = html;

  const hamburger = document.getElementById('hamburger');
  const navbarLinks = document.getElementById('navbar-links');

  hamburger.addEventListener('click', () => {
    navbarLinks.classList.toggle('show');
  });

  // Collapsing each section when its heading is clicked
  document.querySelectorAll('.nav-heading').forEach(heading => {
    heading.addEventListener('click', () => {
      const sub = heading.nextElementSibling;
      if (sub) {
        const isVisible = sub.style.display === 'block';
        document.querySelectorAll('.nav-subheadings').forEach(s => s.style.display = 'none');
        sub.style.display = isVisible ? 'none' : 'block';
      }
    });
  });

  // Logout functionality
  const logoutLink = document.getElementById('logout-link');
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  });
});
