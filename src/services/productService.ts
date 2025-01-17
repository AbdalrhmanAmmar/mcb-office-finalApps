import { supabase } from '../lib/supabase';
import { Product } from '../types/product';
import { Database } from '../types/supabase';

type DbProduct = Database['public']['Tables']['products']['Row'];

function mapDbProductToProduct(dbProduct: DbProduct): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    image: dbProduct.image,
    quantity: dbProduct.quantity,
    price: dbProduct.price,
    customerName: dbProduct.customer_name,
    phoneNumber: dbProduct.phone_number,
    shippingType: dbProduct.shipping_type,
    shippingDuration: dbProduct.shipping_duration,
    currency: dbProduct.currency,
  };
}

function mapProductToDbProduct(product: Omit<Product, 'id'>, userId: string) {
  return {
    name: product.name,
    image: product.image,
    quantity: product.quantity,
    price: product.price,
    customer_name: product.customerName,
    phone_number: product.phoneNumber,
    shipping_type: product.shippingType,
    shipping_duration: product.shippingDuration,
    currency: product.currency,
    user_id: userId,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return products.map(mapDbProductToProduct);
}

export async function createProduct(product: Omit<Product, 'id'>, userId: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(mapProductToDbProduct(product, userId))
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return mapDbProductToProduct(data);
}

export async function updateProduct(id: string, product: Omit<Product, 'id'>, userId: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(mapProductToDbProduct(product, userId))
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return mapDbProductToProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}