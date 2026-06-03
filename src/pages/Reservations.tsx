import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Reservation } from '@/types';

const mockReservations: Reservation[] = [
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

export function Reservations() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reservas de Áreas Comuns</h1>
      
      <div className="grid gap-4">
        {mockReservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{reservation.area}</CardTitle>
                <Badge className={getStatusColor(reservation.status)}>
                  {getStatusLabel(reservation.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Data:</span>{' '}
                  <span className="font-medium">
                    {reservation.date.toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Horário:</span>{' '}
                  <span className="font-medium">
                    {reservation.startTime} - {reservation.endTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Morador:</span>{' '}
                  <span className="font-medium">{reservation.residentName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Unidade:</span>{' '}
                  <span className="font-medium">{reservation.unit}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
