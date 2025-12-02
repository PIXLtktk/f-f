/* ========================================
   ARCHIVO: script.js
   LÓGICA: Database Pro, Galería Interactiva, Checkout
   ========================================
*/

// 1. BASE DE DATOS PRO (Nombres e Imágenes Actualizados)
const productsDB = [
    {
        id: "ff-flux-elite",
        name: "Focus & Flow: Flux Elite", 
        category: "tech",
        lensType: "Fotocromático Inteligente",
        description: "LA JOYA DE LA CORONA. Lentes adaptativos que reaccionan a los rayos UV. Transparentes en interior, oscuros bajo el sol en segundos.",
        price: 3899,
        isNew: true,
        // Galería de imágenes para efecto hover
        image: "https://i.imgur.com/Jp1wZfW.jpeg", 
        hoverImage: "https://i.imgur.com/7bCLWoe.jpeg"
    },
    {
        id: "ff-obsidian",
        name: "Focus & Flow: Obsidian Core", 
        category: "solar",
        lensType: "Polarizado Black-Out",
        description: "El estándar de la industria. Acabado negro mate furtivo para grabación discreta y protección solar total.",
        price: 2499,
        isNew: false,
        image: "https://i.imgur.com/GKhTeY7.jpeg",
        hoverImage: "https://i.imgur.com/eM3T9Ru.jpeg"
    },
    {
        id: "ff-cobalt",
        name: "Focus & Flow: Cobalt Shield", 
        category: "optical",
        lensType: "Blue-Light Defense",
        description: "Escudo digital. Filtra el espectro de luz azul dañino. Claridad cristalina optimizada para oficina y gaming.",
        price: 2599,
        isNew: false,
        image: "https://i.imgur.com/1G6h1Pv.jpeg",
        hoverImage: "https://i.imgur.com/3RiHZ96.jpeg"
    },
    {
        id: "ff-inferno",
        name: "Focus & Flow: Inferno Mirror", 
        category: "style",
        lensType: "Reflective Coating",
        description: "Estética agresiva. Recubrimiento espejo rojizo de alta densidad. Privacidad absoluta para tu mirada.",
        price: 2699,
        isNew: false,
        image: "https://i.imgur.com/qEWO1Ez.jpeg",
        hoverImage: "https://i.imgur.com/mtZb5cY.jpeg"
    },
    {
        id: "ff-vision-zero",
        name: "Focus & Flow: Vision Zero", 
        category: "optical",
        lensType: "Concept Prototype",
        description: "PRÓXIMAMENTE. Marco ultraligero experimental con lentes de alta fidelidad. Únete a la lista de espera.",
        price: null, // Sin precio aún
        isNew: false,
        comingSoon: true,
        image: "https://i.imgur.com/sArAbQv.png", // Placeholder limpio
        hoverImage: "https://i.imgur.com/sArAbQv.png"
    }
];

const appState = {
    cart: JSON.parse(localStorage.getItem('ff_cart')) || [],
    whatsappNumber: "5215512345678" // ¡RECUERDA PONER TU NÚMERO AQUÍ!
};

