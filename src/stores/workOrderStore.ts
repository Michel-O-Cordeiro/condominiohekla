import { create } from 'zustand';
import { WorkOrder } from '@/types';

interface WorkOrderStore {
  workOrders: WorkOrder[];
  addWorkOrder: (workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'totalValue'>) => void;
  updateWorkOrder: (id: string, workOrder: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
}

const initialWorkOrders: WorkOrder[] = [
  {
    id: '1',
    title: 'Reparo de luz no corredor',
    description: 'Trocar lâmpada quebrada no corredor do 2º andar.',
    serviceValue: 80.00,
    products: [
      { id: '1', name: 'Lâmpada LED', quantity: 2, unitPrice: 25.00 }
    ],
    totalValue: 130.00,
    status: 'completed',
    createdAt: new Date('2024-12-10')
  },
  {
    id: '2',
    title: 'Manutenção portão',
    description: 'Ajustar motor do portão principal.',
    serviceValue: 150.00,
    products: [],
    totalValue: 150.00,
    status: 'in_progress',
    createdAt: new Date('2024-12-12')
  }
];

export const useWorkOrderStore = create<WorkOrderStore>((set) => ({
  workOrders: initialWorkOrders,
  addWorkOrder: (workOrder) => {
    const productsTotal = workOrder.products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    const totalValue = workOrder.serviceValue + productsTotal;
    set((state) => ({
      workOrders: [
        ...state.workOrders,
        {
          ...workOrder,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date(),
          totalValue,
        },
      ],
    }));
  },
  updateWorkOrder: (id, workOrder) =>
    set((state) => ({
      workOrders: state.workOrders.map((wo) => {
        if (wo.id === id) {
          const updated = { ...wo, ...workOrder };
          const productsTotal = updated.products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
          return { ...updated, totalValue: updated.serviceValue + productsTotal };
        }
        return wo;
      }),
    })),
  deleteWorkOrder: (id) =>
    set((state) => ({
      workOrders: state.workOrders.filter((wo) => wo.id !== id),
    })),
}));
