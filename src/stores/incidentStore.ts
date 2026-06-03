import { create } from 'zustand';
import { Incident } from '@/types';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

interface IncidentStore {
  incidents: Incident[];
  isLoading: boolean;
  fetchIncidents: () => Promise<void>;
  addIncident: (incident: Omit<Incident, 'id' | 'reportedAt'>) => Promise<{ success: boolean; error?: string }>;
  updateIncident: (id: string, incident: Partial<Incident>) => Promise<{ success: boolean; error?: string }>;
  deleteIncident: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidents: [],
  isLoading: false,

  fetchIncidents: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('reported_at', { ascending: false });

    if (error) {
      console.error('Error fetching incidents:', error);
    } else {
      set({
        incidents: data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.type as 'security' | 'maintenance' | 'other',
          location: item.location,
          status: item.status as 'open' | 'in_progress' | 'resolved',
          priority: item.priority as 'low' | 'medium' | 'high',
          reportedBy: item.reported_by,
          reportedAt: new Date(item.reported_at || item.created_at),
        })),
      });
    }
    set({ isLoading: false });
  },

  addIncident: async (incident) => {
    const { error } = await supabase.from('incidents').insert({
      title: incident.title,
      description: incident.description,
      type: incident.type,
      location: incident.location,
      status: incident.status || 'open',
      priority: incident.priority || 'medium',
      reported_by: incident.reportedBy,
    });

    if (error) {
      console.error('Error adding incident:', error);
      return { success: false, error: error.message };
    }

    get().fetchIncidents();
    return { success: true };
  },

  updateIncident: async (id, incident) => {
    const updateData: any = {};
    if (incident.title) updateData.title = incident.title;
    if (incident.description) updateData.description = incident.description;
    if (incident.type) updateData.type = incident.type;
    if (incident.location) updateData.location = incident.location;
    if (incident.status) updateData.status = incident.status;
    if (incident.priority) updateData.priority = incident.priority;
    if (incident.reportedBy) updateData.reported_by = incident.reportedBy;

    const { error } = await supabase
      .from('incidents')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating incident:', error);
      return { success: false, error: error.message };
    }

    get().fetchIncidents();
    return { success: true };
  },

  deleteIncident: async (id) => {
    const { error } = await supabase
      .from('incidents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting incident:', error);
      return { success: false, error: error.message };
    }

    get().fetchIncidents();
    return { success: true };
  },
}));

// Hook para inicializar a busca de ocorrências
export function useInitializeIncidents() {
  const fetchIncidents = useIncidentStore((state) => state.fetchIncidents);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);
}
