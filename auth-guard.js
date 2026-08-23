import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';
import { auth, db } from './firebase-config.js';

const loginUrl = new URL('login.html', window.location.href);
const returnTo = `${window.location.pathname.split('/').pop() || 'index.html'}${window.location.search}`;
const INACTIVITY_MS = 15 * 60 * 1000;
let inactivityTimer;
let activityListenersAttached = false;

function redirectToLogin() {
  loginUrl.searchParams.set('next', returnTo);
  window.location.replace(loginUrl.href);
}

async function endInactiveSession() {
  clearTimeout(inactivityTimer);
  sessionStorage.removeItem('hbd-last-active-at');
  await signOut(auth);
}

function checkForInactivity() {
  const lastActiveAt = Number(sessionStorage.getItem('hbd-last-active-at')) || Date.now();
  if (Date.now() - lastActiveAt >= INACTIVITY_MS) {
    endInactiveSession();
  }
}

function resetInactivityTimer() {
  sessionStorage.setItem('hbd-last-active-at', String(Date.now()));
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(endInactiveSession, INACTIVITY_MS);
}

function enableInactivityLogout() {
  if (activityListenersAttached) return;
  activityListenersAttached = true;
  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((eventName) => {
    window.addEventListener(eventName, resetInactivityTimer, { passive: true });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForInactivity();
  });
  resetInactivityTimer();
}

function showApprovalScreen(title, message, icon = '') {
  document.body.innerHTML = `<style>.approval-screen{min-height:100vh;display:grid;place-items:center;padding:24px;text-align:center;color:#654465;font-family:system-ui,sans-serif;background:linear-gradient(135deg,#ffe3f0,#e8e3ff)}.approval-screen section{max-width:460px;padding:38px 30px;border-radius:28px;background:#ffffffd9;box-shadow:0 20px 60px #734a7329}.approval-screen div{font-size:3rem}.approval-screen h1{margin:12px 0;color:#d94b98}.approval-screen p{line-height:1.55}.approval-screen button{border:0;border-radius:12px;padding:11px 18px;color:#fff;cursor:pointer;font-weight:700;background:linear-gradient(100deg,#ff5fa8,#9472df)}</style><main class="approval-screen"><section><div aria-hidden="true">${icon}</div><h1>${title}</h1><p>${message}</p><button type="button" id="approval-signout">Sign out</button></section></main>`;
  document.getElementById('approval-signout').addEventListener('click', () => signOut(auth));
  document.body.classList.remove('auth-pending');
}

function showWaitingForApproval() {
  showApprovalScreen('Almost there!', 'Your account is waiting for approval. Please check back once the admin has granted access.', '💌');
}

function showAccessProblem() {
  showApprovalScreen('Account setup needed', 'We could not find your access profile. Please contact the site admin.');
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    redirectToLogin();
    return;
  }

  try {
    const profile = await getDoc(doc(db, 'users', user.uid));
    if (!profile.exists()) {
      showAccessProblem();
      return;
    }

    const data = profile.data();
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (data.role === 'admin') {
      if (page === 'admin.html') {
        document.body.classList.remove('auth-pending');
        enableInactivityLogout();
        return;
      }
    } else if (page === 'admin.html') {
      window.location.replace('index.html');
      return;
    } else if (data.isApproved !== true) {
      showWaitingForApproval();
      return;
    }
  } catch (error) {
    console.error('Unable to check account approval:', error);
    showAccessProblem();
    return;
  }

  document.body.classList.remove('auth-pending');
  enableInactivityLogout();
});
