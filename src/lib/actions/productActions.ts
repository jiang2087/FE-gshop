"use server";

import type { Product, ProductFormData, ProductActionResponse } from "@/types/productManagement";

// Mock database - In production, this would be a real database

// list of available product images under public/images/products
const productImages: string[] = [
  '/images/products/image 156.png',
  '/images/products/product-1-bg-1.png',
  '/images/products/product-1-bg-2.png',
  '/images/products/product-1-sm-1.png',
  '/images/products/product-1-sm-2.png',
  '/images/products/product-2-bg-1.png',
  '/images/products/product-2-bg-2.png',
  '/images/products/product-2-sm-1.png',
  '/images/products/product-2-sm-2.png',
  '/images/products/product-3-bg-1.png',
  '/images/products/product-3-bg-2.png',
  '/images/products/product-3-sm-1.png',
  '/images/products/product-3-sm-2.png',
  '/images/products/product-4-bg-1.png',
  '/images/products/product-4-bg-2.png',
  '/images/products/product-4-sm-1.png',
  '/images/products/product-4-sm-2.png',
  '/images/products/product-5-bg-1.png',
  '/images/products/product-5-bg-2.png',
  '/images/products/product-5-sm-1.png',
  '/images/products/product-5-sm-2.png',
  '/images/products/product-6-bg-1.png',
  '/images/products/product-6-bg-2.png',
  '/images/products/product-6-sm-1.png',
  '/images/products/product-6-sm-2.png',
  '/images/products/product-7-bg-1.png',
  '/images/products/product-7-bg-2.png',
  '/images/products/product-7-sm-1.png',
  '/images/products/product-7-sm-2.png',
  '/images/products/product-8-bg-1.png',
  '/images/products/product-8-sm-1.png',
  '/images/products/product-8-sm-2.png',
];

function getRandomImageUrl(): string {
  const idx = Math.floor(Math.random() * productImages.length);
  return productImages[idx];
}

let mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    stock: 45,
    category: "Electronics",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    name: "Ultra-Lightweight Laptop",
    price: 1299.99,
    stock: 12,
    category: "Computers",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-20"),
  },
  {
    id: "3",
    name: "Mechanical Gaming Keyboard",
    price: 149.99,
    stock: 78,
    category: "Accessories",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-10"),
  },
  {
    id: "4",
    name: "4K Webcam",
    price: 199.99,
    stock: 34,
    category: "Electronics",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-01-28"),
  },
  {
    id: "5",
    name: "Ergonomic Mouse",
    price: 79.99,
    stock: 156,
    category: "Accessories",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-05"),
  },
  {
    id: "6",
    name: "USB-C Hub Multi-Port",
    price: 89.99,
    stock: 92,
    category: "Accessories",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-01-30"),
  },
  {
    id: "7",
    name: "Portable SSD 1TB",
    price: 129.99,
    stock: 67,
    category: "Storage",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-12"),
  },
  {
    id: "8",
    name: "Monitor Stand Adjustable",
    price: 59.99,
    stock: 103,
    category: "Furniture",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-01"),
  },
  {
    id: "9",
    name: "Smartphone X100",
    price: 999.99,
    stock: 58,
    category: "Electronics",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-15"),
  },
  {
    id: "10",
    name: "Bluetooth Speaker",
    price: 49.99,
    stock: 120,
    category: "Electronics",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-01-20"),
  },
  {
    id: "11",
    name: "Gaming Chair",
    price: 199.99,
    stock: 25,
    category: "Furniture",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-03-01"),
  },
  {
    id: "12",
    name: "Wireless Charger",
    price: 29.99,
    stock: 190,
    category: "Accessories",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-22"),
  },
  {
    id: "13",
    name: "4K Monitor 27\"",
    price: 349.99,
    stock: 40,
    category: "Computers",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-01-25"),
  },
  {
    id: "14",
    name: "Noise-Cancelling Earbuds",
    price: 129.99,
    stock: 85,
    category: "Electronics",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-18"),
  },
  {
    id: "15",
    name: "Fitness Tracker",
    price: 59.99,
    stock: 150,
    category: "Accessories",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-03-05"),
  },
  {
    id: "16",
    name: "Electric Toothbrush",
    price: 39.99,
    stock: 70,
    category: "Personal Care",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-10"),
  },
  {
    id: "17",
    name: "Action Camera",
    price: 249.99,
    stock: 34,
    category: "Electronics",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-28"),
  },
  {
    id: "18",
    name: "Drone Pro",
    price: 499.99,
    stock: 15,
    category: "Electronics",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-03-03"),
  },
  {
    id: "19",
    name: "Smartwatch Series 5",
    price: 299.99,
    stock: 60,
    category: "Electronics",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-01-30"),
  },
  {
    id: "20",
    name: "Portable Projector",
    price: 399.99,
    stock: 22,
    category: "Electronics",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-02-12"),
  },
  {
    id: "21",
    name: "Gaming Mouse",
    price: 59.99,
    stock: 140,
    category: "Accessories",
    imageUrl: getRandomImageUrl(),
    createdAt: new Date("2025-03-08"),
  },
  {
    id: "22",
    name: "Laptop Bag",
    price: 49.99,
    stock: 200,
    category: "Accessories",
    imageUrl: "/images/product/product-22.jpg",
    createdAt: new Date("2025-01-18"),
  },
  {
    id: "23",
    name: "LED Desk Lamp",
    price: 24.99,
    stock: 160,
    category: "Furniture",
    imageUrl: "/images/product/product-23.jpg",
    createdAt: new Date("2025-02-06"),
  },
  {
    id: "24",
    name: "Wireless Keyboard",
    price: 89.99,
    stock: 90,
    category: "Accessories",
    imageUrl: "/images/product/product-24.jpg",
    createdAt: new Date("2025-02-25"),
  },
  {
    id: "25",
    name: "Graphic Tablet",
    price: 229.99,
    stock: 30,
    category: "Computers",
    imageUrl: "/images/product/product-25.jpg",
    createdAt: new Date("2025-01-22"),
  },
  {
    id: "26",
    name: "VR Headset",
    price: 349.99,
    stock: 18,
    category: "Electronics",
    imageUrl: "/images/product/product-26.jpg",
    createdAt: new Date("2025-03-10"),
  },
  {
    id: "27",
    name: "Smart Doorbell",
    price: 99.99,
    stock: 75,
    category: "Home",
    imageUrl: "/images/product/product-27.jpg",
    createdAt: new Date("2025-02-14"),
  },
  {
    id: "28",
    name: "Air Purifier",
    price: 199.99,
    stock: 40,
    category: "Home",
    imageUrl: "/images/product/product-28.jpg",
    createdAt: new Date("2025-01-27"),
  },
  {
    id: "29",
    name: "Electric Kettle",
    price: 34.99,
    stock: 120,
    category: "Home",
    imageUrl: "/images/product/product-29.jpg",
    createdAt: new Date("2025-03-01"),
  },
  {
    id: "30",
    name: "Smart Light Bulb",
    price: 14.99,
    stock: 300,
    category: "Home",
    imageUrl: "/images/product/product-30.jpg",
    createdAt: new Date("2025-02-18"),
  },
  {
    id: "31",
    name: "Portable Bluetooth Keyboard",
    price: 59.99,
    stock: 110,
    category: "Accessories",
    imageUrl: "/images/product/product-31.jpg",
    createdAt: new Date("2025-03-12"),
  },
  {
    id: "32",
    name: "External Hard Drive 2TB",
    price: 119.99,
    stock: 85,
    category: "Storage",
    imageUrl: "/images/product/product-32.jpg",
    createdAt: new Date("2025-02-05"),
  },
  {
    id: "33",
    name: "Smart Thermostat",
    price: 249.99,
    stock: 50,
    category: "Home",
    imageUrl: "/images/product/product-33.jpg",
    createdAt: new Date("2025-02-20"),
  },
  {
    id: "34",
    name: "Cordless Vacuum Cleaner",
    price: 299.99,
    stock: 55,
    category: "Home",
    imageUrl: "/images/product/product-34.jpg",
    createdAt: new Date("2025-03-02"),
  },
  {
    id: "35",
    name: "Smart TV 55",
    price: 799.99,
    stock: 20,
    category: "Electronics",
    imageUrl: "/images/product/product-35.jpg",
    createdAt: new Date("2025-01-29"),
  },
  {
    id: "36",
    name: "Coffee Maker",
    price: 89.99,
    stock: 110,
    category: "Home",
    imageUrl: "/images/product/product-36.jpg",
    createdAt: new Date("2025-02-11"),
  },
  {
    id: "37",
    name: "Wireless Earphones",
    price: 59.99,
    stock: 95,
    category: "Electronics",
    imageUrl: "/images/product/product-37.jpg",
    createdAt: new Date("2025-02-26"),
  },
  {
    id: "38",
    name: "Smart Refrigerator",
    price: 1299.99,
    stock: 8,
    category: "Home",
    imageUrl: "/images/product/product-38.jpg",
    createdAt: new Date("2025-03-11"),
  },
  {
    id: "39",
    name: "Gaming Console",
    price: 499.99,
    stock: 30,
    category: "Electronics",
    imageUrl: "/images/product/product-39.jpg",
    createdAt: new Date("2025-02-04"),
  },
  {
    id: "40",
    name: "Electric Scooter",
    price: 399.99,
    stock: 25,
    category: "Transport",
    imageUrl: "/images/product/product-40.jpg",
    createdAt: new Date("2025-03-07"),
  },
  {
    id: "41",
    name: "Smart Lock",
    price: 149.99,
    stock: 65,
    category: "Home",
    imageUrl: "/images/product/product-41.jpg",
    createdAt: new Date("2025-02-16"),
  },
  {
    id: "42",
    name: "Wireless Router",
    price: 129.99,
    stock: 80,
    category: "Computers",
    imageUrl: "/images/product/product-42.jpg",
    createdAt: new Date("2025-01-31"),
  },
  {
    id: "43",
    name: "3D Printer",
    price: 599.99,
    stock: 12,
    category: "Computers",
    imageUrl: "/images/product/product-43.jpg",
    createdAt: new Date("2025-03-09"),
  },
  {
    id: "44",
    name: "Electric Bike",
    price: 999.99,
    stock: 10,
    category: "Transport",
    imageUrl: "/images/product/product-44.jpg",
    createdAt: new Date("2025-02-07"),
  },
  {
    id: "45",
    name: "Portable Power Bank",
    price: 39.99,
    stock: 220,
    category: "Accessories",
    imageUrl: "/images/product/product-45.jpg",
    createdAt: new Date("2025-01-24"),
  },
  {
    id: "46",
    name: "Smart Scale",
    price: 49.99,
    stock: 140,
    category: "Health",
    imageUrl: "/images/product/product-46.jpg",
    createdAt: new Date("2025-02-13"),
  },
  {
    id: "47",
    name: "Digital Camera",
    price: 549.99,
    stock: 28,
    category: "Electronics",
    imageUrl: "/images/product/product-47.jpg",
    createdAt: new Date("2025-03-04"),
  },
  {
    id: "48",
    name: "Noise Machine",
    price: 29.99,
    stock: 130,
    category: "Health",
    imageUrl: "/images/product/product-48.jpg",
    createdAt: new Date("2025-02-21"),
  },
  {
    id: "49",
    name: "Electric Grill",
    price: 79.99,
    stock: 75,
    category: "Home",
    imageUrl: "/images/product/product-49.jpg",
    createdAt: new Date("2025-01-26"),
  },
  {
    id: "50",
    name: "Smart Water Bottle",
    price: 24.99,
    stock: 190,
    category: "Accessories",
    imageUrl: "/images/product/product-50.jpg",
    createdAt: new Date("2025-03-13"),
  },
];
// Simulating a small delay for realistic server action behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all products with optional filtering and pagination
 */
