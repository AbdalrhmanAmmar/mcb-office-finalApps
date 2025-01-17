import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as contactService from '../services/contactService';
import { toast } from 'react-toastify';

interface ContactInfo {
  email: string;
  phone1: string;
  phone2: string;
  whatsapp1: string;
  whatsapp2: string;
}

interface ContactContextType {
  contactInfo: ContactInfo;
  updateContactInfo: (info: ContactInfo) => Promise<void>;
  isLoading: boolean;
}

const defaultContactInfo: ContactInfo = {
  email: 'babe38463@gmail.com',
  phone1: '38280203',
  phone2: '42266947',
  whatsapp1: '42266947',
  whatsapp2: '38280203'
};

const ContactContext = createContext<ContactContextType | null>(null);

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadContactSettings();
    }
  }, [user]);

  const loadContactSettings = async () => {
    if (!user) return;

    try {
      const settings = await contactService.fetchContactSettings(user.id);
      if (settings) {
        setContactInfo({
          email: settings.email,
          phone1: settings.phone1,
          phone2: settings.phone2,
          whatsapp1: settings.whatsapp1,
          whatsapp2: settings.whatsapp2
        });
      }
    } catch (error) {
      console.error('Error loading contact settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContactInfo = async (info: ContactInfo) => {
    if (!user) {
      toast.error('You must be logged in to update contact settings');
      return;
    }

    try {
      await contactService.createOrUpdateContactSettings(user.id, info);
      setContactInfo(info);
    } catch (error) {
      console.error('Error updating contact settings:', error);
      throw error;
    }
  };

  return (
    <ContactContext.Provider value={{ contactInfo, updateContactInfo, isLoading }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
}