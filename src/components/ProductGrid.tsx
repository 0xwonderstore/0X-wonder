import React, { useState, useMemo } from 'react';
import { Product, DisplayConfig, VendorStats } from '../types';
import ProductCard from './ProductCard';
import DisplayControls from './DisplayControls';
import VendorFilter from './VendorFilter';
import SortControls from './SortControls';
import { getVendorLanguages } from '../utils/languageDetection';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [config, setConfig] = useState<DisplayConfig>({
    itemsPerPage: 20,
    dateRange: {},
    search: '',
    gridCols: 4,
    vendors: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);

  const vendorStats = useMemo(() => {
    const stats = new Map<string, VendorStats>();
    const vendorLanguages = getVendorLanguages(products);
    
    products.forEach(product => {
      const existing = stats.get(product.vendor) || {
        name: product.vendor,
        count: 0,
        totalProducts: 0,
        minPrice: Infinity,
        maxPrice: -Infinity,
        latestProduct: '',
        languages: Array.from(vendorLanguages.get(product.vendor) || [])
      };

      existing.totalProducts++;
      existing.minPrice = Math.min(existing.minPrice, product.avg_price);
      existing.maxPrice = Math.max(existing.maxPrice, product.avg_price);
      
      if (!existing.latestProduct || new Date(product.created_at) > new Date(existing.latestProduct)) {
        existing.latestProduct = product.created_at;
      }

      stats.set(product.vendor, existing);
    });

    return Array.from(stats.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const searchMatch = config.search === '' ||
        product.title.toLowerCase().includes(config.search.toLowerCase());

      const dateMatch = !config.dateRange.start || !config.dateRange.end ||
        (new Date(product.created_at) >= new Date(config.dateRange.start) &&
         new Date(product.created_at) <= new Date(config.dateRange.end));

      const vendorMatch = config.vendors.length === 0 || config.vendors.includes(product.vendor);

      return searchMatch && dateMatch && vendorMatch;
    }).sort((a, b) => {
      switch (config.sortBy) {
        case 'date':
          return config.sortOrder === 'asc'
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'price':
          return config.sortOrder === 'asc'
            ? a.avg_price - b.avg_price
            : b.avg_price - a.avg_price;
        case 'title':
          return config.sortOrder === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [products, config]);

  const updatedVendorStats = useMemo(() => {
    return vendorStats.map(stat => ({
      ...stat,
      count: filteredProducts.filter(p => p.vendor === stat.name).length
    }));
  }, [vendorStats, filteredProducts]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * config.itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + config.itemsPerPage);
  }, [filteredProducts, currentPage, config.itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / config.itemsPerPage);

  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }[config.gridCols];

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <DisplayControls
          config={config}
          onConfigChange={setConfig}
          onPageChange={setCurrentPage}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <VendorFilter
              vendors={updatedVendorStats}
              selectedVendors={config.vendors}
              onVendorChange={(vendors) => {
                setConfig(prev => ({ ...prev, vendors }));
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex-1">
            <SortControls
              sortBy={config.sortBy}
              sortOrder={config.sortOrder}
              onSortChange={(sortBy, sortOrder) => {
                setConfig(prev => ({ ...prev, sortBy, sortOrder }));
              }}
            />
          </div>
        </div>
      </div>

      <div className={`grid ${gridColsClass} gap-8`}>
        {paginatedProducts.map((product) => (
          <ProductCard key={product.url} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50"
            aria-label="الصفحة السابقة"
          >
            السابق
          </button>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(Number(page))}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            )
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50"
            aria-label="الصفحة التالية"
          >
            التالي
          </button>
        </div>
      )}

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        عرض {((currentPage - 1) * config.itemsPerPage) + 1} إلى {Math.min(currentPage * config.itemsPerPage, filteredProducts.length)} من {filteredProducts.length} منتج
      </div>
    </div>
  );
}