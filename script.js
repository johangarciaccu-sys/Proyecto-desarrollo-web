/* ==========================================================================
   1. PRODUCTOS EN PESOS COLOMBIANOS (COP) CON IMÁGENES REALES
   ========================================================================== */
   const products = [
    {
      id: 1,
      title: "PC Gaming Pro Ultra",
      category: "computadores",
      price: 5990000,
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
      description: "Torre custom gaming con cristal templado, refrigeración líquida e iluminación RGB. Procesador Intel i7, 32GB RAM y RTX 4070."
    },
    {
      id: 2,
      title: "Teclado Mecánico RGB",
      category: "perifericos",
      price: 360000,
      image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80",
      description: "Teclado mecánico con interruptores táctiles, iluminación RGB tecla por tecla y chasis reforzado de aluminio."
    },
    {
      id: 3,
      title: "Monitor Gaming 27\" 165Hz",
      category: "monitores",
      price: 1120000,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      description: "Setup con pantalla curva IPS de alta tasa de refresco (165Hz), 1ms de respuesta y soporte ergonómico ajustable."
    },
    {
      id: 4,
      title: "Mouse Inalámbrico Precision",
      category: "perifericos",
      price: 200000,
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
      description: "Mouse gamer inalámbrico de ultra baja latencia sobre mousepad profesional. Sensor óptico de 26,000 DPI."
    },
    {
      id: 5,
      title: "Laptop UltraBook 14\"",
      category: "computadores",
      price: 3990000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      description: "Portátil de diseño ultra delgado sobre escritorio de trabajo. Procesador de última generación, 16GB RAM y pantalla Retina/OLED."
    },
    {
      id: 6,
      title: "Audífonos Gamer 7.1 Surround",
      category: "perifericos",
      price: 280000,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      description: "Diadema gamer profesional con micrófono de cancelación de ruido, sonido envolvente 7.1 y soporte de escritorio."
    }
  ];
  
  // Cargar carrito desde localStorage
  let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];
  
  /* ==========================================================================
     2. FORMATO MONEDA COLOMBIANA (COP)
     ========================================================================== */
  function formatCOP(amount) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }
  
  /* ==========================================================================
     3. ELEMENTOS DEL DOM
     ========================================================================== */
  const catalogContainer = document.getElementById('catalog-container');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const sortFilter = document.getElementById('sort-filter');
  const cartCount = document.getElementById('cart-count');
  
  // Modales
  const cartModal = document.getElementById('cart-modal');
  const detailsModal = document.getElementById('details-modal');
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const closeDetailsBtn = document.getElementById('close-details-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const modalDetailsBody = document.getElementById('modal-details-body');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  /* ==========================================================================
     4. RENDERIZADO DEL CATÁLOGO
     ========================================================================== */
  function renderCatalog() {
    const query = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;
  
    // Filtrar
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(query) || 
                            product.description.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  
    // Ordenar
    if (selectedSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'name-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
  
    // Dibujar tarjetas
    catalogContainer.innerHTML = '';
  
    if (filtered.length === 0) {
      catalogContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">No se encontraron productos que coincidan con la búsqueda.</p>`;
      return;
    }
  
    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">${product.title}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-footer">
            <span class="product-price">${formatCOP(product.price)}</span>
            <div class="btn-group">
              <button class="btn-icon btn-details" data-id="${product.id}" title="Ver detalles">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn-add" data-id="${product.id}">
                <i class="fa-solid fa-cart-plus"></i> Agregar
              </button>
            </div>
          </div>
        </div>
      `;
      catalogContainer.appendChild(card);
    });
  }
  
  /* ==========================================================================
     5. DELEGACIÓN DE EVENTOS PARA BOTONES DEL CATÁLOGO
     ========================================================================== */
  catalogContainer.addEventListener('click', (e) => {
    const btnAdd = e.target.closest('.btn-add');
    const btnDetails = e.target.closest('.btn-details');
  
    if (btnAdd) {
      const productId = parseInt(btnAdd.dataset.id);
      addToCart(productId);
    }
  
    if (btnDetails) {
      const productId = parseInt(btnDetails.dataset.id);
      openDetailsModal(productId);
    }
  });
  
  /* ==========================================================================
     6. MANEJO DEL CARRITO (LOCALSTORAGE)
     ========================================================================== */
  function saveCart() {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
    updateCartBadge();
  }
  
  function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
  
  function addToCart(productId) {
    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      const product = products.find(p => p.id === productId);
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
  }
  
  function changeQuantity(productId, delta) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
    }
    saveCart();
    renderCartModal();
  }
  
  function renderCartModal() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
  
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1rem;">El carrito está vacío.</p>`;
      cartTotalPrice.textContent = formatCOP(0);
      return;
    }
  
    cart.forEach(item => {
      total += item.price * item.quantity;
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${formatCOP(item.price)} c/u</div>
        </div>
        <div class="qty-controls">
          <button class="btn-qty" data-id="${item.id}" data-action="minus">-</button>
          <span>${item.quantity}</span>
          <button class="btn-qty" data-id="${item.id}" data-action="plus">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  
    cartTotalPrice.textContent = formatCOP(total);
  }
  
  // Eventos dentro del carrito
  cartItemsContainer.addEventListener('click', (e) => {
    const btnQty = e.target.closest('.btn-qty');
    if (btnQty) {
      const productId = parseInt(btnQty.dataset.id);
      const action = btnQty.dataset.action;
      changeQuantity(productId, action === 'plus' ? 1 : -1);
    }
  });
  
  /* ==========================================================================
     7. MODAL DE DETALLES
     ========================================================================== */
  function openDetailsModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
  
    modalDetailsBody.innerHTML = `
      <img src="${product.image}" alt="${product.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 12px; margin-bottom: 1rem;">
      <span class="product-category">${product.category}</span>
      <h2 style="margin: 0.5rem 0;">${product.title}</h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${product.description}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <span style="font-size: 1.4rem; font-weight: 800;">${formatCOP(product.price)}</span>
        <button class="btn-add" id="modal-add-btn" data-id="${product.id}">
          <i class="fa-solid fa-cart-plus"></i> Agregar al Carrito
        </button>
      </div>
    `;
  
    // Evento para botón del modal
    document.getElementById('modal-add-btn').addEventListener('click', () => {
      addToCart(product.id);
      detailsModal.classList.remove('active');
    });
  
    detailsModal.classList.add('active');
  }
  
  /* ==========================================================================
     8. LISTENERS DE FILTROS Y MODALES
     ========================================================================== */
  searchInput.addEventListener('input', renderCatalog);
  categoryFilter.addEventListener('change', renderCatalog);
  sortFilter.addEventListener('change', renderCatalog);
  
  openCartBtn.addEventListener('click', () => {
    renderCartModal();
    cartModal.classList.add('active');
  });
  
  closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));
  closeDetailsBtn.addEventListener('click', () => detailsModal.classList.remove('active'));
  
  // Cerrar modales al hacer clic fuera del contenido
  window.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.remove('active');
    if (e.target === detailsModal) detailsModal.classList.remove('active');
  });
  
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    alert('¡Simulación de compra realizada con éxito! No se realizó ningún cargo real.');
    cart = [];
    saveCart();
    cartModal.classList.remove('active');
  });
  
  // Inicializar catálogo al cargar
  renderCatalog();
  updateCartBadge();
