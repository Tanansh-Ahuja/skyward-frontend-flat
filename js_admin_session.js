import { API_BASE_URL } from './js_config.js';

const sessionContainer = document.getElementById('session-container');
const createBtn = document.getElementById('create-session-btn');
const modal = document.getElementById('session-modal');
const closeModal = document.getElementById('close-modal');
const form = document.getElementById('session-form');
const nameInput = document.getElementById('session-name');
const startInput = document.getElementById('start-date');
const endInput = document.getElementById('end-date');

let isEditMode = false;
let editSessionId = null;

// Load sessions on page load
window.addEventListener('DOMContentLoaded', loadSessions);

// Fetch all sessions
async function loadSessions() {
  try {
    const res = await fetch(`${API_BASE_URL}/sessions/`);
    const data = await res.json();

    sessionContainer.innerHTML = ''; // Clear previous
    data.forEach(createSessionCard);
  } catch (err) {
    console.error('Failed to load sessions:', err);
    alert('Could not load sessions.');
  }
}

// Create a session card
function createSessionCard(session) {
  const card = document.createElement('div');
  card.classList.add('session-card');

  card.innerHTML = `
    <strong>Session ID: ${session.session_id}</strong>
    <div>${session.session_name} | ${formatDate(session.start_date)} → ${formatDate(session.end_date)}</div>
    <div class="card-buttons">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  // Edit
  card.querySelector('.edit-btn').addEventListener('click', () => {
    if (confirm(`Edit session ${session.session_id}?`)) {
      isEditMode = true;
      editSessionId = session.session_id;
      nameInput.value = session.session_name;
      startInput.value = session.start_date;
      endInput.value = session.end_date;
      modal.classList.remove('hidden');
    }
  });

  // Delete
  card.querySelector('.delete-btn').addEventListener('click', async () => {
    const confirmDelete = confirm(`Are you sure you want to delete session ${session.session_id}?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/sessions/${session.session_id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Session deleted.');
        loadSessions();
      } else {
        const err = await res.json();
        alert('Error: ' + (err.message || 'Failed to delete'));
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Something went wrong.');
    }
  });

  sessionContainer.appendChild(card);
}

// Open modal
createBtn.addEventListener('click', () => {
  isEditMode = false;
  editSessionId = null;
  form.reset();
  modal.classList.remove('hidden');
});

// Close modal
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
  form.reset();
  isEditMode = false;
  editSessionId = null;
});

// Create or update session
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    session_name: nameInput.value.trim(),
    start_date: startInput.value,
    end_date: endInput.value
  };

  if (!payload.session_name || !payload.start_date || !payload.end_date) {
    alert('Please fill all fields.');
    return;
  }

  const url = isEditMode
    ? `${API_BASE_URL}/sessions/${editSessionId}`
    : `${API_BASE_URL}/sessions/`;

  const method = isEditMode ? 'PATCH' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert(isEditMode ? 'Session updated!' : 'Session created!');
      modal.classList.add('hidden');
      form.reset();
      isEditMode = false;
      editSessionId = null;
      loadSessions();
    } else {
      const err = await res.json();
      alert('Error: ' + (err.message || 'Operation failed'));
    }
  } catch (err) {
    console.error('Submit failed:', err);
    alert('Something went wrong. Check console.');
  }
});

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
