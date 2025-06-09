import { API_BASE_URL } from './js_config.js';

const urlParams = new URLSearchParams(window.location.search);
const classId = urlParams.get("class_id");
const subjectId = urlParams.get("subject_id");
const className = urlParams.get("class_name");
const subjectName = urlParams.get("subject_name");

document.getElementById("page-heading").textContent = `Enter Marks - ${subjectName} (${className})`;

const examTypeSelect = document.getElementById("exam-type");
const totalMarksInput = document.getElementById("total-marks");
const tableBody = document.querySelector("#marks-entry-table tbody");
const submitButton = document.getElementById("submit-marks");

// Dynamically set total marks
function updateTotalMarks() {
  const type = examTypeSelect.value;
  totalMarksInput.value = (type === "unit-test-1" || type === "unit-test-2") ? 50 : 80;
}

examTypeSelect.addEventListener("change", updateTotalMarks);
updateTotalMarks();

async function fetchStudents() {
  const res = await fetch(`${API_BASE_URL}/student/by-class?class_id=${classId}`);
  const data = await res.json();

  tableBody.innerHTML = "";
  console.log(data);

  data.students.forEach((student) => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${student.student_name}</td>
    <td><input type="number" class="marks" data-student-id="${student.student_id}" /></td>
    <td><input type="text" class="grade" data-student-id="${student.student_id}" readonly /></td>
    <td><input type="checkbox" class="on-leave" data-student-id="${student.student_id}" /></td>
  `;

  const marksInput = row.querySelector(".marks");
  const gradeInput = row.querySelector(".grade");

  marksInput.addEventListener("input", () => {
    const marks = parseFloat(marksInput.value);
    const total = parseFloat(totalMarksInput.value);

    if (isNaN(marks) || marks < 0 || marks > total) {
      gradeInput.value = "";
      return;
    }

    const percentage = (marks / total) * 100;
    let grade = "E"; // default

    if (percentage >= 91) grade = "A1";
    else if (percentage >= 81) grade = "A2";
    else if (percentage >= 71) grade = "B1";
    else if (percentage >= 61) grade = "B2";
    else if (percentage >= 51) grade = "C1";
    else if (percentage >= 41) grade = "C2";
    else if (percentage >= 33) grade = "D";

    gradeInput.value = grade;
  });

  tableBody.appendChild(row);
});
}




fetchStudents();

submitButton.addEventListener("click", async () => {
  const examType = examTypeSelect.value;
  const totalMarks = parseFloat(totalMarksInput.value);

  const rows = document.querySelectorAll("#marks-entry-table tbody tr");
  const payload = [];

  rows.forEach(row => {
  const studentId = row.querySelector(".marks")?.dataset.studentId;
  const marks = row.querySelector(".marks")?.value || null;
  const grade = row.querySelector(".grade")?.value || null;
  const onLeave = row.querySelector(".on-leave").checked;

  let marksObtained = marks ? parseFloat(marks) : null;
  let finalGrade = grade || null;
  let total = totalMarks;

  if (onLeave) {
    marksObtained = null;
    finalGrade = null;
    total = null;
  }

  payload.push({
    student_id: parseInt(studentId),
    class_id: parseInt(classId),
    subject_id: parseInt(subjectId),
    exam_type: examType,
    marks_obtained: marksObtained,
    total_marks: total,
    grade: finalGrade,
    on_leave: onLeave
  });
});

  console.log(payload);
  const res = await fetch(`${API_BASE_URL}/marks/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ entries: payload })
  });

  const result = await res.json();
  alert(result.msg || "Marks submitted!");
});
