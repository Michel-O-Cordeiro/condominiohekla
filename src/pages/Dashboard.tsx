import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, AlertTriangle, DollarSign, Wrench } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { title: 'Reservas Hoje', value: '5', icon: Calendar, color: 'bg-blue-500' },
    { title: 'Ocorrências Abertas', value: '3', icon: AlertTriangle, color: 'bg-red-500' },
    { title: 'Inadimplentes', value: '8', icon: DollarSign, color: 'bg-yellow-500' },
    { title: 'Ordens de Serviço', value: '2', icon: Wrench, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
    </div>
  );
}
