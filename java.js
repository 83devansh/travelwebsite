// =====================
// 🔥 FIREBASE SETUP
// =====================
let selectedService = {};
let selectedType = "";
let isLogin = true;
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth(app);

// =====================
// DATA
// =====================
const vehicles = [
  { id: 1, name: "Toyota Fortuner", type: "Premium SUV", image: "fortuner.jpeg", price: 7000, badge: "Most Popular", specs: ["7 Seats", "4x4 AWD", "AC + Heater"], desc: "The ultimate mountain machine. Perfect for Rohtang, Spiti & Ladakh routes." },
  { id: 2, name: "Suzuki Jimny", type: "Compact 4x4",  image: "jimny.jpeg", price: 4000, badge: "Best for 2-4", specs: ["4 Seats", "True 4x4", "Compact & Agile"], desc: "Nimble and rugged." },
  { id: 3, name: "Mahindra Thar", type: "Adventure 4x4",  image: "thar.jpg", price: 6000, badge: "Fan Favourite", specs: ["4 Seats", "4WD", "Open Top"], desc: "Pure adventure." },
  { id: 4, name: "Gypsy", type: "Family SUV",  image: "gypsy.jpeg", price: 5000, badge: "Family Pick", specs: ["7 Seats", "Comfort", "Large Luggage"], desc: "Spacious comfort." },
  { id: 5, name: "Mahindra Scorpio", type: "Expedition 4x4",  image: "scorpio.jpg", price: 6000, badge: "Expedition", specs: ["5 Seats", "High Clearance"], desc: "Extreme terrain." },
];

const activities = [
  { id: 1, name: "ParaGliding",  image: "paragliding.jpeg", price: 1200, duration: "1 Day", desc: "Trek through alpine meadows and glacial moraines to the stunning Beas Kund lake.", difficulty: "Moderate" },
  { id: 2, name: "Rever Rafting", image: "rafting.jpeg", price: 1000, duration: "Full Day", desc: "Conquer the legendary Rohtang Pass at 3978m in a 4x4 with expert mountain drivers.", difficulty: "Easy" },
  { id: 3, name: "Bunjee Jumping", image: "bungee.jpg", price: 2000, duration: "2-3 Hours", desc: "Soar above the Kullu Valley with certified instructors. Stunning aerial views guaranteed.", difficulty: "Easy" },
  { id: 4, name: "ATV Bikes", image: "atvbike.jpeg", price: 1000, duration: "Overnight", desc: "Camp beside the Beas river under a blanket of stars. Bonfire, dinner & breakfast included.", difficulty: "Easy" },
  { id: 5, name: "ZipLine",  image: "zipline.jpeg", price: 300, duration: "Full Day", desc: "Learn skiing or polish your skills at the famous Solang Valley ski slopes with expert trainers.", difficulty: "Beginner–Adv" },
  { id: 6, name: "Zorbing Ball",  image: "zorbing.jpg", price: 300, duration: "4 Hours", desc: "Scale natural rock faces with safety gear and professional instructors. Perfect for beginners.", difficulty: "Moderate" },
  { id: 7, name: "Hot Air Ballon",  image: "hab.jpeg", price: 1000, duration: "3 Hours", desc: "Navigate Grade II–III rapids on the Beas. Thrilling, refreshing and perfectly safe.", difficulty: "Moderate" },
  { id: 8, name: "Skiing", image: "skiing.jpeg", price: 200, duration: "2 Hours", desc: "Explore Old Manali's scenic trails and apple orchards on horseback. Great for families.", difficulty: "Easy" },
];
// =====================
// RENDER
// =====================
function renderVehicles() {
  const grid = document.getElementById('vehiclesGrid');
  grid.innerHTML = vehicles.map(v => `
    <div class="vehicle-card">
     <div class="vehicle-img">
  <img src="${v.image}" alt="${v.name}">
</div>
      <div class="vehicle-badge">${v.badge}</div>
      <div class="vehicle-body">
        <div class="vehicle-name">${v.name}</div>
        <div class="vehicle-type">${v.type}</div>
        <div class="vehicle-specs">
          ${v.specs.map(s => `<div class="spec"><span class="spec-icon">✓</span> ${s}</div>`).join('')}
        </div>
        <p style="font-size:0.85rem;color:#8a7a6a;margin-bottom:1rem;line-height:1.6">${v.desc}</p>
        <div class="vehicle-price">₹${v.price.toLocaleString()} <small>/ day incl. driver</small></div>
        <button class="btn-book" onclick="openBookModal('${v.name}', ${v.price}, 'vehicle')">Book Now →</button>
      </div>
    </div>
  `).join('');
}


