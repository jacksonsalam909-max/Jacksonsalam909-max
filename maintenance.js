// maintenance.js - FINAL - Pikachu Offline + Maintenance Control
// Add to EVERY page: <script src="maintenance.js"></script>
// Keep pikachu.mp4 in same folder
(function(){
  if(window.location.pathname.includes('settings.html')) return;

  // --- 1. CREATE PIKACHU OVERLAY ---
  var style=document.createElement('style');
  style.textContent=`
  #pikachu-offline{position:fixed;inset:0;background:#fff;z-index:999999;display:none;align-items:center;justify-content:center;flex-direction:column;font-family:sans-serif;text-align:center}
  #pikachu-offline video{width:300px;height:300px;object-fit:contain;border-radius:20px}
  #pikachu-offline h2{margin:10px 0 6px;color:#333}
  #pikachu-offline p{color:#777;font-size:14px;line-height:1.6}
  #pikachu-offline .badge{background:#ef4444;color:#fff;font-size:12px;font-weight:800;padding:6px 14px;border-radius:20px;margin-bottom:10px}
  #pikachu-shadow{width:120px;height:16px;background:rgba(0,0,0,.2);border-radius:50%;margin-top:-10px;animation:ps .4s ease-in-out infinite alternate}
  @keyframes ps{from{transform:scaleX(1)}to{transform:scaleX(.7)}}
  #pikachu-maint{position:fixed;inset:0;background:#fff;z-index:999998;display:none;align-items:center;justify-content:center;flex-direction:column;font-family:sans-serif;text-align:center;padding:20px}
  `;
  document.head.appendChild(style);

  var div=document.createElement('div');
  div.id='pikachu-offline';
  div.innerHTML=`
    <div class="badge">● NO INTERNET</div>
    <video autoplay loop muted playsinline preload="auto"><source src="pikachu.mp4" type="video/mp4"></video>
    <div id="pikachu-shadow"></div>
    <h2>Pikachu is waiting...</h2>
    <p>No Internet Connection<br>Page will come back automatically<br>when internet returns ⚡</p>
  `;
  document.documentElement.appendChild(div);

  var maintDiv=document.createElement('div');
  maintDiv.id='pikachu-maint';
  maintDiv.innerHTML=`<div style="font-size:50px">🔧</div><h1>Under Maintenance</h1><p id="maintMsg" style="white-space:pre-line;color:#777;line-height:1.6">We are updating the page.<br>Please come back in a while.</p>`;
  document.documentElement.appendChild(maintDiv);

  var offlineBox=document.getElementById('pikachu-offline');
  var video=offlineBox.querySelector('video');

  // --- 2. OFFLINE / ONLINE LOGIC - MAIN PART ---
  function checkInternet(){
    if(!navigator.onLine){
      // NO INTERNET -> Show Pikachu, Hide Maintenance
      maintDiv.style.display='none';
      offlineBox.style.display='flex';
      video.play().catch(()=>{});
    }else{
      // INTERNET BACK -> Hide Pikachu, Show Original Page Normally
      offlineBox.style.display='none';
      video.pause();
      checkMaintenance(); // check Settings maintenance only when online
    }
  }

  // --- 3. MAINTENANCE FROM SETTINGS (only when online) ---
  async function checkMaintenance(){
    try{
      var m=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
      var f=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
      const cfg={apiKey:"AIzaSyB8Eu2ScZyR62gfkGXKs1sMp3ZudLtGdFE",authDomain:"discharge-b9528.firebaseapp.com",projectId:"discharge-b9528",storageBucket:"discharge-b9528.firebasestorage.app",messagingSenderId:"1076050472607",appId:"1:1076050472607:web:736e0688a41462460efcaa"};
      const app=m.initializeApp(cfg,"maint_"+Math.random());
      const db=f.getFirestore(app);
      let snap=await f.getDoc(f.doc(db,'site_settings','global'));
      if(!snap.exists()) return;
      let d=snap.data();
      let page=location.pathname.split('/').pop()||'index.html';
      let pg=(d.pages||{})[page]||{};
      let msg=d.message||'We are updating the page.\nPlease come back in a while.';
      document.getElementById('maintMsg').innerText=msg;
      if(pg.hide||d.globalHide){
        document.body.innerHTML='<div style="background:#000;height:100vh"></div>';
        return;
      }
      if(pg.maintenance||d.globalMaintenance){
        maintDiv.style.display='flex';
      }else{
        maintDiv.style.display='none';
      }
    }catch(e){}
  }

  // Run on load + every change
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',checkInternet);
  }else checkInternet();

  window.addEventListener('online',checkInternet);
  window.addEventListener('offline',checkInternet);
  setInterval(checkInternet,2000);
})();
