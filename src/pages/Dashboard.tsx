import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { SearchAndFilterBar } from '../components/SearchAndFilterBar';
import { ProductList } from '../components/ProductList';
import { ProductForm } from '../components/ProductForm';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { ContactSettingsModal } from '../components/ContactSettingsModal';
import { Product } from '../types/product';
import * as productService from '../services/productService';

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [shippingFilter, setShippingFilter] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesShipping = 
      !shippingFilter || 
      shippingFilter === 'all' || 
      product.shippingType === shippingFilter;

    return matchesSearch && matchesShipping;
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await productService.fetchProducts();
      setProducts(fetchedProducts);
      setError(null);
    } catch (err) {
      const message = 'Failed to load products. Please try again later.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      const newProduct = await productService.createProduct(productData, user.id);
      setProducts([newProduct, ...products]);
      setShowForm(false);
      toast.success('Product added successfully');
    } catch (err) {
      const message = 'Failed to add product. Please try again.';
      setError(message);
      toast.error(message);
    }
  };

  const handleEditProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      if (!user || !editingProduct) throw new Error('Invalid operation');
      const updatedProduct = await productService.updateProduct(
        editingProduct.id,
        productData,
        user.id
      );
      setProducts(products.map(p => 
        p.id === editingProduct.id ? updatedProduct : p
      ));
      setEditingProduct(null);
      setShowForm(false);
      toast.success('Product updated successfully');
    } catch (err) {
      const message = 'Failed to update product. Please try again.';
      setError(message);
      toast.error(message);
    }
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete);
        setProducts(products.filter(p => p.id !== productToDelete));
        setShowDeleteConfirmation(false);
        setProductToDelete(null);
        toast.success('Product deleted successfully');
      } catch (err) {
        const message = 'Failed to delete product. Please try again.';
        setError(message);
        toast.error(message);
      }
    }
  };

  return (
    <Layout onLogout={handleLogout}>
      <div className="bg-white rounded-lg shadow">
        <SearchAndFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          shippingFilter={shippingFilter}
          onShippingFilterChange={setShippingFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddProduct={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          onOpenSettings={() => setShowSettings(true)}
          filteredProducts={filteredProducts}
        />

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="p-4">
            <ProductList
              products={filteredProducts}
              viewMode={viewMode}
              onView={setViewingProduct}
              onEdit={(product) => {
                setEditingProduct(product);
                setShowForm(true);
              }}
              onDelete={(productId) => {
                setProductToDelete(productId);
                setShowDeleteConfirmation(true);
              }}
            />
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <ProductForm
              onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              initialProduct={editingProduct || undefined}
            />
          </div>
        </div>
      )}

      {viewingProduct && (
        <ProductDetailsModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setProductToDelete(null);
          }}
        />
      )}

      {showSettings && (
        <ContactSettingsModal
          onClose={() => setShowSettings(false)}
        />
      )}
    </Layout>
  );
}