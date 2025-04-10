import React from 'react';
import { ArrowUpDown, Calendar, DollarSign, Text } from 'lucide-react';
import { SortOption } from '../types';

interface SortControlsProps {
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: SortOption, sortOrder: 'asc' | 'desc') => void;
}

export default function SortControls({
  sortBy,
  sortOrder,
  onSortChange,
}: SortControlsProps) {
  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'date', label: 'التاريخ', icon: <Calendar className="w-4 h-4" /> },
    { value: 'price', label: 'السعر', icon: <DollarSign className="w-4 h-4" /> },
    { value: 'title', label: 'العنوان', icon: <Text className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">ترتيب حسب:</span>
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              const newOrder = sortBy === option.value && sortOrder === 'asc' ? 'desc' : 'asc';
              onSortChange(option.value, newOrder);
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
              sortBy === option.value
                ? 'bg-white dark:bg-gray-700 shadow-sm'
                : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            title={option.label}
          >
            {option.icon}
            <span className="text-sm">{option.label}</span>
            {sortBy === option.value && (
              <ArrowUpDown
                className={`w-4 h-4 transform transition-transform ${
                  sortOrder === 'desc' ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}