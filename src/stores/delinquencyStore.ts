import { create } from 'zustand';
import { Delinquency } from '@/types';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

interface DelinquencyStore {
  delinquencies: Delinquency[];
  isLoading: boolean;
  fetchDelinquencies: () => Promise<void>;
  addDelinquency: (delinquency: Omit<Delinquency, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateDelinquency: (id: string, delinquency: Partial<Delinquency>) => Promise<{ success: boolean; error?: string }>;
  deleteDelinquency: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const useDelinquencyStore = create<DelinquencyStore>((set, get) => ({
  delinquencies: [],
  isLoading: false,

  fetchDelinquencies: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('delinquencies')
      .select('*')
      .order('due_date', { ascending: false });

    if (error) {
      console.error('Error fetching delinquencies:', error);
    } else {
      set({
        delinquencies: data.map((item: any) => ({
          id: item.id,
          unit: item.unit,
          residentName: item.resident_name,
          amount: item.amount,
          dueDate: new Date(item.due_date),
          status: item.status as 'overdue' | 'pending' | 'paid',
        })),
      });
    }
    set({ isLoading: false });
  },

  addDelinquency: async (delinquency) => {
    const dueDate = new Date(delinquency.dueDate);
    const month = months[dueDate.getMonth()];
    const year = dueDate.getFullYear();

    const { error } = await supabase.from('delinquencies').insert({
      unit: delinquency.unit,
      resident_name: delinquency.residentName,
      amount: delinquency.amount,
      due_date: delinquency.dueDate.toISOString().split('T')[0],
      status: delinquency.status || 'pending',
      month,
      year,
    });

    if (error) {
      console.error('Error adding delinquency:', error);
      return { success: false, error: error.message };
    }

    get().fetchDelinquencies();
    return { success: true };
  },

  updateDelinquency: async (id, delinquency) => {
    const updateData: any = {};
    if (delinquency.unit) updateData.unit = delinquency.unit;
    if (delinquency.residentName) updateData.resident_name = delinquency.residentName;
    if (delinquency.amount !== undefined) updateData.amount = delinquency.amount;
    
    if (delinquency.dueDate) {
      const dueDate = new Date(delinquency.dueDate);
      updateData.due_date = dueDate.toISOString().split('T')[0];
      updateData.month = months[dueDate.getMonth()];
      updateData.year = dueDate.getFullYear();
    }
    
    if (delinquency.status) updateData.status = delinquency.status;

    const { error } = await supabase
      .from('delinquencies')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating delinquency:', error);
      return { success: false, error: error.message };
    }

    get().fetchDelinquencies();
    return { success: true };
  },

  deleteDelinquency: async (id) => {
    const { error } = await supabase
      .from('delinquencies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting delinquency:', error);
      return { success: false, error: error.message };
    }

    get().fetchDelinquencies();
    return { success: true };
  },
}));

// Hook para inicializar a busca de inadimplências
export function useInitializeDelinquencies() {
  const fetchDelinquencies = useDelinquencyStore((state) => state.fetchDelinquencies);

  useEffect(() => {
    fetchDelinquencies();
  }, [fetchDelinquencies]);
}
