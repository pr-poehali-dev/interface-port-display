import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Icon from '@/components/ui/icon';

interface Port {
  id: number;
  number: number;
  status: 'active' | 'inactive' | 'error';
  speed: string;
  device?: string;
}

interface Switch {
  id: number;
  name: string;
  location: string;
  model: string;
  ports: Port[];
}

const mockData: Switch[] = [
  {
    id: 1,
    name: 'SW-CORE-01',
    location: 'Серверная комната A',
    model: 'Cisco Catalyst 3850',
    ports: [
      { id: 1, number: 1, status: 'active', speed: '1 Gbps', device: 'Server-01' },
      { id: 2, number: 2, status: 'active', speed: '1 Gbps', device: 'Server-02' },
      { id: 3, number: 3, status: 'inactive', speed: '1 Gbps' },
      { id: 4, number: 4, status: 'active', speed: '10 Gbps', device: 'Storage-01' },
      { id: 5, number: 5, status: 'error', speed: '1 Gbps', device: 'Router-01' },
      { id: 6, number: 6, status: 'inactive', speed: '1 Gbps' },
    ],
  },
  {
    id: 2,
    name: 'SW-FLOOR-02',
    location: '2 этаж, офис',
    model: 'HP ProCurve 2920',
    ports: [
      { id: 7, number: 1, status: 'active', speed: '1 Gbps', device: 'PC-201' },
      { id: 8, number: 2, status: 'active', speed: '1 Gbps', device: 'PC-202' },
      { id: 9, number: 3, status: 'active', speed: '1 Gbps', device: 'PC-203' },
      { id: 10, number: 4, status: 'inactive', speed: '1 Gbps' },
    ],
  },
  {
    id: 3,
    name: 'SW-FLOOR-03',
    location: '3 этаж, офис',
    model: 'Juniper EX2300',
    ports: [
      { id: 11, number: 1, status: 'active', speed: '1 Gbps', device: 'PC-301' },
      { id: 12, number: 2, status: 'inactive', speed: '1 Gbps' },
      { id: 13, number: 3, status: 'active', speed: '1 Gbps', device: 'Printer-03' },
    ],
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSwitches, setOpenSwitches] = useState<number[]>([1]);

  const filteredSwitches = mockData.filter(
    (sw) =>
      sw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sw.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sw.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Port['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getStatusIcon = (status: Port['status']) => {
    switch (status) {
      case 'active':
        return 'CheckCircle2';
      case 'inactive':
        return 'Circle';
      case 'error':
        return 'XCircle';
    }
  };

  const toggleSwitch = (switchId: number) => {
    setOpenSwitches((prev) =>
      prev.includes(switchId) ? prev.filter((id) => id !== switchId) : [...prev, switchId]
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Сетевое оборудование</h1>
            <p className="text-muted-foreground">Управление коммутаторами и портами</p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Icon name="Server" size={20} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Коммутаторов</p>
                  <p className="text-xl font-bold">{mockData.length}</p>
                </div>
              </div>
            </Card>
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Icon name="Network" size={20} className="text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Активных портов</p>
                  <p className="text-xl font-bold">
                    {mockData.reduce((acc, sw) => acc + sw.ports.filter((p) => p.status === 'active').length, 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию, расположению или модели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          {filteredSwitches.map((switchItem) => {
            const activePorts = switchItem.ports.filter((p) => p.status === 'active').length;
            const totalPorts = switchItem.ports.length;
            const isOpen = openSwitches.includes(switchItem.id);

            return (
              <Card key={switchItem.id} className="overflow-hidden transition-all hover:shadow-lg">
                <Collapsible open={isOpen} onOpenChange={() => toggleSwitch(switchItem.id)}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Icon name="Server" size={24} className="text-primary" />
                          </div>
                          <div className="text-left">
                            <CardTitle className="text-xl mb-1">{switchItem.name}</CardTitle>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Icon name="MapPin" size={14} />
                                {switchItem.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Cpu" size={14} />
                                {switchItem.model}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-accent">
                              {activePorts}/{totalPorts}
                            </p>
                            <p className="text-xs text-muted-foreground">активных портов</p>
                          </div>
                          <Icon
                            name={isOpen ? 'ChevronUp' : 'ChevronDown'}
                            size={24}
                            className="text-muted-foreground"
                          />
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                        {switchItem.ports.map((port) => (
                          <div
                            key={port.id}
                            className={`p-4 rounded-lg border transition-all hover:scale-105 ${getStatusColor(
                              port.status
                            )}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Icon name={getStatusIcon(port.status)} size={18} />
                                <span className="font-semibold">Порт {port.number}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {port.speed}
                              </Badge>
                            </div>
                            {port.device && (
                              <div className="flex items-center gap-2 text-sm mt-2">
                                <Icon name="Cable" size={14} />
                                <span className="truncate">{port.device}</span>
                              </div>
                            )}
                            {!port.device && <p className="text-xs opacity-60 mt-2">Не подключено</p>}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>

        {filteredSwitches.length === 0 && (
          <Card className="p-12 text-center">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Коммутаторы не найдены</p>
            <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить параметры поиска</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
