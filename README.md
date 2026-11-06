# ShopSphere 🛍️ — Modern Full-Stack E-Commerce Platform

ShopSphere is a high-performance, full-stack e-commerce web application built using **React 18**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB**. It delivers an elegant shopping experience for customers and a full-featured management portal for store administrators.

---

## 🌟 Key Features

### 🛒 Customer Portal
- **Discovery:** Hero promotions, category navigation pills, trending and featured products.
- **Catalog Browsing:** Instant debounced keyword search, category filters, interactive price range slider, minimum star rating, and multi-option sorting.
- **Product Details (PDP):** Multi-image thumbnail gallery, live stock indicators, quantity picker, detailed specs, and verified customer reviews.
- **Cart & Wishlist:** Real-time synced cart and persistent wishlist with one-click "Move to Cart".
- **Checkout Flow:** Multi-step wizard (Saved address book or new delivery address, payment method selection, order review).
- **Payment Method:** **Cash on Delivery (COD)** default with doorstep verification. Built with a pluggable adapter ready to switch to **Razorpay** in production.
- **Account & History:** Profile management, saved addresses, chronological order tracking with status updates.

### 🛡️ Admin Dashboard (`/admin`)
- **Real-Time Analytics:** Lifetime store revenue, order volume, customer counts, and low-stock warnings (stock ≤ 5 units).
- **Interactive Sales Charts:** Revenue and sales volume trend visualization powered by Recharts.
- **Product Management:** Full CRUD operations (Add, Edit, Delete), stock updates, and image URL handling.
- **Category Management:** Create, edit, and delete store categories.
- **Order Management:** View orders, inspect customer shipping details, update lifecycle statuses (`Pending` → `Processing` → `Shipped` → `Delivered`), and toggle **"Mark as Paid"** for COD collections.
- **User Moderation:** View registered users and deactivate/activate accounts.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js:** v18.0.0 or later (`node -v`)
- **MongoDB:** Local MongoDB instance running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection string.

### 2. Environment Configuration
The backend environment is configured in `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shopsphere
JWT_SECRET=shopsphere_super_secret_jwt_key_2026_xyz_!@#
JWT_EXPIRES_IN=7d
PAYMENT_GATEWAY_ACTIVE=COD
CLIENT_URL=http://localhost:5173
```

The frontend environment is configured in `client/.env`:
```env
VITE_API_BASE_URL=/api/v1
```

### 3. Seed Demo Data
To populate the database with categories, rich catalog products with HD imagery, verified reviews, and demo users:
```bash
node server/seeder.js
```

### 4. Start Development Servers
From the project root:
```bash
# Option A: Start both Backend and Frontend concurrently
npm run dev

# Option B: Run separately in two terminals
# Terminal 1 (Backend API on port 5000):
node server/server.js

# Terminal 2 (React Frontend on port 5173):
npm run dev --prefix client
```

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Demo Login Credentials

The login page features one-click demo credentials buttons:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Store Admin** | `admin@shopsphere.com` | `Admin@123` | Full Admin Portal (`/admin`) + Customer Store |
| **Customer** | `user@shopsphere.com` | `User@123` | Storefront, Cart, Checkout, Order History |

---

## 💳 Switching from COD to Razorpay in Production

ShopSphere is designed using the **Payment Adapter Pattern** (`server/services/paymentAdapter.js`). You can run in Cash on Delivery mode today, and when you are ready to deploy to production, simply:

1. Obtain your **Key ID** and **Key Secret** from your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Update your `server/.env` file:
   ```env
   PAYMENT_GATEWAY_ACTIVE=RAZORPAY
   RAZORPAY_KEY_ID=rzp_live_your_actual_key_id
   RAZORPAY_KEY_SECRET=your_actual_secret_key
   ```
3. Restart the server. The checkout system will activate online payment validation without modifying existing database schemas or order processing logic!

---

## 📁 Architectural Documentation

Full project specifications are stored in the root directory:
- [PRD.md](PRD.md) — Comprehensive product requirements
- [ARCHITECTURE.md](ARCHITECTURE.md) — System, security & payment architecture
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) — MongoDB schemas, Mongoose models, indexes & ER diagram
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) — Complete RESTful API endpoints contract
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — Phased development sequence & quality checklists
- [PROJECT_FOLDER_STRUCTURE.md](PROJECT_FOLDER_STRUCTURE.md) — Directory tree and component guide

---

## 📄 License
MIT License. Built for ShopSphere E-Commerce.

