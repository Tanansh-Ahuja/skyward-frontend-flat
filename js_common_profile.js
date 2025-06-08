import { API_BASE_URL } from './js_config.js';

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  alert("User not logged in");
  window.location.href = "/login.html";
}

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const passwordInput = document.getElementById("password");
const editBtn = document.getElementById("edit-btn");
const submitBtn = document.getElementById("submit-btn");
const msg = document.getElementById("msg");

// Fetch user details
async function fetchProfile() {
  try {
    let res = null;
    if(user.role==='admin')
    {
      res = await fetch(`${API_BASE_URL}/users/admin/${user.user_id}`);
    }
    else if(user.role === 'teacher')
    {
      res = await fetch(`${API_BASE_URL}/users/teacher/${user.user_id}`);
    }
    if(res === null)
    {
      console.log("Error in fetching profile");
      return;
    }
    const data = await res.json();
    nameInput.value = data.name || "";
    emailInput.value = data.email || "";
    mobileInput.value = data.mobile || "";
  } catch (err) {
    console.error("Error loading profile", err);
  }
}

editBtn.addEventListener("click", () => {
  nameInput.disabled = false;
  emailInput.disabled = false;
  mobileInput.disabled = false;
  passwordInput.disabled = false;
  editBtn.style.display = "none";
  submitBtn.style.display = "inline-block";
});

document.getElementById("profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: nameInput.value,
    email: emailInput.value,
    mobile: mobileInput.value,
  };
  if (passwordInput.value.trim() !== "") {
    payload.password = passwordInput.value;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/users/update_me/${user.user_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result = await res.json(); // ✅ Parse first, regardless of status

    if (!res.ok){
        throw new Error(result.msg || "Unknown error");
    }

    msg.textContent = "Profile updated successfully!";
    passwordInput.value = "";
    nameInput.disabled = true;
    emailInput.disabled = true;
    mobileInput.disabled = true;
    passwordInput.disabled = true;
    submitBtn.style.display = "none";
    editBtn.style.display = "inline-block";

  } catch (err) {
    console.error(err);
    msg.textContent = err.message;
    msg.style.color = "red";
  }
});

fetchProfile();
