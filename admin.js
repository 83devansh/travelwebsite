import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection,getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDSO1dmM8u5dRRUIQc1L_ZS7WFgmOkqOu4",
  authDomain: "travel-b948e.firebaseapp.com",
  projectId: "travel-b948e",
  storageBucket: "travel-b948e.firebasestorage.app",
  messagingSenderId: "943193452468",
  appId: "1:943193452468:web:14f8ce65720b6f44620ce1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



function renderAll(bookings) {
  renderQuickBookings(bookings);
  renderActivityBookings(bookings);
  renderVehicleBookings(bookings);
  renderDashboard(bookings);
   renderDashboardTable(bookings);
}
async function loadBookings() {
  try {
    const snapshot = await getDocs(collection(db, "bookings"));

    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Bookings loaded:", bookings); // 🔥 ADD THIS

    renderAll(bookings);

  } catch (err) {
    console.error("Error loading bookings:", err);
  }
}
function renderQuickBookings(bookings) {
  const tbody = document.getElementById("bookingsBody");

  const quick = bookings.filter(b => b.type === "quick");

  if (!quick.length) {
    tbody.innerHTML = `<tr><td colspan="9">No quick bookings</td></tr>`;
    return;
  }

  tbody.innerHTML = quick.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.name}</td>
      <td>${b.phone}</td>
      <td>${b.service}</td>
      <td>${b.date || "-"}</td>
      <td>${b.people || "-"}</td>
      <td>₹${b.price || 0}</td>
      <td>
  ${b.status || "Pending"}
</td>
<td>
  <button onclick="deleteBooking('${b.id}')">Delete</button>
</td>
      
    </tr>
  `).join("");
}

function renderActivityBookings(bookings) {
  const tbody = document.getElementById("activitiesBody");
  if (!tbody) return;

  const activities = bookings.filter(b => b.type === "activity");

  if (!activities.length) {
    tbody.innerHTML = `<tr><td colspan="8">No activity bookings</td></tr>`;
    return;
  }

  tbody.innerHTML = activities.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.name}</td>
      <td>${b.phone}</td>
      <td>${b.service}</td>
      <td>${b.date || "-"}</td>
      <td>${b.people || "-"}</td>
      <td>₹${b.price || 0}</td>
      <td>
  ${b.status || "Pending"}
</td>
<td>
  <button onclick="deleteBooking('${b.id}')">Delete</button>
</td>
    </tr>
  `).join("");
}

function renderVehicleBookings(bookings) {
  const tbody = document.getElementById("vehiclesBody");
  if (!tbody) return;

  const vehicles = bookings.filter(b => b.type === "vehicle");

  if (!vehicles.length) {
    tbody.innerHTML = `<tr><td colspan="8">No vehicle bookings</td></tr>`;
    return;
  }

  tbody.innerHTML = vehicles.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.name}</td>
      <td>${b.phone}</td>
      <td>${b.service}</td>
      <td>${b.date || "-"}</td>
      <td>${b.people || "-"}</td>
      <td>₹${b.price || 0}</td>
     <td>
  ${b.status || "Pending"}
</td>
<td>
  <button onclick="deleteBooking('${b.id}')">Delete</button>
</td>
    </tr>
  `).join("");
}

function renderDashboard(bookings) {
 
  const activities = bookings.filter(b => b.type === "activity");
  const vehicles = bookings.filter(b => b.type === "vehicle");

  const revenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);

  
  document.getElementById("stat-activities").textContent = activities.length;
  document.getElementById("stat-vehicles").textContent = vehicles.length;
  document.getElementById("stat-revenue").textContent = "₹" + revenue;
}
async function updateContactStats() {
  try {
    const snapshot = await getDocs(collection(db, "contactus"));

    const totalContacts = snapshot.size;

    document.getElementById("stat-bookings").textContent = totalContacts;

  } catch (err) {
    console.error("Error loading contact stats:", err);
  }
}

function renderDashboardTable(bookings) {
  const tbody = document.getElementById("dashBookingsBody");
  if (!tbody) return;

  const latest = bookings
  .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
  .slice(0, 5);

  tbody.innerHTML = latest.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.name}</td>
      <td>${b.service}</td>
      <td>${b.date || "-"}</td>
      <td>₹${b.price || 0}</td>
      <td>${b.status || "Pending"}</td>
      <td>
  <button onclick="deleteBooking('${b.id}')">Delete</button>
</td>
    </tr>
  `).join("");
}

function showPage(page, el) {
  // remove active from all pages
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  // show selected page
  document.getElementById(`page-${page}`).classList.add("active");

  // update sidebar active state
  document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
  el.classList.add("active");

  // change title
  document.getElementById("pageTitle").textContent =
    page.charAt(0).toUpperCase() + page.slice(1);
}

// make it global (important for onclick)
window.showPage = showPage;

window.addEventListener("DOMContentLoaded", () => {
  loadBookings();
  loadContacts();
    updateContactStats(); // 🔥 ADD THIS
});
const isAdmin = localStorage.getItem("isAdmin");

if (isAdmin !== "true") {
  alert("Access denied");
  window.location.href = "index.html";
}

async function deleteBooking(id) {
  const confirmDelete = confirm("Delete this booking?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "bookings", id));

    alert("Deleted successfully");
    loadBookings(); // refresh UI

  } catch (err) {
    console.error(err);
    alert("Error deleting booking");
  }
}

window.deleteBooking = deleteBooking;

async function loadContacts() {
  try {
    const snapshot = await getDocs(collection(db, "contactus"));

    const contacts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderContacts(contacts);

  } catch (err) {
    console.error("Error loading contacts:", err);
  }
}

function renderContacts(contacts) {
  const tbody = document.getElementById("contactBody");
  if (!tbody) return;

  if (!contacts.length) {
    tbody.innerHTML = `<tr><td colspan="7">No contact queries</td></tr>`;
    return;
  }

  tbody.innerHTML = contacts.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.phone}</td>
      <td>${c.email || "-"}</td>
      <td>${c.interest}</td>
      <td>${c.message || "-"}</td>
      <td>
        <button onclick="deleteContact('${c.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

async function deleteContact(id) {
  const confirmDelete = confirm("Delete this query?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "contactus", id));

    alert("Deleted successfully");
    loadContacts();

  } catch (err) {
    console.error(err);
    alert("Error deleting contact");
  }
}

window.deleteContact = deleteContact;