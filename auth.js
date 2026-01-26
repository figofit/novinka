const AUTH_STORAGE_KEY = 'itfit_users_v1';
const AUTH_CURRENT_KEY = 'itfit_current_user_v1';

function loadUsers() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

function ensureDefaultAdmin() {
  const users = loadUsers();
  if (users.length > 0) return;
  users.push({
    id: 'admin',
    name: 'Admin',
    email: 'admin@itfit.local',
    password: 'admin123',
    role: 'admin'
  });
  saveUsers(users);
}

function getCurrentUser() {
  const raw = localStorage.getItem(AUTH_CURRENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(AUTH_CURRENT_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(AUTH_CURRENT_KEY);
}

function renderAuthBar() {
  const bar = document.getElementById('auth-bar');
  if (!bar) return;
  const user = getCurrentUser();
  const inner = document.createElement('div');
  inner.className = 'auth-inner';
  if (!user) {
    inner.innerHTML = `
      <div>vault.auth()</div>
      <div class="auth-actions">
        <a href="login.html">Přihlásit se</a>
      </div>
    `;
  } else {
    const adminLink = user.role === 'admin'
      ? '<a href="admin.html">Admin</a>'
      : '';
    inner.innerHTML = `
      <div>Ahoj, <strong>${user.name}</strong></div>
      <div class="auth-actions">
        ${adminLink}
        <a href="profile.html">Profil</a>
        <button type="button" id="logoutBtn">Odhlásit</button>
      </div>
    `;
  }
  bar.innerHTML = '';
  bar.appendChild(inner);
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearCurrentUser();
      window.location.href = 'index.html';
    });
  }
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

function requireAdmin() {
  const user = requireAuth();
  if (!user) return null;
  if (user.role !== 'admin') {
    window.location.href = 'profile.html';
    return null;
  }
  return user;
}

ensureDefaultAdmin();
window.Auth = {
  loadUsers,
  saveUsers,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  renderAuthBar,
  requireAuth,
  requireAdmin
};

document.addEventListener('DOMContentLoaded', () => {
  renderAuthBar();
});
