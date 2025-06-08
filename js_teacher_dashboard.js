import { API_BASE_URL } from './js_config.js';

window.onload = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    const res = await fetch(`${API_BASE_URL}/teachers/me/mappings?user_id=${user.user_id}`);
    if (!res.ok) throw new Error("Failed to fetch teacher mappings");

    const data = await res.json();

    renderSubjects(data.subjects);
    if (data.isClassTeacher) {
      renderClassTeacherSection(data.classTeacherClass);
    }
  } catch (err) {
    console.error("Error loading teacher dashboard:", err);
    alert("Something went wrong while loading your dashboard.");
  }
};

function renderSubjects(subjects) {
  const container = document.getElementById("subject-teach-list");
  container.innerHTML = "";

  subjects.forEach(({ class: className, subject }) => {
    const card = document.createElement("div");
    card.className = "subject-card";

    card.innerHTML = `
      <h3>${subject}</h3>
      <p>Class: ${className}</p>
      <div class="card-buttons">
        <button class="btn">View Marks</button>
        <button class="btn">Enter/Update Marks</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderClassTeacherSection(className) {
  const section = document.getElementById("class-teacher-section");
  section.classList.remove("hidden");
  document.getElementById("class-teacher-classname").textContent = className;
}

