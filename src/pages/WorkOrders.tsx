import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { IntegerInput } from '@/components/ui/integer-input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Pencil, Trash2, Plus, Trash } from 'lucide-react';
import { useWorkOrderStore } from '@/stores/workOrderStore';
import { useToast } from '@/components/ToastContainer';
import { WorkOrder, Product } from '@/types';
import { formatCurrencyForInput } from '@/lib/utils';

export function WorkOrders() {
  const { workOrders, addWorkOrder, updateWorkOrder, deleteWorkOrder } = useWorkOrderStore();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  const [deletingWorkOrderId, setDeletingWorkOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Pick<WorkOrder, 'title' | 'description' | 'products' | 'status' | 'assignedTo'> & { serviceValue: number }>({
    title: '',
    description: '',
    serviceValue: 0,
    products: [] as Product[],
    status: 'pending',
    assignedTo: '',
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: 0,
    unitPrice: 0,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'completed':
        return 'Concluída';
      default:
        return status;
    }
  };

  const handleOpenAddModal = () => {
    setEditingWorkOrder(null);
    setFormData({
      title: '',
      description: '',
      serviceValue: 0,
      products: [],
      status: 'pending',
      assignedTo: '',
    });
    setNewProduct({ name: '', quantity: 0, unitPrice: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (workOrder: WorkOrder) => {
    setEditingWorkOrder(workOrder);
    setFormData({
      title: workOrder.title,
      description: workOrder.description,
      serviceValue: workOrder.serviceValue,
      products: [...workOrder.products],
      status: workOrder.status,
      assignedTo: workOrder.assignedTo || '',
    });
    setNewProduct({ name: '', quantity: 0, unitPrice: 0 });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeletingWorkOrderId(id);
    setIsDeleteModalOpen(true);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.quantity || !newProduct.unitPrice) return;
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        {
          id: Math.random().toString(36).substring(2, 9),
          name: newProduct.name,
          quantity: newProduct.quantity,
          unitPrice: newProduct.unitPrice,
        },
      ],
    });
    setNewProduct({ name: '', quantity: 0, unitPrice: 0 });
  };

  const handleRemoveProduct = (id: string) => {
    setFormData({
      ...formData,
      products: formData.products.filter((p) => p.id !== id),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
    };
    if (editingWorkOrder) {
      const result = await updateWorkOrder(editingWorkOrder.id, data);
      if (result.success) {
        addToast('Ordem de serviço atualizada com sucesso!');
        setIsModalOpen(false);
      } else {
        addToast(`Atenção: Ocorreu um erro ao atualizar a ordem de serviço. ${result.error}`, 'error');
      }
    } else {
      const result = await addWorkOrder(data);
      if (result.success) {
        addToast('Ordem de serviço criada com sucesso!');
        setIsModalOpen(false);
      } else {
        addToast(`Atenção: Ocorreu um erro ao criar a ordem de serviço. ${result.error}`, 'error');
      }
    }
  };

  const handleDelete = async () => {
    if (deletingWorkOrderId) {
      const result = await deleteWorkOrder(deletingWorkOrderId);
      if (result.success) {
        addToast('Ordem de serviço excluída com sucesso!');
        setIsDeleteModalOpen(false);
        setDeletingWorkOrderId(null);
      } else {
        addToast(`Atenção: Ocorreu um erro ao excluir a ordem de serviço. ${result.error}`, 'error');
      }
    }
  };

  const calculateTotal = (products: Product[], serviceValue: number) => {
    const productsTotal = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    return serviceValue + productsTotal;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
        <Button onClick={handleOpenAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Ordem
        </Button>
      </div>

      <div className="grid gap-4">
        {workOrders.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-lg text-muted-foreground">Você ainda não tem ordens de serviço cadastradas</p>
          </div>
        ) : (
          workOrders.map((workOrder) => (
            <Card key={workOrder.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{workOrder.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(workOrder.status)}>
                      {getStatusLabel(workOrder.status)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditModal(workOrder)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDeleteModal(workOrder.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{workOrder.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Valor do Serviço:</span>{' '}
                    <span className="font-medium">
                      R$ {formatCurrencyForInput(workOrder.serviceValue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data:</span>{' '}
                    <span className="font-medium">
                      {workOrder.createdAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {workOrder.assignedTo && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Atribuído a:</span>{' '}
                      <span className="font-medium">{workOrder.assignedTo}</span>
                    </div>
                  )}
                </div>

                {workOrder.products.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Produtos Utilizados</h4>
                    <div className="space-y-1 text-sm">
                      {workOrder.products.map((product) => (
                        <div key={product.id} className="flex justify-between">
                          <span>
                            {product.name} x{product.quantity}
                          </span>
                          <span>
                            R$ {formatCurrencyForInput(product.quantity * product.unitPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-lg">
                    R$ {formatCurrencyForInput(workOrder.totalValue)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWorkOrder ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
        size="lg"
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
              <Label htmlFor="serviceValue">Valor do Serviço</Label>
              <CurrencyInput
                id="serviceValue"
                value={formData.serviceValue}
                onChange={(value) => setFormData({ ...formData, serviceValue: value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Atribuído a</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
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
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluída</option>
            </Select>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label>Produtos Utilizados</Label>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <Input
                  placeholder="Nome do produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="col-span-3">
                <IntegerInput
                  placeholder="Quantidade"
                  value={newProduct.quantity}
                  onChange={(value) => setNewProduct({ ...newProduct, quantity: value })}
                />
              </div>
              <div className="col-span-3">
                <CurrencyInput
                  placeholder="Preço unitário"
                  value={newProduct.unitPrice}
                  onChange={(value) => setNewProduct({ ...newProduct, unitPrice: value })}
                />
              </div>
              <div className="col-span-1">
                <Button type="button" onClick={handleAddProduct} size="icon" className="w-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {formData.products.length > 0 && (
              <div className="space-y-1">
                {formData.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 px-3 bg-muted rounded">
                    <span>
                      {product.name} x{product.quantity} - R$ {formatCurrencyForInput(product.unitPrice)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-2 border-t flex justify-between font-medium">
              <span>Total:</span>
              <span>
                R$ {formatCurrencyForInput(calculateTotal(formData.products, formData.serviceValue))}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingWorkOrder ? 'Salvar Alterações' : 'Criar Ordem'}
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
          <p>Tem certeza que deseja excluir esta ordem de serviço?</p>
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
