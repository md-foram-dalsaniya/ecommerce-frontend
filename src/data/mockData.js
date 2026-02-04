/**
 * Mock data for e-commerce frontend
 * All data is stored in localStorage for persistence
 */

// Default product images (placeholder base64 or URLs)
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Ctext fill='%239ca3af' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

// Initial categories
export const initialCategories = [
  { id: "cat1", name: "Electronics", slug: "electronics", isActive: true },
  { id: "cat2", name: "Fashion", slug: "fashion", isActive: true },
  { id: "cat3", name: "Home & Garden", slug: "home-garden", isActive: true },
  { id: "cat4", name: "Sports", slug: "sports", isActive: true },
  { id: "cat5", name: "Books", slug: "books", isActive: true },
];

// Initial products
export const initialProducts = [
  {
    id: "prod1",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30hr battery life.",
    price: 2999,
    originalPrice: 3999,
    category: "Electronics",
    categoryId: "cat1",
    images: [PLACEHOLDER_IMAGE],
    stock: 50,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "prod2",
    name: "Smart Watch Pro",
    description: "Feature-rich smartwatch with health tracking and GPS.",
    price: 4999,
    originalPrice: 6999,
    category: "Electronics",
    categoryId: "cat1",
    images: [PLACEHOLDER_IMAGE],
    stock: 25,
    isActive: true,
    createdAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "prod3",
    name: "Cotton T-Shirt",
    description: "Premium cotton t-shirt, comfortable and durable.",
    price: 599,
    originalPrice: 899,
    category: "Fashion",
    categoryId: "cat2",
    images: [PLACEHOLDER_IMAGE],
    stock: 100,
    isActive: true,
    createdAt: "2024-01-17T10:00:00Z",
  },
  {
    id: "prod4",
    name: "Running Shoes",
    description: "Lightweight running shoes with cushioned sole.",
    price: 2499,
    originalPrice: 2999,
    category: "Sports",
    categoryId: "cat4",
    images: [PLACEHOLDER_IMAGE],
    stock: 30,
    isActive: true,
    createdAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "prod5",
    name: "Garden Tool Set",
    description: "Complete gardening tool set with 10 pieces.",
    price: 1899,
    originalPrice: 2499,
    category: "Home & Garden",
    categoryId: "cat3",
    images: [PLACEHOLDER_IMAGE],
    stock: 20,
    isActive: true,
    createdAt: "2024-01-19T10:00:00Z",
  },
  {
    id: "prod6",
    name: "React Programming Book",
    description: "Learn React.js from basics to advanced concepts.",
    price: 449,
    originalPrice: 599,
    category: "Books",
    categoryId: "cat5",
    images: [PLACEHOLDER_IMAGE],
    stock: 0,
    isActive: true,
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "prod7",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life.",
    price: 799,
    originalPrice: 999,
    category: "Electronics",
    categoryId: "cat1",
    images: [PLACEHOLDER_IMAGE],
    stock: 75,
    isActive: true,
    createdAt: "2024-01-21T10:00:00Z",
  },
  {
    id: "prod8",
    name: "Yoga Mat",
    description: "Non-slip yoga mat with carrying strap.",
    price: 899,
    originalPrice: 1199,
    category: "Sports",
    categoryId: "cat4",
    images: [PLACEHOLDER_IMAGE],
    stock: 40,
    isActive: true,
    createdAt: "2024-01-22T10:00:00Z",
  },
];

// Admin credentials (hardcoded)
export const ADMIN_EMAIL = "admin@shop.com";
export const ADMIN_PASSWORD = "Admin@123";
