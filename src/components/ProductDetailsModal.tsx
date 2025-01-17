import React from 'react';
import { FileDown, X, MapPin, Mail, Phone as PhoneIcon } from 'lucide-react';
import { Product } from '../types/product';
import { printSingleProduct } from '../utils/pdfGenerator';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Company Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img src="/logo.jpg" alt="MCB Logo" className="w-16 h-16 rounded-full border-2 border-white" />
              <div>
                <h2 className="text-2xl font-bold">MCB OFFICE</h2>
                <p className="text-teal-100">General Trade & Import Services</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-teal-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Friendship Bridge (Carrefour Madrid)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>babe38463@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-4 h-4" />
              <span>38280203 / 42266947</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Details */}
          <div className="border rounded-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div className="p-6 bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Product Name</h4>
                    <p className="text-lg font-semibold text-gray-900">{product.name}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Customer Details</h4>
                    <p className="text-lg font-semibold text-gray-900">{product.customerName}</p>
                    <p className="text-sm text-gray-600">{product.phoneNumber}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Shipping Information</h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {product.shippingType.toUpperCase()} Shipping
                    </p>
                    <p className="text-sm text-gray-600">Duration: {product.shippingDuration}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Quantity</h4>
                    <p className="text-lg font-semibold text-gray-900">{product.quantity} units</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Price Details</h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {product.price.toFixed(2)} {product.currency} per unit
                    </p>
                    <p className="text-sm font-medium text-indigo-600">
                      Total: {(product.quantity * product.price).toFixed(2)} {product.currency}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => printSingleProduct(product)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}