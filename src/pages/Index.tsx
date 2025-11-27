import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Port {
  id: number;
  number: number;
  status: 'active' | 'inactive' | 'blocked' | 'unknown';
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
      { id: 5, number: 5, status: 'blocked', speed: '1 Gbps', device: 'Router-01' },
      { id: 6, number: 6, status: 'unknown', speed: '1 Gbps' },
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
      { id: 9, number: 3, status: 'blocked', speed: '1 Gbps', device: 'PC-203' },
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
      { id: 12, number: 2, status: 'unknown', speed: '1 Gbps' },
      { id: 13, number: 3, status: 'active', speed: '1 Gbps', device: 'Printer-03' },
    ],
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openSwitches, setOpenSwitches] = useState<number[]>([1]);
  const [selectedPorts, setSelectedPorts] = useState<number[]>([]);
  const [showAddPortDialog, setShowAddPortDialog] = useState(false);

  const handleDeletePorts = () => {
    console.log('Удаление портов:', selectedPorts);
    setSelectedPorts([]);
  };

  const handleReconfigurePorts = () => {
    console.log('Перенастройка портов:', selectedPorts);
  };

  const handleAddPort = () => {
    console.log('Добавление порта');
    setShowAddPortDialog(true);
  };

  const filteredSwitches = mockData.filter(
    (sw) =>
      sw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sw.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sw.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Port['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 border-l-2 border-l-green-400';
      case 'inactive':
        return 'bg-red-50 border-l-2 border-l-red-400';
      case 'blocked':
        return 'bg-red-950/5 border-l-2 border-l-red-900';
      case 'unknown':
        return 'bg-gray-50 border-l-2 border-l-gray-300';
    }
  };

  const getStatusBadgeColor = (status: Port['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'blocked':
        return 'bg-red-950/10 text-red-950 border-red-950/20';
      case 'unknown':
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: Port['status']) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'inactive':
        return 'Неактивен';
      case 'blocked':
        return 'Заблокирован';
      case 'unknown':
        return 'Неизвестно';
    }
  };

  const toggleSwitch = (switchId: number) => {
    setOpenSwitches((prev) =>
      prev.includes(switchId) ? prev.filter((id) => id !== switchId) : [...prev, switchId]
    );
  };

  const togglePort = (portId: number) => {
    setSelectedPorts((prev) =>
      prev.includes(portId) ? prev.filter((id) => id !== portId) : [...prev, portId]
    );
  };

  const toggleAllPorts = (switchItem: Switch) => {
    const portIds = switchItem.ports.map((p) => p.id);
    const allSelected = portIds.every((id) => selectedPorts.includes(id));

    if (allSelected) {
      setSelectedPorts((prev) => prev.filter((id) => !portIds.includes(id)));
    } else {
      setSelectedPorts((prev) => [...new Set([...prev, ...portIds])]);
    }
  };

  const isAllPortsSelected = (switchItem: Switch) => {
    const portIds = switchItem.ports.map((p) => p.id);
    return portIds.length > 0 && portIds.every((id) => selectedPorts.includes(id));
  };

  const isSomePortsSelected = (switchItem: Switch) => {
    const portIds = switchItem.ports.map((p) => p.id);
    return portIds.some((id) => selectedPorts.includes(id)) && !isAllPortsSelected(switchItem);
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

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Физические порты подключения (Level-2 OSI)</h2>
            <Button onClick={handleAddPort} className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить порт
            </Button>
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
                      <div className="flex items-center gap-2 mb-3 p-2 bg-secondary/30 rounded-lg">
                        <Checkbox
                          checked={isAllPortsSelected(switchItem)}
                          onCheckedChange={() => toggleAllPorts(switchItem)}
                          className={isSomePortsSelected(switchItem) ? 'data-[state=checked]:bg-primary/50' : ''}
                        />
                        <span className="text-sm font-medium">Выбрать все порты</span>
                      </div>

                      <div className="space-y-2">
                        {switchItem.ports.map((port) => (
                          <div
                            key={port.id}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${getStatusColor(
                              port.status
                            )}`}
                          >
                            <Checkbox
                              checked={selectedPorts.includes(port.id)}
                              onCheckedChange={() => togglePort(port.id)}
                            />
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="font-semibold text-sm w-20">Порт {port.number}</span>
                              <Badge variant="outline" className={`text-xs w-28 justify-center ${getStatusBadgeColor(port.status)}`}>
                                {getStatusText(port.status)}
                              </Badge>
                              <Badge variant="outline" className="text-xs w-20 justify-center">
                                {port.speed}
                              </Badge>
                              {port.device && (
                                <div className="flex items-center gap-1 text-sm truncate">
                                  <Icon name="Cable" size={14} />
                                  <span className="truncate">{port.device}</span>
                                </div>
                              )}
                              {!port.device && <span className="text-xs text-muted-foreground">Не подключено</span>}
                            </div>
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
            <div className="p-12 text-center">
              <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Коммутаторы не найдены</p>
              <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </Card>

        {selectedPorts.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <Card className="shadow-2xl border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Icon name="CheckSquare" size={20} className="text-primary" />
                    <span className="font-medium">
                      Выбрано портов: <span className="text-primary">{selectedPorts.length}</span>
                    </span>
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <div className="flex gap-2">
                    <Button onClick={handleReconfigurePorts} variant="outline" className="gap-2">
                      <Icon name="Settings" size={16} />
                      Перенастроить
                    </Button>
                    <Button onClick={handleDeletePorts} variant="destructive" className="gap-2">
                      <Icon name="Trash2" size={16} />
                      Удалить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;