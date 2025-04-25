// Load logged-in patient info
const patient = JSON.parse(localStorage.getItem("loggedInPatient"));
if (!patient) {
  alert("Please login first");
  window.location.href = "login.html";
}

document.getElementById("patientName").textContent = patient.name;
document.getElementById("patientEmail").textContent = patient.email;
document.getElementById("patientPhone").textContent = patient.phone || "Not Provided";

// Section Switching
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  const section = document.getElementById(id);
  if (!section) {
    console.error(`Section with id '${id}' not found.`);
    return;
  }
  section.style.display = "block";
  if (id === "search") loadDoctors();
  if (id === "status") loadAppointmentStatus();
  if (id === "history") loadPreviousAppointments();
  if (id === "calendar") renderCalendar();
}

// Load Doctors
function loadDoctors() {
  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const container = document.getElementById("doctorList");
  container.innerHTML = doctors.map((doc, index) => `
    <div class="doctor-card">
      <p><strong>${doc.name}</strong> - ${doc.specialization}</p>
      <p>Fee: ₹${doc.fee}</p>
      <input type="date" id="date-${index}" />
      <input type="text" placeholder="Slot (e.g. 10:00 AM - 10:30 AM)" id="slot-${index}" />
      <button onclick="bookDoctor(${index})">Book</button>
    </div>
  `).join("");
}

// Book a doctor
function bookDoctor(index) {
  const doctors = JSON.parse(localStorage.getItem("doctors")) || [];
  const doc = doctors[index];

  const dateInput = document.getElementById(`date-${index}`);
  const slotInput = document.getElementById(`slot-${index}`);

  const date = dateInput.value;
  const slot = slotInput.value;

  if (!date || !slot) {
    alert("Please select a date and enter a time slot.");
    return;
  }

  const appointment = {
    patientEmail: patient.email,
    doctorName: doc.name,
    doctorEmail: doc.email,
    date,
    slot,
    status: "Pending",
    meetLink: "Will be shared later",
    fee: doc.fee,
  };

  const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
  allAppointments.push(appointment);
  localStorage.setItem("appointments", JSON.stringify(allAppointments));

  const receipt = `
    Receipt:
    Doctor: ${doc.name}
    Date: ${date}
    Time: ${slot}
    Fee: ₹${doc.fee}
  `;
  if (confirm("Appointment Booked!\n\nDo you want to print the receipt?")) {
    const win = window.open("", "Print Receipt", "width=400,height=400");
    win.document.write(`<pre>${receipt}</pre>`);
    win.print();
    win.close();
  }
}

// Appointment Status
function loadAppointmentStatus() {
  const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const myAppointments = allAppointments.filter(a => a.patientEmail === patient.email);

  const container = document.getElementById("appointmentStatusList");
  container.innerHTML = myAppointments.map(app => `
    <div class="appointment-card">
      <p><strong>Doctor:</strong> ${app.doctorName}</p>
      <p><strong>Date:</strong> ${app.date}</p>
      <p><strong>Time:</strong> ${app.slot}</p>
      <p><strong>Status:</strong> ${app.status}</p>
      <p><strong>Meet Link:</strong> ${app.meetLink}</p>
    </div>
  `).join("");
}

// Appointment History
function loadPreviousAppointments() {
  const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const myHistory = allAppointments.filter(a => a.patientEmail === patient.email && a.status === "Completed");

  const container = document.getElementById("previousAppointmentsList");
  container.innerHTML = myHistory.map((app, index) => {
    const feedback = app.feedback || "";
    return `
      <div class="appointment-card">
        <p><strong>Doctor:</strong> ${app.doctorName}</p>
        <p><strong>Date:</strong> ${app.date}</p>
        <p><strong>Time:</strong> ${app.slot}</p>
        <p><strong>Feedback:</strong> ${feedback || "No feedback yet"}</p>
        ${!feedback ? `<button onclick="giveFeedback(${index})">Give Feedback</button>` : ""}
      </div>
    `;
  }).join("");
}

// Give Feedback
function giveFeedback(index) {
  const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const completed = allAppointments.filter(a => a.patientEmail === patient.email && a.status === "Completed");
  const feedback = prompt("Enter your feedback:");
  if (feedback) {
    const realIndex = allAppointments.findIndex(a => a.patientEmail === completed[index].patientEmail && a.date === completed[index].date);
    allAppointments[realIndex].feedback = feedback;
    localStorage.setItem("appointments", JSON.stringify(allAppointments));
    alert("Feedback submitted!");
    loadPreviousAppointments();
  }
}

// Generate Meet Link
function generateMeetLink() {
  return "https://meet.fakehospital.com/" + Math.random().toString(36).substring(2, 8);
}

// Logout
function logout() {
  localStorage.removeItem("loggedInPatient");
  localStorage.removeItem("loggedInDoctor");
  window.location.href = "../index.html";
}

// Render Calendar
function renderCalendar() {
  const calendarContainer = document.getElementById("calendarContainer");
  calendarContainer.innerHTML = ""; // Reset

  const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const myAppointments = allAppointments.filter(a => a.patientEmail === patient.email);

  const events = myAppointments.map(app => ({
    title: `Dr. ${app.doctorName} (${app.slot})`,
    start: app.date,
    allDay: false,
  }));

  const calendarEl = document.createElement("div");
  calendarEl.id = "calendar";
  calendarContainer.appendChild(calendarEl);

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    events: events,
  });

  calendar.render();
}
