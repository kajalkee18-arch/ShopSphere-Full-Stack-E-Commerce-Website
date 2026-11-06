# Product Requirements Document (PRD)
## Project Name: ShopSphere
**Document Version:** 1.0.0  
**Status:** Ready for Review  
**Author:** DeepMind / Antigravity Engineering  

---

## 1. Executive Summary
**ShopSphere** is a modern, high-performance, full-stack e-commerce web platform designed to provide a seamless, premium shopping experience for retail customers while equipping store administrators with a comprehensive management dashboard. 

The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS for utility-first styling. The platform emphasizes responsiveness, intuitive navigation, rapid checkout, secure transactions, and robust data integrity.

---

## 2. Target Audience & User Personas

### 2.1 Retail Customer (Shopper)
- **Profile:** Individuals looking for products online across desktop, tablet, and mobile devices.
- **Key Goals:**
  - Discover products easily via categorized browsing, keyword search, and granular filters.
  - Review detailed product specifications, high-definition imagery, and authentic verified customer ratings.
  - Manage a persistent shopping cart and personal wishlist across sessions.
  - Complete checkout with minimal friction using credit/debit cards or Cash on Delivery.
  - Track orders in real-time from placement to delivery.

### 2.2 Store Administrator (Admin)
- **Profile:** Store owners, inventory managers, and customer support leads.
- **Key Goals:**
  - Monitor key business metrics (revenue, orders, active customers, low-stock alerts) at a glance.
  - Create, update, and manage inventory items with categories, prices, discounts, and multi-image uploads.
  - Process orders through defined lifecycle states (Pending, Processing, Shipped, Delivered, Cancelled).
  - Oversee registered customer accounts and moderate customer reviews.

---

## 3. Product Scope & Functional Requirements

### 3.1 Customer Portal Requirements

#### 3.1.1 Authentication & Profile
- **Registration & Login:** Secure email/password authentication with JWT (JSON Web Tokens).
- **Password Security:** Salted and hashed passwords using `bcryptjs`.
- **User Profile:** Manage personal info (Full Name, Phone Number, Avatar).
- **Address Book:** Support multiple saved shipping addresses with a default selection flag.
- **Order History:** View chronological list of historical orders, order summaries, payment statuses, and detailed invoice receipts.

#### 3.1.2 Product Discovery & Navigation
- **Home Page:**
  - Hero banner carousel showcasing featured promotions and seasonal campaigns.
  - Quick-access category pills/cards.
  - "Trending Products" and "New Arrivals" dynamic showcases.
  - Value proposition blocks (Free Shipping, Secure Payments, 24/7 Support).
- **Catalog & Search:**
  - Full-text search with instant query debounce.
  - Granular filters: Category, Price Range (dual-slider), Minimum Star Rating, Availability (in-stock only).
  - Sorting options: Price Low-to-High, Price High-to-Low, Top Rated, Newest First.
  - Responsive pagination or customizable items-per-page.
- **Product Details Page (PDP):**
  - High-resolution multi-image gallery with thumbnail preview and zoom capability.
  - Product title, brand, SKU/Model, price, discount badge, and live stock indicator.
  - Rich text product description and feature highlights.
  - Quantity selector with maximum stock validation.
  - Customer review summary (average rating, rating breakdown chart) and verified purchase reviews.
  - Related/recommended products carousel.

#### 3.1.3 Cart & Wishlist
- **Shopping Cart:**
  - Persistent cart synced with backend for authenticated users (with local storage sync for guests before login).
  - Real-time stock reservation check.
  - Quantity increment, decrement, and item removal.
  - Subtotal, estimated tax, shipping fee calculation, and promo/discount code support.
- **Wishlist:**
  - One-click heart toggle on product cards and PDP.
  - Dedicated wishlist view with quick "Move to Cart" action.

#### 3.1.4 Checkout & Payment
- **Multi-Step Checkout Flow:**
  - **Step 1 - Shipping Address:** Select from existing addresses or input a new one.
  - **Step 2 - Payment Selection:** 
    - **Current Active Mode (Development):** Cash on Delivery (COD) / Direct Mock Confirmation (no complex external API keys required to test).
    - **Modular / Pluggable Architecture (Production Ready):** Ready for seamless switch to Razorpay / Stripe via environment configuration (`PAYMENT_GATEWAY_PROVIDER=COD|RAZORPAY|STRIPE`).
  - **Step 3 - Order Review:** Verify order items, shipping costs, taxes, and final payable amount.
