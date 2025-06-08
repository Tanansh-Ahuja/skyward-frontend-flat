import { API_BASE_URL } from './js_config.js';
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem("user"));
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        try {
            const verifyRes = await fetch(`${API_BASE_URL}/utils/verify-token`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            });

            if (!verifyRes.ok) {
            local_storage_remove_items();
            window.location.href = 'login.html';
            return;
            }
        }
        catch (err) {
        console.error('Token check failed', err);
        window.location.href = 'login.html';
    }
    if(user.role != 'admin')
    {
      alert("Not authorised to view this page");
      local_storage_remove_items();
      window.location.href = 'login.html';
      return;
    }
});

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
    local_storage_remove_items();
    window.location.href = 'login.html';
  });
});

function local_storage_remove_items()
{
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
