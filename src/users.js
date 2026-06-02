import { getUsers, addUser, deleteUser } from './data.js';

export function initUsers() {
  const tableBody = document.getElementById('users-table-body');
  const btnAdd = document.getElementById('btn-add-user');
  const modal = document.getElementById('modal-user');
  const form = document.getElementById('form-user');
  
  if (!tableBody) return;

  function renderTable() {
    const users = getUsers();
    tableBody.innerHTML = users.map(u => `
      <tr>
        <td>${u.name}</td>
        <td><strong>${u.username}</strong></td>
        <td><span class="badge role-badge">${u.role}</span></td>
        <td>
          ${u.username !== 'admin' ? 
            `<button class="btn-icon delete-user-btn" data-id="${u.id}" title="Eliminar">🗑️</button>` 
            : '<span style="color: var(--text-muted); font-size: 0.8rem;">Admin maestro</span>'}
        </td>
      </tr>
    `).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTable();
  });
  
  document.getElementById('main-nav')?.addEventListener('click', () => {
    renderTable();
  });

  tableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-user-btn');
    if (btn) {
      if (confirm('¿Seguro que deseas eliminar este usuario?')) {
        deleteUser(btn.dataset.id);
        renderTable();
      }
    }
  });

  btnAdd.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') || e.target.closest('.close-modal')) {
      modal.classList.add('hidden');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newUser = {
      name: document.getElementById('user-name').value,
      username: document.getElementById('user-username').value,
      password: document.getElementById('user-password').value,
      role: document.getElementById('user-role').value
    };
    
    // Validar usuario repetido
    const users = getUsers();
    if (users.find(u => u.username === newUser.username)) {
      alert('Ese nombre de usuario ya existe');
      return;
    }

    addUser(newUser);
    form.reset();
    modal.classList.add('hidden');
    renderTable();
  });
}
