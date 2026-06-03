import { create } from 'zustand';
import { Reservation } from '@/types';

interface ReservationStore {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
}

const initialReservations: Reservation[] = [
  {
    id: '1',
    area: 'Salão de Festas',
    date: new Date('2024-12-15'),
    startTime: '14:00',
    endTime: '22:00',
    residentName: 'João Silva',
    unit: 'Apto 101',
    status: 'confirmed',
    createdAt: new Date()
  },
  {
    id: '2',
    area: 'Churrasqueira',
    date: new Date('2024-12-20'),
    startTime: '11:00',
    endTime: '18:00',
    residentName: 'Maria Santos',
    unit: 'Apto 205',
    status: 'pending',
    createdAt: new Date()
  }
];

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: initialReservations,
  addReservation: (reservation) =>
    set((state) => ({
      reservations: [
        ...state.reservations,
        {
          ...reservation,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date(),
        },
      ],
    })),
  updateReservation: (id, reservation) =>
    set((state) => ({
      reservations: state.reservations.map((r) =>
        r.id === id ? { ...r, ...reservation } : r
      ),
    })),
  deleteReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((r) => r.id !== id),
    })),
}));
