// SHIJA - maintenance.js - CLEAN WHITE - ONLY VIDEO + MESSAGE - NO OFFLINE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = { apiKey:"AIzaSyB8Eu2ScZyR62gfkGXKs1sMp3ZudLtGdFE", authDomain:"discharge-b9528.firebaseapp.com", projectId:"discharge-b9528", storageBucket:"discharge-b9528.firebasestorage.app", messagingSenderId:"1076050472607", appId:"1:1076050472607:web:736e0688a41462460efcaa" };
const app = initializeApp(cfg, "maint_"+Math.random());
const db = getFirestore(app);

const style = document.createElement("style");
style.textContent = `
#maintOverlay{position:fixed!important;inset:0!important;z-index:999999!important;background:#fff!important;display:none;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui}
.maintClean{width:100%;max-width:520px;text-align:center}
.maintClean video{width:100%;max-height:380px;object-fit:contain;background:#fff;display:block}
.maintClean h1{font-size:28px;font-weight:900;color:#000;margin:18px 0 8px;line-height:1.2}
.maintClean p{font-size:15px;color:#525252;line-height:1.5;margin:0}
@media(max-width:640px){.maintClean h1{font-size:24px}.maintClean video{max-height:300px}}
`;
document.head.appendChild(style);

const div = document.createElement("div");
div.id = "maintOverlay";
div.innerHTML = `
  <div class="maintClean">
    <video autoplay muted loop playsinline preload="auto">
      <source src="mpikachu.mp4" type="video/mp4">
    </video>
    <h1>We Are Improving SHIJA!</h1>
    <p id="maintMsgText">We are updating the page.<br>Please come back in a while.</p>
  </div>`;
document.body.appendChild(div);

const file = location.pathname.split('/').pop() || 'index.html';

onSnapshot(doc(db,'site_settings','global'), (s)=>{
  if(!s.exists()) return;
  let d = s.data();
  let page = d.pages?.[file] || {};
  let show = d.globalMaintenance || d.maintenance || d.maintenanceMode || page.maintenance || page.maintenanceMode || false;
  let overlay = document.getElementById('maintOverlay');
  overlay.style.display = show ? 'flex' : 'none';
  let vid = overlay.querySelector('video');
  if(show){ vid.play().catch(()=>{}); } else { vid.pause(); }
  if(show && d.message) document.getElementById('maintMsgText').innerHTML = d.message;
});