const App = {
    init: () => {
        App.updateCartBadge();
        
        // Renderizar tienda si existe el contenedor
        if (document.getElementById('products-container')) {
            App.renderStore(productsDB);
        }

        // Listener Búsqueda Global
        const searchInput = document.getElementById('global-search');
        if(searchInput) {
            searchInput.addEventListener('input', (e) => App.searchProducts(e.target.value));
        }
    },

    // Renderizado Tarjetas con Lógica Hover y Próximamente
    renderStore: (products) => {
        const container = document.getElementById('products-container');
        if(!container) return;

        if(products.length === 0) {
            container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No encontramos gafas con ese nombre.</p>`;
            return;
        }

        container.innerHTML = products.map(product => {
            // Lógica para botón de compra vs Próximamente
            let buttonHTML;
            if (product.comingSoon) {
                buttonHTML = `
                    <button class="btn" style="padding: 8px 16px; font-size: 0.8rem; background: #333; color: #777; cursor: not-allowed;" disabled>
                        Próximamente
                    </button>`;
            } else {
                buttonHTML = `
                    <button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.8rem;" onclick="App.addToCart('${product.id}')">
                        + Añadir
                    </button>`;
            }

            // Lógica de precio
            const priceDisplay = product.price ? `$${product.price}` : '<span style="font-size:0.8rem; letter-spacing:1px;">ESPERA</span>';

            return `
            <div class="card product-card">
                ${product.isNew ? '<div style="position:absolute; top:15px; left:15px; background:var(--accent-neon); color:black; padding:4px 12px; border-radius:8px; font-weight:800; font-size:0.7rem; z-index:10; box-shadow: 0 0 10px var(--accent-neon);">NUEVO MODELO</div>' : ''}
                
                <div style="background:#0a0a0a; border-radius:20px; padding:20px; margin-bottom:15px; display:flex; justify-content:center; position:relative; overflow:hidden; aspect-ratio:1/1;">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-img-main"
                         style="width:100%; height:100%; object-fit:contain; transition: opacity 0.3s ease, transform 0.3s ease;" 
                         onmouseover="this.src='${product.hoverImage}'; this.style.transform='scale(1.05)';" 
                         onmouseout="this.src='${product.image}'; this.style.transform='scale(1)';"
                    >
                </div>
                
                <div>
                    <span style="font-size: 0.75rem; color: var(--accent-neon); text-transform: uppercase; letter-spacing: 1px;">${product.lensType}</span>
                    <h3 style="font-size: 1.1rem; margin: 5px 0 8px 0; color:white;">${product.name}</h3>
                    <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 20px; line-height: 1.4; min-height: 3.4em;">${product.description}</p>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                        <span class="text-neon" style="font-weight:700; font-size: 1.1rem;">${priceDisplay}</span>
                        ${buttonHTML}
                    </div>
                </div>
            </div>
            `;
        }).join('');
    },

    searchProducts: (query) => {
        const term = query.toLowerCase();
        const filtered = productsDB.filter(p => p.name.toLowerCase().includes(term) || p.lensType.toLowerCase().includes(term));
        App.renderStore(filtered);
    },

    addToCart: (id) => {
        const product = productsDB.find(p => p.id === id);
        appState.cart.push(product);
        localStorage.setItem('ff_cart', JSON.stringify(appState.cart));
        App.updateCartBadge();
        
        // Feedback visual simple
        const prevText = event.target.innerText;
        event.target.innerText = "¡Listo!";
        event.target.style.background = "var(--whatsapp-green)";
        event.target.style.color = "white";
        setTimeout(() => {
            event.target.innerText = prevText;
            event.target.style.background = "white"; // Regresa a primary
            event.target.style.color = "black";
        }, 1500);
    },

    updateCartBadge: () => {
        const badge = document.getElementById('cart-count');
        if(badge) badge.innerText = appState.cart.length;
    },

    checkoutWhatsApp: () => {
        if(appState.cart.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }
        let message = "🚀 *NUEVO PEDIDO WEB - Focus & Flow*\n\nHola! Me interesa adquirir:\n\n";
        let total = 0;
        appState.cart.forEach((item, i) => {
            message += `🔹 *${item.name}* \n   Lente: ${item.lensType}\n   Precio: $${item.price}\n\n`;
            total += item.price;
        });
        message += `💰 *TOTAL A PAGAR: $${total} MXN*\n`;
        message += `----------------------------------\n`;
        message += `📍 *DATOS DE ENVÍO:*\nPor favor cotízame el envío a mi Código Postal:\n[ESCRIBE TU CP AQUÍ]\n\n`;
        message += `📦 Preferencia: FedEx / Estafeta / UPS`;
        
        window.open(`https://wa.me/${appState.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    },

    toggleMenu: () => {
        const menu = document.getElementById('mobile-menu');
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    }
};

document.addEventListener('DOMContentLoaded', App.init);