# ShopEase - E-Commerce Frontend

A complete responsive e-commerce frontend built with React.js, using localStorage as a mock backend.

## Tech Stack

- **React 18** (JavaScript)
- **React Router v6**
- **Context API** (Auth, Cart, Wishlist)
- **Tailwind CSS**
- **Vite** (Build tool)
- **LocalStorage** (No backend required)

## Features

### Authentication
- Single login/register page for Admin and User
- **Admin credentials:** `admin@shop.com` / `Admin@123`
- Forgot Password UI
- Form validation & error messages
- Success/error toast notifications

### User Side
- **Profile:** View/edit name, email, phone, addresses
- **Products:** Grid view, detail page, image gallery, categories, stock labels
- **Search & Filter:** By name, category, price range; sort by price/date
- **Cart:** Add/remove, update quantity, persist in localStorage
- **Wishlist:** Add/remove, move to cart
- **Checkout:** COD only, address selection, coupons (SAVE10, FLAT50), tax & shipping
- **Orders:** History, status tracking, cancel if "Placed"

### Admin Panel
- **Dashboard:** Users, products, orders, sales stats
- **Products:** CRUD, image upload (base64), stock, activate/deactivate
- **Categories:** Add, edit, delete
- **Users:** View list, details, activate/deactivate
- **Orders:** View all, update status (Placed→Shipped→Delivered→Cancelled)

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # Auth, Cart, Wishlist, Toast contexts
├── data/             # Mock data (products, categories)
├── pages/
│   ├── auth/         # Login/Register
│   ├── user/         # Home, Products, Cart, Checkout, Orders, etc.
│   └── admin/        # Admin dashboard & management
├── routes/           # App routes, protected routes
└── utils/            # Storage, formatters
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Coupon Codes (Demo)
- **SAVE10** - 10% off (max ₹100)
- **FLAT50** - ₹50 off

## Currency
All prices in Indian Rupees (₹)

## Payment
Cash on Delivery (COD) only
