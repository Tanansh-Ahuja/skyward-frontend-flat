import { API_BASE_URL } from './js_config.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById('error-msg').textContent = data.msg || 'Login failed';
      return;
    }

    // Store token and user in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect to dashboard or homepage
    window.location.href = '/pages_admin_dashboard.html';
  } catch (err) {
    document.getElementById('error-msg').textContent = 'Server error';
    console.error(err);
  }
});
