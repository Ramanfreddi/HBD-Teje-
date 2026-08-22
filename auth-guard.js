import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';
import { auth, db } from './firebase-config.js';

const loginUrl = new URL('login.html', window.location.href);
const returnTo = `${window.location.pathname.split('/').pop() || 'index.html'}${window.location.search}`;

function redirectToLogin() {
  loginUrl.searchParams.set('next', returnTo);
  window.location.replace(loginUrl.href);
}

function redirectToPending() {
  window.location.replace(new URL('pending-approval.html', window.location.href));
}

const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    logoutButton.disabled = true;
    await signOut(auth);
  });
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    redirectToLogin();
    return;
  }

  try {
    const profile = await getDoc(doc(db, 'users', user.uid));
    if (!profile.exists()) {
      redirectToPending();
      return;
    }

    const profileData = profile.data();
    if (profileData.role === 'admin') {
      window.location.replace(new URL('admin.html', window.location.href));
      return;
    }

    if (profileData.approved !== true) {
      redirectToPending();
      return;
    }

    document.body.classList.remove('auth-pending');
  } catch (error) {
    console.error('Unable to verify account approval.', error);
    document.body.classList.remove('auth-pending');
    document.body.innerHTML = '<main style="max-width:560px;margin:12vh auto;padding:28px;font:600 16px system-ui;text-align:center;color:#654465"><h1>Unable to check account access</h1><p>Firestore could not read your user profile. Deploy the Firestore rules and make sure /users/{uid} exists for this account.</p><button id="retryAccess" type="button">Try again</button><button id="signOutAccess" type="button">Sign out</button></main>';
    document.getElementById('retryAccess').onclick = () => window.location.reload();
    document.getElementById('signOutAccess').onclick = () => signOut(auth);
  }
});
