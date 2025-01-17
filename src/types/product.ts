export interface Product {
  id: string;
  image: string;
  name: string;
  quantity: number;
  price: number;
  customerName: string;
  phoneNumber: string;
  shippingType: 'air' | 'sea';
  shippingDuration: string;
  currency: 'USD' | 'RMB' | 'MRU';
}