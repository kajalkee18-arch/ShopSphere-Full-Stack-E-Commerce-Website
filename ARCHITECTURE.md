# System Architecture Document
## Project Name: ShopSphere
**Document Version:** 1.0.0  
**Target Stack:** React.js, Tailwind CSS, Node.js, Express.js, MongoDB, Mongoose  

---

## 1. High-Level Architectural Overview

ShopSphere is built using the industry-standard **MERN (MongoDB, Express.js, React.js, Node.js)** architectural pattern following a decoupled, client-server model.

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Frontend)"]
        Browser["User Browser (Desktop/Mobile)"]
        ReactApp["React 18 + Vite SPA"]
        Tailwind["Tailwind CSS System"]
        State["Zustand / Context Store (Auth, Cart, UI)"]
        Browser --> ReactApp
        ReactApp --- Tailwind
        ReactApp --- State
    end

    subgraph APILayer ["API & Business Logic (Backend)"]
        Express["Express.js Server (Node.js)"]
        Middlewares["Security Middlewares (CORS, Helmet, RateLimiter)"]
        AuthGuard["Auth & Role Guards (JWT Middleware)"]
        Controllers["Controllers (Users, Products, Orders, Admin)"]
        PaymentAdapter["Modular Payment Adapter (COD / Razorpay / Stripe)"]
        
        Express --> Middlewares --> AuthGuard --> Controllers
        Controllers --> PaymentAdapter
    end

    subgraph DataLayer ["Data & Storage Layer"]
        MongoDB[("MongoDB Database (Mongoose ODM)")]
        MediaStorage["Local Storage / Cloudinary (Product Images)"]
    end

    ReactApp -- "HTTPS REST API (JSON)" --> Express
    Controllers -- "Mongoose Models" --> MongoDB
    Controllers -- "Uploads" --> MediaStorage
```

---

## 2. Architectural Layers in Beginner-Friendly Language

### 2.1 The Client Layer (Frontend)
- **Role:** What the user sees and interacts with.
- **Built with:** React 18, Vite (for blazing fast build times), and Tailwind CSS.
- **How it works:**
  - **Single Page Application (SPA):** Instead of reloading the whole page when clicking a link, React instantly swaps out components.
  - **Component-Driven Design:** Buttons, input boxes, product cards, and navigation bars are reusable building blocks.
  - **Global State Management:** Keeps track of who is logged in and what items are in the shopping cart across all pages without losing data on navigation.

### 2.2 The Server Layer (Backend API)
- **Role:** The brain and security guard of the application.
- **Built with:** Node.js runtime and Express.js framework.
- **How it works:**
  - **RESTful Endpoints:** Serves standardized JSON data when requested by the frontend (e.g. `GET /api/v1/products`).
  - **Layered Architecture:**
    1. **Routes:** Directs the incoming URL to the right controller.
    2. **Middlewares:** Checks security, validates user input, and verifies JWT tokens before letting requests reach business logic.
    3. **Controllers:** Handles logic (e.g. checking if stock is available, creating an order).
    4. **Models:** Defines database structure via Mongoose schemas.

### 2.3 The Data Layer (Database)
- **Role:** The permanent vault for your store's data.
- **Built with:** MongoDB (NoSQL Document Store) and Mongoose ODM.
- **How it works:** Data is stored in flexible, JSON-like documents grouped into collections (`users`, `products`, `orders`, `categories`, `reviews`).

---

## 3. Pluggable Payment Adapter Pattern

To accommodate running in **Cash on Delivery (COD)** mode right now while allowing zero-friction switching to **Razorpay** or **Stripe** when deploying to production, ShopSphere employs the **Adapter Pattern**:

```mermaid
flowchart LR
    CheckoutController["Checkout Controller"] --> PaymentService["Payment Service Interface"]
    PaymentService --> ProviderCheck{"Active Provider in .env"}
    ProviderCheck -- "mode: 'cod'" --> CODAdapter["COD Handler (Instant Order Creation, Payment: Pending)"]
    ProviderCheck -- "mode: 'razerpay'" --> RazorpayAdapter["Razorpay Gateway (Order Creation & Webhook Signature Verification)"]
    ProviderCheck -- "mode: 'stripe'" --> StripeAdapter["Stripe Gateway (Payment Intent & Confirmation)"]
