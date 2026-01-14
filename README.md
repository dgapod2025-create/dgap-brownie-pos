# Brownie Shop Website

A complete brownie shop website with menu display, shopping cart, billing system, and admin panel for menu management and sales reporting.

## Features

### Customer Features
- **Menu Display**: View all available brownie items with images and prices
- **Shopping Cart**: Add items to cart by clicking on them, adjust quantities, remove items
- **Billing System**: 
  - Pay Now button opens billing modal
  - UPI QR code generation for payments
  - Print bill functionality
  - Clear cart option
- **Real-time Updates**: Cart total updates automatically as items are added/removed

### Admin Features
- **Menu Management (CRUD)**:
  - Create: Add new brownie items with name, price, and image
  - Read: View all menu items in a list
  - Update: Edit existing menu items
  - Delete: Remove items from menu
- **Monthly Sales Report**:
  - Filter sales by month and year
  - View total sales, transaction count, and average transaction value
  - Item-wise breakdown (quantities sold and revenue)
  - Detailed transaction history

## Setup Instructions

1. **Add Product Images**:
   - Place your brownie images in the `images/` folder
   - Recommended image names:
     - `double-chocolate.jpg`
     - `triple-chocolate.jpg`
     - `nuts-brownie.jpg`
     - `biscoff-brownie.jpg`
     - `fudge-brownie.jpg`
     - `choco-chips-brownie.jpg`
   - Or use any image names and specify them in the admin panel

2. **Open the Website**:
   - Open `index.html` in a web browser
   - The website uses localStorage, so all data persists in your browser

3. **Default Menu Items**:
   - The website comes with 6 default brownie items pre-loaded
   - You can edit or delete them via the Admin panel
   - Prices can be adjusted through the admin interface

## File Structure

```
Billing/
├── index.html          # Main customer-facing page
├── admin.html          # Admin panel for menu management and reports
├── styles.css          # All styling for both pages
├── script.js           # Main application logic (cart, billing)
├── admin.js            # Admin panel logic (CRUD, reports)
├── images/             # Folder for product images
└── README.md           # This file
```

## Usage

### For Customers:
1. Browse the menu on the home page
2. Click on any brownie item to add it to your cart
3. Adjust quantities using the +/- buttons in the cart
4. Click "Pay Now" to view the bill and UPI QR code
5. Use "Print Bill" to print the receipt
6. Click "Complete Payment" to finalize the transaction

### For Admins:
1. Navigate to Admin panel (click "Admin" in the navigation)
2. **Manage Menu Tab**:
   - Add new items: Fill the form and click "Add Item"
   - Edit items: Click "Edit" on any item, modify details, click "Update Item"
   - Delete items: Click "Delete" on any item (with confirmation)
3. **Sales Report Tab**:
   - Select month and year from dropdowns
   - Click "Generate Report" to view sales data
   - View summary statistics and detailed transaction history

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser localStorage (no backend required)
- **QR Code**: Uses qrcode.js library (loaded via CDN)
- **Responsive**: Works on desktop and mobile devices
- **Print Support**: Bill printing with optimized print styles

## Data Storage

All data is stored in browser localStorage:
- `brownieMenu`: Array of menu items
- `cart`: Current shopping cart (temporary)
- `transactions`: Array of completed transactions for reports

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Notes

- Images will show a placeholder if the image file is not found
- All prices are in Indian Rupees (₹)
- UPI QR code is generated with a placeholder UPI ID (`brownieshop@upi`)
- You can update the UPI ID in `script.js` if needed (line with `upi://pay?pa=...`)
- Data persists only in the browser where it's stored (localStorage)

## Future Enhancements

- Backend integration for multi-device sync
- Multiple payment gateway support
- Email receipts
- Inventory management
- Customer order history
- Export reports to CSV/PDF
