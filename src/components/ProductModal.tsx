import React from 'react';
import { X } from 'lucide-react';
import { Product } from '../types';
import { formatDate, formatPrice } from '../utils';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-slide-in">
        <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={product.images[0]?.src || 'https://via.placeholder.com/400'}
                alt={product.product_name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500">Product ID</h3>
                <p className="font-medium">{product.product_id}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">Product Name</h3>
                <p className="font-medium">{product.product_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">Price</h3>
                <p className="font-medium">{formatPrice(product.price)}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">Vendor</h3>
                <p className="font-medium">{product.vendor || '-'}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">Created At</h3>
                <p className="font-medium">{formatDate(product.created_at)}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">Tags</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.tags?.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                    >
                      {tag}
                    </span>
                  )) || '-'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm text-gray-500 mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}