- **Order Placement:**
  - Atomic transaction: Deduct inventory stock upon order placement.
  - Generation of unique Order ID and tracking details.
  - Email-friendly order confirmation receipt page.

---

### 3.2 Admin Dashboard Requirements

#### 3.2.1 Dashboard Analytics
- **Summary Metrics (KPI Cards):**
  - Total Lifetime Revenue (formatted currency).
  - Total Orders Count (with daily/weekly delta).
  - Total Registered Users.
  - Total Active Products & Low Stock Warnings (stock ≤ 5 units).
- **Visual Analytics:**
  - Revenue & Sales Trend chart (monthly and weekly breakdown using Recharts).
  - Order status distribution (Pie/Doughnut chart: Pending, Processing, Shipped, Delivered, Cancelled).
  - Top 5 best-selling products leaderboard.

#### 3.2.2 Product Management (CRUD)
- View paginated list of all products with search, category filter, and stock status.
- Add new product with fields: Title, Description, Category, Price, Discount Price, Stock, SKU, and multiple image upload.
- Edit existing product details and replace/add images.
- Delete or archive products (prevent hard-delete if referenced in active orders).

#### 3.2.3 Category Management (CRUD)
- Create new product categories with name, URL-friendly slug, image icon, and description.
- Edit category details.
- Delete category (safeguarded: prevent deletion if assigned to active products).

#### 3.2.4 Order Management
- View all platform orders with filters by status, payment state, and date range.
- View granular order detail: customer info, shipping address, ordered items, payment receipt.
- Update order lifecycle status: `Pending` → `Processing` → `Shipped` → `Delivered` → `Cancelled`.
- Mark payment status for manual transactions (e.g., Cash on Delivery collected).

#### 3.2.5 User Management
- View all registered customers with search and sort.
- View user order history and registration dates.
- Admin action: Toggle user account status (Active / Blocked).
- Role assignment (promote eligible users to Admin).

---

## 4. Non-Functional Requirements (NFRs)

### 4.1 Performance & Responsiveness
- **Page Load Time:** First Contentful Paint (FCP) < 1.5 seconds on broadband connections.
- **Client Bundle Size:** Optimized via Vite code-splitting and dynamic imports for route-based lazy loading.
- **Responsive Layout:** 100% mobile, tablet, and desktop responsive using Tailwind CSS breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).

### 4.2 Security & Compliance
- **Data Protection:** All passwords encrypted with `bcryptjs` (minimum 10 salt rounds).
- **API Security:** 
  - JWT tokens signed with secure secrets and sensible expiry (`7d`).
  - Role-based authorization middleware protecting all `/api/v1/admin/*` endpoints.
  - Rate limiting via `express-rate-limit` to prevent brute force attacks on auth routes.
  - Security headers using `helmet` and strict CORS policy.
  - Sanitization of user input to prevent NoSQL injection and Cross-Site Scripting (XSS).

### 4.3 Reliability & Error Handling
- Consistent standard JSON error response across all endpoints: `{ success: false, message: "...", errors: [] }`.
- Graceful client-side error states with fallback UI, empty states, and toast notifications (via `react-hot-toast` or `react-toastify`).

---

## 5. Technology Stack Summary
| Layer | Technologies Selected |
| :--- | :--- |
| **Frontend UI** | React.js (v18+), Vite, Tailwind CSS, Lucide React (Icons) |
| **Client Routing & State** | React Router DOM (v6), React Context API / Zustand, Axios |
| **Backend Runtime & Framework** | Node.js (v18+ LTS), Express.js |
| **Database & ODM** | MongoDB, Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), `bcryptjs` |
| **Payments** | Stripe API / Stripe Elements & Cash on Delivery (COD) |
| **File / Media Storage** | Multer + Cloudinary (or local static upload fallback) |
| **Version Control** | Git & GitHub |

---

## 6. Success Criteria
1. Full end-to-end user journey verified: Register → Browse → Filter → Add to Cart → Checkout → Pay → Track.
2. Complete admin lifecycle verified: Login → Analytics Review → Create Product → Update Category → Process Order.
3. Clean zero-vulnerability security baseline and consistent API response contracts.
4. Clean code architecture adhering to separation of concerns (MVC backend, component-driven frontend).
