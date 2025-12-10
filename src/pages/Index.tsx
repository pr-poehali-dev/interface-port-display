import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [diagnosticsSwitch, setDiagnosticsSwitch] = useState<string>('');
  const [diagnosticsPort, setDiagnosticsPort] = useState<string>('');
  const [diagnosticsTab, setDiagnosticsTab] = useState<string>('graph');
  const [isLoading, setIsLoading] = useState(false);
  const [portStatus, setPortStatus] = useState<'up' | 'down'>('up');
  const [portSpeed, setPortSpeed] = useState<string>('100');
  const [cableDiagnostics, setCableDiagnostics] = useState<string>('');
  const [isDiagnostingCable, setIsDiagnostingCable] = useState(false);

  // Состояния для графика
  const [chartType, setChartType] = useState<'link' | 'traffic' | 'unicast' | 'broadcast' | 'errors'>('traffic');
  const [isRealtime, setIsRealtime] = useState(false);
  const [timeInterval, setTimeInterval] = useState<'5m' | '10m' | '30m' | '1h' | '6h' | '1d'>('10m');

  const handleDeletePorts = (switchId: number) => {
    const switchPortIds = mockData.find(s => s.id === switchId)?.ports.map(p => p.id) || [];
    const portsToDelete = selectedPorts.filter(id => switchPortIds.includes(id));
    console.log('Удаление портов:', portsToDelete);
    setSelectedPorts(prev => prev.filter(id => !switchPortIds.includes(id)));
  };

  const handleReconfigurePorts = (switchId: number) => {
    const switchPortIds = mockData.find(s => s.id === switchId)?.ports.map(p => p.id) || [];
    const portsToReconfigure = selectedPorts.filter(id => switchPortIds.includes(id));
    console.log('Перенастройка портов:', portsToReconfigure);
  };

  const handleAddSwitch = () => {
    console.log('Добавление коммутатора');
  };

  const handleAddPort = (switchId: number) => {
    console.log('Добавление порта к коммутатору:', switchId);
  };

  const openDiagnostics = (switchId: number, portId: number) => {
    setDiagnosticsSwitch(switchId.toString());
    setDiagnosticsPort(portId.toString());
    setDiagnosticsOpen(true);
    setDiagnosticsTab('graph');
  };

  const loadDiagnosticsData = async (tab: string) => {
    setIsLoading(true);
    // Симуляция запроса на сервер
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Загружены данные для вкладки:', tab);
    setIsLoading(false);
  };

  const handleTabChange = (tab: string) => {
    setDiagnosticsTab(tab);
    loadDiagnosticsData(tab);
  };

  const handlePortStatusChange = async (status: 'up' | 'down') => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setPortStatus(status);
    console.log('Статус порта изменен на:', status);
    setIsLoading(false);
  };

  const handlePortSpeedChange = async (speed: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setPortSpeed(speed);
    console.log('Скорость порта изменена на:', speed);
    setIsLoading(false);
  };

  const handleCableDiagnostics = async () => {
    setIsDiagnostingCable(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockResults = [
      'FastEthernet; п-1: [OK] 11 м; п-2: [OK] 11 м; п-3: [Other]; п-4: [Other];',
      'FastEthernet; п-1: [Open] 11 м; п-2: [Open] 11 м; п-3: [Other]; п-4: [Other];',
      'GigabitEthernet; п-1: [OK] 45 м; п-2: [OK] 45 м; п-3: [OK] 45 м; п-4: [OK] 45 м;'
    ];
    setCableDiagnostics(mockResults[Math.floor(Math.random() * mockResults.length)]);
    setIsDiagnostingCable(false);
  };

  const getAvailablePorts = () => {
    if (!diagnosticsSwitch) return [];
    const switchData = mockData.find(s => s.id.toString() === diagnosticsSwitch);
    return switchData?.ports || [];
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

  const getSelectedPortsCountForSwitch = (switchItem: Switch) => {
    const portIds = switchItem.ports.map((p) => p.id);
    return selectedPorts.filter(id => portIds.includes(id)).length;
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
            <Button onClick={handleAddSwitch} className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить коммутатор
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
                        <span className="text-sm font-medium flex-1">Выбрать все порты</span>
                        {getSelectedPortsCountForSwitch(switchItem) > 0 && (
                          <>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded">
                              <Icon name="CheckSquare" size={14} className="text-primary" />
                              <span className="text-xs font-medium text-primary">
                                {getSelectedPortsCountForSwitch(switchItem)}
                              </span>
                            </div>
                            <Button onClick={() => handleReconfigurePorts(switchItem.id)} variant="outline" size="sm" className="gap-1.5 h-7 px-2 text-xs">
                              <Icon name="Settings" size={12} />
                              Перенастроить
                            </Button>
                            <Button onClick={() => handleDeletePorts(switchItem.id)} variant="destructive" size="sm" className="gap-1.5 h-7 px-2 text-xs">
                              <Icon name="Trash2" size={12} />
                              Удалить
                            </Button>
                          </>
                        )}
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Icon name="MoreVertical" size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => console.log('Переместить порт', port.id)}>
                                  <Icon name="Move" size={14} className="mr-2" />
                                  Переместить
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => console.log('Изменить описание', port.id)}>
                                  <Icon name="Pencil" size={14} className="mr-2" />
                                  Изменить описание
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openDiagnostics(switchItem.id, port.id)}>
                                  <Icon name="Activity" size={14} className="mr-2" />
                                  Диагностика
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => handleAddPort(switchItem.id)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all w-full group"
                        >
                          <div className="w-5 h-5 rounded border-2 border-dashed border-muted-foreground/30 group-hover:border-primary transition-colors" />
                          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                            <Icon name="Plus" size={16} />
                            <span className="text-sm font-medium">Добавить порт</span>
                          </div>
                        </button>
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
      </div>

      {/* Модальное окно диагностики */}
      <Dialog open={diagnosticsOpen} onOpenChange={setDiagnosticsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Диагностика порта</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Панель управления вверху */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Коммутатор</label>
                <Select value={diagnosticsSwitch} onValueChange={setDiagnosticsSwitch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите коммутатор" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.map((sw) => (
                      <SelectItem key={sw.id} value={sw.id.toString()}>
                        {sw.name} — {sw.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Порт</label>
                <Select 
                  value={diagnosticsPort} 
                  onValueChange={setDiagnosticsPort}
                  disabled={!diagnosticsSwitch}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите порт" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePorts().map((port) => (
                      <SelectItem key={port.id} value={port.id.toString()}>
                        Порт {port.number} {port.device ? `— ${port.device}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setDiagnosticsOpen(false)}
                className="mt-6"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Вкладки */}
            <Tabs value={diagnosticsTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="graph" className="gap-2">
                  <Icon name="LineChart" size={16} />
                  График
                </TabsTrigger>
                <TabsTrigger value="diagnostics" className="gap-2">
                  <Icon name="Activity" size={16} />
                  Диагностика
                </TabsTrigger>
              </TabsList>

              {/* Контент вкладок */}
              <div className="min-h-[400px] relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-3">
                      <Icon name="Loader2" size={32} className="animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Загрузка данных...</p>
                    </div>
                  </div>
                )}

                <TabsContent value="graph" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">График трафика</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Панель управления графиком */}
                      <div className="space-y-3">
                        {/* Верхняя строка: типы графиков */}
                        <div className="flex flex-wrap items-center gap-2">
                          {[
                            { value: 'link', label: 'Link', icon: 'Link' },
                            { value: 'traffic', label: 'Traffic', icon: 'Activity' },
                            { value: 'unicast', label: 'Unicast', icon: 'Send' },
                            { value: 'broadcast', label: 'Broadcast', icon: 'Radio' },
                            { value: 'errors', label: 'Errors', icon: 'AlertCircle' },
                          ].map((type) => (
                            <Button
                              key={type.value}
                              variant={chartType === type.value ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setChartType(type.value as any)}
                              className="gap-1.5 h-9"
                            >
                              <Icon name={type.icon as any} size={14} />
                              {type.label}
                            </Button>
                          ))}
                        </div>

                        {/* Нижняя строка: управление и настройки */}
                        <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                          {/* Режим реального времени */}
                          <Button
                            variant={isRealtime ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setIsRealtime(!isRealtime)}
                            className="gap-1.5 h-8"
                          >
                            <Icon name={isRealtime ? 'Zap' : 'Clock'} size={14} />
                            Realtime
                          </Button>

                          <div className="h-6 w-px bg-border" />

                          {/* Интервал времени */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                const intervals: typeof timeInterval[] = ['5m', '10m', '30m', '1h', '6h', '1d'];
                                const currentIndex = intervals.indexOf(timeInterval);
                                if (currentIndex > 0) {
                                  setTimeInterval(intervals[currentIndex - 1]);
                                }
                              }}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <div className="min-w-[70px] text-center px-2 py-1 bg-background rounded border">
                              <span className="text-xs font-medium">
                                {timeInterval === '5m' && '5 мин'}
                                {timeInterval === '10m' && '10 мин'}
                                {timeInterval === '30m' && '30 мин'}
                                {timeInterval === '1h' && '1 час'}
                                {timeInterval === '6h' && '6 ч'}
                                {timeInterval === '1d' && '1 день'}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                const intervals: typeof timeInterval[] = ['5m', '10m', '30m', '1h', '6h', '1d'];
                                const currentIndex = intervals.indexOf(timeInterval);
                                if (currentIndex < intervals.length - 1) {
                                  setTimeInterval(intervals[currentIndex + 1]);
                                }
                              }}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                          </div>

                          <div className="h-6 w-px bg-border" />

                          {/* Управление графиком */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="К текущему моменту"
                          >
                            <Icon name="SkipForward" size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Обновить график"
                          >
                            <Icon name="RefreshCw" size={14} />
                          </Button>
                        </div>
                      </div>

                      {/* График */}
                      <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                        <div className="text-center">
                          <Icon name="LineChart" size={48} className="mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground mb-1">График {chartType} будет здесь</p>
                          <p className="text-xs text-muted-foreground">Интервал: {timeInterval} • Режим: {isRealtime ? 'Realtime' : 'Static'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="diagnostics" className="space-y-4 mt-4">
                  <div className="space-y-6">
                    {/* Статус порта */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">Статус порта</h3>
                            <div className="flex items-center gap-3">
                              <Badge variant={portStatus === 'up' ? 'default' : 'secondary'} className="text-sm">
                                {portStatus === 'up' ? 'Активен' : 'Неактивен'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">Скорость: {portSpeed} Mbps</span>
                            </div>
                          </div>
                        </div>

                        {/* Панель управления портом */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-3 block">Управление портом</label>
                            <div className="flex gap-2">
                              <Button
                                variant={portStatus === 'down' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePortStatusChange('down')}
                                className="min-w-[70px]"
                              >
                                Down
                              </Button>
                              <Button
                                variant={portStatus === 'up' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePortStatusChange('up')}
                                className="min-w-[70px]"
                              >
                                Up
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-3 block">Скорость порта</label>
                            <div className="flex gap-2 flex-wrap">
                              {['10', '100', '1000', 'auto'].map((speed) => (
                                <Button
                                  key={speed}
                                  variant={portSpeed === speed ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handlePortSpeedChange(speed)}
                                  className="min-w-[70px]"
                                >
                                  {speed === 'auto' ? 'Auto' : speed}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                            <Icon name="Info" size={16} className="text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-800 dark:text-amber-200">
                              После любого изменения линк обычно отключается на несколько секунд, 
                              поэтому необходимо повторно обновить состояние не меньше, чем через 5 сек
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Диагностика кабеля */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Диагностика кабеля</h3>
                            <Button 
                              onClick={handleCableDiagnostics}
                              disabled={isDiagnostingCable}
                              size="sm"
                            >
                              {isDiagnostingCable && <Icon name="Loader2" size={16} className="mr-2 animate-spin" />}
                              {isDiagnostingCable ? 'Диагностика...' : 'Запустить диагностику'}
                            </Button>
                          </div>
                          
                          {cableDiagnostics && (
                            <div className="p-4 bg-muted/50 rounded-lg border">
                              <p className="text-sm font-mono">{cableDiagnostics}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Таблица подключений */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Подключенные устройства</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="text-left p-3 text-sm font-medium">VLAN</th>
                                <th className="text-left p-3 text-sm font-medium">MAC / Интерфейс</th>
                                <th className="text-left p-3 text-sm font-medium">IP</th>
                                <th className="text-left p-3 text-sm font-medium">DHCP</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr className="hover:bg-muted/30 transition-colors">
                                <td className="p-3 text-sm">1</td>
                                <td className="p-3">
                                  <div className="text-sm font-mono">74:56:3c:4c:1c:c7</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">GIGA-BYTE TECHNOLOGY CO.,LTD.</div>
                                </td>
                                <td className="p-3 text-sm font-mono">10.190.1.205</td>
                                <td className="p-3">
                                  <div className="text-sm">23 мин</div>
                                  <div className="text-xs text-muted-foreground">onix</div>
                                </td>
                              </tr>
                              <tr className="hover:bg-muted/30 transition-colors">
                                <td className="p-3 text-sm">1</td>
                                <td className="p-3">
                                  <div className="text-sm font-mono">a8:5e:45:2b:8f:3d</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">Apple, Inc.</div>
                                </td>
                                <td className="p-3 text-sm font-mono">10.190.1.156</td>
                                <td className="p-3">
                                  <div className="text-sm">1 ч 12 мин</div>
                                  <div className="text-xs text-muted-foreground">MacBook-Pro</div>
                                </td>
                              </tr>
                              <tr className="hover:bg-muted/30 transition-colors">
                                <td className="p-3 text-sm">100</td>
                                <td className="p-3">
                                  <div className="text-sm font-mono">00:1a:2b:3c:4d:5e</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">Cisco Systems</div>
                                </td>
                                <td className="p-3 text-sm font-mono">192.168.100.45</td>
                                <td className="p-3">
                                  <div className="text-sm">5 мин</div>
                                  <div className="text-xs text-muted-foreground">server-01</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Ссылка на расширенный функционал */}
                    <div className="flex items-center justify-center py-4">
                      <a
                        href="https://docs.poehali.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <Icon name="Sparkles" size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Расширенный функционал</span>
                        <Icon name="ExternalLink" size={14} />
                      </a>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;