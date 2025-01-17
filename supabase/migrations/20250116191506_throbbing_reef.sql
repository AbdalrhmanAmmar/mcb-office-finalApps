/*
  # Initial Schema Setup

  1. Products Table
    - `id` (uuid, primary key)
    - `name` (text)
    - `image` (text)
    - `quantity` (integer)
    - `price` (decimal)
    - `customer_name` (text)
    - `phone_number` (text)
    - `shipping_type` (text)
    - `shipping_duration` (text)
    - `currency` (text)
    - `user_id` (uuid, foreign key)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

  2. Security
    - Enable RLS on products table
    - Add policies for CRUD operations
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL DEFAULT 0,
  customer_name text NOT NULL,
  phone_number text NOT NULL,
  shipping_type text NOT NULL CHECK (shipping_type IN ('air', 'sea')),
  shipping_duration text NOT NULL,
  currency text NOT NULL CHECK (currency IN ('USD', 'RMB', 'MRU')),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_shipping_type ON products(shipping_type);
CREATE INDEX IF NOT EXISTS idx_products_customer_name ON products(customer_name);
CREATE INDEX IF NOT EXISTS idx_products_phone_number ON products(phone_number);