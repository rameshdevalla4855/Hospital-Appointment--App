// Helper to get users
function getUsers(role) {
    return JSON.parse(localStorage.getItem(role + "s")) || [];
  }
  
  // Register
  document.getElementById("patientRegisterForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
  
    const users = getUsers("patient");
  
    if (users.find(u => u.email === email)) {
      alert("User already exists!");
      return;
    }
  
    users.push({ name, email, phone, password });
    localStorage.setItem("patients", JSON.stringify(users));
    alert("Registered successfully!");
    window.location.href = "login.html";
  });
  
  // Login
  document.getElementById("patientLoginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const users = getUsers("patient");
    const user = users.find(u => u.email === email && u.password === password);
  
    if (!user) {
      alert("Invalid credentials");
      return;
    }
  
    localStorage.setItem("loggedInPatient", JSON.stringify(user));
    window.location.href = "dashboard.html";
  });
  


  // Doctor Register
document.getElementById("doctorRegisterForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const specialization = document.getElementById("specialization").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const fee = document.getElementById("fee").value;
  
    const doctors = getUsers("doctor");
  
    if (doctors.find(u => u.email === email)) {
      alert("Doctor already exists!");
      return;
    }
  
    doctors.push({ name, specialization, phone, email, password, fee });
    localStorage.setItem("doctors", JSON.stringify(doctors));
    alert("Doctor registered successfully!");
    window.location.href = "login.html";
  });
  
  // Doctor Login
  document.getElementById("doctorLoginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const doctors = getUsers("doctor");
    const doctor = doctors.find(d => d.email === email && d.password === password);
  
    if (!doctor) {
      alert("Invalid credentials");
      return;
    }
  
    localStorage.setItem("loggedInDoctor", JSON.stringify(doctor));
    window.location.href = "dashboard.html";
  });
