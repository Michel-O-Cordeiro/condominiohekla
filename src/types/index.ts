export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
}

export interface Reservation {
  id: string;
  area: string;
  date: Date;
  startTime: string;
  endTime: string;
  residentName: string;
  unit: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  type: 'security' | 'maintenance' | 'other';
  location: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  reportedBy: string;
  reportedAt: Date;
}

export interface Delinquency {
  id: string;
  unit: string;
  residentName: string;
  amount: number;
  dueDate: Date;
  status: 'overdue' | 'pending' | 'paid';
  month: string;
  year: number;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  serviceValue: number;
  products: Product[];
  totalValue: number;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CashTransaction {
  id: string;
  type: 'income' | 'expense';
  category?: {
    condominiumValue: number;
    reserveValue: number;
    workTaxValue: number;
    paidApartments: number;
  } | null;
  description?: string;
  value: number;
  month: string;
  year: number;
  createdAt: Date;
}
