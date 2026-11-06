# Project Folder Structure & Architecture
## Project Name: ShopSphere
**Repository Architecture:** Unified Client-Server Architecture  
**Frontend Framework:** React 18 (Vite + Tailwind CSS)  
**Backend Framework:** Node.js + Express.js + Mongoose  

---

## 1. Complete Directory Tree

```
Shopsphere/
│
├── PRD.md                           # Product Requirements Document
├── ARCHITECTURE.md                  # System & Security Architecture
├── DATABASE_SCHEMA.md               # MongoDB & Mongoose Schemas & Indexes
├── API_DOCUMENTATION.md             # REST API Endpoints Specification
├── IMPLEMENTATION_PLAN.md           # Phased Development Sequence
├── PROJECT_FOLDER_STRUCTURE.md      # Folder Structure Guide (This document)
├── .gitignore                       # Ignored files (node_modules, .env, uploads)
├── README.md                        # Master Project Documentation & Run Guide
├── package.json                     # Root orchestrator scripts (concurrently run)
│
├── server/                          # Backend Application (Node.js & Express)
│   ├── config/
│   │   └── db.js                    # MongoDB Mongoose connection handler
│   ├── controllers/
│   │   ├── authController.js        # User signup, login, profile, addresses
│   │   ├── categoryController.js    # Category listing & admin CRUD
│   │   ├── productController.js     # Search, filter, product details & CRUD
│   │   ├── reviewController.js      # Customer reviews & ratings
│   │   ├── cartController.js        # Server-persisted cart operations
│   │   ├── wishlistController.js    # Wishlist bookmarking & retrieval
│   │   ├── orderController.js       # Checkout, order placement & my-orders
│   │   └── adminController.js       # Admin analytics, user & order management
│   ├── middlewares/
│   │   ├── authMiddleware.js        # JWT verify & role protection (protect, adminOnly)
│   │   ├── errorMiddleware.js       # Global 404 & unified error response handler
│   │   ├── uploadMiddleware.js      # Multer file upload configuration
│   │   └── validateMiddleware.js    # Request body sanitization & validation
│   ├── models/
│   │   ├── User.js                  # User schema with bcrypt password hashing
│   │   ├── Category.js              # Product category schema
│   │   ├── Product.js               # Product catalog item schema with text index
│   │   ├── Review.js                # Customer review & star rating schema
│   │   ├── Cart.js                  # Persistent cart schema
│   │   ├── Wishlist.js              # Bookmarked products schema
│   │   └── Order.js                 # Complete customer order & status schema
│   ├── routes/
│   │   ├── authRoutes.js            # /api/v1/auth
│   │   ├── categoryRoutes.js        # /api/v1/categories
│   │   ├── productRoutes.js         # /api/v1/products
│   │   ├── reviewRoutes.js          # /api/v1/reviews
│   │   ├── cartRoutes.js            # /api/v1/cart
│   │   ├── wishlistRoutes.js        # /api/v1/wishlist
│   │   ├── orderRoutes.js           # /api/v1/orders
│   │   └── adminRoutes.js           # /api/v1/admin
│   ├── services/
│   │   └── paymentAdapter.js        # Pluggable payment interface (COD / Razorpay / Stripe)
│   ├── utils/
│   │   ├── generateToken.js         # JWT signing helper
│   │   └── apiFeatures.js           # Reusable search, filter, sort, paginate query helper
│   ├── uploads/                     # Local storage directory for uploaded product images
│   ├── seeder.js                    # Database seed script for dummy demo data
│   ├── .env.example                 # Environment variables blueprint
│   ├── package.json                 # Backend dependencies & scripts
│   └── server.js                    # Express application entrypoint
│
└── client/                          # Frontend Application (React + Vite + Tailwind CSS)
    ├── public/
    │   ├── favicon.ico              # ShopSphere favicon
    │   └── placeholder.png          # Fallback image for missing product photos
    ├── src/
    │   ├── assets/                  # Static graphics, SVG badges, banners
    │   ├── components/              # Modular, reusable UI components
    │   │   ├── common/
    │   │   │   ├── Button.jsx       # Reusable button with variants & loading state
    │   │   │   ├── Input.jsx        # Styled text/password/number inputs with error labels
    │   │   │   ├── Badge.jsx        # Status pills (In Stock, Discount %, Order Status)
    │   │   │   ├── Modal.jsx        # Generic accessible dialog overlay
    │   │   │   ├── Spinner.jsx      # Animated SVG loading spinner
    │   │   │   ├── RatingStars.jsx  # Interactive / Read-only 5-star rating visualizer
    │   │   │   └── Pagination.jsx   # Page navigation bar
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx       # Responsive header with search, cart badge, menu
    │   │   │   ├── Footer.jsx       # Footer with store policies, links, copyright
    │   │   │   ├── CustomerLayout.jsx # Wrapper with Navbar & Footer
    │   │   │   ├── AdminLayout.jsx    # Admin layout with sidebar navigation
    │   │   │   └── AdminSidebar.jsx   # Collapsible admin sidebar with active links
    │   │   ├── product/
    │   │   │   ├── ProductCard.jsx    # Card with image, price, discount, quick-actions
    │   │   │   ├── ProductGrid.jsx    # Responsive grid layout for catalog items
    │   │   │   ├── ProductFilters.jsx # Sidebar: category checklist, price slider, ratings
    │   │   │   ├── ImageGallery.jsx   # Multi-image preview with active thumbnail
    │   │   │   └── ReviewSection.jsx  # Reviews list + submission form
    │   │   ├── cart/
    │   │   │   ├── CartItem.jsx       # Item row with quantity stepper & remove button
    │   │   │   └── OrderSummary.jsx   # Subtotal, tax, shipping, discount calculation card
    │   │   └── admin/
    │   │       ├── StatCard.jsx       # KPI card (Total sales, orders, users, low-stock)
    │   │       ├── SalesChart.jsx     # Recharts revenue trend line/bar graph
    │   │       └── OrderStatusBadge.jsx # Color-coded order lifecycle badge
    │   ├── context/
    │   │   ├── AuthContext.jsx        # User state, token, login, register, logout
    │   │   ├── CartContext.jsx        # Cart state, item count, add/remove actions
    │   │   └── WishlistContext.jsx    # Wishlist state & toggle action
    │   ├── hooks/
    │   │   ├── useAuth.js             # Hook to consume AuthContext
    │   │   ├── useCart.js             # Hook to consume CartContext
    │   │   └── useDebounce.js         # Debounces keyword inputs for live search
    │   ├── pages/
    │   │   ├── customer/
    │   │   │   ├── HomePage.jsx             # Hero, Category cards, Featured items
    │   │   │   ├── ProductListingPage.jsx   # Catalog with search, filter, and pagination
    │   │   │   ├── ProductDetailPage.jsx    # PDP with gallery, specs, reviews
    │   │   │   ├── CartPage.jsx             # Cart items overview & checkout button
    │   │   │   ├── WishlistPage.jsx         # Bookmarked items with "Move to Cart"
    │   │   │   ├── CheckoutPage.jsx         # Multi-step checkout (Address, COD, Review)
    │   │   │   ├── OrderSuccessPage.jsx     # Post-order confirmation with Order ID
    │   │   │   ├── ProfilePage.jsx          # User info & address book manager
    │   │   │   ├── OrderHistoryPage.jsx     # Customer past orders & status timeline
    │   │   │   ├── LoginPage.jsx            # Customer / Admin login form
    │   │   │   ├── RegisterPage.jsx         # New customer registration form
    │   │   │   └── NotFoundPage.jsx         # 404 page with navigation back home
    │   │   └── admin/
    │   │       ├── AdminDashboardPage.jsx   # Analytics cards & sales chart
    │   │       ├── AdminProductsPage.jsx    # Product CRUD table & add/edit modal
    │   │       ├── AdminCategoriesPage.jsx  # Category management table & modal
    │   │       ├── AdminOrdersPage.jsx      # Order list, status updater, COD pay toggle
    │   │       └── AdminUsersPage.jsx       # Registered users list & block/unblock
    │   ├── routes/
    │   │   ├── AppRoutes.jsx          # Main route definitions
    │   │   ├── ProtectedRoute.jsx     # Route guard requiring customer login
    │   │   └── AdminRoute.jsx         # Route guard requiring admin role
    │   ├── services/
    │   │   ├── api.js                 # Axios instance with base URL & JWT interceptor
    │   │   ├── authService.js         # Auth API calls (login, register, profile)
    │   │   ├── productService.js      # Catalog & review API calls
    │   │   ├── orderService.js        # Checkout & order API calls
    │   │   └── adminService.js        # Admin metrics, product & order management calls
    │   ├── utils/
    │   │   ├── formatCurrency.js      # Formats numbers to Indian Rupees (₹) or USD ($)
    │   │   └── formatDate.js          # Human-friendly date formatting (e.g., Nov 6, 2026)
    │   ├── App.jsx                    # Root App component with context providers
    │   ├── main.jsx                   # React DOM render entrypoint
    │   └── index.css                  # Tailwind directives and custom scrollbar styles
    ├── .env.example                   # Client environment variables blueprint
    ├── index.html                     # HTML root template
    ├── tailwind.config.js             # Tailwind CSS custom themes & breakpoints
    ├── postcss.config.js              # PostCSS plugins for Tailwind
    ├── vite.config.js                 # Vite bundler configuration & proxy
    └── package.json                   # Client dependencies (React, Lucide, Axios, etc.)
```

