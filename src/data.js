// Seed data for the generic POS system
const INITIAL_CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'tech', name: 'Tecnología' },
  { id: 'clothing', name: 'Ropa' },
  { id: 'food', name: 'Alimentos' },
  { id: 'services', name: 'Servicios' }
];

const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Auriculares Inalámbricos', price: 89.99, category: 'tech', emoji: '🎧' },
  { id: 'p2', name: 'Teclado Mecánico', price: 120.00, category: 'tech', emoji: '⌨️' },
  { id: 'p3', name: 'Camiseta de Algodón', price: 25.50, category: 'clothing', emoji: '👕' },
  { id: 'p4', name: 'Pantalón Vaquero', price: 45.00, category: 'clothing', emoji: '👖' },
  { id: 'p5', name: 'Café Espresso', price: 3.50, category: 'food', emoji: '☕' },
];

const INITIAL_USERS = [
  { id: 'u1', username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' }
];

export function initData() {
  if (!localStorage.getItem('pos_categories')) localStorage.setItem('pos_categories', JSON.stringify(INITIAL_CATEGORIES));
  if (!localStorage.getItem('pos_products')) localStorage.setItem('pos_products', JSON.stringify(INITIAL_PRODUCTS));
  if (!localStorage.getItem('pos_users')) localStorage.setItem('pos_users', JSON.stringify(INITIAL_USERS));
  if (!localStorage.getItem('pos_sales')) localStorage.setItem('pos_sales', JSON.stringify([]));
}

// ----- Users -----
export function getUsers() {
  return JSON.parse(localStorage.getItem('pos_users') || '[]');
}
export function addUser(user) {
  const users = getUsers();
  users.push({ ...user, id: 'U-' + Date.now() });
  localStorage.setItem('pos_users', JSON.stringify(users));
}
export function deleteUser(id) {
  const users = getUsers();
  localStorage.setItem('pos_users', JSON.stringify(users.filter(u => u.id !== id)));
}

// ----- Products -----
export function getCategories() {
  return JSON.parse(localStorage.getItem('pos_categories') || '[]');
}
export function getProducts() {
  return JSON.parse(localStorage.getItem('pos_products') || '[]');
}
export function addProduct(product) {
  const products = getProducts();
  products.push({ ...product, id: 'P-' + Date.now() });
  localStorage.setItem('pos_products', JSON.stringify(products));
}
export function updateProduct(id, updatedData) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    localStorage.setItem('pos_products', JSON.stringify(products));
  }
}
export function deleteProduct(id) {
  const products = getProducts();
  localStorage.setItem('pos_products', JSON.stringify(products.filter(p => p.id !== id)));
}

// ----- Sales -----
export function saveSale(saleData) {
  const sales = JSON.parse(localStorage.getItem('pos_sales') || '[]');
  sales.push({ ...saleData, id: 'SALE-' + Date.now(), date: new Date().toISOString() });
  localStorage.setItem('pos_sales', JSON.stringify(sales));
}