function renderActivities() {
  const grid = document.getElementById('activitiesGrid');
  grid.innerHTML = activities.map(a => `
    <div class="activity-card">
      <div class="activity-img">
        <img src="${a.image}" alt="${a.name}">
        <div class="activity-img-overlay"></div>
      </div>
      <div class="activity-body">
        <div class="activity-name">${a.name}</div>
        <div class="activity-desc">${a.desc}</div>
        <div style="font-size:0.75rem;color:rgba(245,242,238,0.45);font-family:'Rajdhani',sans-serif;letter-spacing:1px;text-transform:uppercase;margin-bottom:0.8rem;">
          Difficulty: ${a.difficulty}
        </div>
        <div class="activity-footer">
          <div class="activity-price">₹${a.price.toLocaleString()}
            <span style="font-size:0.75rem;color:rgba(245,242,238,0.45);font-weight:400"> /person</span>
          </div>
          <div class="activity-duration">${a.duration}</div>
        </div>
        <button class="btn-activity" onclick="openBookModal('${a.name}', ${a.price}, 'activity')">
          Book Activity →
        </button>
      </div>
    </div>
  `).join('');
}

function isLoggedIn() {
  return auth.currentUser !== null;
}
// =====================
// BOOKING LOGIC
// =====================
async function handleBookingSubmit(e) {
  e.preventDefault();

  // 🔴 ADD THIS BLOCK
  if (!isLoggedIn()) {
    alert("Please login first");
    openLogin();
    return;
  }

  try {
    const name = document.getElementById("bkName").value;
    const phone = document.getElementById("bkPhone").value;
    const people = document.getElementById("bkPeople").value;

    const serviceSelect = document.getElementById("bookingSelect");
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];

    const serviceName = selectedOption.text;
    const price = serviceSelect.value;

    const type = selectedOption.parentElement.label.includes("Vehicles")
      ? "vehicle"
      : "activity";

    const date = document.getElementById("bookingDate").value;
    const duration = document.getElementById("bookingDuration").value;

    if (!name || !phone) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "bookings"), {
      name,
      phone,
      people: Number(people),
      service: serviceName,
      price: Number(price),
      date,
      duration,
      type,
      status: "Pending",
      createdAt: serverTimestamp()
    });

    document.getElementById('successModal').classList.add('active');
    e.target.reset();

  } catch (err) {
    console.error(err);
    alert("Error saving booking");
  }
}

// =====================
// MODAL BOOKING
// =====================
function openBookModal(name, price, type) {
  selectedService = { name, price };
  selectedType = type;

  document.getElementById("modalTitle").textContent = `Book: ${name}`;
  document.getElementById("bookModal").classList.add("active");
}

function closeModal() {
  document.getElementById("bookModal").classList.remove("active");
}

async function handleModalSubmit(e) {
  e.preventDefault();

  // 🔴 ADD THIS BLOCK
  if (!isLoggedIn()) {
    alert("Please login first");
    openLogin();
    return;
  }

  try {
    const name = document.getElementById("modalName").value;
    const phone = document.getElementById("modalPhone").value;
    const date = document.getElementById("modalDate").value;
    const people = document.getElementById("modalPeople").value;
    const duration = document.getElementById("modalDuration").value;

    if (!name || !phone || !date) {
      alert("Please fill all required fields");
      return;
    }

    await addDoc(collection(db, "bookings"), {
      name,
      phone,
      date,
      people: Number(people || 1),
      duration,
      service: selectedService.name,
      price: selectedService.price,
      type: selectedType,
      status: "Pending",
      createdAt: serverTimestamp()
    });

    document.getElementById("successModal").classList.add("active");
    closeModal();

  } catch (err) {
    console.error(err);
    alert("Error saving booking");
  }
}

// =====================
// AUTH
// =====================
async function registerUser() {
  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;
  const phone = document.getElementById("authPhone").value;

  if (!email || !password || !phone) return alert("Fill all");

  await createUserWithEmailAndPassword(auth, email, password);
  alert("Registered");
}