---

## 2. Explanation of Key Directories & Architectural Separation

### 2.1 Backend Separation of Concerns (MVC Pattern)
- **`models/` (Data Tier):** Defines what the data looks like and enforces database-level integrity (types, required fields, unique indexes).
- **`controllers/` (Logic Tier):** Contains the business rules. For example, in `orderController.js`, when a customer places a COD order, the controller checks whether the product is in stock, calculates taxes and shipping, deducts stock, and saves the order.
- **`routes/` (Routing Tier):** Maps URLs (like `POST /api/v1/orders`) to their corresponding controller function, applying security middlewares in sequence.
- **`middlewares/` (Gatekeepers):** Protects routes. `authMiddleware.js` verifies the JWT token; if invalid or expired, the request is stopped immediately before it ever touches business logic.
- **`services/paymentAdapter.js`:** Encapsulates the payment mechanism. It allows the entire system to run in Cash on Delivery (COD) mode today, with zero code changes required in controllers when flipping to Razorpay for production.

### 2.2 Frontend Modular Component Architecture
- **`context/`:** Avoids "prop drilling" by sharing global state (user credentials, cart contents, wishlist items) across any page in the application.
- **`services/api.js`:** An Axios client configured with an automatic interceptor that attaches the `Authorization: Bearer <token>` header to all outgoing requests and automatically catches 401 unauthorized errors.
- **`routes/ProtectedRoute.jsx` & `AdminRoute.jsx`:** Route wrapper components that ensure only authenticated users can access the cart/checkout, and only administrators can access the admin dashboard.

