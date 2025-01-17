import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type ContactSettings = Database['public']['Tables']['contact_settings']['Row'];

export async function fetchContactSettings(userId: string): Promise<ContactSettings | null> {
  const { data, error } = await supabase
    .from('contact_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching contact settings:', error);
    throw error;
  }

  return data;
}

export async function createOrUpdateContactSettings(
  userId: string,
  settings: Omit<ContactSettings, 'id' | 'created_at' | 'updated_at' | 'user_id'>
): Promise<ContactSettings> {
  // First try to get existing settings
  const { data: existing } = await supabase
    .from('contact_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Update existing settings
    const { data, error } = await supabase
      .from('contact_settings')
      .update({ ...settings })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact settings:', error);
      throw error;
    }

    return data;
  } else {
    // Create new settings
    const { data, error } = await supabase
      .from('contact_settings')
      .insert([{ ...settings, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('Error creating contact settings:', error);
      throw error;
    }

    return data;
  }
}