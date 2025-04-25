// Load logged-in doctor info
const doctor = JSON.parse(localStorage.getItem("loggedInDoctor"));

if (!doctor) {
  alert("Please login first");
  window.location.href = "login.html";
}

document.getElementById("doctorName").textContent = doctor.name;

// Section switching
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";

  if (id === "schedule") loadTodaySchedule();
  if (id === "personal") loadDoctorDetails();
  if (id === "history") loadPreviousAppointments();
}

// Load doctor profile
function loadDoctorDetails() {
  document.getElementById("docName").textContent = doctor.name;
  document.getElementById("docSpec").textContent = doctor.specialization || "N/A";
  document.getElementById("docPhone").textContent = doctor.phone || "Not Provided";
  document.getElementById("docFee").textContent = doctor.fee || "N/A";
}

// Load today's appointments
function loadTodaySchedule() {
  const today = new Date().toISOString().split("T")[0];
  const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const todaysAppointments = allAppointments.filter(app =>
    app.doctorEmail === doctor.email && app.date === today
  );

  const container = document.getElementById("todayScheduleList");
  container.innerHTML = todaysAppointments.length > 0
    ? todaysAppointments.map(app => `
      <div class="appointment-card">
        <p><strong>Patient:</strong> ${app.patientEmail}</p>
        <p><strong>Time:</strong> ${app.slot}</p>
        <p><strong>Status:</strong> ${app.status}</p>
        <button onclick="markAsCompleted('${app.patientEmail}', '${app.date}', '${app.slot}')">Mark as Completed</button>
      </div>
    `).join("")
    : `<p>No appointments for today.</p>`;
}

function markAsCompleted(patientEmail, date, slot) {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const index = appointments.findIndex(a =>
    a.patientEmail === patientEmail && a.date === date && a.slot === slot
  );

  if (index !== -1) {
    appointments[index].status = "Completed";
    appointments[index].meetLink = "Meet Completed";
    localStorage.setItem("appointments", JSON.stringify(appointments));
    alert("Appointment marked as completed.");
    loadTodaySchedule();
  }
}

// Load previous appointments
function loadPreviousAppointments() {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const prev = appointments.filter(app =>
    app.doctorEmail === doctor.email && app.status === "Completed"
  );

  const container = document.getElementById("doctorAppointmentHistory");
  container.innerHTML = prev.length > 0
    ? prev.map(app => `
      <div class="appointment-card">
        <p><strong>Patient:</strong> ${app.patientEmail}</p>
        <p><strong>Date:</strong> ${app.date}</p>
        <p><strong>Time:</strong> ${app.slot}</p>
        <p><strong>Feedback:</strong> ${app.feedback || "No feedback yet"}</p>
      </div>
    `).join("")
    : `<p>No completed appointments yet.</p>`;
}


function logout() {
    localStorage.removeItem("loggedInPatient");
    localStorage.removeItem("loggedInDoctor");
    window.location.href = "../index.html";
  }
  