async function loginUser() {
  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;

  try {
    // 👑 ADMIN LOGIN CHECK
    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");

      alert("Admin login successful");

      window.location.href = "admin.html";
      return;
    }

    // 👤 NORMAL USER LOGIN
    await signInWithEmailAndPassword(auth, email, password);

    alert("Login successful");

  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
}

// =====================
// UI AUTH
// =====================
function openLogin() {
  isLogin = true;
  document.getElementById("phoneGroup").style.display = "none";
  document.getElementById("authModal").classList.add("active");
}

function openRegister() {
  isLogin = false;
  document.getElementById("phoneGroup").style.display = "block";
  document.getElementById("authModal").classList.add("active");
}

function closeAuth() {
  document.getElementById("authModal").classList.remove("active");
}

// =====================
// INIT
// =====================
window.addEventListener("DOMContentLoaded", () => {
  renderVehicles();
  renderActivities();

  document.querySelector("#booking .booking-form")
    ?.addEventListener("submit", handleBookingSubmit);

  document.getElementById("modalBookingForm")
    ?.addEventListener("submit", handleModalSubmit);

  document.getElementById("authForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      isLogin ? await loginUser() : await registerUser();
      closeAuth();
    });
});

// =====================
// GLOBAL
// =====================
window.openBookModal = openBookModal;
window.closeModal = closeModal;
window.openLogin = openLogin;
window.openRegister = openRegister;
window.closeAuth = closeAuth;

// =====================
// AUTH STATE
// =====================
onAuthStateChanged(auth, (user) => {
  const loginBtn = document.querySelector(".login-btn");
  const registerBtn = document.querySelector(".register-btn");

  if (!loginBtn || !registerBtn) return;

  if (user) {
    loginBtn.textContent = user.email;
    registerBtn.textContent = "Logout";
    registerBtn.onclick = () => signOut(auth);
  } else {
    loginBtn.textContent = "Login";
    registerBtn.textContent = "Register";
    registerBtn.onclick = openRegister;
  }
});
function populateBookingDropdown() {
  const select = document.getElementById("bookingSelect");

  const vehicleGroup = select.querySelector('optgroup[label="🚙 Vehicles"]');
  const activityGroup = select.querySelector('optgroup[label="🏔️ Activities"]');

  // Clear old options
  vehicleGroup.innerHTML = "";
  activityGroup.innerHTML = "";

  // Add vehicles
  vehicles.forEach(v => {
    const option = document.createElement("option");
    option.value = v.price;
    option.textContent = v.name;
    vehicleGroup.appendChild(option);
  });

  // Add activities
  activities.forEach(a => {
    const option = document.createElement("option");
    option.value = a.price;
    option.textContent = a.name;
    activityGroup.appendChild(option);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderVehicles();
  renderActivities();

  populateBookingDropdown(); // 🔥 ADD THIS

  document.querySelector("#booking .booking-form")
    ?.addEventListener("submit", handleBookingSubmit);
});

function updateEstimatedTotal() {
  const select = document.getElementById("bookingSelect");
  const people = document.getElementById("bkPeople").value;

  const price = select.value;

  if (!price) {
    document.getElementById("bookingTotal").textContent = "₹ —";
    return;
  }

  const total = Number(price) * Number(people || 1);

  document.getElementById("bookingTotal").textContent = `₹${total}`;
}

document.getElementById("bookingSelect")
  ?.addEventListener("change", updateEstimatedTotal);

document.getElementById("bkPeople")
  ?.addEventListener("input", updateEstimatedTotal);

  async function handleContactSubmit(e) {
  e.preventDefault();

  try {
    const name = document.getElementById("ctName").value;
    const phone = document.getElementById("ctPhone").value;
    const email = document.getElementById("ctEmail").value;
    const interest = document.getElementById("ctInterest").value;
    const message = document.getElementById("ctMessage").value;

    if (!name || !phone) {
      alert("Please fill required fields");
      return;
    }

    await addDoc(collection(db, "contactus"), {
      name,
      phone,
      email,
      interest,
      message,
      createdAt: serverTimestamp()
    });

    alert("Message sent successfully ✅");

    e.target.reset();

  } catch (err) {
    console.error(err);
    alert("Error sending message");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", handleContactSubmit);
  }
});

