// Dummy data for now — replace with API calls later
const teacherData = {
  isClassTeacher: true,
  classTeacherClass: "6A",
  subjects: [
    { class: "6A", subject: "English" },
    { class: "6A", subject: "GK" },
    { class: "7B", subject: "Math" }
  ]
};

window.onload = () => {
  renderSubjects();
  renderClassTeacherSection();
};

function renderSubjects() {
  const container = document.getElementById("subject-teach-list");

  teacherData.subjects.forEach((item) => {
    const card = document.createElement("div");
    card.className = "subject-card";

    card.innerHTML = `
      <h3>${item.subject}</h3>
      <p>Class: ${item.class}</p>
      <div class="card-buttons">
        <button class="btn">View Marks</button>
        <button class="btn">Enter/Update Marks</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderClassTeacherSection() {
  if (teacherData.isClassTeacher) {
    const section = document.getElementById("class-teacher-section");
    section.classList.remove("hidden");
    document.getElementById("class-teacher-classname").textContent = teacherData.classTeacherClass;
  }
}
