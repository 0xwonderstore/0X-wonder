import React from 'react';
import { Store, ChevronDown, Globe2 } from 'lucide-react';
import { VendorStats } from '../types';

interface VendorFilterProps {
  vendors: VendorStats[];
  selectedVendors: string[];
  onVendorChange: (vendors: string[]) => void;
}

export default function VendorFilter({
  vendors,
  selectedVendors,
  onVendorChange,
}: VendorFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleVendorToggle = (vendor: string) => {
    const newSelection = selectedVendors.includes(vendor)
      ? selectedVendors.filter(v => v !== vendor)
      : [...selectedVendors, vendor];
    onVendorChange(newSelection);
  };

  const handleSelectAll = () => {
    onVendorChange(selectedVendors.length === vendors.length ? [] : vendors.map(v => v.name));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-200">
            {selectedVendors.length === 0
              ? 'كل المتاجر'
              : selectedVendors.length === 1
              ? `متجر ${selectedVendors[0]}`
              : `${selectedVendors.length} متاجر`}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSelectAll}
              className="w-full text-right px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {selectedVendors.length === vendors.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {vendors.map((vendor) => (
              <div
                key={vendor.name}
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleVendorToggle(vendor.name)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.name)}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium">{vendor.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {vendor.count} منتجات
                    </span>
                  </div>
                  {vendor.languages.length > 0 && (
                    <div className="flex items-center gap-1 mr-6 text-xs text-gray-500">
                      <Globe2 className="w-3 h-3" />
                      <span>{vendor.languages.join('، ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}