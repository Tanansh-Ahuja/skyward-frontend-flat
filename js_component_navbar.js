import { API_BASE_URL } from './js_config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  // Load navbar.html
  const res = await fetch('navbar.html');
  const navbarHTML = await res.text();
  placeholder.innerHTML = navbarHTML;

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const links = document.getElementById('navbar-links');
  hamburger?.addEventListener('click', () => {
    links.classList.toggle('show');
  });

  // Public pages: skip token check on login.html
  const isLoginPage = window.location.pathname.endsWith('login.html');
  const token = localStorage.getItem('token');

  if (!token) {
    if (!isLoginPage) {
      window.location.href = 'login.html';
    }
    return;
  }

  try {
    const verifyRes = await fetch(`${API_BASE_URL}/utils/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!verifyRes.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!isLoginPage) {
        window.location.href = 'login.html';
      }
      return;
    }

    const data = await verifyRes.json();

    // Show Register User if admin
    if (data.role === 'admin') {
      links.innerHTML += `<a href="register.html">Register User</a>`;
    }

    // Always show Logout
    links.innerHTML += `<a href="#" id="logout-link">Logout</a>`;
    document.getElementById('logout-link').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });

  } catch (err) {
    console.error('Token check failed', err);
    if (!isLoginPage) {
      window.location.href = 'login.html';
    }
  }
});
