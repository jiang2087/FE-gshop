// ─────────────────────────────────────────────────────────────
// Product Type Definitions for [[...slug]] routing
// ─────────────────────────────────────────────────────────────

/** All supported product types */
export const PRODUCT_TYPES = ["laptop", "watch", "mobile", "headphone"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

// ─── Base product interface (shared across all types) ───────
export interface BaseProduct {
  name: string;
  description: string;
  sku: string;
  price: number;
  brand: string;
  colorName: string;
  hexCode: string;
  image: string;
  type: ProductType;
}

// ─── Laptop ─────────────────────────────────────────────────
export interface LaptopProduct extends BaseProduct {
  type: "laptop";
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  resolution: string;
  screenSize: number;
  dimension: string;
}

// ─── Watch ──────────────────────────────────────────────────
export interface WatchProduct extends BaseProduct {
  type: "watch";
  caseMaterial: string;
  strapMaterial: string;
  waterResistance: string;
  displayType: string;
  batteryLife: string;
  connectivity: string;
  caseSize: number;
  os: string;
  sensors: string;
  weight: string;
}

// ─── Mobile ─────────────────────────────────────────────────
export interface MobileProduct extends BaseProduct {
  type: "mobile";
  cpu: string;
  ram: string;
  storage: string;
  resolution: string;
  screenSize: number;
  battery: string;
  os: string;
  camera: string;
  dimension: string;
  weight: string;
  sim: string;
}

// ─── Headphone ──────────────────────────────────────────────
export interface HeadphoneProduct extends BaseProduct {
  type: "headphone";
  driverSize: string;
  frequencyResponse: string;
  impedance: string;
  connectivity: string;
  batteryLife: string;
  noiseCancelling: boolean;
  headphoneType: string; // "over-ear" | "in-ear" | "on-ear"
  weight: string;
  microphone: boolean;
}

// ─── Union Type ─────────────────────────────────────────────
export type Product = LaptopProduct | WatchProduct | MobileProduct | HeadphoneProduct;

// ─── API Response Types ─────────────────────────────────────
export interface ProductApiResponse {
  success: boolean;
  data?: Product;
  message?: string;
}

export interface ProductListApiResponse {
  success: boolean;
  data?: Product[];
  message?: string;
  pagination?: {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ─── Type guard utilities ───────────────────────────────────
export function isLaptop(product: Product): product is LaptopProduct {
  return product.type === "laptop";
}

export function isWatch(product: Product): product is WatchProduct {
  return product.type === "watch";
}

export function isMobile(product: Product): product is MobileProduct {
  return product.type === "mobile";
}

export function isHeadphone(product: Product): product is HeadphoneProduct {
  return product.type === "headphone";
}

export function isValidProductType(type: string): type is ProductType {
  return PRODUCT_TYPES.includes(type as ProductType);
}
