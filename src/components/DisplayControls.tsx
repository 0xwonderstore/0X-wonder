import React, { useState } from 'react';
import { Search, Calendar, Grid2x2, Grid3x3, Grid } from 'lucide-react';
import { DisplayConfig, DateRangeFilter } from '../types';

interface DisplayControlsProps {
  config: DisplayConfig;
  onConfigChange: (config: DisplayConfig) => void;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [20, 50, 100, 200];

const DATE_RANGE_OPTIONS: { value: DateRangeFilter; label: string }[] = [
  { value: 'all', label: 'كل الوقت' },
  { value: 'today', label: 'اليوم' },
  { value: 'week', label: 'آخر أسبوع' },
  { value: 'month', label: 'آخر شهر' },
  { value: 'three_months', label: 'آخر 3 أشهر' },
  { value: 'six_months', label: 'آخر 6 أشهر' },
  { value: 'year', label: 'آخر سنة' },
  { value: 'custom', label: 'فترة مخصصة' }
];

const GRID_OPTIONS = [
  { cols: 2, icon: Grid2x2, label: '2 منتجات في الصف' },
  { cols: 3, icon: Grid3x3, label: '3 منتجات في الصف' },
  { cols: 4, icon: Grid, label: '4 منتجات في الصف' },
];

export default function DisplayControls({
  config,
  onConfigChange,
  onPageChange,
}: DisplayControlsProps) {
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);

  const handleDateRangeChange = (filter: DateRangeFilter) => {
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined = new Date();

    switch (filter) {
      case 'today':
        start = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        start = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        start = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'three_months':
        start = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'six_months':
        start = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case 'year':
        start = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'custom':
        setShowCustomDateRange(true);
        return;
      case 'all':
      default:
        start = undefined;
        end = undefined;
        break;
    }

    setShowCustomDateRange(false);
    onConfigChange({
      ...config,
      dateRange: {
        start: start?.toISOString(),
        end: end?.toISOString(),
      },
    });
    onPageChange(1);
  };

  const handleCustomDateChange = (startDate: string, endDate: string) => {
    onConfigChange({
      ...config,
      dateRange: {
        start: startDate ? new Date(startDate).toISOString() : undefined,
        end: endDate ? new Date(endDate).toISOString() : undefined,
      },
    });
    onPageChange(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="البحث عن المنتجات..."
            value={config.search}
            onChange={(e) => {
              onConfigChange({ ...config, search: e.target.value });
              onPageChange(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <div className="flex gap-4">
          <select
            value={config.itemsPerPage}
            onChange={(e) => {
              onConfigChange({ ...config, itemsPerPage: Number(e.target.value) });
              onPageChange(1);
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value} منتج
              </option>
            ))}
          </select>

          <div className="relative">
            <select
              onChange={(e) => handleDateRangeChange(e.target.value as DateRangeFilter)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              {DATE_RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {showCustomDateRange && (
        <div className="flex gap-4 items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              من تاريخ
            </label>
            <input
              type="date"
              onChange={(e) => handleCustomDateChange(e.target.value, config.dateRange.end || '')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              إلى تاريخ
            </label>
            <input
              type="date"
              onChange={(e) => handleCustomDateChange(config.dateRange.start || '', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">عدد المنتجات في الصف:</span>
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {GRID_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.cols}
                onClick={() => onConfigChange({ ...config, gridCols: option.cols })}
                className={`p-2 rounded-md transition-colors ${
                  config.gridCols === option.cols
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
                title={option.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {config.dateRange.start && config.dateRange.end && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>
            عرض المنتجات من {new Date(config.dateRange.start).toLocaleDateString('ar')} إلى{' '}
            {new Date(config.dateRange.end).toLocaleDateString('ar')}
          </span>
        </div>
      )}
    </div>
  );
}