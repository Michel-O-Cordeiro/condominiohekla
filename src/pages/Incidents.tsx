import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Incident } from '@/types';

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Luz quebrada no corredor',
    description: 'Lâmpada do corredor do 2º andar quebrada.',
    type: 'maintenance',
    location: 'Corredor 2º andar',
    status: 'in_progress',
    priority: 'medium',
    reportedBy: 'Ana Oliveira',
    reportedAt: new Date('2024-12-10')
  },
  {
    id: '2',
    title: 'Portão com problema',
    description: 'Portão principal não está fechando corretamente.',
    type: 'security',
    location: 'Portão principal',
    status: 'open',
    priority: 'high',
    reportedBy: 'Carlos Pereira',
    reportedAt: new Date('2024-12-12')
  }
];

export function Incidents() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Registro de Ocorrências</h1>
      
      <div className="grid gap-4">
        {mockIncidents.map((incident) => (
          <Card key={incident.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{incident.title}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">{incident.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(incident.status)}>
                    {getStatusLabel(incident.status)}
                  </Badge>
                  <Badge className={getPriorityColor(incident.priority)}>
                    {getPriorityLabel(incident.priority)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Tipo:</span>{' '}
                  <span className="font-medium">{getTypeLabel(incident.type)}</span>
                </div>
                <div>
                  <span className="text-slate-500">Localização:</span>{' '}
                  <span className="font-medium">{incident.location}</span>
                </div>
                <div>
                  <span className="text-slate-500">Reportado por:</span>{' '}
                  <span className="font-medium">{incident.reportedBy}</span>
                </div>
                <div>
                  <span className="text-slate-500">Data:</span>{' '}
                  <span className="font-medium">
                    {incident.reportedAt.toLocaleDateString('pt-BR')}
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
