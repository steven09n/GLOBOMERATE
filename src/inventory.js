import { getProducts, addProduct, updateProduct, deleteProduct } from './data.js';

export function initInventory() {
  const tableBody = document.getElementById('inventory-table-body');
  const btnAdd = document.getElementById('btn-add-product');
  const modal = document.getElementById('modal-product');
  const modalTitle = document.querySelector('#modal-product .modal-header h3');
  const form = document.getElementById('form-product');
  let editingProductId = null;
  
  if (!tableBody) return;

  // Render Table
  function renderTable() {
    const products = getProducts();
    if (products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay productos registrados</td></tr>`;
      return;
    }
    
    tableBody.innerHTML = products.map(p => `
      <tr>
        <td style="font-size: 1.5rem;">${p.emoji}</td>
        <td>${p.name}</td>
        <td><span class="badge category-badge">${p.category}</span></td>
        <td class="price-cell">C$ ${p.price.toFixed(2)}</td>
        <td>
          <button class="btn-icon edit-product-btn" data-id="${p.id}" title="Editar">✏️</button>
          <button class="btn-icon delete-product-btn" data-id="${p.id}" title="Eliminar">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  // Initial render
  document.addEventListener('DOMContentLoaded', () => {
    // Wait until they visit the tab, but for now we render immediately
    renderTable();
  });
  
  // Re-render when nav is clicked to keep data fresh
  document.getElementById('main-nav')?.addEventListener('click', () => {
    renderTable();
  });

  // Edit and Delete Actions
  tableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-product-btn');
    const delBtn = e.target.closest('.delete-product-btn');
    
    if (delBtn) {
      if (confirm('¿Seguro que deseas eliminar este producto?')) {
        deleteProduct(delBtn.dataset.id);
        renderTable();
      }
    } else if (editBtn) {
      const pId = editBtn.dataset.id;
      const product = getProducts().find(p => p.id === pId);
      if (product) {
        editingProductId = pId;
        modalTitle.textContent = 'Editar Producto';
        
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-emoji').value = product.emoji || '';
        
        modal.classList.remove('hidden');
      }
    }
  });

  // Modal logic
  btnAdd.addEventListener('click', () => {
    editingProductId = null;
    modalTitle.textContent = 'Nuevo Producto';
    form.reset();
    modal.classList.remove('hidden');
  });

  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') || e.target.closest('.close-modal')) {
      modal.classList.add('hidden');
    }
  });

  // Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const productData = {
      name: document.getElementById('product-name').value,
      price: parseFloat(document.getElementById('product-price').value),
      category: document.getElementById('product-category').value,
      emoji: document.getElementById('product-emoji').value
    };
    
    if (editingProductId) {
      updateProduct(editingProductId, productData);
    } else {
      addProduct(productData);
    }
    
    form.reset();
    modal.classList.add('hidden');
    renderTable();
    // Dispatch custom event to notify POS that products changed
    document.dispatchEvent(new Event('productsChanged'));
  });
}
