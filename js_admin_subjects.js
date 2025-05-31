import { API_BASE_URL } from './js_config.js';

const gradeSelect = document.getElementById("grade-select");
const classSelect = document.getElementById("class-select");
const subjectCheckboxContainer = document.getElementById("subject-checkbox-container");
const submitMappingBtn = document.getElementById("submit-mapping-btn");

const subjectsContainer = document.getElementById("subjects-container");
const addSubjectBtn = document.getElementById("add-subject-btn");
const subjectPopup = document.getElementById("subject-popup");
const submitSubjectBtn = document.getElementById("submit-subject");
const cancelSubjectBtn = document.getElementById("cancel-subject");
const newSubjectInput = document.getElementById("new-subject-name");
const mappingSummaryContainer = document.getElementById("mapping-summary-container");

// ----------------------- Subject CRUD Section -----------------------

async function fetchAllSubjects() {
  subjectsContainer.innerHTML = "";
  try {
    const res = await fetch(`${API_BASE_URL}/subject_map`);
    const subjects = await res.json();

    if (!Array.isArray(subjects)) throw new Error("Subjects not in array form");

    subjects.forEach(subject => {
      const card = document.createElement("div");
      card.className = "subject-card";
      card.innerHTML = `
        <span>${subject.subject_name}</span>
        <button class="delete-subject" data-id="${subject.subject_id}">Delete</button>
      `;
      subjectsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching subjects:", err);
    subjectsContainer.innerHTML = "<p>Error loading subjects.</p>";
  }
}

async function deleteSubject(subjectId) {
  if (!confirm("Are you sure you want to delete this subject?")) return;
  const res = await fetch(`${API_BASE_URL}/subject_map/${subjectId}`, { method: "DELETE" });
  if (res.ok) {
    fetchAllSubjects();
    fetchSubjects(); // update checkboxes too
  } else {
    alert("Failed to delete subject.");
  }
}

addSubjectBtn.addEventListener("click", () => {
  newSubjectInput.value = "";
  subjectPopup.classList.remove("hidden");
});

cancelSubjectBtn.addEventListener("click", () => {
  subjectPopup.classList.add("hidden");
});

submitSubjectBtn.addEventListener("click", async () => {
  const name = newSubjectInput.value.trim();
  if (!name) {
    alert("Subject name cannot be empty.");
    return;
  }
  const res = await fetch(`${API_BASE_URL}/subject_map/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject_name: name }),
  });
  if (res.ok) {
    subjectPopup.classList.add("hidden");
    fetchAllSubjects();
    fetchSubjects(); // update checkboxes too
  } else {
    alert("Failed to add subject.");
  }
});

subjectsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-subject")) {
    const subjectId = e.target.dataset.id;
    deleteSubject(subjectId);
  }
});

// ----------------------- Mapping Summary Section -----------------------
async function fetchMappings() {
  mappingSummaryContainer.innerHTML = "";
  try {
    const res = await fetch(`${API_BASE_URL}/subject_map/summary`);
    const mappings = await res.json();

    if (!Array.isArray(mappings)) throw new Error("Mappings not array");

    mappings.forEach(mapping => {
      const div = document.createElement("div");
      div.className = "mapping-summary-card";
      div.innerHTML = `
        <strong>${mapping.grade}${mapping.section}</strong>: 
        ${mapping.subjects.length > 0 ? mapping.subjects.join(", ") : '<em>No mapped subject</em>'}
      `;
      mappingSummaryContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching mappings:", err);
    mappingSummaryContainer.innerHTML = "<p>Error loading mappings.</p>";
  }
}

// ----------------------- Mapping Management Section -----------------------
async function fetchGrades() {
  const res = await fetch(`${API_BASE_URL}/subject_map/grades`);
  const grades = await res.json();
  grades.forEach(grade => {
    const option = document.createElement("option");
    option.value = grade;
    option.textContent = `Grade ${grade}`;
    gradeSelect.appendChild(option);
  });
}

async function fetchSubjects() {
  const res = await fetch(`${API_BASE_URL}/subjects`);
  const subjects = await res.json();
  subjectCheckboxContainer.innerHTML = "";

  subjects.forEach(sub => {
    const label = document.createElement("label");
    label.classList.add("subject-checkbox");
    label.innerHTML = `
      <input type="checkbox" value="${sub.subject_id}" />
      ${sub.subject_name}
    `;
    subjectCheckboxContainer.appendChild(label);
  });

  submitMappingBtn.style.display = "block";
}

// ----------------------- Event Bindings -----------------------
gradeSelect.addEventListener("change", async () => {
  const grade = gradeSelect.value;
  if (!grade) {
    subjectCheckboxContainer.innerHTML = "";
    submitMappingBtn.style.display = "none";
    return;
  }

  const mappedSubjectsRes = await fetch(`${API_BASE_URL}/subject_map/mapped-subjects/${grade}`);
  const mappedSubjects = await mappedSubjectsRes.json(); // e.g. [{subject_id: 1, subject_name: "Math"}, ...]
  console.log(mappedSubjects);

  const allSubjectsRes = await fetch(`${API_BASE_URL}/subject_map`);
  const allSubjects = await allSubjectsRes.json(); // same format
  console.log(allSubjects);

  const mappedIds = new Set(mappedSubjects.map(s => s.subject_id));

  subjectCheckboxContainer.innerHTML = "";

  allSubjects.forEach(sub => {
    const label = document.createElement("label");
    label.classList.add("subject-checkbox");
    label.innerHTML = `
      <input type="checkbox" value="${sub.subject_id}" ${mappedIds.has(sub.subject_id) ? 'checked' : ''} />
      ${sub.subject_name}
    `;
    subjectCheckboxContainer.appendChild(label);
  });

  submitMappingBtn.style.display = "block";
});



submitMappingBtn.addEventListener("click", async () => {
  const selectedGrade = gradeSelect.value;
  const selectedSubjects = [...subjectCheckboxContainer.querySelectorAll("input:checked")]
    .map(cb => cb.value);

  if (!selectedGrade || selectedSubjects.length === 0) {
    alert("Please select a grade and at least one subject.");
    return;
  }
  console.log(selectedGrade);
  console.log(selectedSubjects);

  const res = await fetch(`${API_BASE_URL}/subject_map/map-subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grade: selectedGrade, subject_ids: selectedSubjects }),
  });

  if (res.ok) {
    alert("Subjects mapped successfully!");
    gradeSelect.value = "";
    subjectCheckboxContainer.innerHTML = "";
    submitMappingBtn.style.display = "none";
    // optional: fetchMappings();
  } else {
    alert("Mapping failed!");
  }
});

// ----------------------- Init -----------------------
fetchGrades();
fetchAllSubjects();
fetchMappings();
