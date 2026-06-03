import { create } from 'zustand';
import { Reservation } from '@/types';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

interface ReservationStore {
  reservations: Reservation[];
  isLoading: boolean;
  fetchReservations: () => Promise<void>;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  updateReservation: (id: string, reservation: Partial<Reservation>) => Promise<{ success: boolean; error?: string }>;
  deleteReservation: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
  reservations: [],
  isLoading: false,

  fetchReservations: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations:', error);
    } else {
      set({
        reservations: data.map((item: any) => ({
          id: item.id,
          area: item.area,
          date: new Date(item.date),
          startTime: item.start_time,
          endTime: item.end_time,
          residentName: item.resident_name,
          unit: item.unit,
          status: item.status as 'pending' | 'confirmed' | 'cancelled',
          createdAt: new Date(item.created_at),
        })),
      });
    }
    set({ isLoading: false });
  },

  addReservation: async (reservation) => {
    const { error } = await supabase.from('reservations').insert({
      area: reservation.area,
      date: reservation.date.toISOString().split('T')[0],
      start_time: reservation.startTime,
      end_time: reservation.endTime,
      resident_name: reservation.residentName,
      unit: reservation.unit,
      status: reservation.status || 'pending',
    });

    if (error) {
      console.error('Error adding reservation:', error);
      return { success: false, error: error.message };
    }

    get().fetchReservations();
    return { success: true };
  },

  updateReservation: async (id, reservation) => {
    const updateData: any = {};
    if (reservation.area) updateData.area = reservation.area;
    if (reservation.date) updateData.date = reservation.date.toISOString().split('T')[0];
    if (reservation.startTime) updateData.start_time = reservation.startTime;
    if (reservation.endTime) updateData.end_time = reservation.endTime;
    if (reservation.residentName) updateData.resident_name = reservation.residentName;
    if (reservation.unit) updateData.unit = reservation.unit;
    if (reservation.status) updateData.status = reservation.status;

    const { error } = await supabase
      .from('reservations')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating reservation:', error);
      return { success: false, error: error.message };
    }

    get().fetchReservations();
    return { success: true };
  },

  deleteReservation: async (id) => {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting reservation:', error);
      return { success: false, error: error.message };
    }

    get().fetchReservations();
    return { success: true };
  },
}));

// Hook para inicializar a busca de reservas
export function useInitializeReservations() {
  const fetchReservations = useReservationStore((state) => state.fetchReservations);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);
}
