import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { IntegerInput } from '@/components/ui/integer-input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useDelinquencyStore } from '@/stores/delinquencyStore';
import { useToast } from '@/components/ToastContainer';
import { Delinquency } from '@/types';
import { formatCurrencyForInput } from '@/lib/utils';

export function Delinquencies() {
  const { delinquencies, addDelinquency, updateDelinquency, deleteDelinquency } = useDelinquencyStore();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDelinquency, setEditingDelinquency] = useState<Delinquency | null>(null);
  const [deletingDelinquencyId, setDeletingDelinquencyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Pick<Delinquency, 'unit' | 'residentName' | 'status' | 'month'> & { amount: number; dueDate: string; year: number }>({
    unit: '',
    residentName: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    month: '',
    year: new Date().getFullYear(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'Vencida';
      case 'pending':
        return 'Pendente';
      case 'paid':
        return 'Paga';
      default:
        return status;
    }
  };

  const handleOpenAddModal = () => {
    setEditingDelinquency(null);
    setFormData({
      unit: '',
      residentName: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      month: '',
      year: new Date().getFullYear(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (delinquency: Delinquency) => {
    setEditingDelinquency(delinquency);
    setFormData({
      unit: delinquency.unit,
      residentName: delinquency.residentName,
      amount: delinquency.amount,
      dueDate: delinquency.dueDate.toISOString().split('T')[0],
      status: delinquency.status,
      month: delinquency.month,
      year: delinquency.year,
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeletingDelinquencyId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      dueDate: new Date(formData.dueDate),
    };
    if (editingDelinquency) {
      updateDelinquency(editingDelinquency.id, data);
      addToast('Inadimplência atualizada com sucesso!');
    } else {
      addDelinquency(data);
      addToast('Inadimplência criada com sucesso!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deletingDelinquencyId) {
      deleteDelinquency(deletingDelinquencyId);
      addToast('Inadimplência excluída com sucesso!');
      setIsDeleteModalOpen(false);
      setDeletingDelinquencyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Controle de Inadimplência</h1>
        <Button onClick={handleOpenAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Inadimplência
        </Button>
      </div>

      <div className="grid gap-4">
        {delinquencies.map((delinquency) => (
          <Card key={delinquency.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{delinquency.unit}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(delinquency.status)}>
                    {getStatusLabel(delinquency.status)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEditModal(delinquency)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDeleteModal(delinquency.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Morador:</span>{' '}
                  <span className="font-medium">{delinquency.residentName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mês/Ano:</span>{' '}
                  <span className="font-medium">{delinquency.month}/{delinquency.year}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor:</span>{' '}
                  <span className="font-medium text-lg">
                    R$ {formatCurrencyForInput(delinquency.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Vencimento:</span>{' '}
                  <span className="font-medium">
                    {delinquency.dueDate.toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDelinquency ? 'Editar Inadimplência' : 'Nova Inadimplência'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="residentName">Nome do Morador</Label>
              <Input
                id="residentName"
                value={formData.residentName}
                onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <CurrencyInput
                id="amount"
                value={formData.amount}
                onChange={(value) => setFormData({ ...formData, amount: value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mês</Label>
              <Input
                id="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                placeholder="Ex: Janeiro"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <IntegerInput
                id="year"
                value={formData.year}
                onChange={(value) => setFormData({ ...formData, year: value })}
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
              <option value="overdue">Vencida</option>
              <option value="paid">Paga</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingDelinquency ? 'Salvar Alterações' : 'Criar Inadimplência'}
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
          <p>Tem certeza que deseja excluir esta inadimplência?</p>
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
