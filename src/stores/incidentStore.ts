import { create } from 'zustand';
import { Incident } from '@/types';

interface IncidentStore {
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'reportedAt'>) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
}

const initialIncidents: Incident[] = [
  {
    id: '1',
    title: 'Luz quebrada no corredor',
    description: 'Lâmpada do corredor do 2º andar quebrada.',
    type: 'maintenance',
    location: 'Corredor 2º andar',
    status: 'in_progress',
    priority: 'medium',
    reportedBy: 'Ana Oliveira',
    reportedAt: new Date('2024-12-10')
  },
  {
    id: '2',
    title: 'Portão com problema',
    description: 'Portão principal não está fechando corretamente.',
    type: 'security',
    location: 'Portão principal',
    status: 'open',
    priority: 'high',
    reportedBy: 'Carlos Pereira',
    reportedAt: new Date('2024-12-12')
  }
];

export const useIncidentStore = create<IncidentStore>((set) => ({
  incidents: initialIncidents,
  addIncident: (incident) =>
    set((state) => ({
      incidents: [
        ...state.incidents,
        {
          ...incident,
          id: Math.random().toString(36).substring(2, 9),
          reportedAt: new Date(),
        },
      ],
    })),
  updateIncident: (id, incident) =>
    set((state) => ({
      incidents: state.incidents.map((i) =>
        i.id === id ? { ...i, ...incident } : i
      ),
    })),
  deleteIncident: (id) =>
    set((state) => ({
      incidents: state.incidents.filter((i) => i.id !== id),
    })),
}));
