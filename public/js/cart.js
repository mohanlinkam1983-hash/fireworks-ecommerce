// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    displayCart();
});

function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-600 text-center py-8">Your cart is empty</p>';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="flex items-center justify-between border-b pb-4 mb-4">
            <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-800">${item.name}</h3>
                <p class="text-gray-600">Type: ${item.type === 'retail' ? 'Retail' : 'Wholesale'}</p>
                <p class="text-green-600 font-bold">Rs. ${item.price}</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <button onclick="decreaseQuantity(${index})" class="bg-gray-300 px-3 py-1 rounded">−</button>
                    <span class="px-4 py-1 bg-gray-100 rounded">${item.quantity}</span>
                    <button onclick="increaseQuantity(${index})" class="bg-gray-300 px-3 py-1 rounded">+</button>
                </div>
                <span class="font-bold w-24 text-right">Rs. ${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart(${index})" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Remove</button>
            </div>
        </div>
    `).join('');
    
    updateSummary();
}

function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        removeFromCart(index);
    }
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0;
    const delivery = 0;
    const grandTotal = subtotal - discount + delivery;
    
    document.getElementById('subtotal').textContent = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById('discount-amount').textContent = `Rs. ${discount.toFixed(2)}`;
    document.getElementById('delivery-amount').textContent = `Rs. ${delivery.toFixed(2)}`;
    document.getElementById('grand-total').textContent = `Rs. ${grandTotal.toFixed(2)}`;
    
    localStorage.setItem('cartSummary', JSON.stringify({ subtotal, discount, delivery, grandTotal }));
}

function goToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = '/checkout.html';
}

function continueShopping() {
    window.location.href = '/';
}
