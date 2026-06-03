import { create } from 'zustand';
import { Delinquency } from '@/types';

interface DelinquencyStore {
  delinquencies: Delinquency[];
  addDelinquency: (delinquency: Omit<Delinquency, 'id'>) => void;
  updateDelinquency: (id: string, delinquency: Partial<Delinquency>) => void;
  deleteDelinquency: (id: string) => void;
}

const initialDelinquencies: Delinquency[] = [
  {
    id: '1',
    unit: 'Apto 103',
    residentName: 'Fernanda Costa',
    amount: 450.00,
    dueDate: new Date('2024-11-05'),
    status: 'overdue',
    month: 'Novembro',
    year: 2024
  },
  {
    id: '2',
    unit: 'Apto 302',
    residentName: 'Ricardo Mendes',
    amount: 450.00,
    dueDate: new Date('2024-12-05'),
    status: 'pending',
    month: 'Dezembro',
    year: 2024
  }
];

export const useDelinquencyStore = create<DelinquencyStore>((set) => ({
  delinquencies: initialDelinquencies,
  addDelinquency: (delinquency) =>
    set((state) => ({
      delinquencies: [
        ...state.delinquencies,
        {
          ...delinquency,
          id: Math.random().toString(36).substring(2, 9),
        },
      ],
    })),
  updateDelinquency: (id, delinquency) =>
    set((state) => ({
      delinquencies: state.delinquencies.map((d) =>
        d.id === id ? { ...d, ...delinquency } : d
      ),
    })),
  deleteDelinquency: (id) =>
    set((state) => ({
      delinquencies: state.delinquencies.filter((d) => d.id !== id),
    })),
}));
