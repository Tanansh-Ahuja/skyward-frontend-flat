import { API_BASE_URL } from './js_config.js';

const createBtn = document.getElementById("create-class-btn");
const popup = document.getElementById("popup-form");
const cancelBtn = document.getElementById("cancel-btn");
const submitBtn = document.getElementById("submit-class");
const gradeSelect = document.getElementById("grade");
const sectionSelect = document.getElementById("section");
const classNameInput = document.getElementById("class_name");
const classList = document.getElementById("class-list");

// Auto-fill class name
function updateClassName() {
  const grade = gradeSelect.value;
  const section = sectionSelect.value;
  if (grade && section) {
    classNameInput.value = `${grade}${section}`;
  }
}

gradeSelect.addEventListener("change", updateClassName);
sectionSelect.addEventListener("change", updateClassName);

// Show/Hide popup
createBtn.onclick = () => popup.classList.remove("hidden");
cancelBtn.onclick = () => popup.classList.add("hidden");

// Submit form
submitBtn.onclick = async () => {
  const class_name = classNameInput.value;
  const grade = parseInt(gradeSelect.value);
  const section = sectionSelect.value;

  if (!class_name || !grade || !section) return alert("Fill all fields");

  try{
    const res = await fetch(`${API_BASE_URL}/classes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ class_name, grade, section })
  });

  if (res.status === 409) {
        alert("Class already exists!");
    } else if (!res.ok) {
        // Something else went wrong
        alert("Failed to create class");
        console.error("Server error:", data.error);
    } else {
        alert("Class created");
        popup.classList.add("hidden");
        loadClasses();
    }
    } catch (err) {
    console.error("Failed to create class:", err);
    alert("Failed to create class");
    }
};

// Load classes
async function loadClasses() {
  const res = await fetch(`${API_BASE_URL}/classes/`);
  const classes = await res.json();
  classList.innerHTML = "";

  classes.forEach(cls => {
    const div = document.createElement("div");
    div.className = "class-card";
    div.innerHTML = `
      <strong>${cls.class_name}</strong>
      <button onclick="deleteClass(${cls.class_id})">Delete</button>
    `;
    classList.appendChild(div);
  });
}

window.deleteClass = async (id) => {
  if (!confirm("Are you sure to delete this class?")) return;
  const res = await fetch(`${API_BASE_URL}/classes/${id}`, { method: "DELETE" });
  const data = await res.json();
  alert(data.message);
  loadClasses();
};

document.addEventListener("DOMContentLoaded", () => {
  const gradeSelect = document.getElementById("grade");
  const sectionSelect = document.getElementById("section");

  // Populate Grade: 1 to 12
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    gradeSelect.appendChild(option);
  }

  // Populate Section: A to F
  ['A', 'B', 'C', 'D', 'E', 'F'].forEach(sec => {
    const option = document.createElement("option");
    option.value = sec;
    option.textContent = sec;
    sectionSelect.appendChild(option);
  });
});


window.onload = loadClasses;
