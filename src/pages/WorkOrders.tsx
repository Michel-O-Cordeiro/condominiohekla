import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkOrder } from '@/types';

const mockWorkOrders: WorkOrder[] = [
  {
    id: '1',
    title: 'Reparo de luz no corredor',
    description: 'Trocar lâmpada quebrada no corredor do 2º andar.',
    serviceValue: 80.00,
    products: [
      { id: '1', name: 'Lâmpada LED', quantity: 2, unitPrice: 25.00 }
    ],
    totalValue: 130.00,
    status: 'completed',
    createdAt: new Date('2024-12-10')
  },
  {
    id: '2',
    title: 'Manutenção portão',
    description: 'Ajustar motor do portão principal.',
    serviceValue: 150.00,
    products: [],
    totalValue: 150.00,
    status: 'in_progress',
    createdAt: new Date('2024-12-12')
  }
];

export function WorkOrders() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
      
      <div className="grid gap-4">
        {mockWorkOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{order.title}</CardTitle>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">{order.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Valor do Serviço:</span>{' '}
                  <span className="font-medium">
                    R$ {order.serviceValue.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Data:</span>{' '}
                  <span className="font-medium">
                    {order.createdAt.toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              {order.products.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Produtos Utilizados</h4>
                  <div className="space-y-1 text-sm">
                    {order.products.map((product) => (
                      <div key={product.id} className="flex justify-between">
                        <span>
                          {product.name} x{product.quantity}
                        </span>
                        <span>
                          R$ {(product.quantity * product.unitPrice).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-lg">
                  R$ {order.totalValue.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
