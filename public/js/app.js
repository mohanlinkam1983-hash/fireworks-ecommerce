// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allCategories = [];
let allRetailProducts = [];
let allWholesaleProducts = [];
const API_BASE = '/api';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadRetailProducts();
    await loadWholesaleProducts();
    updateCartCount();
    loadSettings();
});

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        allCategories = await response.json();
        populateCategoryFilters();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Populate category filters
function populateCategoryFilters() {
    const categoryFilters = document.querySelectorAll('#category-filter, #wholesale-category-filter');
    categoryFilters.forEach(filter => {
        allCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            filter.appendChild(option);
        });
    });
}

// Load retail products
async function loadRetailProducts() {
    try {
        const categoryId = document.getElementById('category-filter')?.value || '';
        const search = document.getElementById('search-input')?.value || '';
        const sort = document.getElementById('sort-filter')?.value || '';
        
        let url = `${API_BASE}/products?`;
        if (categoryId) url += `category_id=${categoryId}&`;
        if (search) url += `search=${search}&`;
        if (sort) url += `sort=${sort}`;
        
        const response = await fetch(url);
        allRetailProducts = await response.json();
        displayRetailProducts(allRetailProducts);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Load wholesale products
async function loadWholesaleProducts() {
    try {
        const categoryId = document.getElementById('wholesale-category-filter')?.value || '';
        const sort = document.getElementById('wholesale-sort-filter')?.value || '';
        
        let url = `${API_BASE}/wholesale?`;
        if (categoryId) url += `category_id=${categoryId}&`;
        if (sort) url += `sort=${sort}`;
        
        const response = await fetch(url);
        allWholesaleProducts = await response.json();
        displayWholesaleProducts(allWholesaleProducts);
    } catch (error) {
        console.error('Error loading wholesale products:', error);
    }
}

// Display retail products
function displayRetailProducts(products) {
    const container = document.getElementById('retail-products');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <img src="${product.image_url || '/images/placeholder.jpg'}" alt="${product.name_en}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg text-gray-800 mb-2">${product.name_en}</h3>
                <p class="text-gray-600 text-sm mb-2">${product.name_ta}</p>
                <p class="text-gray-600 text-sm mb-2">Packing: ${product.packing}</p>
                <div class="mb-4">
                    <span class="text-gray-500 line-through">Rs. ${product.mrp}</span>
                    <span class="text-2xl font-bold text-green-600 ml-2">Rs. ${product.offer_price}</span>
                </div>
                <button onclick="addToCart(${product.id}, '${product.name_en}', ${product.offer_price}, 'retail')" class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    🛒 Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Display wholesale products
function displayWholesaleProducts(products) {
    const container = document.getElementById('wholesale-products');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <img src="${product.image_url || '/images/placeholder.jpg'}" alt="${product.name_en}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg text-gray-800 mb-2">${product.name_en}</h3>
                <p class="text-gray-600 text-sm mb-2">${product.name_ta}</p>
                <p class="text-gray-600 text-sm mb-2">Packing: ${product.packing}</p>
                <div class="mb-2">
                    <span class="text-gray-600">Unit: Rs. ${product.unit_price}</span>
                </div>
                <div class="mb-4">
                    <span class="text-2xl font-bold text-green-600">Rs. ${product.price}</span>
                </div>
                <button onclick="addToCart(${product.id}, '${product.name_en}', ${product.price}, 'wholesale')" class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    🛒 Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId, name, price, type) {
    const existingItem = cart.find(item => item.product_id === productId && item.type === type);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product_id: productId,
            name,
            price,
            quantity: 1,
            type
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Cart button click
const cartBtn = document.getElementById('cart-btn');
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        window.location.href = '/cart.html';
    });
}

// Filter event listeners
const categoryFilter = document.getElementById('category-filter');
if (categoryFilter) {
    categoryFilter.addEventListener('change', loadRetailProducts);
}

const sortFilter = document.getElementById('sort-filter');
if (sortFilter) {
    sortFilter.addEventListener('change', loadRetailProducts);
}

const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('change', loadRetailProducts);
}

const wholesaleCategoryFilter = document.getElementById('wholesale-category-filter');
if (wholesaleCategoryFilter) {
    wholesaleCategoryFilter.addEventListener('change', loadWholesaleProducts);
}

const wholesaleSortFilter = document.getElementById('wholesale-sort-filter');
if (wholesaleSortFilter) {
    wholesaleSortFilter.addEventListener('change', loadWholesaleProducts);
}

// Load settings
async function loadSettings() {
    try {
        const response = await fetch(`${API_BASE}/settings`);
        const settings = await response.json();
        
        if (settings) {
            const footerPhone = document.getElementById('footer-phone');
            const footerEmail = document.getElementById('footer-email');
            
            if (footerPhone && settings.phone) footerPhone.textContent = settings.phone;
            if (footerEmail && settings.email) footerEmail.textContent = settings.email;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}
