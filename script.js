// Initialize menu data structure
const MENU_STORAGE_KEY = 'brownieMenu';
const CART_STORAGE_KEY = 'cart';
const TRANSACTIONS_STORAGE_KEY = 'transactions';

// Shop/Invoice Configuration - Update these with your details
const SHOP_CONFIG = {
    name: 'DGAP Brownie Delight',
    address: '43/3/1, Lishitha Nilaya, 11th Main, 1st Block, Hosapalya, Bommanahalli, Bengaluru - 560068',
    phone: '+91 9629402466',
    email: 'dgapod2025@gmail.com',
    gstin: '',
    website: 'www.dgapbrownie.in',
    logo: './assets/logo.png'
};

// Bank/UPI Configuration - Update these with your details
const BANK_CONFIG = {
    qrCodeImage: 'images/bank-qr-code.png', // Path to your static QR code image
    merchantName: 'DGAP Brownie Delight', // Your merchant/business name
    useStaticQR: true // Set to true to use static image, false to generate dynamically
};

// Default menu items with open-source images from Unsplash (free to use)
const defaultMenuItems = [
    { id: 1, name: 'Homemade double chocolate brownie', price: 50, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&auto=format' },
    { id: 2, name: 'Homemade triple chocolate brownie', price: 50, image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=400&fit=crop&auto=format' },
    { id: 3, name: 'Homemade nuts brownie', price: 50, image: 'https://images.unsplash.com/photo-1606312619070-d48b4d0e3e2e?w=400&h=400&fit=crop&auto=format' },
    { id: 4, name: 'Homemade biscoff brownie', price: 50, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&auto=format' },
    { id: 5, name: 'Homemade fudge brownie', price: 50, image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=400&fit=crop&auto=format' },
    { id: 6, name: 'Homemade choco chips brownie', price: 50, image: 'https://images.unsplash.com/photo-1606312619070-d48b4d0e3e2e?w=400&h=400&fit=crop&auto=format' }
];

// Initialize data on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeMenu();
    loadMenu();
    loadCart();
    setupEventListeners();
});

// Initialize menu in localStorage if empty
function initializeMenu() {
    if (!localStorage.getItem(MENU_STORAGE_KEY)) {
        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(defaultMenuItems));
    }
}

// Load menu items from localStorage
function loadMenu() {
    const menuItems = JSON.parse(localStorage.getItem(MENU_STORAGE_KEY) || '[]');
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2214%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo Image%3C/text%3E%3C/svg%3E'">
            <h3>${item.name}</h3>
            <div class="price">₹${item.price}</div>
        `;
        menuItem.addEventListener('click', () => addToCart(item));
        menuGrid.appendChild(menuItem);
    });
}

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Add item to cart
function addToCart(item) {
    let cart = getCart();
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }

    saveCart(cart);
    loadCart();
    showNotification(`${item.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    loadCart();
}

// Update item quantity in cart
function updateQuantity(itemId, change) {
    let cart = getCart();
    const item = cart.find(cartItem => cartItem.id === itemId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        saveCart(cart);
        loadCart();
    }
}

// Load and display cart
function loadCart() {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const payNowBtn = document.getElementById('pay-now-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        payNowBtn.disabled = true;
        clearCartBtn.disabled = true;
        cartTotal.textContent = '0';
        return;
    }

    payNowBtn.disabled = false;
    clearCartBtn.disabled = false;

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
}

// Setup event listeners
function setupEventListeners() {
    const payNowBtn = document.getElementById('pay-now-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const billingModal = document.getElementById('billing-modal');
    const closeModal = document.querySelector('.close');
    const printBillBtn = document.getElementById('print-bill-btn');
    const completePaymentBtn = document.getElementById('complete-payment-btn');

    // Ensure elements exist before adding listeners
    if (payNowBtn) {
        payNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showBillingModal();
        });
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (billingModal) billingModal.style.display = 'none';
        });
    }
    
    if (printBillBtn) {
        printBillBtn.addEventListener('click', printBill);
    }
    
    if (completePaymentBtn) {
        completePaymentBtn.addEventListener('click', completePayment);
    }

    // Close modal when clicking outside
    if (billingModal) {
        window.addEventListener('click', (event) => {
            if (event.target === billingModal) {
                billingModal.style.display = 'none';
            }
        });
    }
}

// Show billing modal
function showBillingModal() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to the cart first.');
        return;
    }

    const modal = document.getElementById('billing-modal');
    const invoiceContent = document.getElementById('invoice-content');

    if (!modal || !invoiceContent) {
        console.error('Required elements not found');
        return;
    }

    // Calculate total
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    // Generate custom invoice
    generateCustomInvoice(cart, total, invoiceContent);

    // Always show modal
    modal.style.display = 'block';
}

