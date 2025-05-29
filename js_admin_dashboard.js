
//This is document checker and authorisation checker
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if(user == null)
    {
      window.location.href = 'login.html';
    }
    else if(user.role == null || user.role != 'admin')
    {
      alert("You are not authorised to view this page");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  
  const user = JSON.parse(localStorage.getItem('user'));
  const welcomeEl = document.getElementById('welcome-msg');
  
  if (user && user.name) {
    welcomeEl.textContent = `Welcome, ${user.name}`;
  } else {
    welcomeEl.textContent = 'Welcome, Admin';
  }
});
