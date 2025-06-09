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
  console.log(subjects);
  const container = document.getElementById("subject-teach-list");
  container.innerHTML = "";

  subjects.forEach(({ class_id, class: className, subject_id, subject }) => {
    const card = document.createElement("div");
    card.className = "subject-card";

    card.innerHTML = `
      <h3>${subject}</h3>
      <p>Class: ${className}</p>
      <div class="card-buttons">
        <button class="btn view-marks-btn"
          data-class-id="${class_id}"
          data-subject-id="${subject_id}"
          data-class-name="${encodeURIComponent(className)}"
          data-subject-name="${encodeURIComponent(subject)}"
        >View/Update Marks</button>

        <button class="btn enter-marks-btn"
          data-class-id="${class_id}"
          data-subject-id="${subject_id}"
          data-class-name="${encodeURIComponent(className)}"
          data-subject-name="${encodeURIComponent(subject)}"
        >Enter Marks</button>
      </div>
    `;

    container.appendChild(card);
  });

  // Now attach the click listeners
  document.querySelectorAll(".enter-marks-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const classId = btn.dataset.classId;
      const subjectId = btn.dataset.subjectId;
      const className = btn.dataset.className;
      const subjectName = btn.dataset.subjectName;

      const url = `pages_teacher_enter_update_marks.html?class_id=${classId}&subject_id=${subjectId}&class_name=${className}&subject_name=${subjectName}`;
      window.location.href = url;
    });
  });

  // Optional: If you want to handle View Marks too
  document.querySelectorAll(".view-marks-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const classId = btn.dataset.classId;
      const subjectId = btn.dataset.subjectId;
      const className = btn.dataset.className;
      const subjectName = btn.dataset.subjectName;

      const url = `pages_teacher_view_update_marks.html?class_id=${classId}&subject_id=${subjectId}&class_name=${className}&subject_name=${subjectName}`;
      window.location.href = url;
    });
  });
}



function renderClassTeacherSection(className) {
  const section = document.getElementById("class-teacher-section");
  section.classList.remove("hidden");
  document.getElementById("class-teacher-classname").textContent = className;
}

