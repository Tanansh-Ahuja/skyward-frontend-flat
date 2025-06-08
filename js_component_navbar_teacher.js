import { API_BASE_URL } from './js_config.js';

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    local_storage_remove_items();
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/utils/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.warn("Token verification failed with status:", response.status);
      local_storage_remove_items();
      window.location.href = 'login.html';
      return;
    }

    const data = await response.json();

    if (!data.valid) {
      console.warn("Token not valid");
      local_storage_remove_items();
      window.location.href = 'login.html';
      return;
    }

    // ✅ Optional: do a role check
    if (data.role !== 'teacher') {
      alert("Access denied. Only teachers can view this page.");
      local_storage_remove_items();
      window.location.href = 'login.html';
      return;
    }

  } catch (err) {
    console.error("Error during token verification:", err);
    local_storage_remove_items();
    window.location.href = 'login.html';
  }
});

document.addEventListener("DOMContentLoaded",async () => {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    const res = await fetch('navbar_teacher.html');
    const html = await res.text();
    placeholder.innerHTML = html;
    const hamburger = document.getElementById("hamburger");
    const navbarLinks = document.getElementById("navbar-links");

  if (hamburger && navbarLinks) {
      hamburger.addEventListener("click", () => {
        navbarLinks.classList.toggle("show");
      });
    }
    else 
    {
        console.warn("Navbar placeholder not found.");
    }
    
  // Logout link functionality
  const logoutLink = document.getElementById("logout-link");
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    // Clear token/session and redirect
    local_storage_remove_items();
    window.location.href = "login.html";
  });
});

function local_storage_remove_items()
{
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
