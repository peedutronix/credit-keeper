# Credit Keeper - Usage Guide

## Quick Start Workflow

### 1. Initial Setup

1. Run the setup script:
   - Windows: `setup.bat`
   - Linux/Mac: `bash setup.sh`

2. Start the backend server:
   ```bash
   npm start
   ```

3. Start the frontend (in a new terminal):
   ```bash
   npm run client
   ```

4. Access the app at http://localhost:3000

### 2. Create User Accounts

#### Admin Account
- Default admin already exists:
  - Username: `admin`
  - Password: `admin123`

#### Create Shopkeeper Account
1. Click "Register" on login page
2. Fill in details:
   - Username: (e.g., `shopkeeper1`)
   - Email: (e.g., `shopkeeper@shop.com`)
   - Password: (choose a password)
   - Role: Select **Shopkeeper**
   - Full Name: (optional)
   - Phone: (optional)
3. Click "Register"

#### Create Customer Accounts
1. Click "Register" on login page
2. Fill in details:
   - Username: (e.g., `customer1`)
   - Email: (e.g., `customer@example.com`)
   - Password: (choose a password)
   - Role: Select **Customer**
   - Full Name: (optional)
   - Phone: (optional)
3. Click "Register"

### 3. Customer Workflow

#### Place a Credit Order

1. **Login as Customer**
   - Use your customer credentials

2. **View Credit Summary**
   - Dashboard shows:
     - Credit Limit
     - Current Credit (outstanding)
     - Available Credit

3. **Create New Order**
   - Click "Create New Order" button
   - Fill in order details:
     - **Order Type**: Choose "Remote Order" or "At Shop"
     - **Total Amount**: Total price of vegetables (₹)
     - **Credit Amount**: Amount to be paid on credit (₹)
     - **Items**: List items (one per line)
       - Example:
         ```
         Tomatoes - 2kg
         Potatoes - 5kg
         Onions - 3kg
         ```
     - **Notes**: Any additional notes (optional)
   - Click "Create Order"

4. **View Order Status**
   - Orders table shows all your orders
   - Status can be: `pending`, `approved`, `rejected`, or `completed`
   - Wait for shopkeeper to approve/reject

### 4. Shopkeeper Workflow

#### Receive and Process Orders

1. **Login as Shopkeeper**

2. **View Notifications**
   - Click the bell icon (🔔) in the navbar
   - Red badge shows unread notification count
   - New orders trigger notifications automatically

3. **Review Pending Orders**
   - "Pending Orders" section shows all orders needing attention
   - Each order displays:
     - Order ID
     - Customer name
     - Order type (Remote/At Shop)
     - Total amount and credit amount
     - Status

4. **Verify Order Details**
   - Click "View" button on any order
   - Modal shows complete order details:
     - Customer information
     - Items list
     - Notes
     - Credit amount

5. **Approve or Reject Order**
   - Click "Approve Order" to accept the credit order
   - Click "Reject Order" to reject it
   - Rejected orders will reverse the credit amount

6. **Monitor Customer Credits**
   - "Customers Credit Summary" table shows:
     - All customers
     - Their credit limits
     - Current outstanding credit
     - Available credit

### 5. Admin Workflow

#### Manage System

1. **Login as Admin**
   - Use default credentials: `admin` / `admin123`

2. **View Dashboard**
   - See system-wide statistics:
     - Total customers
     - Total orders
     - Total credit outstanding
     - Pending orders count

3. **View All Users**
   - See all registered users (admin, shopkeeper, customer)
   - View their details and roles

4. **Manage Customer Credit Limits**
   - Go to "Customers Credit Management" section
   - Click "Set Limit" for any customer
   - Enter new credit limit
   - Click "Update"

## Key Features

### Real-time Notifications
- Shopkeepers receive notifications when customers place orders
- Customers receive notifications when order status changes
- Notifications update every 5 seconds (polling)
- WebSocket support for instant updates (optional)

### Credit Management
- Automatic credit tracking
- Credit limit enforcement
- Payment recording capability
- Credit history tracking

### Order Management
- Remote and at-shop orders
- Order status tracking
- Order history
- Detailed order information

## Tips

1. **Credit Limits**: Set appropriate credit limits for customers to manage risk
2. **Order Verification**: Always verify customer details before approving credit orders
3. **Notifications**: Keep notifications panel open to stay updated
4. **Regular Updates**: Check pending orders regularly to maintain good customer service

## Troubleshooting

### Cannot login
- Check username and password are correct
- Make sure backend server is running
- Check browser console for errors

### Notifications not showing
- Refresh the page
- Check if backend is running
- Verify WebSocket connection (if using WebSocket)

### Orders not appearing
- Check if customer is logged in
- Verify shopkeeper account exists
- Check database connection

### Credit calculations seem wrong
- Check credit limit is set correctly
- Verify payment records
- Review credit history

## Support

For issues or questions, refer to the main README.md file or create an issue in the repository.

