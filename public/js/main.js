// public/js/main.js
(function () {
  const STORAGE_KEY = 'artisan_cart';
  const cartCountEl = document.getElementById('cart-count');

  const getCart = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  };
  const setCart = (cart) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCount();
    document.dispatchEvent(new CustomEvent('cart:changed'));
  };
  const updateCount = () => {
    const total = getCart().reduce((sum, i) => sum + i.qty, 0);
    if (cartCountEl) cartCountEl.textContent = total;
  };


  function showToast(title, message = '', type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: '✓', error: '!', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '✓'}</span>
      <div class="toast-body">
        <strong>${title}</strong>
        ${message ? `<p>${message}</p>` : ''}
      </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }


  window.showToast = showToast;


  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    if (!id) return;

    const cart = getCart();
    const existing = cart.find((i) => i.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, qty: 1 });
    setCart(cart);

    // Feedback visual en el botón
    const originalText = btn.textContent;
    btn.textContent = '✓ Añadido';
    btn.style.background = 'var(--terracotta)';
    btn.style.color = 'white';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 1200);

    showToast('Añadido al carrito', 'Revisa tu carrito cuando quieras', 'success');
  });

  document.querySelectorAll('[data-delay]').forEach((el) => {
    const ms = Number(el.dataset.delay) || 0;
    el.style.animationDelay = ms + 'ms';
  });


  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const openBtn = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('drawer-close');

  const openDrawer = () => {
    if (!drawer) return;
    drawer.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    if (!drawer) return;
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
  drawer?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));

  updateCount();
})();