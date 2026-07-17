// Checkout functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartSummary = JSON.parse(localStorage.getItem('cartSummary')) || {};
const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    displayOrderReview();
    updateCheckoutSummary();
    
    document.getElementById('checkout-form').addEventListener('submit', submitOrder);
});

function displayOrderReview() {
    const reviewContainer = document.getElementById('order-review');
    
    reviewContainer.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center p-4 bg-gray-50 rounded">
            <div>
                <p class="font-bold text-gray-800">${item.name}</p>
                <p class="text-gray-600 text-sm">Quantity: ${item.quantity} × Rs. ${item.price}</p>
            </div>
            <p class="font-bold text-green-600">Rs. ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    `).join('');
}

function updateCheckoutSummary() {
    const subtotal = cartSummary.subtotal || 0;
    const discount = cartSummary.discount || 0;
    const delivery = cartSummary.delivery || 0;
    const grandTotal = cartSummary.grandTotal || 0;
    
    document.getElementById('checkout-subtotal').textContent = `Rs. ${subtotal.toFixed(2)}`;
    document.getElementById('checkout-discount').textContent = `Rs. ${discount.toFixed(2)}`;
    document.getElementById('checkout-delivery').textContent = `Rs. ${delivery.toFixed(2)}`;
    document.getElementById('checkout-grand-total').textContent = `Rs. ${grandTotal.toFixed(2)}`;
}

async function submitOrder(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const customerName = document.getElementById('customer-name').value;
    const customerMobile = document.getElementById('customer-mobile').value;
    const customerWhatsapp = document.getElementById('customer-whatsapp').value || customerMobile;
    const customerEmail = document.getElementById('customer-email').value;
    const customerCity = document.getElementById('customer-city').value;
    const customerState = document.getElementById('customer-state').value;
    const customerPincode = document.getElementById('customer-pincode').value;
    const customerAddress = document.getElementById('customer-address').value;
    const specialInstructions = document.getElementById('special-instructions').value;
    
    // Determine order type
    const orderType = cart.some(item => item.type === 'wholesale') ? 'wholesale' : 'retail';
    
    const orderData = {
        customer: {
            name: customerName,
            mobile: customerMobile,
            whatsapp: customerWhatsapp,
            email: customerEmail,
            city: customerCity,
            state: customerState,
            pincode: customerPincode,
            address: customerAddress
        },
        items: cart,
        order_type: orderType,
        subtotal: cartSummary.subtotal || 0,
        discount: cartSummary.discount || 0,
        delivery_charge: cartSummary.delivery || 0,
        grand_total: cartSummary.grandTotal || 0,
        special_instructions: specialInstructions
    };
    
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error('Order submission failed');
        }
        
        const result = await response.json();
        
        // Store order confirmation data
        localStorage.setItem('lastOrder', JSON.stringify({
            orderId: result.order_id,
            customerName: customerName,
            grandTotal: cartSummary.grandTotal
        }));
        
        // Clear cart
        localStorage.removeItem('cart');
        localStorage.removeItem('cartSummary');
        
        // Redirect to confirmation
        window.location.href = `/order-confirmation.html?order=${result.order_id}`;
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('Error placing order. Please try again.');
    }
}
