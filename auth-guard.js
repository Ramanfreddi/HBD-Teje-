import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
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
  const style = document.createElement('style');
  style.textContent = `.auth-account{position:fixed;top:18px;right:18px;z-index:10000;display:flex;align-items:center;gap:10px;max-width:min(86vw,360px);padding:8px 9px 8px 14px;border:1px solid rgba(255,255,255,.8);border-radius:999px;color:#6f4b72;background:rgba(255,255,255,.82);box-shadow:0 6px 20px rgba(112,63,125,.16);font:700 .78rem system-ui,sans-serif}.auth-account span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.auth-account button{border:0;border-radius:999px;padding:7px 11px;cursor:pointer;color:#fff;background:linear-gradient(100deg,#f56da9,#9874db);font:inherit}`;
  document.head.append(style);
  const account = document.createElement('div');
  account.className = 'auth-account';
  const name = document.createElement('span');
  const label = user.displayName || user.email || 'Signed in';
  name.textContent = label;
  name.title = `Signed in as ${user.email || 'Google user'}`;
  const logout = document.createElement('button');
  logout.type = 'button';
  logout.textContent = 'Log out';
  logout.addEventListener('click', async () => {
    await signOut(auth);
  });
  account.append(name, logout);
  document.body.append(account);
});
