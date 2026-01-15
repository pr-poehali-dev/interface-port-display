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
  const [expandedIpRows, setExpandedIpRows] = useState<number[]>([]);
  const [portStatus, setPortStatus] = useState<'up' | 'down'>('up');
  const [portSpeed, setPortSpeed] = useState<string>('100');
  const [portDuplex, setPortDuplex] = useState<'full' | 'half'>('half');
  const [cableDiagnostics, setCableDiagnostics] = useState<string>('');
  const [isDiagnostingCable, setIsDiagnostingCable] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<any[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  const [dhcpMode, setDhcpMode] = useState('auto');
  const [ipDistributionMode, setIpDistributionMode] = useState<'simple' | 'advanced'>('simple');
  const [internetAccess, setInternetAccess] = useState<'closed' | 'open'>('closed');
  const [incomingSpeed, setIncomingSpeed] = useState('100');
  const [outgoingSpeed, setOutgoingSpeed] = useState('100');
  const [autoBlock, setAutoBlock] = useState<'none' | 'smtp'>('smtp');

  const mockIpAddresses = [
    { 
      ip: '10.190.1.160', 
      mac: 'd8:bb:c1:5f:5c:2c', 
      hostname: 'iMacPro-mixa', 
      vendor: 'Apple Inc.',
      status: 'active', 
      dhcp: '16 мин',
      internet: '9.89 kbit/s',
      mask: '255.255.255.0',
      gateway: '10.190.1.1',
      dns: ['192.168.50.100', '192.168.50.50'],
      description: 'wi-fi Офис',
      macBind: 'd8:bb:c1:5f:5c:2c',
      arp: 'b8:cc:f1:5f:bb:4a'
    },
    { 
      ip: '10.190.1.205', 
      mac: '74:56:3c:4c:1c:c7', 
      hostname: 'onix', 
      vendor: 'MSFT 5.0',
      status: 'active', 
      dhcp: '23 мин',
      internet: '45.2 Mbit/s',
      mask: '255.255.255.0',
      gateway: '10.190.1.1',
      dns: ['192.168.50.100', '192.168.50.50'],
      description: '',
      macBind: null
    },
    { 
      ip: '10.190.1.156', 
      mac: 'a8:5e:45:2b:8f:3d', 
      hostname: 'MacBook-Pro', 
      vendor: null,
      status: 'active', 
      dhcp: '1 ч 12 мин',
      internet: '12.5 Mbit/s',
      mask: '255.255.255.0',
      gateway: '10.190.1.1',
      dns: ['192.168.50.100'],
      description: 'Рабочий MacBook',
      macBind: 'a8:5e:45:2b:8f:3d'
    },
    { 
      ip: '10.190.1.89', 
      mac: 'b4:2e:99:7a:1f:cc', 
      hostname: 'printer-office', 
      vendor: 'HP',
      status: 'blocked', 
      dhcp: '—',
      internet: '—',
      mask: '255.255.255.0',
      gateway: '10.190.1.1',
      dns: ['192.168.50.100'],
      description: 'Принтер 2 этаж',
      macBind: 'b4:2e:99:7a:1f:cc'
    },
  ];

  // Состояния для графика
  const [chartType, setChartType] = useState<'link' | 'traffic' | 'unicast' | 'broadcast' | 'errors'>('traffic');
  const [isRealtime, setIsRealtime] = useState(false);
  const [timeInterval, setTimeInterval] = useState<'5m' | '10m' | '30m' | '1h' | '6h' | '1d'>('10m');

  // Информация о подключении
  const [connectionInfo, setConnectionInfo] = useState({
    vlanNumber: '01-0179',
    description: 'Помещение правления на 1ом этаже'
  });
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(connectionInfo.description);

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

  const handleLoadConnectedDevices = async () => {
    setIsLoadingDevices(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    const mockDevices = [
      {
        vlan: 1,
        mac: '74:56:3c:4c:1c:c7',
        vendor: 'GIGA-BYTE TECHNOLOGY CO.,LTD.',
        ips: [
          { ip: '10.190.1.205', uptime: '23 мин', hostname: 'onix' },
          { ip: '10.190.1.240', uptime: '45 мин', hostname: 'onix-backup' }
        ]
      },
      {
        vlan: 1,
        mac: 'a8:5e:45:2b:8f:3d',
        vendor: 'Apple, Inc.',
        ips: [
          { ip: '10.190.1.156', uptime: '1 ч 12 мин', hostname: 'MacBook-Pro' }
        ]
      },
      {
        vlan: 100,
        mac: '00:1a:2b:3c:4d:5e',
        vendor: 'Cisco Systems',
        ips: [
          { ip: '192.168.100.45', uptime: '5 мин', hostname: 'server-01' },
          { ip: '192.168.100.46', uptime: '3 ч', hostname: 'server-01-mgmt' },
          { ip: '192.168.100.47', uptime: '2 д', hostname: 'server-01-backup' }
        ]
      }
    ];
    setConnectedDevices(mockDevices);
    setIsLoadingDevices(false);
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-red-500 to-rose-600">
                <Icon name="Info" size={20} className="text-white" />
              </div>
              Сведения о точке подключения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Номер подключения</p>
                <div className="flex items-center gap-2">
                  <Icon name="Hash" size={20} className="text-primary" />
                  <p className="text-2xl font-bold">{connectionInfo.vlanNumber}</p>
                </div>
              </div>
              
              <div className="p-5 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Коммутаторов</p>
                <div className="flex items-center gap-2">
                  <Icon name="Server" size={20} className="text-primary" />
                  <p className="text-2xl font-bold">{mockData.length}</p>
                </div>
              </div>
              
              <div className="p-5 rounded-xl bg-muted/40 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Активных портов</p>
                <div className="flex items-center gap-2">
                  <Icon name="Network" size={20} className="text-primary" />
                  <p className="text-2xl font-bold">
                    {mockData.reduce((acc, sw) => acc + sw.ports.filter((p) => p.status === 'active').length, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-muted/40 border border-border/50">
              <div className="flex items-start gap-3">
                <Icon name="FileText" size={20} className="text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Описание</p>
                  {isEditingDescription ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        className="h-9"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setConnectionInfo({ ...connectionInfo, description: tempDescription });
                            setIsEditingDescription(false);
                          } else if (e.key === 'Escape') {
                            setTempDescription(connectionInfo.description);
                            setIsEditingDescription(false);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          setConnectionInfo({ ...connectionInfo, description: tempDescription });
                          setIsEditingDescription(false);
                        }}
                      >
                        <Icon name="Check" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTempDescription(connectionInfo.description);
                          setIsEditingDescription(false);
                        }}
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <p className="text-sm font-medium leading-relaxed">
                        {connectionInfo.description || 'Нажмите для добавления описания'}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                        onClick={() => {
                          setTempDescription(connectionInfo.description);
                          setIsEditingDescription(true);
                        }}
                      >
                        <Icon name="Pencil" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
                  <Icon name="Network" size={20} className="text-white" />
                </div>
                Физические порты подключения (Level-2 OSI)
              </CardTitle>
              <Button onClick={handleAddSwitch} className="gap-2">
                <Icon name="Plus" size={18} />
                Добавить коммутатор
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSwitches.map((switchItem) => {
              const activePorts = switchItem.ports.filter((p) => p.status === 'active').length;
              const totalPorts = switchItem.ports.length;
              const isOpen = openSwitches.includes(switchItem.id);

              return (
                <Card key={switchItem.id} className="overflow-hidden transition-all hover:shadow-md border-border/50">
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
                            <p className="text-2xl font-bold text-green-600">
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
          </CardContent>
        </Card>

        {/* Ссылка на расширенный функционал */}
        <div className="flex justify-center py-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent hover:border-primary transition-all"
          >
            <Icon name="Settings" size={16} />
            Расширенный функционал
          </a>
        </div>

        {/* IP-уровень */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <Icon name="Route" size={20} className="text-white" />
              </div>
              IP-уровень (Level-3 OSI, маршрутизация)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Сервер */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-2">
                <Icon name="Server" size={18} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Сервер</p>
                  <p className="text-xs text-muted-foreground">term-14</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
                  priority: 200
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5">
                  active
                </Badge>
              </div>
            </div>

            {/* DHCP */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="Network" size={16} className="text-muted-foreground" />
                DHCP
              </label>
              <Select value={dhcpMode} onValueChange={setDhcpMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Только автоматическое получение настроек</SelectItem>
                  <SelectItem value="auto-manual">Автоматическое получение и ручной ввод настроек</SelectItem>
                  <SelectItem value="manual">Только ручной ввод настроек</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Выдача IP */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="Globe" size={14} className="text-muted-foreground" />
                Выдача IP
              </label>
              <div className="p-3 bg-muted/30 rounded-lg border">
                <div className="space-y-1.5">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
                    {ipDistributionMode === 'simple' ? 'Простая' : 'Расширенная'}
                  </Badge>
                  <div>
                    {ipDistributionMode === 'simple' ? (
                      <p className="text-xs text-muted-foreground leading-snug">
                        Любое подключенное устройство получит один и тот же IP. 
                        Нет привязки к времени аренды — при смене устройства новое получит указанный IP сразу же, 
                        ждать его освобождения (час) не надо. 
                        При подключении двух и более устройств одновременно будет конфликт IP-адресов.
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground leading-snug">
                        Устройства получают IP из пула адресов с привязкой к времени аренды. 
                        Поддерживается работа множества устройств одновременно без конфликтов. 
                        Освобожденные адреса становятся доступны после истечения срока аренды.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Доступ в Интернет */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="Wifi" size={14} className="text-muted-foreground" />
                Доступ в Интернет
              </label>
              {internetAccess === 'closed' ? (
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs px-2 py-0.5">
                      Закрыт
                    </Badge>
                    <p className="text-xs text-muted-foreground">Доступ в интернет заблокирован</p>
                  </div>
                  <Button size="sm" onClick={() => setInternetAccess('open')}>
                    <Icon name="Unlock" size={14} className="mr-1.5" />
                    Открыть
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-muted/30 rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5">
                      Открыт
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setInternetAccess('closed')}>
                      <Icon name="Lock" size={12} className="mr-1.5" />
                      Закрыть
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Входящая скорость</label>
                      <Select value={incomingSpeed} onValueChange={setIncomingSpeed}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 Мбит/с</SelectItem>
                          <SelectItem value="50">50 Мбит/с</SelectItem>
                          <SelectItem value="100">100 Мбит/с</SelectItem>
                          <SelectItem value="500">500 Мбит/с</SelectItem>
                          <SelectItem value="1000">1 Гбит/с</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Исходящая скорость</label>
                      <Select value={outgoingSpeed} onValueChange={setOutgoingSpeed}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 Мбит/с</SelectItem>
                          <SelectItem value="50">50 Мбит/с</SelectItem>
                          <SelectItem value="100">100 Мбит/с</SelectItem>
                          <SelectItem value="500">500 Мбит/с</SelectItem>
                          <SelectItem value="1000">1 Гбит/с</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Автоблокировка трафика */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="ShieldAlert" size={14} className="text-muted-foreground" />
                Автоблокировка трафика
              </label>
              {autoBlock === 'none' ? (
                <div className="p-3 bg-muted/30 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-xs px-2 py-0.5">
                      Нет
                    </Badge>
                    <p className="text-xs text-muted-foreground">Автоблокировка отключена</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 text-xs px-2 py-0.5">
                      SMTP
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setAutoBlock('none')}>
                      Отменить
                    </Button>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs">
                    <Icon name="AlertTriangle" size={14} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-orange-900 font-mono leading-tight">
                      31.05.2021 3:43 91.219.24.200: 35 pkts by 60 sec (0.58 pps)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Таблица IP-адресов */}
            <div className="space-y-2 pt-4 mt-4 border-t-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Icon name="Network" size={16} />
                  IP-адреса
                </h3>
                <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Icon name="Plus" size={14} className="mr-1.5" />
                  Добавить
                </Button>
              </div>
              
              <div className="space-y-2">
                {mockIpAddresses.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-card hover:bg-muted/20 transition-colors">
                    <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                      {/* Левая часть: Основная информация */}
                      <div className="space-y-2">
                        {/* Первая строка: IP, статус, описание */}
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-sm">{item.ip}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-1.5 py-0 ${
                              item.status === 'active' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : item.status === 'blocked'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            {item.status === 'active' ? 'активен' : item.status === 'blocked' ? 'заблокирован' : 'неактивен'}
                          </Badge>
                          {item.description && (
                            <span className="text-xs text-muted-foreground italic">
                              — {item.description}
                            </span>
                          )}
                        </div>

                        {/* MAC привязка */}
                        {item.macBind && (
                          <div className="text-xs flex items-center gap-1.5">
                            <Icon name="Link" size={12} className="text-blue-600" />
                            <span className="text-muted-foreground">Привязан к:</span>{' '}
                            <span className="font-mono text-blue-600">{item.macBind}</span>
                          </div>
                        )}

                        {/* Разделитель */}
                        <div className="border-t my-2 w-1/3"></div>

                        {/* Вторая строка: DHCP и Интернет */}
                        <div className="text-xs text-muted-foreground">
                          DHCP: {item.dhcp} · Интернет: {item.internet}
                        </div>

                        {/* Третья строка: MAC (оперативный) */}
                        {item.mac && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">MAC:</span>{' '}
                            <span className="font-mono">{item.mac}</span>
                          </div>
                        )}

                        {/* Четвертая строка: Host и Vendor */}
                        {(item.hostname || item.vendor) && (
                          <div className="text-xs">
                            {item.hostname && (
                              <>
                                <span className="text-muted-foreground">Host:</span>{' '}
                                <span>{item.hostname}</span>
                              </>
                            )}
                            {item.vendor && (
                              <>
                                {item.hostname && ' · '}
                                <span className="text-muted-foreground">Vendor:</span>{' '}
                                <span>{item.vendor}</span>
                              </>
                            )}
                          </div>
                        )}

                        {/* ARP */}
                        {item.arp && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">ARP:</span>{' '}
                            <span className="font-mono">{item.arp}</span>
                          </div>
                        )}
                      </div>

                      {/* Центр: Сетевые параметры в столбик */}
                      <div className="text-xs space-y-2 px-4 border-x flex flex-col justify-center">
                        <div>
                          <span className="text-muted-foreground">Маска:</span>{' '}
                          <span className="font-mono">{item.mask}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Шлюз:</span>{' '}
                          <span className="font-mono">{item.gateway}</span>
                        </div>
                        {item.dns.map((dns, dnsIndex) => (
                          <div key={dnsIndex}>
                            <span className="text-muted-foreground">DNS:</span>{' '}
                            <span className="font-mono">{dns}</span>
                          </div>
                        ))}
                      </div>

                      {/* Правая часть: Кнопки действий */}
                      <div className="flex flex-col gap-0.5 items-start">
                        {item.status !== 'blocked' ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 justify-start"
                          >
                            <Icon name="Ban" size={12} className="mr-1.5" />
                            Заблокировать
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 justify-start"
                          >
                            <Icon name="CheckCircle" size={12} className="mr-1.5" />
                            Разблокировать
                          </Button>
                        )}
                        
                        {item.macBind ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs justify-start"
                          >
                            <Icon name="LinkOff" size={12} className="mr-1.5" />
                            Отвязать MAC
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 justify-start"
                          >
                            <Icon name="Link" size={12} className="mr-1.5" />
                            Привязать MAC
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs justify-start"
                        >
                          <Icon name="FileEdit" size={12} className="mr-1.5" />
                          {item.description ? 'Изменить описание' : 'Добавить описание'}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 justify-start"
                        >
                          <Icon name="Trash2" size={12} className="mr-1.5" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
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
                              <span className="text-sm text-muted-foreground">
                                Скорость: {portSpeed} Mbps
                                {portDuplex === 'half' && (
                                  <span className="ml-1 text-orange-500 font-medium">(half-duplex)</span>
                                )}
                              </span>
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
                                  className={`min-w-[70px] ${portSpeed === speed && portDuplex === 'half' ? 'border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/50' : ''}`}
                                >
                                  <span className="flex flex-col items-center gap-0.5">
                                    <span>{speed === 'auto' ? 'Auto' : speed}</span>
                                    {portSpeed === speed && portDuplex === 'half' && (
                                      <span className="text-[9px] font-semibold uppercase tracking-wider">Half</span>
                                    )}
                                  </span>
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
                              <p className="text-sm font-mono">
                                {cableDiagnostics.split(' ').map((word, index) => {
                                  if (/^\d+$/.test(word)) {
                                    return <span key={index} className="font-bold text-primary">{word} </span>;
                                  }
                                  return <span key={index}>{word} </span>;
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Таблица подключений */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg">Подключенные устройства</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLoadConnectedDevices}
                          disabled={isLoadingDevices}
                          className="gap-2"
                        >
                          {isLoadingDevices ? (
                            <>
                              <Icon name="Loader2" className="animate-spin" size={16} />
                              Загрузка...
                            </>
                          ) : (
                            <>
                              <Icon name="RefreshCw" size={16} />
                              Запросить данные
                            </>
                          )}
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {connectedDevices.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <Icon name="Network" size={48} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Нажмите кнопку "Запросить данные" для получения информации</p>
                          </div>
                        ) : (
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-muted/50">
                                <tr>
                                  <th className="text-left p-3 text-sm font-medium">VLAN</th>
                                  <th className="text-left p-3 text-sm font-medium">MAC / Интерфейс</th>
                                  <th className="text-left p-3 text-sm font-medium">IP адреса</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {connectedDevices.map((device, index) => (
                                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-3 text-sm align-middle">{device.vlan}</td>
                                    <td className="p-3 align-middle">
                                      <div className="text-sm font-mono">{device.mac}</div>
                                      <div className="text-xs text-muted-foreground mt-0.5">{device.vendor}</div>
                                    </td>
                                    <td className="p-3 align-middle">
                                      <div className="space-y-2">
                                        {device.ips.map((ipInfo: any, ipIndex: number) => (
                                          <div key={ipIndex} className="flex flex-col">
                                            <div className="text-sm font-mono">
                                              {ipInfo.ip} <span className="text-muted-foreground font-normal">• {ipInfo.uptime}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                              {ipInfo.hostname}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
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