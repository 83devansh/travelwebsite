// =====================
// 🔥 FIREBASE SETUP
// =====================
let selectedService = {};
let selectedType = "";
let isLogin = true;
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp ,getDocs,query,orderBy} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
  { id: 2, name: "Suzuki Jimny", type: "Compact 4x4",  image: "jimny.jpeg", price: 4000, badge: "Best for 2-4", specs: ["4 Seats", "True 4x4", "Compact"], desc: "Nimble and rugged." },
  { id: 3, name: "Mahindra Thar", type: "Adventure 4x4",  image: "thar.jpg", price: 6000, badge: "Fan Favourite", specs: ["4 Seats", "4WD", "Open Top"], desc: "Pure adventure." },
  { id: 4, name: "Gypsy", type: "Family SUV",  image: "gypsy.jpeg", price: 5000, badge: "Family Pick", specs: ["7 Seats", "Comfort", "Large Luggage"], desc: "Spacious comfort." },
  { id: 5, name: "Mahindra Scorpio", type: "Expedition 4x4",  image: "scorpio.jpg", price: 6000, badge: "Expedition", specs: ["5 Seats", "High Clearance"], desc: "Extreme terrain." },
];

const activities = [
  {
  id: 1,
  name: "ParaGliding",
  image: "paragliding.jpeg",
  duration: "Adventure Experience",
  desc: "Fly above the beautiful valleys of Manali and experience breathtaking aerial views.",
  difficulty: "Moderate",

  options: [
    {
      name: "Solang Short Fly",
      price: 1300
    },
    {
      name: "Solang High Fly",
      price: 3500
    },
    {
      name: "Paragliding in Dhobi",
      price: 2000
    }
  ]
},
  { id: 2, name: "River Rafting", image: "rafting.jpeg", price: 1000, duration: "Adventure Experience", desc: "Ride through powerful river currents and enjoy an exciting white water rafting experience in the Himalayas.", difficulty: "Easy" },
  { id: 3, name: "Bunjee Jumping", image: "bungee.jpg", price: 2000, duration: "Adventure Experience", desc: "Feel the ultimate adrenaline rush with an unforgettable bungee jumping experience surrounded by mountain views.", difficulty: "Easy" },
  { id: 4, name: "ATV Bikes", image: "atvbike.jpeg", price: 1000, duration: "Adventure Experience", desc: "Explore rugged mountain trails and offroad paths with thrilling ATV bike adventures in Manali.", difficulty: "Easy" },
  { id: 5, name: "ZipLine",  image: "zipline.jpeg", price: 300, duration: "Adventure Experience", desc:"Glide across scenic valleys and forests while enjoying breathtaking panoramic views from high above.", difficulty: "Beginner–Adv" },
  { id: 6, name: "Zorbing Ball",  image: "zorbing.jpg", price: 300, duration: "Adventure Experience", desc: "Roll downhill inside a giant inflatable ball and enjoy a fun-filled adventure with friends and family.", difficulty: "Moderate" },
  { id: 7, name: "Hot Air Ballon",  image: "hab.jpeg", price: 1000, duration: "Adventure Experience", desc: "Experience peaceful sky rides and witness stunning Himalayan landscapes from a colorful hot air balloon.", difficulty: "Moderate" },
  { id: 8, name: "Skiing", image: "skiing.jpeg", price: 200, duration: "Adventure Experience", desc: "Slide through snowy mountain slopes and enjoy exciting skiing adventures during Manali’s winter season.", difficulty: "Easy" },
];

