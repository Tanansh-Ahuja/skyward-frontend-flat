import { API_BASE_URL } from './js_config.js';

const classListDiv = document.getElementById("class-list");
const mapForm = document.getElementById("map-form");

document.addEventListener("DOMContentLoaded", () => {
  initPage();
});

async function initPage() {
  try {
    const [session, classes, teachers] = await Promise.all([
      fetchCurrentSession(),
      fetchClasses(),
      fetchUnassignedTeachers()
    ]);

    populateSession(session);
    populateClassDropdown(classes);
    populateTeacherDropdown(teachers);
    setupClassChangeListener();
    setupFormSubmission(session.session_id);
    await loadClassTeacherMappings();

  } catch (err) {
    console.error("Initialization failed:", err);
    document.getElementById("current-session").textContent = "Failed to load session.";
  }
}

async function fetchCurrentSession() {
  const res = await fetch(`${API_BASE_URL}/sessions/current`);
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

function populateSession(session) {
  const sessionPara = document.getElementById("current-session");
  sessionPara.textContent = `Session: ${session.session_name}`;
}

async function fetchClasses() {
  const res = await fetch(`${API_BASE_URL}/classes/`);
  if (!res.ok) throw new Error("Failed to fetch classes");
  return res.json();
}

function populateClassDropdown(classes) {
  const classSelect = document.getElementById("class-select");
  classSelect.innerHTML = `<option value="">--Select Class--</option>`;
  classes.forEach(cls => {
    classSelect.innerHTML += `<option value="${cls.class_id}">${cls.class_name}</option>`;
  });
}

async function fetchUnassignedTeachers() {
  const res = await fetch(`${API_BASE_URL}/teachers/unassigned`);
  if (!res.ok) throw new Error("Failed to fetch teachers");
  return res.json();
}

function populateTeacherDropdown(teachers) {
  const teacherSelect = document.getElementById("teacher-select");
  teacherSelect.innerHTML = `<option value="">--Select Teacher--</option>`;
  teachers.forEach(teacher => {
    teacherSelect.innerHTML += `<option value="${teacher.user_id}">${teacher.name}</option>`;
  });
}

function setupClassChangeListener() {
  const classSelect = document.getElementById("class-select");
  const subjectSelect = document.getElementById("subject-select");

  classSelect.addEventListener("change", async () => {
    const classId = classSelect.value;
    if (!classId) {
      subjectSelect.innerHTML = `<option value="">--Select Subject--</option>`;
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/subject_map/${classId}`);
      if (!res.ok) throw new Error("Failed to fetch subjects");

      const subjects = await res.json();
      subjectSelect.innerHTML = `<option value="">--Select Subject--</option>`;
      subjects.forEach(sub => {
        subjectSelect.innerHTML += `<option value="${sub.subject_id}">${sub.subject_name}</option>`;
      });
    } catch (err) {
      console.error("Error loading subjects:", err);
      subjectSelect.innerHTML = `<option value="">--Failed to load subjects--</option>`;
    }
  });
}

function setupFormSubmission(currentSessionId) {
  mapForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const classId = document.getElementById("class-select").value;
    const teacherUserId = document.getElementById("teacher-select").value;
    const subjectId = document.getElementById("subject-select").value;
    const mappingMsg = document.getElementById("mapping-msg");

    if (!classId || !teacherUserId || !subjectId) {
      alert("All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/teachers/class_teacher_mappings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: classId,
          user_id: teacherUserId,
          subject_id: subjectId
        })
      });

      if (!res.ok) throw new Error("Mapping failed");

      mappingMsg.textContent = "Class teacher assigned successfully!";
      mappingMsg.style.color = "green";

      await loadClassTeacherMappings(); // reload the list after success

    } catch (err) {
      console.error(err);
      mappingMsg.textContent = "Failed to assign class teacher.";
      mappingMsg.style.color = "red";
    }
  });
}

async function loadClassTeacherMappings() {
  try {
    const res = await fetch(`${API_BASE_URL}/teachers/get_class_teacher_mappings`);
    if (!res.ok) throw new Error("Failed to fetch mappings");

    const mappings = await res.json();

    classListDiv.innerHTML = "";

    if (mappings.length === 0) {
      classListDiv.innerHTML = "<p>No class-teacher mappings found.</p>";
      return;
    }

    mappings.forEach(({ class_name, class_teacher, subject_name, class_id, teacher_id }) => {
    const card = document.createElement("div");
    card.className = "mapping-card";
    card.innerHTML = `
        <strong>Class:</strong> ${class_name} <br>
        <strong>Teacher:</strong> ${class_teacher} <br>
        <strong>Subject:</strong> ${subject_name}<br>
        <button class="delete-btn" data-class-id="${class_id}" data-teacher-id="${teacher_id}">Delete</button>
    `;
    classListDiv.appendChild(card);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const classId = btn.getAttribute("data-class-id");
    const teacherId = btn.getAttribute("data-teacher-id");

    if (!confirm("Are you sure you want to unassign this class teacher?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/teachers/unassign_class_teacher`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          class_id: classId,
          teacher_id: teacherId
        })
      });

      if (!res.ok) throw new Error("Delete failed");

      alert("Class teacher mapping deleted successfully.");
      await loadClassTeacherMappings(); // Refresh list

    } catch (err) {
      console.error(err);
      alert("Failed to delete mapping.");
    }
  });
});

  } catch (err) {
    console.error("Error loading class-teacher mappings:", err);
    classListDiv.innerHTML = "<p>Failed to load mappings.</p>";
  }
}
