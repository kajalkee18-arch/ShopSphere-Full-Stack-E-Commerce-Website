# RESTful API Documentation
## Project Name: ShopSphere
**API Version:** v1  
**Base URL:** `http://localhost:5000/api/v1`  
**Content-Type:** `application/json`  

---

## 1. Standard Request & Response Structure

### 1.1 Authentication Header
For all protected customer and admin routes, include the JWT token in the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token_here>
```

### 1.2 Standard Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### 1.3 Standard Error Response
```json
{
  "success": false,
  "message": "Error description here",
  "errors": []
}
```

---

## 2. API Endpoints Directory

| Category | Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | Public | Register a new user |
| **Auth** | `POST` | `/auth/login` | Public | Authenticate user & get JWT |
| **Auth** | `GET` | `/auth/me` | Authenticated | Get current logged-in profile |
| **Auth** | `PUT` | `/auth/profile` | Authenticated | Update user name, phone, avatar |
| **Auth** | `POST` | `/auth/address` | Authenticated | Add a shipping address |
| **Auth** | `DELETE`| `/auth/address/:addressId`| Authenticated | Remove a shipping address |
| **Categories** | `GET` | `/categories` | Public | List all active categories |
| **Categories** | `GET` | `/categories/:id` | Public | Get single category details |
| **Categories** | `POST` | `/categories` | Admin Only | Create a new category |
| **Categories** | `PUT` | `/categories/:id` | Admin Only | Update existing category |
| **Categories** | `DELETE`| `/categories/:id` | Admin Only | Delete category |
| **Products** | `GET` | `/products` | Public | List products (Search, Filter, Paginate) |
| **Products** | `GET` | `/products/featured` | Public | List featured showcase products |
| **Products** | `GET` | `/products/:idOrSlug` | Public | Get single product by ID or Slug |
| **Products** | `POST` | `/products` | Admin Only | Create a new product (with images) |
| **Products** | `PUT` | `/products/:id` | Admin Only | Update product details / stock |
| **Products** | `DELETE`| `/products/:id` | Admin Only | Delete product |
| **Reviews** | `GET` | `/products/:id/reviews`| Public | Get all reviews for a product |
| **Reviews** | `POST` | `/products/:id/reviews`| Authenticated | Submit product review & rating |
| **Cart** | `GET` | `/cart` | Authenticated | Retrieve user cart items & total |
| **Cart** | `POST` | `/cart/items` | Authenticated | Add item or increment quantity |
| **Cart** | `PUT` | `/cart/items/:productId`| Authenticated | Update item quantity in cart |
| **Cart** | `DELETE`| `/cart/items/:productId`| Authenticated | Remove item from cart |
| **Cart** | `DELETE`| `/cart/clear` | Authenticated | Empty the cart |
| **Wishlist** | `GET` | `/wishlist` | Authenticated | Retrieve user's bookmarked products |
| **Wishlist** | `POST` | `/wishlist/toggle/:productId` | Authenticated | Toggle product in/out of wishlist |
| **Orders** | `POST` | `/orders` | Authenticated | Create order (COD or Gateway mode) |
| **Orders** | `GET` | `/orders/my-orders` | Authenticated | List all orders placed by user |
| **Orders** | `GET` | `/orders/:id` | Authenticated | Get detailed order summary & invoice |
| **Admin Orders**| `GET` | `/admin/orders` | Admin Only | List all store orders with filters |
| **Admin Orders**| `PUT` | `/admin/orders/:id/status`| Admin Only | Update order lifecycle status |
| **Admin Orders**| `PUT` | `/admin/orders/:id/pay` | Admin Only | Mark COD order as Paid |
| **Admin Users** | `GET` | `/admin/users` | Admin Only | List registered users with pagination |
| **Admin Users** | `PUT` | `/admin/users/:id/status`| Admin Only | Toggle user Active/Blocked status |
| **Admin Analytics**| `GET`| `/admin/analytics/overview`| Admin Only | Summary metrics (Revenue, Orders, Low Stock) |
| **Admin Analytics**| `GET`| `/admin/analytics/sales-trend`| Admin Only | Monthly/Weekly revenue chart series |

---

## 3. Granular Request & Response Examples

### 3.1 Authentication

#### `POST /auth/register`
- **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "6650a12b...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOi..."
  }
}
```

#### `POST /auth/login`
- **Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "Password123"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "6650a12b...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOi..."
  }
}
```

---

### 3.2 Product Catalog with Granular Filtering

#### `GET /products`
- **Query Parameters:**
  - `keyword` (string): Search in title and description
  - `category` (string): Category ID or slug
  - `minPrice` (number): Lower price limit
  - `maxPrice` (number): Upper price limit
  - `rating` (number): Minimum average rating (1 to 5)
  - `sort` (string): `price_asc` | `price_desc` | `rating_desc` | `newest` (default)
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 12)
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "6650b24e...",
        "title": "Minimalist Wireless Headphones",
        "slug": "minimalist-wireless-headphones",
        "price": 2999,
        "discountPrice": 2499,
        "stock": 25,
        "sku": "AUD-WL-001",
        "category": {
          "_id": "6650b11a...",
          "name": "Electronics",
          "slug": "electronics"
        },
        "images": [
          { "url": "https://...", "altText": "Front view" }
        ],
        "ratingsAverage": 4.8,
        "numReviews": 34
      }
    ],
    "pagination": {
      "totalProducts": 142,
      "currentPage": 1,
      "totalPages": 12,
      "limit": 12
    }
  }
}
```

---

### 3.3 Orders & Modular Payment Flow

#### `POST /orders` (Cash on Delivery Mode)
- **Request Body:**
```json
{
  "orderItems": [
    {
      "product": "6650b24e...",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "Jane Doe",
    "street": "123 Market Street, Apt 4B",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560001",
    "country": "India",
    "phone": "+91 9876543210"
  },
  "paymentMethod": "COD"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Order placed successfully via Cash on Delivery",
  "data": {
    "order": {
      "_id": "6650c89a...",
      "totalPrice": 4998,
      "paymentMethod": "COD",
      "paymentStatus": "Pending",
      "orderStatus": "Processing",
      "isPaid": false,
      "createdAt": "2026-11-06T15:00:00.000Z"
    }
  }
}
```

#### *Future Production Deployment: Switching to Razorpay*
When switching to Razorpay:
1. Client calls `POST /orders/razorpay-init` with cart payload to receive `razorpayOrderId`.
2. Client opens Razorpay Checkout modal.
3. Upon success, client calls `POST /orders/razorpay-verify` with `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
4. Server verifies HMAC SHA256 signature and marks order `isPaid: true`, `paymentStatus: "Completed"`.

---

### 3.4 Admin Analytics Overview

#### `GET /admin/analytics/overview`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalRevenue": 284500,
      "totalOrders": 124,
      "totalUsers": 98,
      "totalProducts": 45,
      "lowStockCount": 3
    },
    "recentOrders": [
      {
        "_id": "6650c89a...",
        "user": { "name": "Jane Doe", "email": "jane@example.com" },
        "totalPrice": 4998,
        "orderStatus": "Processing",
        "paymentMethod": "COD",
        "createdAt": "2026-11-06T15:00:00.000Z"
      }
    ],
    "lowStockProducts": [
      {
        "_id": "6650b991...",
        "title": "Smart Watch Series 5",
        "stock": 2
      }
    ]
  }
}
```

