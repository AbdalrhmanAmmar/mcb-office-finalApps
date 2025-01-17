import React, { useRef, useState } from 'react';
import { Upload, User, Phone, Package, Hash, DollarSign, Coins, Plane, Ship, Clock, Loader2 } from 'lucide-react';
import { Product } from '../types/product';

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id'>) => Promise<void>;
  onCancel: () => void;
  initialProduct?: Product;
}

export function ProductForm({ onSubmit, onCancel, initialProduct }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Omit<Product, 'id'>>({
    image: initialProduct?.image || '',
    name: initialProduct?.name || '',
    quantity: initialProduct?.quantity || 1,
    price: initialProduct?.price || 0,
    customerName: initialProduct?.customerName || '',
    phoneNumber: initialProduct?.phoneNumber || '',
    shippingType: initialProduct?.shippingType || 'air',
    shippingDuration: initialProduct?.shippingDuration || '',
    currency: initialProduct?.currency || 'USD'
  });
  const [previewImage, setPreviewImage] = useState<string | null>(initialProduct?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setProduct({ ...product, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(product);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value, 10));
    setProduct({ ...product, quantity: value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value));
    setProduct({ ...product, price: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
          <div className="flex flex-col items-center space-y-4">
            {previewImage ? (
              <div className="relative w-full h-48">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setProduct({ ...product, image: '' });
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition-all duration-200 group"
              >
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <p className="mt-2 text-sm text-gray-500 group-hover:text-indigo-500 transition-colors">Click to upload image</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              required={!initialProduct}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={product.customerName}
                onChange={(e) => setProduct({ ...product, customerName: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter customer name"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={product.phoneNumber}
                onChange={(e) => setProduct({ ...product, phoneNumber: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter phone number"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter product name"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="1"
              value={product.quantity}
              onChange={handleQuantityChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter quantity"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={product.price}
              onChange={handlePriceChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter price"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Coins className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={product.currency}
              onChange={(e) => setProduct({ ...product, currency: e.target.value as 'USD' | 'RMB' | 'MRU' })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
              disabled={isSubmitting}
            >
              <option value="USD">USD (US Dollar)</option>
              <option value="RMB">RMB (Chinese Yuan)</option>
              <option value="MRU">MRU (Mauritanian Ouguiya)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Type</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {product.shippingType === 'air' ? (
                <Plane className="h-5 w-5 text-gray-400" />
              ) : (
                <Ship className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <select
              value={product.shippingType}
              onChange={(e) => setProduct({ ...product, shippingType: e.target.value as 'air' | 'sea' })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
              disabled={isSubmitting}
            >
              <option value="air">Air Shipping</option>
              <option value="sea">Sea Shipping</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Duration</label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={product.shippingDuration}
              onChange={(e) => setProduct({ ...product, shippingDuration: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g., 7-10 days"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {initialProduct ? 'Saving...' : 'Adding...'}
            </>
          ) : (
            initialProduct ? 'Save Changes' : 'Add Product'
          )}
        </button>
      </div>
    </form>
  );
}