```

### How the Switch Works in Code:
- The system reads an environment variable `PAYMENT_METHOD_DEFAULT=COD`.
- When ready for production deployment:
  1. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env`.
  2. Set `PAYMENT_GATEWAY_ACTIVE=RAZORPAY`.
  3. The checkout UI and backend seamlessly unlock Razorpay popup verification without altering the underlying order or database schema!

---

## 4. Authentication & Authorization Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Customer / Admin
    participant Client as React App
    participant API as Express Auth API
    participant DB as MongoDB

    User->>Client: Enters Email & Password
    Client->>API: POST /api/v1/auth/login
    API->>DB: Find User by Email
    DB-->>API: Returns User Document (with hashed password)
    API->>API: Compare password using bcrypt.compare()
    alt Credentials Invalid
        API-->>Client: 401 Unauthorized ("Invalid credentials")
    else Credentials Valid
        API->>API: Generate JWT token with payload { id, role }
        API-->>Client: 200 OK + JWT Token + User Profile Info
        Client->>Client: Store Token in secure storage & Auth State
    end

    Note over Client,API: Accessing Protected & Admin Routes
    Client->>API: Request with Header: Authorization: Bearer <token>
    API->>API: Verify JWT signature & expiration
    API->>API: Check Role Middleware (e.g. role === 'admin')
    alt Role Not Admin for Admin Route
        API-->>Client: 403 Forbidden ("Admin access required")
    else Authorized
        API->>DB: Perform Requested Operation
        DB-->>API: Result Data
        API-->>Client: 200 OK + Data
    end
```

---

## 5. Security Architecture

1. **Password Encryption:**
   - Passwords are never stored in plain text.
   - Hashed using `bcryptjs` with salt rounds = 10 before saving to the database.

2. **Route Protection & Role-Based Access Control (RBAC):**
   - **Public Routes:** Home, Product Catalog, Product Details, Login, Register.
   - **Protected Routes (Customer):** Cart, Wishlist, Checkout, Profile, My Orders.
   - **Admin Protected Routes:** Dashboard, Product CRUD, Category Management, Order Processing, User Management.

3. **Input Sanitization & Validation:**
   - All incoming request bodies are validated using validation schemas (e.g. express-validator / Joi) to reject invalid payloads early.
   - Prevention of NoSQL query injection by casting and sanitizing MongoDB queries.

4. **HTTP Security Headers & CORS:**
   - `helmet` middleware sets secure HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.).
   - `cors` configured to only allow requests from whitelisted frontend origins.

5. **Rate Limiting:**
   - `express-rate-limit` prevents brute-force login attempts and API abuse.

---

## 6. Frontend Routing & Component Hierarchy

```mermaid
graph TD
    App["App Root (BrowserRouter, AuthProvider, CartProvider)"]
    Navbar["Universal Navbar (Logo, Search, NavLinks, CartBadge, UserMenu)"]
    Footer["Footer (Links, Newsletter, Socials, Copyright)"]
    
    App --> Navbar
    App --> RoutesContainer["Routes Container"]
    App --> Footer

    subgraph PublicRoutes ["Public Pages"]
        Home["HomePage (Hero, Categories, FeaturedProducts)"]
        Catalog["ProductListingPage (Filters, Search, ProductGrid)"]
        PDP["ProductDetailsPage (Gallery, Info, Reviews, AddToCart)"]
        AuthPages["Login & Register Pages"]
    end

    subgraph CustomerRoutes ["Protected Customer Pages"]
        Cart["CartPage"]
        Wishlist["WishlistPage"]
        Checkout["CheckoutPage (Address, Payment, Review)"]
        Profile["ProfilePage & OrderHistoryPage"]
    end

    subgraph AdminRoutes ["Protected Admin Pages (AdminLayout)"]
        AdminDashboard["Dashboard Overview (Metrics & Charts)"]
        AdminProducts["Products Management (List, Add, Edit)"]
        AdminCategories["Category Management"]
        AdminOrders["Orders Management (Status Updater)"]
        AdminUsers["Users Management"]
    end

    RoutesContainer --> PublicRoutes
    RoutesContainer --> CustomerRoutes
    RoutesContainer --> AdminRoutes
```