export async function getProducts(
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
): Promise<ProductsResponse> {
  await delay(300);

  let filtered = mockProducts;

  // Search filter
  if (search.trim()) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (validPage - 1) * pageSize;
  const paginatedProducts = filtered.slice(startIndex, startIndex + pageSize);

  return {
    success: true,
    products: paginatedProducts,
    pagination: {
      currentPage: validPage,
      pageSize,
      total,
      totalPages,
    },
  };
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<ProductActionResponse> {
  await delay(200);

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  return {
    success: true,
    data: product,
  };
}

/**
 * Create a new product
 */
export async function createProduct(
  data: ProductFormData
): Promise<ProductActionResponse> {
  await delay(400);

  // Validation
  if (!data.name.trim()) {
    return {
      success: false,
      message: "Product name is required",
    };
  }

  if (data.price <= 0) {
    return {
      success: false,
      message: "Price must be greater than 0",
    };
  }

  if (data.stock < 0) {
    return {
      success: false,
      message: "Stock cannot be negative",
    };
  }

  const newProduct: Product = {
    id: (mockProducts.length + 1).toString(),
    ...data,
    imageUrl: data.imageUrl || getRandomImageUrl(),
    createdAt: new Date(),
  };

  mockProducts.push(newProduct);

  return {
    success: true,
    data: newProduct,
    message: "Product created successfully",
  };
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  data: ProductFormData
): Promise<ProductActionResponse> {
  await delay(400);

  const productIndex = mockProducts.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  // Validation
  if (!data.name.trim()) {
    return {
      success: false,
      message: "Product name is required",
    };
  }

  if (data.price <= 0) {
    return {
      success: false,
      message: "Price must be greater than 0",
    };
  }

  if (data.stock < 0) {
    return {
      success: false,
      message: "Stock cannot be negative",
    };
  }

  const updatedProduct: Product = {
    ...mockProducts[productIndex],
    ...data,
  };

  mockProducts[productIndex] = updatedProduct;

  return {
    success: true,
    data: updatedProduct,
    message: "Product updated successfully",
  };
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<ProductActionResponse> {
  await delay(300);

  const productIndex = mockProducts.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return {
      success: false,
      message: "Product not found",
    };
  }

  mockProducts.splice(productIndex, 1);

  return {
    success: true,
    message: "Product deleted successfully",
  };
}

export type ProductsResponse = {
  success: boolean;
  products?: Product[];
  pagination?: {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  message?: string;
};
