// maintenance.js - Global + Per-Page Maintenance / Hide
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = { apiKey:"AIzaSyB8Eu2ScZyR62gfkGXKs1sMp3ZudLtGdFE", authDomain:"discharge-b9528.firebaseapp.com", projectId:"discharge-b9528", storageBucket:"discharge-b9528.firebasestorage.app", messagingSenderId:"1076050472607", appId:"1:1076050472607:web:736e0688a41462460efcaa" };
const app = initializeApp(cfg, "maint_" + Math.random());
const db = getFirestore(app);

const currentPage = (location.pathname.split('/').pop() || 'index.html').split('?')[0].toLowerCase();
if (currentPage === 'setting.html' || currentPage === 'settings.html') {
  // NEVER hide setting page itself, otherwise you can't un-hide
} else {

function showOverlay(type, msg) {
  let el = document.getElementById('shija-block-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'shija-block-overlay';
    el.style.cssText = 'position:fixed;inset:0;z-index:99999;background:' + (type === 'hide' ? '#000' : '#0f172a') + ';color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;';
    document.body.appendChild(el);
  }
  if (type === 'hide') {
    el.innerHTML = '';
  } else {
    el.innerHTML = '<div style="font-size:52px">🔧</div><h1 style="font-size:26px;font-weight:900;margin:14px 0 8px">Under Maintenance</h1><p style="color:#cbd5e1;font-size:14px;white-space:pre-line;max-width:420px">' + (msg || 'We are updating the page.\nPlease come back in a while.') + '</p>';
  }
  el.style.display = 'flex';
}
function hideOverlay() {
  let el = document.getElementById('shija-block-overlay');
  if (el) el.style.display = 'none';
}

// Hide cards on index.html
function applyCardHide(pages) {
  if (currentPage !== 'index.html') return;
  document.querySelectorAll('a.card[data-page]').forEach(card => {
    let p = card.getAttribute('data-page');
    let pg = pages && pages[p];
    card.style.display = (pg && pg.hide) ? 'none' : '';
  });
}

onSnapshot(doc(db, 'site_settings', 'global'), (snap) => {
  if (!snap.exists()) { hideOverlay(); applyCardHide({}); return; }
  let d = snap.data() || {};
  let pages = d.pages || {};
  let my = pages[currentPage] || {};

  // 1. GLOBAL HIDE / PER-PAGE HIDE = black blank
  if (d.globalHide || my.hide) { showOverlay('hide', ''); return; }

  // 2. GLOBAL MAINTENANCE / PER-PAGE MAINTENANCE
  if (d.globalMaintenance || my.maintenance) { showOverlay('maintenance', d.message); return; }

  hideOverlay();
  applyCardHide(pages);
});

// Old system/maintenance also support (for backward compat)
onSnapshot(doc(db, 'system', 'maintenance'), (snap) => {
  if (!snap.exists()) return;
  let d = snap.data() || {};
  if (d.enabled || d.on || d.maintenance) showOverlay('maintenance', d.message);
});
}
