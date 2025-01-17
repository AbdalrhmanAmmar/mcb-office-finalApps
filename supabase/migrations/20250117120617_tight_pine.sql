/*
  # Create contact settings table

  1. New Tables
    - `contact_settings`
      - `id` (uuid, primary key)
      - `email` (text)
      - `phone1` (text)
      - `phone2` (text)
      - `whatsapp1` (text)
      - `whatsapp2` (text)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `contact_settings` table
    - Add policies for authenticated users to manage their own contact settings
*/

-- Create contact settings table
CREATE TABLE IF NOT EXISTS contact_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  phone1 text NOT NULL,
  phone2 text NOT NULL,
  whatsapp1 text NOT NULL,
  whatsapp2 text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_settings_updated_at
  BEFORE UPDATE ON contact_settings
  FOR EACH ROW
  EXECUTE PROCEDURE update_contact_settings_updated_at();

-- Enable Row Level Security
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own contact settings"
  ON contact_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contact settings"
  ON contact_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contact settings"
  ON contact_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contact settings"
  ON contact_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_settings_user_id ON contact_settings(user_id);