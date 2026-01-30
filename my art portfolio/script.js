/* 
    --- DATA CONFIGURATION --- 
    Gallery and Shop are fully independent.
*/

const products = [
    {
        id: 1,
        title: "Guitar Piece",
        shopTitle: "Guitar Piece Print",
        year: "2026",
        price: "$20.00",
        type: "prints",          
        showInGallery: true,     
        image: "assets/guitar.jpg",
        description: "A high-resolution digital print of an acoustic guitar. 5117x6600 dimensions.",
        stripeLink: "https://stripe.com"
    },
    {
        id: 2,
        title: "Test Gallery 2",
        shopTitle: null,
        year: "2025",
        price: null,
        type: null,          
        showInGallery: true,
        image: "assets/testgallery2.png",
        description: "Test",
        stripeLink: null
    },
    {
        id: 3,
        title: "Test Hat",
        shopTitle: "Test Hat",
        year: "2025",
        price:  "999.99",             
        type: "apparel",              
        showInGallery: false,      
        image: "assets/testhat.png",
        description: "Test",
        stripeLink: null
    }
];

// --- ELEMENTS ---
const galleryContainer = document.getElementById('gallery-container');
const galleryView = document.getElementById('gallery-view');
const productView = document.getElementById('product-view');
const aboutView = document.getElementById('about-view');
const contactView = document.getElementById('contact-view');
const sidebar = document.getElementById('sidebar');
const shopSubmenu = document.getElementById('shop-submenu');

// --- STARTUP ---
window.onload = function () {
    renderMainGallery();
};

// --- FUNCTIONS ---

// 1. MAIN GALLERY (CURATED)
function renderMainGallery() {
    hideAllViews();
    galleryView.classList.remove('hidden');
    galleryContainer.innerHTML = '';

    const galleryItems = products.filter(item => item.showInGallery);

    if (galleryItems.length === 0) {
        galleryContainer.innerHTML =
            "<p style='text-align:center; padding:3rem;'>No gallery items yet.</p>";
        return;
    }

    const years = [...new Set(galleryItems.map(item => item.year))]
        .sort()
        .reverse();

    years.forEach(year => {
        const yearHeader = document.createElement('div');
        yearHeader.className = 'section-header';
        yearHeader.innerHTML = `<span>${year}</span>`;
        galleryContainer.appendChild(yearHeader);

        const grid = document.createElement('div');
        grid.className = 'grid-container';

        galleryItems
            .filter(item => item.year === year)
            .forEach(item => {
                const card = document.createElement('div');
                card.className = 'card gallery-card';
                card.innerHTML = `
                    <img src="${item.image}" class="card-img"
                         onclick="window.open('${item.image}', '_blank')">
                    <div class="card-info">
                        <div class="card-title">${item.title}</div>
                        <button class="btn btn-view-full"
                            onclick="window.open('${item.image}', '_blank')">
                            View Full Image
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            });

        galleryContainer.appendChild(grid);
    });
}

// 2. SHOP VIEW
function renderShop(category) {
    hideAllViews();
    galleryView.classList.remove('hidden');
    galleryContainer.innerHTML = '';

    const shopHeader = document.createElement('div');
    shopHeader.className = 'section-header';
    shopHeader.innerHTML = `<span>Shop: ${category.toUpperCase()}</span>`;
    galleryContainer.appendChild(shopHeader);

    const grid = document.createElement('div');
    grid.className = 'grid-container';

    const shopItems = products.filter(
        item => item.type === category
    );

    if (shopItems.length === 0) {
        galleryContainer.innerHTML +=
            "<p style='text-align:center; padding:2rem;'>No items found.</p>";
        return;
    }

    shopItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card shop-card';
        card.innerHTML = `
            <img src="${item.image}" class="card-img"
                 onclick="openProduct(${item.id})">
            <div class="card-info">
                <div class="card-title">${item.shopTitle || item.title}</div>
                <div class="card-price">${item.price}</div>
            </div>
        `;
        grid.appendChild(card);
    });

    galleryContainer.appendChild(grid);
}

// 3. PRODUCT DETAIL
function openProduct(id) {
    const item = products.find(p => p.id === id);
    if (!item || !item.type) return;

    hideAllViews();
    productView.classList.remove('hidden');

    document.getElementById('p-img').src = item.image;
    document.getElementById('p-title').innerText = item.shopTitle || item.title;
    document.getElementById('p-price').innerText = item.price;
    document.getElementById('p-desc').innerText = item.description;
    document.getElementById('p-buy-link').href = item.stripeLink;

    window.scrollTo(0, 0);
}

// 4. NAV / UTILS
function showPage(page) {
    hideAllViews();
    if (page === 'about') aboutView.classList.remove('hidden');
    if (page === 'contact') contactView.classList.remove('hidden');
}

function goBack() {
    renderMainGallery();
}

function hideAllViews() {
    galleryView.classList.add('hidden');
    productView.classList.add('hidden');
    aboutView.classList.add('hidden');
    contactView.classList.add('hidden');
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
}

function toggleShopMenu() {
    shopSubmenu.classList.toggle('hidden-submenu');
}