import { getCategories, getProducts, saveSale } from './data.js';

let cart = [];
let currentCategory = 'all';
let searchQuery = '';

export function initPOS() {
  renderCategories();
  renderProducts();
  setupEventListeners();
  updateCartUI();
}

function setupEventListeners() {
  // Category filter
  document.getElementById('categories-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.id;
      renderProducts();
    }
  });

  // Search
  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderProducts();
  });

  // Add to cart click delegates
  document.getElementById('products-container').addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) {
      const productId = card.dataset.id;
      addToCart(productId);
    }
  });

  // Cart actions delegate
  document.getElementById('cart-container').addEventListener('click', (e) => {
    const qtyBtn = e.target.closest('.qty-btn');
    if (qtyBtn) {
      const productId = qtyBtn.dataset.id;
      const action = qtyBtn.dataset.action;
      updateCartItemQuantity(productId, action === 'inc' ? 1 : -1);
    }
  });

  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    cart = [];
    updateCartUI();
  });

  document.getElementById('checkout-btn').addEventListener('click', processCheckout);
}

function renderCategories() {
  const container = document.getElementById('categories-container');
  const categories = getCategories();
  container.innerHTML = categories.map(cat => `
    <button class="category-btn ${cat.id === currentCategory ? 'active' : ''}" data-id="${cat.id}">
      ${cat.name}
    </button>
  `).join('');
}

export function renderProducts() {
  const container = document.getElementById('products-container');
  let products = getProducts();
  
  if (currentCategory !== 'all') {
    products = products.filter(p => p.category === currentCategory);
  }
  if (searchQuery) {
    products = products.filter(p => p.name.toLowerCase().includes(searchQuery));
  }

  if (products.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No se encontraron productos.</div>`;
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image-placeholder">${p.emoji || '📦'}</div>
      <div class="product-info">
        <h4>${p.name}</h4>
        <div class="price">C$ ${p.price.toFixed(2)}</div>
      </div>
    </div>
  `).join('');
}

function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
}

function updateCartItemQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
  }
}

function updateCartUI() {
  const container = document.getElementById('cart-container');
  const subtotalEl = document.getElementById('subtotal-amount');
  const taxEl = document.getElementById('tax-amount');
  const totalEl = document.getElementById('total-amount');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart-message">El carrito está vacío</div>`;
    subtotalEl.textContent = 'C$ 0.00';
    taxEl.textContent = 'C$ 0.00';
    totalEl.textContent = 'C$ 0.00';
    checkoutBtn.disabled = true;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="item-details">
        <h5>${item.name}</h5>
        <div class="price">C$ ${item.price.toFixed(2)}</div>
      </div>
      <div class="item-actions">
        <button class="qty-btn" data-id="${item.id}" data-action="dec">-</button>
        <div class="qty-display">${item.quantity}</div>
        <button class="qty-btn" data-id="${item.id}" data-action="inc">+</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15; // 15% tax
  const total = subtotal + tax;

  subtotalEl.textContent = `C$ ${subtotal.toFixed(2)}`;
  taxEl.textContent = `C$ ${tax.toFixed(2)}`;
  totalEl.textContent = `C$ ${total.toFixed(2)}`;
  checkoutBtn.disabled = false;
}

function processCheckout() {
  if (cart.length === 0) return;
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  saveSale({ items: cart, subtotal, tax, total });
  cart = [];
  updateCartUI();
  
  // Custom alert mimicking a premium vibe
  alert('¡Pago procesado con éxito! ✅');
}
