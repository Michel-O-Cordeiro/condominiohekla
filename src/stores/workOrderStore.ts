import { create } from 'zustand';
import { WorkOrder } from '@/types';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

interface WorkOrderStore {
  workOrders: WorkOrder[];
  isLoading: boolean;
  fetchWorkOrders: () => Promise<void>;
  addWorkOrder: (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'totalValue'>) => Promise<{ success: boolean; error?: string }>;
  updateWorkOrder: (id: string, workOrder: Partial<WorkOrder>) => Promise<{ success: boolean; error?: string }>;
  deleteWorkOrder: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const useWorkOrderStore = create<WorkOrderStore>((set, get) => ({
  workOrders: [],
  isLoading: false,

  fetchWorkOrders: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching work orders:', error);
    } else {
      set({
        workOrders: data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          serviceValue: item.service_value,
          products: item.products || [],
          totalValue: item.total_value,
          status: item.status as 'pending' | 'in_progress' | 'completed',
          assignedTo: item.assigned_to,
          createdAt: new Date(item.created_at),
        })),
      });
    }
    set({ isLoading: false });
  },

  addWorkOrder: async (workOrder) => {
    const productsTotal = workOrder.products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    const totalValue = workOrder.serviceValue + productsTotal;

    const { error } = await supabase.from('work_orders').insert({
      title: workOrder.title,
      description: workOrder.description,
      service_value: workOrder.serviceValue,
      products: workOrder.products,
      total_value: totalValue,
      status: workOrder.status || 'pending',
      assigned_to: workOrder.assignedTo,
    });

    if (error) {
      console.error('Error adding work order:', error);
      return { success: false, error: error.message };
    }

    get().fetchWorkOrders();
    return { success: true };
  },

  updateWorkOrder: async (id, workOrder) => {
    // Get current work order to calculate total value
    const current = get().workOrders.find(wo => wo.id === id);
    const updatedProducts = workOrder.products || current?.products || [];
    const updatedServiceValue = workOrder.serviceValue ?? current?.serviceValue ?? 0;
    const productsTotal = updatedProducts.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    const totalValue = updatedServiceValue + productsTotal;

    const updateData: any = {};
    if (workOrder.title) updateData.title = workOrder.title;
    if (workOrder.description) updateData.description = workOrder.description;
    if (workOrder.serviceValue !== undefined) updateData.service_value = workOrder.serviceValue;
    if (workOrder.products) updateData.products = workOrder.products;
    if (workOrder.status) updateData.status = workOrder.status;
    if (workOrder.assignedTo !== undefined) updateData.assigned_to = workOrder.assignedTo;
    updateData.total_value = totalValue;

    const { error } = await supabase
      .from('work_orders')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating work order:', error);
      return { success: false, error: error.message };
    }

    get().fetchWorkOrders();
    return { success: true };
  },

  deleteWorkOrder: async (id) => {
    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting work order:', error);
      return { success: false, error: error.message };
    }

    get().fetchWorkOrders();
    return { success: true };
  },
}));

// Hook para inicializar a busca de ordens de serviço
export function useInitializeWorkOrders() {
  const fetchWorkOrders = useWorkOrderStore((state) => state.fetchWorkOrders);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);
}
