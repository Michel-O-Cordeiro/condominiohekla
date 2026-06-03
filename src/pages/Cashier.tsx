import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { IntegerInput } from '@/components/ui/integer-input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight, Wallet, Coins, ArrowLeftRight } from 'lucide-react';
import { useCashStore } from '@/stores/cashStore';
import { useToast } from '@/components/ToastContainer';
import { CashTransaction } from '@/types';
import { formatCurrencyForInput } from '@/lib/utils';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export function Cashier() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useCashStore();
  const { addToast } = useToast();
  
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<CashTransaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [formData, setFormData] = useState<{
    condominiumValue: number;
    reserveValue: number;
    workTaxValue: number;
    paidApartments: number;
    description: string;
    value: number;
    month: string;
    year: number;
  }>({
    condominiumValue: 0,
    reserveValue: 0,
    workTaxValue: 0,
    paidApartments: 0,
    description: '',
    value: 0,
    month: months[new Date().getMonth()],
    year: currentYear,
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.month === selectedMonth && t.year === parseInt(selectedYear)
    );
  }, [transactions, selectedMonth, selectedYear]);

  const totalValue = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => {
      return t.type === 'income' ? sum + t.value : sum - t.value;
    }, 0);
  }, [filteredTransactions]);

  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0);
  }, [filteredTransactions]);

  const totalExpense = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);
  }, [filteredTransactions]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'expense':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'income':
        return 'Entrada';
      case 'expense':
        return 'Saída';
      default:
        return type;
    }
  };

  const handleOpenAddModal = (type: 'income' | 'expense') => {
    setEditingTransaction(null);
    setFormType(type);
    setFormData({
      condominiumValue: 0,
      reserveValue: 0,
      workTaxValue: 0,
      paidApartments: 0,
      description: '',
      value: 0,
      month: selectedMonth,
      year: parseInt(selectedYear),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (transaction: CashTransaction) => {
    setEditingTransaction(transaction);
    setFormType(transaction.type);
    setFormData({
      condominiumValue: transaction.category?.condominiumValue || 0,
      reserveValue: transaction.category?.reserveValue || 0,
      workTaxValue: transaction.category?.workTaxValue || 0,
      paidApartments: transaction.category?.paidApartments || 0,
      description: transaction.description || '',
      value: transaction.value,
      month: transaction.month,
      year: transaction.year,
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeletingTransactionId(id);
    setIsDeleteModalOpen(true);
  };

  const calculateTotalIncomeValue = () => {
    const condominium = formData.condominiumValue || 0;
    const reserve = formData.reserveValue || 0;
    const workTax = formData.workTaxValue || 0;
    const apartments = formData.paidApartments || 0;
    return (condominium + reserve + workTax) * apartments;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let transactionValue: number;
    let category: CashTransaction['category'] = null;
    let description: string | undefined = undefined;

    if (formType === 'income') {
      transactionValue = calculateTotalIncomeValue();
      category = {
        condominiumValue: formData.condominiumValue || 0,
        reserveValue: formData.reserveValue || 0,
        workTaxValue: formData.workTaxValue || 0,
        paidApartments: formData.paidApartments || 0,
      };
    } else {
      transactionValue = formData.value;
      description = formData.description;
    }

    const data = {
      type: formType,
      category,
      description,
      value: transactionValue,
      month: formData.month,
      year: formData.year,
    };

    if (editingTransaction) {
      const result = await updateTransaction(editingTransaction.id, data);
      if (result.success) {
        addToast('Transação atualizada com sucesso!');
        setIsModalOpen(false);
      } else {
        addToast(`Atenção: Ocorreu um erro ao atualizar a transação. ${result.error}`, 'error');
      }
    } else {
      const result = await addTransaction(data);
      if (result.success) {
        addToast('Transação criada com sucesso!');
        setIsModalOpen(false);
      } else {
        addToast(`Atenção: Ocorreu um erro ao criar a transação. ${result.error}`, 'error');
      }
    }
  };

  const handleDelete = async () => {
    if (deletingTransactionId) {
      const result = await deleteTransaction(deletingTransactionId);
      if (result.success) {
        addToast('Transação excluída com sucesso!');
        setIsDeleteModalOpen(false);
        setDeletingTransactionId(null);
      } else {
        addToast(`Atenção: Ocorreu um erro ao excluir a transação. ${result.error}`, 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Caixa</h1>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleOpenAddModal('income')}>
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Nova Entrada
          </Button>
          <Button onClick={() => handleOpenAddModal('expense')} variant="secondary">
            <ArrowDownRight className="h-4 w-4 mr-2" />
            Nova Saída
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtrar por Mês/Ano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mês</Label>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ano</Label>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <div className="bg-blue-500 p-2 rounded-lg">
              <Wallet className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {formatCurrencyForInput(totalValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            <div className="bg-green-500 p-2 rounded-lg">
              <Coins className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              R$ {formatCurrencyForInput(totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            <div className="bg-red-500 p-2 rounded-lg">
              <ArrowLeftRight className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              R$ {formatCurrencyForInput(totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <div className="grid gap-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Nenhuma transação encontrada para este período.
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">
                        {transaction.type === 'income' ? 'Recebimento' : transaction.description}
                      </CardTitle>
                      <Badge className={getTypeColor(transaction.type)}>
                        {getTypeLabel(transaction.type)}
                      </Badge>
                    </div>
                    {transaction.category && transaction.type === 'income' && (
                      <div className="text-sm text-muted-foreground">
                        Condomínio: R$ {formatCurrencyForInput(transaction.category.condominiumValue)} |
                        Reserva: R$ {formatCurrencyForInput(transaction.category.reserveValue)} |
                        Taxa de Obra: R$ {formatCurrencyForInput(transaction.category.workTaxValue)} |
                        Apartamentos: {transaction.category.paidApartments}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditModal(transaction)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDeleteModal(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {transaction.createdAt.toLocaleDateString('pt-BR')}
                  </div>
                  <div className={`text-xl font-bold ${
                    transaction.type === 'income' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} R$ {formatCurrencyForInput(transaction.value)}
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
        title={editingTransaction ? 'Editar Transação' : (formType === 'income' ? 'Nova Entrada' : 'Nova Saída')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formType === 'income' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condominiumValue">Valor do Condomínio</Label>
                  <CurrencyInput
                    id="condominiumValue"
                    value={formData.condominiumValue}
                    onChange={(value) => setFormData({ ...formData, condominiumValue: value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reserveValue">Valor da Reserva</Label>
                  <CurrencyInput
                    id="reserveValue"
                    value={formData.reserveValue}
                    onChange={(value) => setFormData({ ...formData, reserveValue: value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workTaxValue">Valor da Taxa de Obra</Label>
                  <CurrencyInput
                    id="workTaxValue"
                    value={formData.workTaxValue}
                    onChange={(value) => setFormData({ ...formData, workTaxValue: value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paidApartments">Apartamentos Pagos</Label>
                  <IntegerInput
                    id="paidApartments"
                    value={formData.paidApartments}
                    onChange={(value) => setFormData({ ...formData, paidApartments: value })}
                    required
                  />
                </div>
              </div>
              {!editingTransaction && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    Total calculado: <span className="font-bold">R$ {formatCurrencyForInput(calculateTotalIncomeValue())}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Valor</Label>
                <CurrencyInput
                  id="value"
                  value={formData.value}
                  onChange={(value) => setFormData({ ...formData, value: value })}
                  required
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mês</Label>
              <Select
                id="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                required
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <Select
                id="year"
                value={formData.year.toString()}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              >
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingTransaction ? 'Salvar Alterações' : 'Criar Transação'}
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
          <p>Tem certeza que deseja excluir esta transação?</p>
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
