document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const welcomeEl = document.getElementById('welcome-msg');

  if (user && user.name) {
    welcomeEl.textContent = `Welcome, ${user.name}`;
  } else {
    welcomeEl.textContent = 'Welcome, Admin';
  }
});
