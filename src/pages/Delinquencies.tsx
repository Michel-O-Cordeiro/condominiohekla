import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Delinquency } from '@/types';

const mockDelinquencies: Delinquency[] = [
  {
    id: '1',
    unit: 'Apto 103',
    residentName: 'Fernanda Costa',
    amount: 450.00,
    dueDate: new Date('2024-11-05'),
    status: 'overdue',
    month: 'Novembro',
    year: 2024
  },
  {
    id: '2',
    unit: 'Apto 302',
    residentName: 'Ricardo Mendes',
    amount: 450.00,
    dueDate: new Date('2024-12-05'),
    status: 'pending',
    month: 'Dezembro',
    year: 2024
  }
];

export function Delinquencies() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Controle de Inadimplência</h1>
      
      <div className="grid gap-4">
        {mockDelinquencies.map((delinquency) => (
          <Card key={delinquency.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{delinquency.unit}</CardTitle>
                <Badge className={getStatusColor(delinquency.status)}>
                  {getStatusLabel(delinquency.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Morador:</span>{' '}
                  <span className="font-medium">{delinquency.residentName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Mês/Ano:</span>{' '}
                  <span className="font-medium">{delinquency.month}/{delinquency.year}</span>
                </div>
                <div>
                  <span className="text-slate-500">Valor:</span>{' '}
                  <span className="font-medium text-lg">
                    R$ {delinquency.amount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Vencimento:</span>{' '}
                  <span className="font-medium">
                    {delinquency.dueDate.toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
