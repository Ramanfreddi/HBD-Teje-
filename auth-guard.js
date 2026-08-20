import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import { auth } from './firebase-config.js';

const loginUrl = new URL('login.html', window.location.href);
const returnTo = `${window.location.pathname.split('/').pop() || 'index.html'}${window.location.search}`;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    loginUrl.searchParams.set('next', returnTo);
    window.location.replace(loginUrl.href);
    return;
  }

  document.body.classList.remove('auth-pending');
});
