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

function redirectToPending() {
  window.location.replace(new URL('pending-approval.html', window.location.href));
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

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    redirectToLogin();
    return;
  }

  try {
    const profile = await getDoc(doc(db, 'users', user.uid));
    if (!profile.exists() || profile.data().approved !== true) {
      redirectToPending();
      return;
    }

    document.body.classList.remove('auth-pending');
    enableInactivityLogout();
  } catch (error) {
    console.error('Unable to verify account approval.', error);
    await signOut(auth);
    redirectToLogin();
  }
});
