export interface Product {
  url: string;
  title: string;
  avg_price: number;
  vendor: string;
  created_at: string;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface ProductVariant {
  price: string;
  compare_at_price: string | null;
}

export interface ProductImage {
  src: string;
  width: number;
  height: number;
}

export interface DisplayConfig {
  itemsPerPage: number;
  dateRange: {
    start?: string;
    end?: string;
  };
  search: string;
  gridCols: number;
  vendors: string[];
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
}

export type DateRangeFilter = 
  | 'all' 
  | 'today' 
  | 'week' 
  | 'month' 
  | 'three_months'
  | 'six_months'
  | 'year'
  | 'custom';

export interface FilterConfig {
  search: string;
  vendor?: string;
}

export interface SortConfig {
  field: keyof Product;
  direction: 'asc' | 'desc';
}

export type SortOption = 'price' | 'date' | 'title';

export interface VendorStats {
  name: string;
  count: number;
  totalProducts: number;
  minPrice: number;
  maxPrice: number;
  latestProduct: string;
  languages: string[];
}