import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useIncidentStore } from '@/stores/incidentStore';
import { useToast } from '@/components/ToastContainer';
import { Incident } from '@/types';

export function Incidents() {
  const { incidents, addIncident, updateIncident, deleteIncident } = useIncidentStore();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [deletingIncidentId, setDeletingIncidentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Pick<Incident, 'title' | 'description' | 'type' | 'location' | 'status' | 'priority' | 'reportedBy'>>({
    title: '',
    description: '',
    type: 'maintenance',
    location: '',
    status: 'open',
    priority: 'medium',
    reportedBy: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'security':
        return 'Segurança';
      case 'maintenance':
        return 'Manutenção';
      case 'other':
        return 'Outro';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberta';
      case 'in_progress':
        return 'Em Andamento';
      case 'resolved':
        return 'Resolvida';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  const handleOpenAddModal = () => {
    setEditingIncident(null);
    setFormData({
      title: '',
      description: '',
      type: 'maintenance',
      location: '',
      status: 'open',
      priority: 'medium',
      reportedBy: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (incident: Incident) => {
    setEditingIncident(incident);
    setFormData({
      title: incident.title,
      description: incident.description,
      type: incident.type,
      location: incident.location,
      status: incident.status,
      priority: incident.priority,
      reportedBy: incident.reportedBy,
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeletingIncidentId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIncident) {
      const result = await updateIncident(editingIncident.id, formData);
      if (result.success) {
        addToast('Ocorrência atualizada com sucesso!');
        setIsModalOpen(false);
      } else {
        addToast(`Atenção: Ocorreu um erro ao atualizar a ocorrência. ${result.error}`, 'error');
      }
    } else {
      const result = await addIncident(formData);
      if (result.success) {
        addToast('Ocorrência criada com sucesso!');
        setIsModalOpen(false);
      } else {
        addToast(`Atenção: Ocorreu um erro ao criar a ocorrência. ${result.error}`, 'error');
      }
    }
  };

  const handleDelete = async () => {
    if (deletingIncidentId) {
      const result = await deleteIncident(deletingIncidentId);
      if (result.success) {
        addToast('Ocorrência excluída com sucesso!');
        setIsDeleteModalOpen(false);
        setDeletingIncidentId(null);
      } else {
        addToast(`Atenção: Ocorreu um erro ao excluir a ocorrência. ${result.error}`, 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Registro de Ocorrências</h1>
        <Button onClick={handleOpenAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Ocorrência
        </Button>
      </div>

      <div className="grid gap-4">
        {incidents.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-muted-foreground">Você ainda não tem ocorrências cadastradas</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <Card key={incident.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{incident.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(incident.status)}>
                      {getStatusLabel(incident.status)}
                    </Badge>
                    <Badge className={getPriorityColor(incident.priority)}>
                      {getPriorityLabel(incident.priority)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditModal(incident)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDeleteModal(incident.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>{' '}
                    <span className="font-medium">{getTypeLabel(incident.type)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Localização:</span>{' '}
                    <span className="font-medium">{incident.location}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reportado por:</span>{' '}
                    <span className="font-medium">{incident.reportedBy}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data:</span>{' '}
                    <span className="font-medium">
                      {incident.reportedAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIncident ? 'Editar Ocorrência' : 'Nova Ocorrência'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                required
              >
                <option value="security">Segurança</option>
                <option value="maintenance">Manutenção</option>
                <option value="other">Outro</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                required
              >
                <option value="open">Aberta</option>
                <option value="in_progress">Em Andamento</option>
                <option value="resolved">Resolvida</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                required
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reportedBy">Reportado por</Label>
            <Input
              id="reportedBy"
              value={formData.reportedBy}
              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingIncident ? 'Salvar Alterações' : 'Criar Ocorrência'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p>Tem certeza que deseja excluir esta ocorrência?</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