const passes = [
  {
    id: 1,
    name: "Rohtang Pass",
    image: "rohtangg.jpg",
    altitude: "13,050 ft",
    
    desc: "Gateway to Lahaul-Spiti with breathtaking snow-covered mountain views and adventure activities."
  },

  {
    id: 2,
    name: "Baralacha La",
    image: "baralacha.jpg",
    altitude: "16,040 ft",
    
    desc: "A high-altitude Himalayan pass famous for rugged landscapes and thrilling road journeys."
  },

  {
    id: 3,
    name: "Shinkula Pass",
    image: "shinkula.jpg",
    altitude: "16,600 ft",
  
    desc: "A scenic off-road mountain pass connecting Himachal to Zanskar with untouched Himalayan beauty."
  },

  {
    id: 4,
    name: "Hampta Pass",
    image: "hampta.jpg",
    altitude: "14,100 ft",
  

    desc: "A beautiful trekking destination known for green valleys, glaciers, rivers, and dramatic mountain scenery."
  },
  {
    id: 5,
    name: "Chandratal Lake",
    image: "chandratallake.jpg",
    altitude: "14,100 ft",
  

    desc: "A stunning high-altitude lake famous for crystal-clear water, camping, and breathtaking Himalayan views."
  }
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

function renderPasses() {
  const grid = document.getElementById("passesGrid");

  grid.innerHTML = passes.map(p => `
    <div class="pass-card">

      <div class="pass-img">
        <img src="${p.image}" alt="${p.name}">
      </div>

      <div class="pass-body">

        <div class="pass-name">${p.name}</div>

        <div class="pass-altitude">
          Altitude: ${p.altitude}
        </div>

        <div class="pass-desc">
          ${p.desc}
        </div>

        

        <button
          class="btn-book"
          onclick="openBookModal('${p.name}', ${p.price}, 'pass')"
        >
          Start Adventure →
        </button>

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

        <div class="activity-desc">
          ${a.desc}
        </div>

        <div style="
          font-size:0.75rem;
          color:rgba(245,242,238,0.45);
          font-family:'Rajdhani',sans-serif;
          letter-spacing:1px;
          text-transform:uppercase;
          margin-bottom:0.8rem;
        ">
          Difficulty: ${a.difficulty}
        </div>

        ${
          a.options
            ? `
              <div class="activity-options">

                ${a.options.map(opt => `
                  <div class="activity-option">

                    <div>
                      <strong>${opt.name}</strong>
                    </div>

                    <div style="
                      display:flex;
                      align-items:center;
                      gap:10px;
                    ">
                      <span style="
                        font-size:1rem;
                        font-weight:700;
                        color:#f9b233;
                      ">
                        ₹${opt.price}
                      </span>

                      <button
                        class="btn-activity"
                        onclick="openBookModal('${opt.name}', ${opt.price}, 'activity')"
                      >
                        Book
                      </button>
                    </div>

                  </div>
                `).join("")}

              </div>
            `
            : `
              <div class="activity-footer">

                <div class="activity-price">
                  ₹${a.price.toLocaleString()}
                  <span style="
                    font-size:0.75rem;
                    color:rgba(245,242,238,0.45);
                    font-weight:400;
                  ">
                    /person
                  </span>
                </div>

                <div class="activity-duration">
                  ${a.duration}
                </div>

              </div>

              <button
                class="btn-activity"
                onclick="openBookModal('${a.name}', ${a.price}, 'activity')"
              >
                Book Activity →
              </button>
            `
        }

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

    const groupLabel = selectedOption.parentElement.label;

  let type = "activity";

  if (groupLabel.includes("Passes")) {
  type = "pass";
}

    const date = document.getElementById("bookingDate").value;
    const request = document.getElementById("bkRequest").value;
    

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
      request,
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
    

    if (!name || !phone || !date) {
      alert("Please fill all required fields");
      return;
    }

    await addDoc(collection(db, "bookings"), {
      name,
      phone,
      date,
      people: Number(people || 1),
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
  renderPasses();

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

function toggleMenu() {
  document.querySelector(".nav-links")
    .classList.toggle("active");
}

window.toggleMenu = toggleMenu;

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

  const activityGroup =
    select.querySelector('optgroup[label="🏔️ Activities"]');

  const passGroup =
    select.querySelector('optgroup[label="🏔️ Passes"]');

  activityGroup.innerHTML = "";
  passGroup.innerHTML = "";

  // Activities
  activities.forEach(a => {

    if (a.options) {

      a.options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.price;
        option.textContent = opt.name;

        activityGroup.appendChild(option);
      });

    } else {

      const option = document.createElement("option");
      option.value = a.price;
      option.textContent = a.name;

      activityGroup.appendChild(option);
    }
  });

  // Passes
  passes.forEach(p => {
    const option = document.createElement("option");
    option.value = 0; // change if passes have prices
    option.textContent = p.name;

    passGroup.appendChild(option);
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





async function handleReviewSubmit(e){


  e.preventDefault();
   if (!isLoggedIn()) {
    
    openLogin();
    return;
  }

  try{

    const name =
      document.getElementById("reviewName").value;

    const city =
      document.getElementById("reviewCity").value;

    const rating =
      document.getElementById("reviewRating").value;

    const review =
      document.getElementById("reviewMessage").value;

    await addDoc(
      collection(db,"reviews"),
      {
        name,
        city,
        rating:Number(rating),
        review,
        approved:true,
        createdAt:serverTimestamp()
      }
    );

    reviewForm.reset();

const btn = document.querySelector("#reviewForm button");

btn.textContent = "Review Submitted ✓";

setTimeout(() => {
  btn.textContent = "Submit Review →";
}, 3000);

    e.target.reset();

  }catch(err){

    console.error(err);

    alert("Error submitting review");

  }

}

document
  .getElementById("reviewForm")
  ?.addEventListener(
    "submit",
    handleReviewSubmit
  );

  async function handleSpitiSubmit(e) {

    e.preventDefault();
   if (!isLoggedIn()) {
    
    openLogin();
    return;
  }

  

  try {

    const name =
      document.getElementById("spitiName").value;

    const phone =
      document.getElementById("spitiPhone").value;

    const email =
      document.getElementById("spitiEmail").value;

    const people =
      document.getElementById("spitiPeople").value;

    const message =
      document.getElementById("spitiMessage").value;

    await addDoc(
      collection(db, "spitiqueries"),
      {
        name,
        phone,
        email,
        people,
        message,
        createdAt: serverTimestamp()
      }
    );

    document.getElementById("successModal")
  .classList.add("active");

    e.target.reset();

  } catch(err) {

    console.error(err);

    alert("Error sending inquiry");

  }
}
document
  .getElementById("spitiForm")
  ?.addEventListener(
    "submit",
    handleSpitiSubmit
  );

  function openSpitiModal() {
  document
    .getElementById("spitiModal")
    .classList.add("active");
}

function closeSpitiModal() {
  document
    .getElementById("spitiModal")
    .classList.remove("active");
}

window.openSpitiModal = openSpitiModal;
window.closeSpitiModal = closeSpitiModal;