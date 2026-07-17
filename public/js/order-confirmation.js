// Order confirmation
const API_BASE = '/api';
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('order');
let lastOrder = JSON.parse(localStorage.getItem('lastOrder')) || {};

document.addEventListener('DOMContentLoaded', () => {
    if (lastOrder.orderId) {
        document.getElementById('order-id-display').textContent = lastOrder.orderId;
        document.getElementById('customer-name-display').textContent = lastOrder.customerName;
        document.getElementById('order-total-display').textContent = `Rs. ${lastOrder.grandTotal.toFixed(2)}`;
        document.getElementById('order-date-display').textContent = new Date().toLocaleDateString();
    }
});

function downloadPDF() {
    window.location.href = `${API_BASE}/orders/${lastOrder.orderId}/pdf`;
}

function printOrder() {
    window.print();
}
