// SHIJA - maintenance.js - VIDEO VERSION - mpikachu.mp4 + logoc.png
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = { apiKey:"AIzaSyB8Eu2ScZyR62gfkGXKs1sMp3ZudLtGdFE", authDomain:"discharge-b9528.firebaseapp.com", projectId:"discharge-b9528", storageBucket:"discharge-b9528.firebasestorage.app", messagingSenderId:"1076050472607", appId:"1:1076050472607:web:736e0688a41462460efcaa" };
const app = initializeApp(cfg, "maint_"+Math.random());
const db = getFirestore(app);

// ---- CREATE OVERLAY ----
const style = document.createElement("style");
style.textContent = `
#maintOverlay{position:fixed;inset:0;z-index:99999;background:#FEF9C3;display:none;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui}
.maintCard{background:#fff;border-radius:22px;max-width:720px;width:100%;padding:22px;box-shadow:0 20px 50px rgba(0,0,0,.18);text-align:center}
.maintTop{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:12px}
.maintTop img{width:50px;height:50px;object-fit:contain;border-radius:50%;background:#FEF08A;padding:4px}
.maintTop b{font-size:18px}
.maintVideo{width:100%;max-height:300px;object-fit:cover;border-radius:16px;background:#000;display:block}
.maintCard h1{font-size:30px;margin:14px 0 6px;line-height:1.1}
.maintCard p{color:#57534e;font-size:14px;line-height:1.5}
.maintBar{height:12px;background:#e5e7eb;border-radius:20px;overflow:hidden;margin:16px 0 6px}
.maintBar div{height:100%;width:85%;background:#FACC15;border-radius:20px;animation:maintLoad 1.5s infinite alternate}
@keyframes maintLoad{from{width:60%}to{width:90%}}
.maintBtns{display:flex;gap:10px;margin-top:14px}
.maintBtns button{flex:1;padding:13px;border-radius:10px;font-weight:900;cursor:pointer;border:0;font-size:14px}
.maintBtns .yellow{background:#FACC15;color:#111}.maintBtns .white{background:#fff;border:2px solid #111}
@media(max-width:640px){.maintCard{padding:16px}.maintCard h1{font-size:24px}.maintVideo{max-height:200px}.maintBtns{flex-direction:column}}
`;
document.head.appendChild(style);

const div = document.createElement("div");
div.id = "maintOverlay";
div.innerHTML = `
  <div class="maintCard">
    <div class="maintTop"><img src="logoc.png" alt="SHIJA Logo"> <b>SHIJA • DIALYSIS CARE</b> <span style="background:#FDE047;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:900">• Maintenance Mode</span></div>
    <video class="maintVideo" autoplay muted loop playsinline preload="auto">
      <source src="mpikachu.mp4" type="video/mp4">
    </video>
    <h1>We Are Improving SHIJA!</h1>
    <p id="maintMsgText">Please wait a while, we will be back soon</p>
    <div class="maintBar"><div></div></div>
    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700"><span>Maintenance in progress...</span><span>~15 mins</span></div>
    <div class="maintBtns"><button class="yellow" onclick="location.reload()">↻ Refresh Status</button><button class="white" onclick="alert('Please contact SHIJA team')">💬 Contact Support</button></div>
    <p style="font-size:12px;color:#78716c;margin-top:12px">🔧 Our team is performing scheduled maintenance to improve performance & stability. Thank you for your patience!</p>
    <div style="margin-top:10px;font-size:11px;color:#a8a29e">🛡️ Secure • Reliable • Monitored</div>
  </div>`;
document.body.appendChild(div);

// ---- FIREBASE LISTENER ----
const file = location.pathname.split('/').pop() || 'index.html';
onSnapshot(doc(db,'site_settings','global'), (s)=>{
  if(!s.exists()) return;
  let d = s.data();
  let page = d.pages?.[file] || {};
  let show = d.globalMaintenance || page.maintenance;
  let hide = d.globalHide || page.hide;
  let overlay = document.getElementById('maintOverlay');
  overlay.style.display = show ? 'flex' : 'none';
  let vid = overlay.querySelector('video');
  if(show){ vid.play().catch(()=>{}); } else { vid.pause(); }
  if(show && d.message) document.getElementById('maintMsgText').innerText = d.message;
  if(hide){ document.body.style.background='#000'; document.body.innerHTML=''; }
});
