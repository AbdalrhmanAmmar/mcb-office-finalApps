import React from 'react';
import { Ship, Plane } from 'lucide-react';

interface ShippingFilterProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
}

export function ShippingFilter({ selectedType, onChange }: ShippingFilterProps) {
  return (
    <div className="flex gap-2 bg-white rounded-md shadow-sm p-1">
      <button
        onClick={() => onChange(selectedType === 'all' ? null : 'all')}
        className={`flex items-center px-3 py-1.5 rounded ${
          selectedType === 'all'
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onChange(selectedType === 'air' ? null : 'air')}
        className={`flex items-center px-3 py-1.5 rounded ${
          selectedType === 'air'
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Plane className="w-4 h-4 mr-1" />
        Aerial
      </button>
      <button
        onClick={() => onChange(selectedType === 'sea' ? null : 'sea')}
        className={`flex items-center px-3 py-1.5 rounded ${
          selectedType === 'sea'
            ? 'bg-indigo-100 text-indigo-600'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Ship className="w-4 h-4 mr-1" />
        Marine
      </button>
    </div>
  );
}