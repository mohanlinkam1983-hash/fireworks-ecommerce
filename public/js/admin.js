// Admin functionality
let authToken = localStorage.getItem('adminToken');
const API_BASE = '/api';

// Check authentication
if (authToken) {
    showDashboard();
} else {
    showLogin();
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) {
                throw new Error('Login failed');
            }
            
            const data = await response.json();
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            showDashboard();
        } catch (error) {
            alert('Invalid username or password');
        }
    });
}

function showLogin() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('dashboard-page').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('dashboard-page').classList.remove('hidden');
    loadDashboard();
}

function logout() {
    localStorage.removeItem('adminToken');
    authToken = null;
    showLogin();
}

function showTab(tabName) {
    document.querySelectorAll('.content-tab').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    
    // Load data for the tab
    if (tabName === 'dashboard') loadDashboard();
    else if (tabName === 'categories') loadCategories();
    else if (tabName === 'products') loadProducts();
    else if (tabName === 'wholesale') loadWholesale();
    else if (tabName === 'retail-orders') loadRetailOrders();
    else if (tabName === 'wholesale-orders') loadWholesaleOrders();
    else if (tabName === 'customers') loadCustomers();
    else if (tabName === 'settings') loadSettings();
}

// Dashboard
async function loadDashboard() {
    try {
        const ordersRes = await fetch(`${API_BASE}/orders`);
        const orders = await ordersRes.json();
        
        const productsRes = await fetch(`${API_BASE}/products`);
        const products = await productsRes.json();
        
        const customersRes = await fetch(`${API_BASE}/customers`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const customers = await customersRes.json();
        
        document.getElementById('total-orders').textContent = orders.length;
        document.getElementById('total-customers').textContent = customers.length;
        document.getElementById('total-products').textContent = products.length;
        
        const totalRevenue = orders.reduce((sum, order) => sum + order.grand_total, 0);
        document.getElementById('total-revenue').textContent = `Rs. ${totalRevenue.toFixed(2)}`;
        
        // Recent orders
        const recentOrdersHtml = orders.slice(0, 5).map(order => `
            <div class="p-3 border rounded">
                <p class="font-bold">${order.order_id}</p>
                <p class="text-sm text-gray-600">Rs. ${order.grand_total}</p>
            </div>
        `).join('');
        document.getElementById('recent-orders').innerHTML = recentOrdersHtml;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        const categories = await response.json();
        
        const html = categories.map(cat => `
            <tr>
                <td class="px-6 py-3">${cat.id}</td>
                <td class="px-6 py-3">${cat.name}</td>
                <td class="px-6 py-3">${cat.description || '-'}</td>
                <td class="px-6 py-3 text-center">
                    <button onclick="deleteCategory(${cat.id})" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('categories-list').innerHTML = html;
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Products
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        
        const html = products.map(prod => `
            <tr>
                <td class="px-6 py-3">${prod.product_number}</td>
                <td class="px-6 py-3">${prod.name_en}</td>
                <td class="px-6 py-3">${prod.category_id}</td>
                <td class="px-6 py-3">Rs. ${prod.mrp}</td>
                <td class="px-6 py-3">Rs. ${prod.offer_price}</td>
                <td class="px-6 py-3 text-center">
                    <button onclick="deleteProduct(${prod.id})" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('products-list').innerHTML = html;
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Wholesale Products
async function loadWholesale() {
    try {
        const response = await fetch(`${API_BASE}/wholesale`);
        const products = await response.json();
        
        const html = products.map(prod => `
            <tr>
                <td class="px-6 py-3">${prod.product_number}</td>
                <td class="px-6 py-3">${prod.name_en}</td>
                <td class="px-6 py-3">${prod.category_id}</td>
                <td class="px-6 py-3">Rs. ${prod.unit_price}</td>
                <td class="px-6 py-3">Rs. ${prod.price}</td>
                <td class="px-6 py-3 text-center">
                    <button onclick="deleteWholesale(${prod.id})" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('wholesale-list').innerHTML = html;
    } catch (error) {
        console.error('Error loading wholesale products:', error);
    }
}

// Retail Orders
async function loadRetailOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders?order_type=retail`);
        const orders = await response.json();
        
        const html = orders.map(order => `
            <tr>
                <td class="px-6 py-3">${order.order_id}</td>
                <td class="px-6 py-3">Customer ${order.customer_id}</td>
                <td class="px-6 py-3">Rs. ${order.grand_total}</td>
                <td class="px-6 py-3"><span class="px-3 py-1 rounded text-white" style="background-color: ${order.status === 'Pending' ? '#ff6b6b' : '#51cf66'}">${order.status}</span></td>
                <td class="px-6 py-3">${new Date(order.created_at).toLocaleDateString()}</td>
                <td class="px-6 py-3 text-center">
                    <button onclick="updateOrderStatus(${order.id})" class="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('retail-orders-list').innerHTML = html;
    } catch (error) {
        console.error('Error loading retail orders:', error);
    }
}

// Wholesale Orders
async function loadWholesaleOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders?order_type=wholesale`);
        const orders = await response.json();
        
        const html = orders.map(order => `
            <tr>
                <td class="px-6 py-3">${order.order_id}</td>
                <td class="px-6 py-3">Customer ${order.customer_id}</td>
                <td class="px-6 py-3">Rs. ${order.grand_total}</td>
                <td class="px-6 py-3"><span class="px-3 py-1 rounded text-white" style="background-color: ${order.status === 'Pending' ? '#ff6b6b' : '#51cf66'}">${order.status}</span></td>
                <td class="px-6 py-3">${new Date(order.created_at).toLocaleDateString()}</td>
                <td class="px-6 py-3 text-center">
                    <button onclick="updateOrderStatus(${order.id})" class="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('wholesale-orders-list').innerHTML = html;
    } catch (error) {
        console.error('Error loading wholesale orders:', error);
    }
}

// Customers
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/customers`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const customers = await response.json();
        
        const html = customers.map(cust => `
            <tr>
                <td class="px-6 py-3">${cust.name}</td>
                <td class="px-6 py-3">${cust.mobile}</td>
                <td class="px-6 py-3">${cust.email || '-'}</td>
                <td class="px-6 py-3">${cust.city}</td>
                <td class="px-6 py-3">${cust.total_orders || 0}</td>
                <td class="px-6 py-3">Rs. ${(cust.total_purchase || 0).toFixed(2)}</td>
            </tr>
        `).join('');
        
        document.getElementById('customers-list').innerHTML = html;
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

// Settings
async function loadSettings() {
    try {
        const response = await fetch(`${API_BASE}/settings`);
        const settings = await response.json();
        
        if (settings) {
            document.getElementById('settings-company-name').value = settings.company_name || '';
            document.getElementById('settings-phone').value = settings.phone || '';
            document.getElementById('settings-whatsapp').value = settings.whatsapp || '';
            document.getElementById('settings-email').value = settings.email || '';
            document.getElementById('settings-address').value = settings.address || '';
            document.getElementById('settings-bank-details').value = settings.bank_details || '';
        }
        
        document.getElementById('settings-form').addEventListener('submit', saveSettings);
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function saveSettings(e) {
    e.preventDefault();
    
    const settingsData = {
        company_name: document.getElementById('settings-company-name').value,
        phone: document.getElementById('settings-phone').value,
        whatsapp: document.getElementById('settings-whatsapp').value,
        email: document.getElementById('settings-email').value,
        address: document.getElementById('settings-address').value,
        bank_details: document.getElementById('settings-bank-details').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settingsData)
        });
        
        if (response.ok) {
            alert('Settings saved successfully!');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// Modal functions
function openCategoryModal() {
    document.getElementById('category-modal').classList.remove('hidden');
    loadCategoriesForDropdown();
}

function closeCategoryModal() {
    document.getElementById('category-modal').classList.add('hidden');
}

function openProductModal() {
    document.getElementById('product-modal').classList.remove('hidden');
    loadCategoriesForDropdown();
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

function openWholesaleModal() {
    document.getElementById('wholesale-modal').classList.remove('hidden');
    loadCategoriesForDropdown();
}

function closeWholesaleModal() {
    document.getElementById('wholesale-modal').classList.add('hidden');
}

async function loadCategoriesForDropdown() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        const categories = await response.json();
        
        const selects = ['product-category', 'wholesale-category'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Select Category</option>' + categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
            }
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Form submissions
const categoryForm = document.getElementById('category-form');
if (categoryForm) {
    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('category-name').value;
        const description = document.getElementById('category-description').value;
        
        try {
            const response = await fetch(`${API_BASE}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });
            
            if (response.ok) {
                alert('Category added successfully!');
                closeCategoryModal();
                loadCategories();
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    });
}

const productForm = document.getElementById('product-form');
if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('product_number', document.getElementById('product-number').value);
        formData.append('category_id', document.getElementById('product-category').value);
        formData.append('name_en', document.getElementById('product-name-en').value);
        formData.append('name_ta', document.getElementById('product-name-ta').value);
        formData.append('packing', document.getElementById('product-packing').value);
        formData.append('mrp', document.getElementById('product-mrp').value);
        formData.append('offer_price', document.getElementById('product-offer-price').value);
        formData.append('description', document.getElementById('product-description').value);
        
        if (document.getElementById('product-image').files.length > 0) {
            formData.append('image', document.getElementById('product-image').files[0]);
        }
        
        try {
            const response = await fetch(`${API_BASE}/products`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                alert('Product added successfully!');
                closeProductModal();
                loadProducts();
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });
}

const wholesaleForm = document.getElementById('wholesale-form');
if (wholesaleForm) {
    wholesaleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('product_number', document.getElementById('wholesale-number').value);
        formData.append('category_id', document.getElementById('wholesale-category').value);
        formData.append('name_en', document.getElementById('wholesale-name-en').value);
        formData.append('name_ta', document.getElementById('wholesale-name-ta').value);
        formData.append('packing', document.getElementById('wholesale-packing').value);
        formData.append('unit_price', document.getElementById('wholesale-unit-price').value);
        formData.append('price', document.getElementById('wholesale-price').value);
        formData.append('description', document.getElementById('wholesale-description').value);
        
        if (document.getElementById('wholesale-image').files.length > 0) {
            formData.append('image', document.getElementById('wholesale-image').files[0]);
        }
        
        try {
            const response = await fetch(`${API_BASE}/wholesale`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                alert('Wholesale product added successfully!');
                closeWholesaleModal();
                loadWholesale();
            }
        } catch (error) {
            console.error('Error adding wholesale product:', error);
        }
    });
}

// Delete functions
async function deleteCategory(id) {
    if (confirm('Are you sure?')) {
        try {
            await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }
}

async function deleteProduct(id) {
    if (confirm('Are you sure?')) {
        try {
            await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}

async function deleteWholesale(id) {
    if (confirm('Are you sure?')) {
        try {
            await fetch(`${API_BASE}/wholesale/${id}`, { method: 'DELETE' });
            loadWholesale();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}

async function updateOrderStatus(orderId) {
    const status = prompt('Enter new status (Pending/Processing/Shipped/Delivered):');
    if (status) {
        try {
            await fetch(`${API_BASE}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            loadRetailOrders();
            loadWholesaleOrders();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    }
}
