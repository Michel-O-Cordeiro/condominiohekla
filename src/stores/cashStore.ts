import { create } from 'zustand';
import { CashTransaction } from '@/types';

interface CashStore {
  transactions: CashTransaction[];
  addTransaction: (transaction: Omit<CashTransaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<CashTransaction>) => void;
  deleteTransaction: (id: string) => void;
}

const initialTransactions: CashTransaction[] = [
  {
    id: '1',
    type: 'income',
    category: {
      condominiumValue: 450.00,
      reserveValue: 50.00,
      workTaxValue: 0,
      paidApartments: 12
    },
    value: (450 + 50) * 12,
    month: 'Janeiro',
    year: 2024,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '2',
    type: 'income',
    category: {
      condominiumValue: 450.00,
      reserveValue: 50.00,
      workTaxValue: 30.00,
      paidApartments: 10
    },
    value: (450 + 50 + 30) * 10,
    month: 'Fevereiro',
    year: 2024,
    createdAt: new Date('2024-02-05')
  },
  {
    id: '3',
    type: 'expense',
    description: 'Manutenção do elevador',
    value: 1200.00,
    month: 'Fevereiro',
    year: 2024,
    createdAt: new Date('2024-02-15')
  },
  {
    id: '4',
    type: 'income',
    category: {
      condominiumValue: 450.00,
      reserveValue: 50.00,
      workTaxValue: 30.00,
      paidApartments: 15
    },
    value: (450 + 50 + 30) * 15,
    month: 'Março',
    year: 2024,
    createdAt: new Date('2024-03-05')
  },
  {
    id: '5',
    type: 'expense',
    description: 'Limpeza da área comum',
    value: 800.00,
    month: 'Março',
    year: 2024,
    createdAt: new Date('2024-03-20')
  }
];

export const useCashStore = create<CashStore>((set) => ({
  transactions: initialTransactions,
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        ...state.transactions,
        {
          ...transaction,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date(),
        },
      ],
    })),
  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...transaction } : t
      ),
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));
