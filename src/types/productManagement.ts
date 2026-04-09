export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
};

export type ProductFormData = Omit<Product, "id" | "createdAt">;

export type ProductViewData = Product & {
  formattedPrice: string;
  formattedDate: string;
};

export type PaginationData = {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ProductsResponse = {
  success: boolean;
  data?: Product[];
  products?: Product[];
  message?: string;
  pagination?: PaginationData;
};

export type ProductActionResponse<T = Product> = {
  success: boolean;
  data?: T;
  message?: string;
};
