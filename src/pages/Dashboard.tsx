import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, AlertTriangle, DollarSign, Wrench, Wallet, Coins, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCashStore } from '@/stores/cashStore';
import { useReservationStore } from '@/stores/reservationStore';
import { useIncidentStore } from '@/stores/incidentStore';
import { useDelinquencyStore } from '@/stores/delinquencyStore';
import { useWorkOrderStore } from '@/stores/workOrderStore';
import { formatCurrencyForInput } from '@/lib/utils';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export function Dashboard() {
  const { transactions } = useCashStore();
  const { reservations } = useReservationStore();
  const { incidents } = useIncidentStore();
  const { delinquencies } = useDelinquencyStore();
  const { workOrders } = useWorkOrderStore();
  
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [tempMonth, setTempMonth] = useState(months[new Date().getMonth()]);
  const [tempYear, setTempYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const filteredTransactions = useMemo(() => {
    if (!isFilterActive) {
      return transactions;
    }
    return transactions.filter(t => 
      t.month === selectedMonth && t.year === selectedYear
    );
  }, [transactions, isFilterActive, selectedMonth, selectedYear]);

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

  const handleFilter = () => {
    setSelectedMonth(tempMonth);
    setSelectedYear(parseInt(tempYear));
    setIsFilterActive(true);
  };

  const handleClearFilter = () => {
    setIsFilterActive(false);
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  const todayReservations = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return reservations.filter(r => {
      const reservationDate = new Date(r.date);
      reservationDate.setHours(0, 0, 0, 0);
      return reservationDate.getTime() === today.getTime();
    }).length;
  }, [reservations]);

  const openIncidents = useMemo(() => {
    return incidents.filter(i => i.status === 'open' || i.status === 'in_progress').length;
  }, [incidents]);

  const overdueDelinquencies = useMemo(() => {
    return delinquencies.filter(d => d.status === 'overdue').length;
  }, [delinquencies]);

  const pendingWorkOrders = useMemo(() => {
    return workOrders.filter(wo => wo.status === 'pending' || wo.status === 'in_progress').length;
  }, [workOrders]);

  const generalStats = [
    { title: 'Reservas Hoje', value: todayReservations.toString(), icon: Calendar, color: 'bg-blue-500' },
    { title: 'Ocorrências Abertas', value: openIncidents.toString(), icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Inadimplentes', value: overdueDelinquencies.toString(), icon: DollarSign, color: 'bg-yellow-500' },
    { title: 'Ordens de Serviço', value: pendingWorkOrders.toString(), icon: Wrench, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Filter Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtrar por Mês/Ano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Mês</Label>
              <Select
                value={tempMonth}
                onChange={(e) => setTempMonth(e.target.value)}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <Label>Ano</Label>
              <Select
                value={tempYear}
                onChange={(e) => setTempYear(e.target.value)}
              >
                {years.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFilter}>
                Filtrar
              </Button>
              {isFilterActive && (
                <Button variant="secondary" onClick={handleClearFilter}>
                  Limpar Filtro
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {generalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cash Stats */}
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
    </div>
  );
}
