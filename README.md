# 🥬 Credit Keeper

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React Version](https://img.shields.io/badge/react-18.2.0-blue.svg)
![Status](https://img.shields.io/badge/status-ready-green.svg)

**A modern, full-stack credit management system designed specifically for vegetable shops**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Introduction

**Credit Keeper** is a comprehensive web application that streamlines credit management for vegetable shops. It provides a seamless experience for shopkeepers, customers, and administrators to manage credit transactions, track orders, and maintain financial records.

### 🎯 Problem Statement

Traditional vegetable shops often struggle with:
- **Manual credit tracking** - Prone to errors and time-consuming
- **Lack of transparency** - Customers can't easily check their credit status
- **No remote ordering** - Customers must visit the shop to place credit orders
- **Inefficient verification** - Shopkeepers can't easily verify customer details and credit amounts

### ✨ Solution

Credit Keeper addresses these challenges by providing:
- **Three-role portal system** - Separate interfaces for Admin, Shopkeeper, and Customer
- **Real-time notifications** - Instant alerts when orders are placed or status changes
- **Credit limit management** - Automated tracking and limit enforcement
- **Remote ordering capability** - Customers can place orders from anywhere
- **Digital verification** - Shopkeepers can verify and approve orders with customer details

### 🚀 Key Highlights

- ✅ **100% Free & Open Source** - Built with completely free tools
- ✅ **Role-Based Access Control** - Secure authentication with JWT
- ✅ **Real-Time Updates** - WebSocket support for instant notifications
- ✅ **Easy Setup** - SQLite database, no complex configuration needed
- ✅ **Modern UI** - Clean, responsive React interface
- ✅ **Production Ready** - Can be migrated to PostgreSQL for production use

## 🎨 Features

### 👥 Customer Portal

- ✅ **Create Credit Orders** - Place orders remotely or at the shop
- ✅ **Credit Balance Tracking** - Real-time view of credit limit, current credit, and available credit
- ✅ **Order History** - Complete order history with status tracking
- ✅ **Credit Amount Input** - Input credit amount directly when placing orders
- ✅ **Order Status Updates** - Get notified when shopkeeper approves/rejects orders

### 🏪 Shopkeeper Portal

- 🔔 **Real-Time Notifications** - Instant alerts for new credit orders
- ✅ **Order Verification** - View complete order details including customer information
- ✅ **Approve/Reject Orders** - Manage pending orders with one click
- ✅ **Customer Credit Dashboard** - Overview of all customers' credit status
- ✅ **Credit Monitoring** - Track total outstanding credit across all customers
- ✅ **Order Management** - View and manage all pending and approved orders

### 👨‍💼 Admin Portal

- 📊 **Dashboard Analytics** - System-wide statistics and insights
- 👥 **User Management** - Manage all users (admin, shopkeeper, customer)
- 💰 **Credit Limit Management** - Set and update customer credit limits
- 📈 **Financial Overview** - Total credit, pending orders, and customer statistics
- 🔍 **System Monitoring** - Track all system activities and transactions

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (easily migratable to PostgreSQL/MySQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: WebSocket (express-ws)
- **Security**: bcryptjs for password hashing

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern design

### Development Tools
- **Package Manager**: npm
- **Development Server**: nodemon (auto-reload)
- **Build Tool**: Create React App

> **Note**: All tools and libraries used are completely free and open source!

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

#### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
bash setup.sh
```

#### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/credit-keeper.git
   cd credit-keeper
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   npm start
   # or for development (with auto-reload):
   npm run dev
   ```

2. **Start the frontend** (open a new terminal)
   ```bash
   npm run client
   ```

3. **Access the application**
   - 🌐 **Frontend**: http://localhost:3000
   - 🔌 **Backend API**: http://localhost:5000

### Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |

> ⚠️ **Important**: Change the default admin password after first login!

### Creating New Users

1. Navigate to the login page
2. Click "Register"
3. Fill in the required information:
   - Username
   - Email
   - Password
   - **Role** (Customer, Shopkeeper, or Admin)
   - Full Name (optional)
   - Phone (optional)
4. Click "Register"

## 📖 Usage

For detailed usage instructions, see [USAGE.md](./USAGE.md)

### Quick Workflow

1. **Admin** → Create shopkeeper and customer accounts (or use registration)
2. **Admin** → Set credit limits for customers
3. **Customer** → Place credit orders (remote or at shop)
4. **Shopkeeper** → Receive notification, verify order, approve/reject
5. **Customer** → Receive status update notification

## 📁 Project Structure

```
credit-keeper/
├── server/
│   ├── index.js              # Main server file
│   ├── database.js           # Database initialization
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── orders.js         # Order management routes
│   │   ├── credits.js        # Credit management routes
│   │   ├── customers.js      # Customer routes
│   │   ├── admin.js          # Admin routes
│   │   └── notifications.js  # Notification routes
│   └── websocket.js          # WebSocket setup
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── CustomerPortal.js
│   │   │   ├── ShopkeeperPortal.js
│   │   │   └── AdminPortal.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── public/
└── package.json
```

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user | No |
| `GET` | `/api/auth/me` | Get current user | Yes |

### Order Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/orders` | Create new order | Customer |
| `GET` | `/api/orders/customer` | Get customer's orders | Customer |
| `GET` | `/api/orders/shopkeeper` | Get shopkeeper's orders | Shopkeeper |
| `PATCH` | `/api/orders/:id/status` | Update order status | Shopkeeper |

### Credit Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/credits/customer` | Get credit records | Customer |
| `GET` | `/api/credits/customer/summary` | Get credit summary | Customer |
| `GET` | `/api/credits/all` | Get all customers' credits | Shopkeeper, Admin |
| `POST` | `/api/credits/payment` | Record payment | Shopkeeper, Admin |

### Customer Management Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/customers` | Get all customers | Shopkeeper, Admin |
| `GET` | `/api/customers/:id` | Get customer details | Shopkeeper, Admin |
| `PATCH` | `/api/customers/:id/credit-limit` | Update credit limit | Shopkeeper, Admin |

### Admin Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/admin/dashboard` | Get dashboard statistics | Admin |
| `GET` | `/api/admin/users` | Get all users | Admin |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/notifications` | Get notifications | Yes |
| `PATCH` | `/api/notifications/:id/read` | Mark notification as read | Yes |
| `PATCH` | `/api/notifications/read-all` | Mark all as read | Yes |
| `GET` | `/api/notifications/unread-count` | Get unread count | Yes |

### WebSocket Endpoint

- **Endpoint**: `ws://localhost:5000/ws?userId=<user_id>`
- **Purpose**: Real-time notifications
- **Usage**: Connect to receive instant order updates

## 🗄️ Database Schema

The application uses SQLite with the following tables:

| Table | Description |
|-------|-------------|
| `users` | User accounts (admin, shopkeeper, customer) with authentication |
| `customers` | Customer-specific information (credit limits, current credit, address) |
| `orders` | Order records with status tracking (pending, approved, rejected, completed) |
| `credit_records` | Complete credit transaction history (credits and payments) |
| `notifications` | Notification system for real-time updates |

### Key Relationships

- `customers.user_id` → `users.id`
- `orders.customer_id` → `users.id`
- `orders.shopkeeper_id` → `users.id`
- `credit_records.customer_id` → `users.id`
- `credit_records.order_id` → `orders.id`
- `notifications.user_id` → `users.id`
- `notifications.order_id` → `orders.id`

## 🎯 Roadmap & Future Enhancements

### Planned Features
- [ ] Email/SMS notifications
- [ ] Payment gateway integration
- [ ] Advanced reporting and analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Inventory management system
- [ ] Multi-shop support
- [ ] Export to PDF/Excel
- [ ] Barcode scanning for products
- [ ] Customer loyalty program
- [ ] Automated reminders for due payments
- [ ] Multi-language support

### Contributing
We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

**How to contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Issue**: Cannot connect to backend
- **Solution**: Make sure the backend server is running on port 5000

**Issue**: Database errors
- **Solution**: Delete `server/database.sqlite` and restart the server (it will recreate)

**Issue**: CORS errors
- **Solution**: Ensure the frontend proxy is set to `http://localhost:5000` in `client/package.json`

**Issue**: Port already in use
- **Solution**: Change the port in `.env` file or kill the process using the port

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- 📧 **Email**: [Your Email]
- 💬 **Issues**: [GitHub Issues](https://github.com/yourusername/credit-keeper/issues)
- 📖 **Documentation**: [Full Documentation](./USAGE.md)

## 🙏 Acknowledgments

- Built with love for vegetable shop owners
- Special thanks to all open-source contributors
- Inspired by the need for digital credit management in local businesses

---

<div align="center">

**Made with ❤️ for vegetable shop owners**

⭐ Star this repo if you find it helpful!

[⬆ Back to Top](#-credit-keeper)

</div>

