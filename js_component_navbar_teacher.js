// Hamburger menu toggle
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
    localStorage.removeItem("token"); // Adjust if you're using sessionStorage or cookies
    window.location.href = "login.html";
  });
});
