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
    await signOut(auth);
    redirectToLogin();
  }
});
