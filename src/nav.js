export function initNav() {
  const navMenu = document.getElementById('main-nav');
  const views = [
    document.getElementById('dashboard-view'),
    document.getElementById('inventory-view'),
    document.getElementById('users-view')
  ];
  const cartSidebar = document.getElementById('cart-sidebar');

  if (!navMenu) return;

  navMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item');
    if (!btn) return;

    // Update active button
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Switch view
    const targetViewId = btn.dataset.view;
    views.forEach(v => {
      if (v) {
        if (v.id === targetViewId) {
          v.classList.remove('hidden');
        } else {
          v.classList.add('hidden');
        }
      }
    });

    // Hide cart sidebar if not in POS dashboard
    if (cartSidebar) {
      if (targetViewId === 'dashboard-view') {
        cartSidebar.style.display = 'flex';
      } else {
        cartSidebar.style.display = 'none';
      }
    }
  });
}