// Generate custom invoice format
function generateCustomInvoice(cart, total, container) {
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
    const currentDate = new Date().toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        itemsHTML += `
            <tr class="invoice-item-row">
                <td class="item-sr">${index + 1}</td>
                <td class="item-name">${item.name}</td>
                <td class="item-qty">${item.quantity}</td>
                <td class="item-price">₹${item.price.toFixed(2)}</td>
                <td class="item-total">₹${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    const invoiceHTML = `
        <div class="invoice-header">
            <div class="invoice-header-left">
                <h1 class="shop-name">${SHOP_CONFIG.name}</h1>
                <div class="shop-details">
                    ${SHOP_CONFIG.address ? `<p class="shop-address">${SHOP_CONFIG.address}</p>` : ''}
                    ${SHOP_CONFIG.phone ? `<p class="shop-contact">📞 ${SHOP_CONFIG.phone}</p>` : ''}
                    ${SHOP_CONFIG.email ? `<p class="shop-contact">✉️ ${SHOP_CONFIG.email}</p>` : ''}
                    ${SHOP_CONFIG.website ? `<p class="shop-contact">🌐 ${SHOP_CONFIG.website}</p>` : ''}
                </div>
            </div>
            <div class="invoice-header-right">
                <h2 class="invoice-title">TAX INVOICE</h2>
                <div class="invoice-info">
                    <p><strong>Invoice No:</strong> <span class="invoice-number">${invoiceNumber}</span></p>
                    <p><strong>Date:</strong> ${currentDate}</p>
                    ${SHOP_CONFIG.gstin ? `<p><strong>GSTIN:</strong> ${SHOP_CONFIG.gstin}</p>` : ''}
                </div>
            </div>
        </div>

        <div class="invoice-table-container">
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th class="col-sr">Sr.</th>
                        <th class="col-name">Item Description</th>
                        <th class="col-qty">Qty</th>
                        <th class="col-price">Unit Price</th>
                        <th class="col-total">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
        </div>

        <div class="invoice-totals">
            <div class="totals-row">
                <div class="totals-label">Subtotal:</div>
                <div class="totals-value">₹${subtotal.toFixed(2)}</div>
            </div>
            <div class="totals-row total-row">
                <div class="totals-label">Total Amount:</div>
                <div class="totals-value">₹${total.toFixed(2)}</div>
            </div>
        </div>

        <div class="invoice-payment-section">
            <h3 class="payment-title">Payment Method</h3>
            <div class="qr-code-container" id="qr-code"></div>
            ${BANK_CONFIG.upiId ? `<p class="upi-id-display">UPI ID: <strong>${BANK_CONFIG.upiId}</strong></p>` : ''}
        </div>

        <div class="invoice-footer">
            <p class="thank-you">Thank you for your purchase!</p>
            <p class="footer-note">This is a computer-generated invoice.</p>
        </div>
    `;

    container.innerHTML = invoiceHTML;

    // Generate QR code after invoice is rendered
    const qrCodeContainer = container.querySelector('#qr-code');
    if (qrCodeContainer) {
        if (BANK_CONFIG.useStaticQR && BANK_CONFIG.qrCodeImage) {
            // Use static QR code image
            const qrImage = document.createElement('img');
            qrImage.src = BANK_CONFIG.qrCodeImage;
            qrImage.alt = 'Bank QR Code';
            qrImage.className = 'qr-code-image';
            qrImage.onerror = function() {
                console.warn('Static QR code image not found, generating dynamically...');
                generateDynamicQRCode(qrCodeContainer, total);
            };
            qrCodeContainer.appendChild(qrImage);
        } else {
            // Generate QR code dynamically
            generateDynamicQRCode(qrCodeContainer, total);
        }
    }
}

// Function to generate dynamic QR code
function generateDynamicQRCode(container, amount) {
    const upiString = `upi://pay?pa=${BANK_CONFIG.upiId || 'brownieshop@upi'}&pn=${encodeURIComponent(BANK_CONFIG.merchantName || 'BrownieShop')}&am=${amount.toFixed(2)}&cu=INR&tn=BrowniePurchase`;
    
    // Generate QR code - using try-catch to prevent errors from blocking modal display
    try {
        if (typeof QRCode !== 'undefined') {
            const canvas = document.createElement('canvas');
            QRCode.toCanvas(canvas, upiString, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, function(error) {
                if (error) {
                    console.error('QR Code generation error:', error);
                    container.innerHTML = '<p style="color: #e74c3c;">Error generating QR code. Please try again.</p>';
                } else {
                    container.appendChild(canvas);
                }
            });
        } else {
            container.innerHTML = '<p style="color: #e74c3c;">QR Code library not loaded. Please refresh the page.</p>';
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        container.innerHTML = '<p style="color: #e74c3c;">Error generating QR code. Please try again.</p>';
    }
}

// Print bill
function printBill() {
    window.print();
}

// Complete payment
function completePayment() {
    const cart = getCart();
    if (cart.length === 0) return;

    // Calculate total
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    // Create transaction record
    const transaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: JSON.parse(JSON.stringify(cart)),
        total: total
    };

    // Save transaction
    let transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_STORAGE_KEY) || '[]');
    transactions.push(transaction);
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));

    // Clear cart
    clearCart();

    // Close modal
    document.getElementById('billing-modal').style.display = 'none';

    showNotification('Payment completed! Thank you for your purchase.');
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        saveCart([]);
        loadCart();
        showNotification('Cart cleared');
    }
}

// Show notification
function showNotification(message) {
    // Simple notification - can be enhanced with a toast library
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
