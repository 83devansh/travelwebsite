import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
 getFirestore,
 collection,
 getDocs,
 query,
 orderBy
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function loadReviews(){

  const container =
    document.getElementById("reviewsContainer");

  try{

    const q = query(
      collection(db,"reviews"),
      orderBy("createdAt","desc")
    );

    const snapshot = await getDocs(q);

    let html = "";

    snapshot.forEach(doc => {

      const r = doc.data();

      if(!r.approved) return;

      html += `
      <div class="review-card">

        <div class="review-stars">
          ${"⭐".repeat(r.rating || 5)}
        </div>

        <p>${r.review}</p>

        <strong>${r.name}</strong>

        <small>${r.city}</small>

      </div>
      `;
    });

    if(html === ""){
      html =
      "<div class='no-reviews'>No reviews found.</div>";
    }

    container.innerHTML = html;

  }catch(err){

    console.error(err);

    container.innerHTML =
    "<div class='no-reviews'>Error loading reviews.</div>";
  }
}
loadReviews();