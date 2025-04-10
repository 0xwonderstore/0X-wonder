import React from 'react';
import { FilterConfig, Product } from '../types';

interface FilterPanelProps {
  filters: FilterConfig;
  onFilterChange: (filters: FilterConfig) => void;
  products: Product[];
}

export default function FilterPanel({ filters, onFilterChange, products }: FilterPanelProps) {
  const vendors = Array.from(new Set(products.map(p => p.vendor).filter(Boolean)));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          المتجر
        </label>
        <select
          value={filters.vendor || ''}
          onChange={(e) => onFilterChange({ ...filters, vendor: e.target.value || undefined })}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-2"
        >
          <option value="">كل المتاجر</option>
          {vendors.map(vendor => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}