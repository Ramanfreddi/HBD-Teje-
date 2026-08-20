import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAvaRLGWXB_-IeFDzhqmlHhUGMimPYDfi4',
  authDomain: 'hbd-teje.firebaseapp.com',
  projectId: 'hbd-teje',
  storageBucket: 'hbd-teje.firebasestorage.app',
  messagingSenderId: '444538732169',
  appId: '1:444538732169:web:119673d7e6a3974d24d058',
  measurementId: 'G-P8JM3MGGMN'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
