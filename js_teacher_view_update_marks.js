import { API_BASE_URL } from './js_config.js';

const urlParams = new URLSearchParams(window.location.search);
const classId = urlParams.get("class_id");
const subjectId = urlParams.get("subject_id");
const className = urlParams.get("class_name");
const subjectName = urlParams.get("subject_name");

document.getElementById("page-heading").textContent = `Update Marks - ${subjectName} (${className})`;

const examTypeSelect = document.getElementById("exam-type");
const totalMarksInput = document.getElementById("total-marks");
const tableBody = document.querySelector("#marks-entry-table tbody");
const updateBtn = document.getElementById("update-btn");

let isEditable = false;

function setInputsDisabled(state) {
  const inputs = document.querySelectorAll('.marks-input');
  inputs.forEach(input => input.disabled = state);
}

examTypeSelect.addEventListener("change", async () => {
  const examType = examTypeSelect.value;

  if (!examType) {
    tableBody.innerHTML = "";
    totalMarksInput.value = "";
    return;
  }

  totalMarksInput.value = (examType.includes("unit-test")) ? 50 : 80;

  const res = await fetch(`${API_BASE_URL}/marks/by-class-subject-exam?class_id=${classId}&subject_id=${subjectId}&exam_type=${examType}`);
  const data = await res.json();

  tableBody.innerHTML = "";

  data.entries.forEach(entry => {
    const row = document.createElement("tr");

    const marks = entry.marks_obtained ?? "";
    const grade = entry.grade ?? "";
    const onLeave = entry.on_leave;

    row.innerHTML = `
      <td>${entry.student_name}</td>
      <td><input type="number" class="marks marks-input" data-student-id="${entry.student_id}" value="${marks}" /></td>
      <td><input type="text" class="grade" data-student-id="${entry.student_id}" value="${grade}" readonly /></td>
      <td><input type="checkbox" class="on-leave marks-input" data-student-id="${entry.student_id}" ${onLeave ? "checked" : ""} /></td>
    `;

    const marksInput = row.querySelector(".marks");
    const gradeInput = row.querySelector(".grade");
    const leaveInput = row.querySelector(".on-leave");

    marksInput.addEventListener("input", () => {
      const marks = parseFloat(marksInput.value);
      const total = parseFloat(totalMarksInput.value);
      if (isNaN(marks) || marks < 0 || marks > total) {
        gradeInput.value = "";
        return;
      }

      const percentage = (marks / total) * 100;
      let grade = "E";
      if (percentage >= 91) grade = "A1";
      else if (percentage >= 81) grade = "A2";
      else if (percentage >= 71) grade = "B1";
      else if (percentage >= 61) grade = "B2";
      else if (percentage >= 51) grade = "C1";
      else if (percentage >= 41) grade = "C2";
      else if (percentage >= 33) grade = "D";

      gradeInput.value = grade;
    });

    leaveInput.addEventListener("change", () => {
      if (leaveInput.checked) {
        marksInput.value = "";
        gradeInput.value = "";
        marksInput.disabled = true;
      } else {
        marksInput.disabled = false;
      }
    });

    if (onLeave) marksInput.disabled = true;

    tableBody.appendChild(row);
  });

  // Disable inputs by default
  setInputsDisabled(true);
  isEditable = false;
  updateBtn.textContent = "Update Marks";
});

updateBtn.addEventListener("click", async () => {
  let has_error=false;
  if (!isEditable) {
    // Switch to edit mode
    setInputsDisabled(false);
    updateBtn.textContent = "Submit Changes";
    isEditable = true;
    return;
  }

  try {
  
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

    if (onLeave) 
    {
      marksObtained = null;
      finalGrade = null;
      total = null;
    }
    else 
    {
        if (marksObtained === null || finalGrade === null || isNaN(total)) 
        {
            has_error=true;
            alert(`Please fill all required fields for student ID ${studentId}`);
            return;
        }
        else
        {
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
        }
    } 
    });

    if(has_error)
    {
        return;
    }

  const res = await fetch(`${API_BASE_URL}/marks/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries: payload })
  });

  if (!res.ok) {
    throw new Error("Backend error");
  }

  const result = await res.json();
  alert(result.msg || "Marks updated successfully!");

} catch (err) {
  console.error("Error while submitting marks:", err);
  alert("Something went wrong on the server. Marks could not be updated.");
} finally {
  if(!has_error)
  {
    // Always disable fields and reset button regardless of outcome
    setInputsDisabled(true);
    updateBtn.textContent = "Update Marks";
    isEditable = false;
  }
}
});
