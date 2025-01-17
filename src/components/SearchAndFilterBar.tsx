import { Plus, Search, LayoutGrid, Table, Settings } from 'lucide-react';
import { ShippingFilter } from './ShippingFilter';
import { PDFButton } from './PDFButton';
import { Product } from '../types/product';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  shippingFilter: string | null;
  onShippingFilterChange: (type: string | null) => void;
  viewMode: 'card' | 'table';
  onViewModeChange: (mode: 'card' | 'table') => void;
  onAddProduct: () => void;
  onOpenSettings: () => void;
  filteredProducts: Product[];
}

export function SearchAndFilterBar({
  searchQuery,
  onSearchChange,
  shippingFilter,
  onShippingFilterChange,
  viewMode,
  onViewModeChange,
  onAddProduct,
  onOpenSettings,
  filteredProducts,
}: SearchAndFilterBarProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <h2 className="text-2xl font-bold text-gray-800">Products</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, customer, or phone..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
          />
        </div>
        
        <ShippingFilter
          selectedType={shippingFilter}
          onChange={onShippingFilterChange}
        />
        
        <div className="flex gap-2 bg-white rounded-md shadow-sm p-1">
          <button
            onClick={() => onViewModeChange('card')}
            className={`flex items-center px-3 py-1.5 rounded ${
              viewMode === 'card'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4 mr-1" />
            Cards
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`flex items-center px-3 py-1.5 rounded ${
              viewMode === 'table'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Table className="w-4 h-4 mr-1" />
            Table
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
          <PDFButton products={filteredProducts} />
          <button
            onClick={onAddProduct}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}