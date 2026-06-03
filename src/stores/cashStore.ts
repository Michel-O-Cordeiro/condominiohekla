import { create } from 'zustand';
import { CashTransaction } from '@/types';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

interface CashStore {
  transactions: CashTransaction[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<CashTransaction, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateTransaction: (id: string, transaction: Partial<CashTransaction>) => Promise<{ success: boolean; error?: string }>;
  deleteTransaction: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const useCashStore = create<CashStore>((set, get) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('cash_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      set({
        transactions: data.map((item: any) => ({
          id: item.id,
          type: item.type as 'income' | 'expense',
          category: item.category,
          description: item.description,
          value: item.value,
          month: item.month,
          year: item.year,
          createdAt: new Date(item.created_at),
        })),
      });
    }
    set({ isLoading: false });
  },

  addTransaction: async (transaction) => {
    const { error } = await supabase.from('cash_transactions').insert({
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      value: transaction.value,
      month: transaction.month,
      year: transaction.year,
    });

    if (error) {
      console.error('Error adding cash transaction:', error);
      return { success: false, error: error.message };
    }

    get().fetchTransactions();
    return { success: true };
  },

  updateTransaction: async (id, transaction) => {
    const updateData: any = {};
    if (transaction.type) updateData.type = transaction.type;
    if (transaction.category !== undefined) updateData.category = transaction.category;
    if (transaction.description !== undefined) updateData.description = transaction.description;
    if (transaction.value !== undefined) updateData.value = transaction.value;
    if (transaction.month) updateData.month = transaction.month;
    if (transaction.year !== undefined) updateData.year = transaction.year;

    const { error } = await supabase
      .from('cash_transactions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating cash transaction:', error);
      return { success: false, error: error.message };
    }

    get().fetchTransactions();
    return { success: true };
  },

  deleteTransaction: async (id) => {
    const { error } = await supabase
      .from('cash_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting cash transaction:', error);
      return { success: false, error: error.message };
    }

    get().fetchTransactions();
    return { success: true };
  },
}));

// Hook para inicializar a busca de transações
export function useInitializeTransactions() {
  const fetchTransactions = useCashStore((state) => state.fetchTransactions);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
}
