import { getUsers } from './data.js';

export function initAuth() {
  const loginScreen = document.getElementById('login-screen');
  const posScreen = document.getElementById('pos-screen');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');

  // Check if already logged in
  if (sessionStorage.getItem('pos_logged_in_user')) {
    updateProfileUI();
    showPOS();
  } else {
    showLogin();
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userField = document.getElementById('username').value;
      const passField = document.getElementById('password').value;
      
      const users = getUsers();
      const user = users.find(u => u.username === userField && u.password === passField);

      if (user) {
        sessionStorage.setItem('pos_logged_in_user', JSON.stringify({ name: user.name, role: user.role }));
        updateProfileUI();
        showPOS();
      } else {
        alert('Credenciales incorrectas');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('pos_logged_in_user');
      showLogin();
    });
  }

  function updateProfileUI() {
    const userData = JSON.parse(sessionStorage.getItem('pos_logged_in_user'));
    if (!userData) return;
    
    document.querySelector('.user-name').textContent = userData.name;
    document.querySelector('.user-role').textContent = userData.role;
    document.querySelector('.avatar').textContent = userData.name.charAt(0).toUpperCase();
  }

  function showPOS() {
    loginScreen.classList.add('hidden');
    posScreen.classList.remove('hidden');
  }

  function showLogin() {
    posScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    if (loginForm) loginForm.reset();
  }
}
