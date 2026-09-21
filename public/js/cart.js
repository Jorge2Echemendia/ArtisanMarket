
(function () {
  const STORAGE_KEY = 'artisan_cart';
  const SHIPPING_COST = 8;
  const FREE_SHIPPING_FROM = 100;

  const els = {
    loading:   document.getElementById('cart-loading'),
    empty:     document.getElementById('cart-empty'),
    content:   document.getElementById('cart-content'),
    success:   document.getElementById('cart-success'),
    items:     document.getElementById('cart-items'),
    subtotal:  document.getElementById('sum-subtotal'),
    shipping:  document.getElementById('sum-shipping'),
    total:     document.getElementById('sum-total'),
    checkout:  document.getElementById('checkout-btn'),
    clear:     document.getElementById('clear-cart-btn'),
    orderId:   document.getElementById('order-id'),
  };

  const getCart = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  };
  const setCart = (cart) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    document.getElementById('cart-count') &&
      (document.getElementById('cart-count').textContent = cart.reduce((s, i) => s + i.qty, 0));
  };

  let productsCache = [];

  const fmt = (n) => '$' + n.toFixed(2);

  async function init() {
    try {
      const res = await fetch('/api/products');
      productsCache = await res.json();
    } catch (err) {
      els.loading.innerHTML = '<p>No se pudo cargar el carrito.</p>';
      return;
    }
    render();
  }

  function render() {
    const cart = getCart();

    if (cart.length === 0) {
      els.loading.style.display = 'none';
      els.empty.style.display = 'block';
      els.content.style.display = 'none';
      els.success.style.display = 'none';
      return;
    }

    const items = cart
      .map((entry) => {
        const product = productsCache.find((p) => p.id === entry.id);
        if (!product) return null;
        return { ...entry, product };
      })
      .filter(Boolean);

    els.loading.style.display = 'none';
    els.empty.style.display = 'none';
    els.content.style.display = 'block';

    // Render de items
    els.items.innerHTML = items
      .map(
        (item) => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <img src="${item.product.imagen}" alt="${item.product.nombre}" />
        </div>
        <div class="cart-item-info">
          <h4>${item.product.nombre}</h4>
          <span class="artisan">${item.product.artesano}</span>
          <span class="unit-price">${fmt(item.product.precio)} c/u</span>
        </div>
        <div class="qty-control">
          <button type="button" data-action="dec" aria-label="Disminuir">−</button>
          <input type="number" value="${item.qty}" min="1" max="99" readonly />
          <button type="button" data-action="inc" aria-label="Aumentar">+</button>
        </div>
        <span class="cart-item-subtotal">${fmt(item.product.precio * item.qty)}</span>
        <button class="cart-item-remove" data-action="remove" title="Eliminar">✕</button>
      </div>
    `
      )
      .join('');

    // Totales
    const subtotal = items.reduce((s, i) => s + i.product.precio * i.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    els.subtotal.textContent = fmt(subtotal);
    els.shipping.textContent = shipping === 0 ? 'Gratis 🎉' : fmt(shipping);
    els.total.textContent = fmt(total);
  }

  /* ---------- Eventos de la lista ---------- */
  els.items?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const itemEl = btn.closest('.cart-item');
    const id = Number(itemEl.dataset.id);
    const cart = getCart();
    const entry = cart.find((i) => i.id === id);
    if (!entry) return;

    const action = btn.dataset.action;

    if (action === 'inc') entry.qty += 1;
    else if (action === 'dec') entry.qty = Math.max(1, entry.qty - 1);
    else if (action === 'remove') {
      const filtered = cart.filter((i) => i.id !== id);
      setCart(filtered);
      render();
      window.showToast?.('Producto eliminado', 'Puedes volver a añadirlo desde la tienda', 'info');
      return;
    }

    setCart(cart);
    render();
  });

  /* ---------- Vaciar carrito ---------- */
  els.clear?.addEventListener('click', () => {
    if (!confirm('¿Vaciar todo el carrito?')) return;
    setCart([]);
    render();
    window.showToast?.('Carrito vaciado', '', 'info');
  });

  /* ---------- Finalizar compra (simulada) ---------- */
  els.checkout?.addEventListener('click', async () => {
    const cart = getCart();
    if (cart.length === 0) return;

    els.checkout.disabled = true;
    els.checkout.textContent = 'Procesando...';

    // Simulamos latencia de red
    await new Promise((r) => setTimeout(r, 1200));

    const orderId = 'AM-' + String(Math.floor(Math.random() * 9000) + 1000);
    els.orderId.textContent = '#' + orderId;

    setCart([]);
    els.content.style.display = 'none';
    els.empty.style.display = 'none';
    els.success.style.display = 'block';

    window.showToast?.('¡Compra confirmada!', 'Pedido ' + orderId + ' generado', 'success');
  });

  init();
})();