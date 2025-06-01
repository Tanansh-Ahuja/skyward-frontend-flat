import { API_BASE_URL } from './js_config.js';

const classSelect = document.getElementById("class-select");
const subjectSelect = document.getElementById("subject-select");
const teacherSelect = document.getElementById("teacher-select");
const assignForm = document.getElementById("assign-form");


// Functions

async function fetchClasses() {
  const res = await fetch(`${API_BASE_URL}/classes`);
  const classes = await res.json();
  classSelect.innerHTML = `<option value="">--Select--</option>`;
  classes.forEach(c => {
    classSelect.innerHTML += `<option value="${c.class_id}">${c.class_name}</option>`;
  });
}

async function fetchSubjectsForClass(classId) {
  const res = await fetch(`${API_BASE_URL}/subject_map/${classId}`);
  const subjects = await res.json();
  subjectSelect.innerHTML = `<option value="">--Select--</option>`;
  subjects.forEach(s => {
    subjectSelect.innerHTML += `<option value="${s.subject_id}">${s.subject_name}</option>`;
  });
}

async function fetchTeachers() {
  const res = await fetch(`${API_BASE_URL}/teachers`);
  const teachers = await res.json();
  teacherSelect.innerHTML = `<option value="">--Select--</option>`;
  teachers.forEach(t => {
    teacherSelect.innerHTML += `<option value="${t.teacher_id}">${t.name}</option>`;
  });
}

classSelect.addEventListener("change", async () => {
  const classId = classSelect.value;
  if (classId) await fetchSubjectsForClass(classId);
});

async function loadAssignedTeachers() {
  const res = await fetch(`${API_BASE_URL}/teachers/view_subject_teacher_mappings`);
  const data = await res.json();
  console.log(data);

  const container = document.getElementById("mapping-display");
  container.innerHTML = "";

  data.forEach(({ class_name, subject_teacher }) => {
    const card = document.createElement("div");
    card.className = "mapping-card";
    let html = `<h3>${class_name}</h3><ul>`;
    subject_teacher.forEach(({ subject_name, teacher_name }) => {
      html += `<li><strong>${subject_name}:</strong> ${teacher_name}</li>`;
    });
    html += "</ul>";
    card.innerHTML = html;
    container.appendChild(card);
  });
}

// Event Listners

assignForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const class_id = classSelect.value;
  const subject_id = subjectSelect.value;
  const teacher_id = teacherSelect.value;

  try {
    const res = await fetch(`${API_BASE_URL}/teachers/assign_subject_teacher`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ class_id, subject_id, teacher_id })
    });

    if (!res.ok) throw new Error("Assignment failed");
    alert("Teacher assigned to subject successfully!");
    loadAssignedTeachers(); // refresh Section 2
  } catch (err) {
    console.error(err);
    alert("Failed to assign subject teacher.");
  }
});

// Initial load
fetchClasses();
fetchTeachers();
loadAssignedTeachers();
