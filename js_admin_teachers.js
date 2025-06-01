import { API_BASE_URL } from './js_config.js';

const teacherForm = document.getElementById("teacher-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const passwordInput = document.getElementById("password");
const isClassTeacherInput = document.getElementById("is-class-teacher");
const classIdSelect = document.getElementById("class-id");
const userIdInput = document.getElementById("user-id");
const submitBtn = document.getElementById("submit-btn");
const teachersContainer = document.getElementById("teachers-container");


async function fetchTeachers() {
  const res = await fetch(`${API_BASE_URL}/teachers/`);
  const teachers = await res.json();
  teachersContainer.innerHTML = "";

  teachers.forEach(teacher => {
    const div = document.createElement("div");
    div.className = "teacher-card";
    div.innerHTML = `
      <p><strong>${teacher.name}</strong></p>
      <p>Email: ${teacher.email || "N/A"}</p>
      <p>Mobile: ${teacher.mobile}</p>
      <p>Class Teacher: ${teacher.is_class_teacher ? "Yes" : "No"}</p>
      <p>Class: ${teacher.class_name || "N/A"}</p>
      <button class="update-btn" onclick='editTeacher(${JSON.stringify(teacher)})'>Update</button>
      <button onclick="deleteTeacher(${teacher.user_id})">Delete</button>
    `;
    teachersContainer.appendChild(div);
  });
}

teacherForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Trim values to avoid issues with spaces
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const mobile = mobileInput.value.trim();
  const password = passwordInput.value.trim(); // even if it’s only for create mode

  // Check required fields
  if (!name) return alert("Name field is empty");
  
  if (!mobile) return alert("Mobile field is empty");

  // Only check password if it's a create (not update)
  if (!userIdInput.value && !password) {
    return alert("Password field is empty");
  }
  // Construct payload
  const payload = { name, email, mobile };
  if (!userIdInput.value) {
    payload.password = password;
  }

  const method = userIdInput.value ? "PATCH" : "POST";
  const endpoint = userIdInput.value 
    ? `${API_BASE_URL}/teachers/${userIdInput.value}`
    : `${API_BASE_URL}/teachers`;

  const res = await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    alert(`Teacher ${userIdInput.value ? "updated" : "registered"} successfully.`);
    passwordInput.parentElement.style.display = 'block'; // for fresh create
    teacherForm.reset();
    submitBtn.textContent = "Register";
    userIdInput.value = "";
    fetchTeachers();
  } else {
    alert("Operation failed.");
  }
});

function editTeacher(teacher) {
  passwordInput.parentElement.style.display = 'none';
  passwordInput.removeAttribute("required");
  userIdInput.value = teacher.user_id;
  nameInput.value = teacher.name;
  emailInput.value = teacher.email;
  mobileInput.value = teacher.mobile;
  submitBtn.textContent = "Update Teacher";
}

async function deleteTeacher(userId) {
  if (confirm("Are you sure you want to delete this teacher?")) {
    const res = await fetch(`${API_BASE_URL}/teachers/${userId}`, { method: "DELETE" });
    if (res.ok) {
      alert("Teacher deleted.");
      fetchTeachers();
    } else {
      alert("Failed to delete.");
    }
  }
}
window.deleteTeacher = deleteTeacher;
window.editTeacher = editTeacher;
fetchTeachers();
