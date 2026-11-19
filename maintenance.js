// SHIJA - maintenance.js - WHITE - MAINTENANCE + NO INTERNET - pikachu.mp4
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = { apiKey:"AIzaSyB8Eu2ScZyR62gfkGXKs1sMp3ZudLtGdFE", authDomain:"discharge-b9528.firebaseapp.com", projectId:"discharge-b9528", storageBucket:"discharge-b9528.firebasestorage.app", messagingSenderId:"1076050472607", appId:"1:1076050472607:web:736e0688a41462460efcaa" };
const app = initializeApp(cfg, "maint_"+Math.random());
const db = getFirestore(app);

const style = document.createElement("style");
style.textContent = `
#maintOverlay,#offlineOverlay{position:fixed!important;inset:0!important;z-index:999999!important;background:#fff!important;display:none;align-items:center;justify-content:center;padding:20px;font-family:Inter,system-ui}
.maintClean{width:100%;max-width:520px;text-align:center}
.maintClean video{width:100%;max-height:380px;object-fit:contain;background:#fff;display:block}
.maintClean h1{font-size:28px;font-weight:900;color:#000;margin:18px 0 8px;line-height:1.2}
.maintClean p{font-size:15px;color:#525252;line-height:1.5;margin:0}
.maintClean .tryList{text-align:left;max-width:340px;margin:14px auto 0;font-size:14px;color:#525252;line-height:1.6}
.maintClean .tryList b{color:#000}
.maintClean .err{margin-top:14px;font-size:12px;color:#a3a3a3;letter-spacing:.5px;text-transform:uppercase}
.maintClean .retryBtn{margin-top:16px;padding:12px 22px;border:0;border-radius:10px;background:#000;color:#fff;font-weight:800;font-size:14px;cursor:pointer}
@media(max-width:640px){.maintClean h1{font-size:24px}.maintClean video{max-height:300px}}
`;
document.head.appendChild(style);

// --- 1. MAINTENANCE OVERLAY - mpikachu.mp4 ---
const maintDiv = document.createElement("div");
maintDiv.id = "maintOverlay";
maintDiv.innerHTML = `
  <div class="maintClean">
    <video autoplay muted loop playsinline preload="auto">
      <source src="mpikachu.mp4" type="video/mp4">
    </video>
    <h1>We Are Improving SHIJA!</h1>
    <p id="maintMsgText">We are updating the page.<br>Please come back in a while.</p>
  </div>`;
document.body.appendChild(maintDiv);

// --- 2. NO INTERNET OVERLAY - pikachu.mp4 ---
const offDiv = document.createElement("div");
offDiv.id = "offlineOverlay";
offDiv.innerHTML = `
  <div class="maintClean">
    <video autoplay muted loop playsinline preload="auto">
      <source src="pikachu.mp4" type="video/mp4">
      <source src="mpikachu.mp4" type="video/mp4">
    </video>
    <h1>No internet</h1>
    <p>Try:</p>
    <div class="tryList">
      <div>• Checking the network cables, modem, and router</div>
      <div>• Reconnecting to Wi-Fi</div>
    </div>
    <div class="err">ERR_INTERNET_DISCONNECTED</div>
    <button class="retryBtn" onclick="location.reload()">↻ Try Again</button>
  </div>`;
document.body.appendChild(offDiv);

function showMaint(show, msg){
  let o = document.getElementById('maintOverlay');
  o.style.display = show ? 'flex' : 'none';
  let v = o.querySelector('video');
  if(show) v.play().catch(()=>{}); else v.pause();
  if(show && msg) document.getElementById('maintMsgText').innerHTML = msg;
}

function showOffline(show){
  // Offline has priority over maintenance
  let o = document.getElementById('offlineOverlay');
  o.style.display = show ? 'flex' : 'none';
  let v = o.querySelector('video');
  if(show) v.play().catch(()=>{}); else v.pause();
  if(show){
    // Hide maintenance when offline
    document.getElementById('maintOverlay').style.display = 'none';
  }
}

// --- CHECK INTERNET ---
function checkOnline(){
  showOffline(!navigator.onLine);
}
window.addEventListener('online', ()=>showOffline(false));
window.addEventListener('offline', ()=>showOffline(true));
checkOnline();

// Extra check - try to ping Google every 10 sec, if fails show offline
setInterval(async ()=>{
  try{
    await fetch('https://www.google.com/favicon.ico', {mode:'no-cors', cache:'no-store'});
  }catch(e){ showOffline(true); }
}, 10000);

// --- FIREBASE MAINTENANCE ---
const file = location.pathname.split('/').pop() || 'index.html';
onSnapshot(doc(db,'site_settings','global'), (s)=>{
  if(!s.exists()) return;
  let d = s.data();
  let page = d.pages?.[file] || {};
  let show = d.globalMaintenance || d.maintenance || d.maintenanceMode || page.maintenance || page.maintenanceMode || false;
  // Don't show maintenance if offline - offline is more important
  if(navigator.onLine) showMaint(show, d.message);
});
