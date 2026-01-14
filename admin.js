// Storage keys
const MENU_STORAGE_KEY = 'brownieMenu';
const TRANSACTIONS_STORAGE_KEY = 'transactions';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    loadMenuList();
    setupMenuForm();
    initializeReportDropdowns();
});

// Setup tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');

            // Load sales report when switching to sales tab
            if (targetTab === 'sales') {
                generateReport();
            }
        });
    });
}

// Load menu items for management
function loadMenuList() {
    const menuItems = JSON.parse(localStorage.getItem(MENU_STORAGE_KEY) || '[]');
    const menuList = document.getElementById('menu-list');
    
    if (menuItems.length === 0) {
        menuList.innerHTML = '<p>No menu items. Add your first item above!</p>';
        return;
    }

    menuList.innerHTML = '';

    menuItems.forEach(item => {
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-card';
        menuCard.innerHTML = `
            <div class="menu-card-info">
                <h3>${item.name}</h3>
                <p><strong>Price:</strong> ₹${item.price}</p>
                <p><strong>Image:</strong> ${item.image}</p>
            </div>
            <div class="menu-card-actions">
                <button class="btn btn-primary" onclick="editMenuItem(${item.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteMenuItem(${item.id})">Delete</button>
            </div>
        `;
        menuList.appendChild(menuCard);
    });
}

// Setup menu form
function setupMenuForm() {
    const form = document.getElementById('menu-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const submitBtn = document.getElementById('submit-btn');
    const formTitle = document.getElementById('form-title');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveMenuItem();
    });

    cancelBtn.addEventListener('click', function() {
        resetForm();
    });
}

// Reset form to add mode
function resetForm() {
    document.getElementById('menu-form').reset();
    document.getElementById('item-id').value = '';
    document.getElementById('form-title').textContent = 'Add New Item';
    document.getElementById('submit-btn').textContent = 'Add Item';
    document.getElementById('cancel-btn').style.display = 'none';
}

// Save menu item (Create or Update)
function saveMenuItem() {
    const itemId = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const image = document.getElementById('item-image').value;

    let menuItems = JSON.parse(localStorage.getItem(MENU_STORAGE_KEY) || '[]');

    if (itemId) {
        // Update existing item
        const index = menuItems.findIndex(item => item.id === parseInt(itemId));
        if (index !== -1) {
            menuItems[index] = {
                id: parseInt(itemId),
                name: name,
                price: price,
                image: (image.startsWith('http') || image.startsWith('images/')) ? image : `images/${image}`
            };
        }
    } else {
        // Create new item
        const newId = menuItems.length > 0 
            ? Math.max(...menuItems.map(item => item.id)) + 1 
            : 1;
        menuItems.push({
            id: newId,
            name: name,
            price: price,
            image: (image.startsWith('http') || image.startsWith('images/')) ? image : `images/${image}`
        });
    }

    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
    loadMenuList();
    resetForm();
    showNotification(itemId ? 'Item updated successfully!' : 'Item added successfully!');
}

// Edit menu item
function editMenuItem(id) {
    const menuItems = JSON.parse(localStorage.getItem(MENU_STORAGE_KEY) || '[]');
    const item = menuItems.find(item => item.id === id);

    if (item) {
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-price').value = item.price;
        // Extract image path - handle both URLs and local paths
        const imagePath = item.image.startsWith('http') ? item.image : item.image.replace('images/', '');
        document.getElementById('item-image').value = imagePath;
        document.getElementById('form-title').textContent = 'Edit Item';
        document.getElementById('submit-btn').textContent = 'Update Item';
        document.getElementById('cancel-btn').style.display = 'inline-block';

        // Scroll to form
        document.getElementById('menu-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Delete menu item
function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    let menuItems = JSON.parse(localStorage.getItem(MENU_STORAGE_KEY) || '[]');
    menuItems = menuItems.filter(item => item.id !== id);
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
    loadMenuList();
    showNotification('Item deleted successfully!');
}

// Initialize report dropdowns
function initializeReportDropdowns() {
    const monthSelect = document.getElementById('report-month');
    const yearSelect = document.getElementById('report-year');

    // Populate months
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        if (index + 1 === new Date().getMonth() + 1) {
            option.selected = true;
        }
        monthSelect.appendChild(option);
    });

    // Populate years (current year and previous 2 years)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 2; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === currentYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    }
}

// Generate sales report
function generateReport() {
    const month = parseInt(document.getElementById('report-month').value);
    const year = parseInt(document.getElementById('report-year').value);
    const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_STORAGE_KEY) || '[]');

    // Filter transactions for selected month and year
    const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() + 1 === month && transactionDate.getFullYear() === year;
    });

    const reportResults = document.getElementById('report-results');

    if (filteredTransactions.length === 0) {
        reportResults.innerHTML = '<p>No transactions found for the selected month.</p>';
        return;
    }

    // Calculate summary
    let totalSales = 0;
    let totalTransactions = filteredTransactions.length;
    const itemBreakdown = {};

    filteredTransactions.forEach(transaction => {
        totalSales += transaction.total;
        transaction.items.forEach(item => {
            if (!itemBreakdown[item.name]) {
                itemBreakdown[item.name] = {
                    quantity: 0,
                    revenue: 0
                };
            }
            itemBreakdown[item.name].quantity += item.quantity;
            itemBreakdown[item.name].revenue += item.price * item.quantity;
        });
    });

    // Display report
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    reportResults.innerHTML = `
        <div class="report-summary">
            <h3>Sales Summary - ${monthNames[month - 1]} ${year}</h3>
            <div class="summary-item">
                <span><strong>Total Sales:</strong></span>
                <span>₹${totalSales.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span><strong>Total Transactions:</strong></span>
                <span>${totalTransactions}</span>
            </div>
            <div class="summary-item">
                <span><strong>Average Transaction Value:</strong></span>
                <span>₹${(totalSales / totalTransactions).toFixed(2)}</span>
            </div>
        </div>

        <h3 style="margin-top: 30px;">Item-wise Breakdown</h3>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(itemBreakdown)
                    .map(([name, data]) => `
                        <tr>
                            <td>${name}</td>
                            <td>${data.quantity}</td>
                            <td>₹${data.revenue.toFixed(2)}</td>
                        </tr>
                    `)
                    .join('')}
            </tbody>
        </table>

        <h3 style="margin-top: 30px;">Transaction Details</h3>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Date & Time</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
                ${filteredTransactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(transaction => {
                        const date = new Date(transaction.date);
                        const itemsList = transaction.items
                            .map(item => `${item.name} (×${item.quantity})`)
                            .join(', ');
                        return `
                            <tr>
                                <td>${date.toLocaleString()}</td>
                                <td>${itemsList}</td>
                                <td>₹${transaction.total.toFixed(2)}</td>
                            </tr>
                        `;
                    })
                    .join('')}
            </tbody>
        </table>
    `;
}

// Show notification
function showNotification(message) {
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
