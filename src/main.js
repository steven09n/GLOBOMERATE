import './style.css';
import { initData } from './data.js';
import { initAuth } from './auth.js';
import { initNav } from './nav.js';
import { initPOS, renderProducts } from './pos.js';
import { initInventory } from './inventory.js';
import { initUsers } from './users.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize mock db
  initData();

  // 2. Setup Authentication
  initAuth();

  // 3. Setup Navigation
  initNav();

  // 4. Setup POS UI logic
  initPOS();

  // 5. Setup Inventory UI logic
  initInventory();

  // 6. Setup Users UI logic
  initUsers();

  // 7. Event listeners for cross-module updates
  document.addEventListener('productsChanged', () => {
    renderProducts();
  });
});
