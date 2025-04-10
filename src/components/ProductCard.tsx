import React, { useState } from 'react';
import { ShoppingCart, Calendar } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, formatDate } from '../utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const price = product.avg_price;
  const compareAtPrice = product.variants?.[0]?.compare_at_price 
    ? parseFloat(product.variants[0].compare_at_price) 
    : null;
  
  const discount = compareAtPrice ? Math.round((1 - price / compareAtPrice) * 100) : 0;
  
  const getImageUrl = () => {
    if (imageError) return 'https://via.placeholder.com/400';
    if (!product.images?.length) return 'https://via.placeholder.com/400';
    return product.images[0].src;
  };

  return (
    <div 
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
        <img
          src={getImageUrl()}
          alt={product.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gray-900 p-3 rounded-full transform hover:scale-110 transition-transform duration-300"
          >
            <ShoppingCart className="w-6 h-6" />
          </a>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 text-right">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {price}
            </span>
            {compareAtPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 line-through">
                  {compareAtPrice}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  -{discount}%
                </span>
              </div>
            )}
          </div>
          
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {product.vendor}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(product.created_at)}</span>
        </div>
      </div>
    </div>
  );
}