import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useReservationStore } from '@/stores/reservationStore';
import { useToast } from '@/components/ToastContainer';
import { Reservation } from '@/types';

export function Reservations() {
  const { reservations, addReservation, updateReservation, deleteReservation } = useReservationStore();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [deletingReservationId, setDeletingReservationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Pick<Reservation, 'area' | 'residentName' | 'unit' | 'status'> & { date: string; startTime: string; endTime: string }>({
    area: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    residentName: '',
    unit: '',
    status: 'pending',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const handleOpenAddModal = () => {
    setEditingReservation(null);
    setFormData({
      area: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      residentName: '',
      unit: '',
      status: 'pending',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setFormData({
      area: reservation.area,
      date: reservation.date.toISOString().split('T')[0],
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      residentName: reservation.residentName,
      unit: reservation.unit,
      status: reservation.status,
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeletingReservationId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      date: new Date(formData.date),
    };
    
    if (editingReservation) {
      const result = await updateReservation(editingReservation.id, data);
      if (result.success) {
        addToast('Reserva atualizada com sucesso!');
        setIsModalOpen(false);
      } else {
        addToast(`Atenção: Ocorreu um erro ao atualizar a reserva. ${result.error}`, 'error');
      }
    } else {
      const result = await addReservation(data);
      if (result.success) {
        addToast('Reserva criada com sucesso!');
        setIsModalOpen(false);
      } else {
        addToast(`Atenção: Ocorreu um erro ao criar a reserva. ${result.error}`, 'error');
      }
    }
  };

  const handleDelete = async () => {
    if (deletingReservationId) {
      const result = await deleteReservation(deletingReservationId);
      if (result.success) {
        addToast('Reserva excluída com sucesso!');
        setIsDeleteModalOpen(false);
        setDeletingReservationId(null);
      } else {
        addToast(`Atenção: Ocorreu um erro ao excluir a reserva. ${result.error}`, 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reservas de Áreas Comuns</h1>
        <Button onClick={handleOpenAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Reserva
        </Button>
      </div>

      <div className="grid gap-4">
        {reservations.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-muted-foreground">Você ainda não tem reservas cadastradas</p>
          </div>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{reservation.area}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(reservation.status)}>
                      {getStatusLabel(reservation.status)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditModal(reservation)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDeleteModal(reservation.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Data:</span>{' '}
                    <span className="font-medium">
                      {reservation.date.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Horário:</span>{' '}
                    <span className="font-medium">
                      {reservation.startTime} - {reservation.endTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Morador:</span>{' '}
                    <span className="font-medium">{reservation.residentName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Unidade:</span>{' '}
                    <span className="font-medium">{reservation.unit}</span>
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
        title={editingReservation ? 'Editar Reserva' : 'Nova Reserva'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="area">Área</Label>
            <Input
              id="area"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Início</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Fim</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="residentName">Nome do Morador</Label>
              <Input
                id="residentName"
                value={formData.residentName}
                onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              required
            >
              <option value="pending">Pendente</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingReservation ? 'Salvar Alterações' : 'Criar Reserva'}
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
          <p>Tem certeza que deseja excluir esta reserva?</p>
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
