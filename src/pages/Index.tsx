import { useState } from 'react';
import Icon from '@/components/ui/icon';
import ConnectionInfoCard from '@/components/ConnectionInfoCard';
import SwitchListCard from '@/components/SwitchListCard';
import IpLevelCard from '@/components/IpLevelCard';
import DiagnosticsDialog from '@/components/DiagnosticsDialog';

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

const mockIpAddresses = [
  { 
    ip: '91.219.26.250',
    isRealIp: true,
    mac: '—', 
    hostname: 'gateway-internet', 
    vendor: 'ISP Gateway',
    status: 'active' as const, 
    dhcp: '—',
    internet: '100 Mbit/s',
    mask: '255.255.255.0',
    gateway: '91.219.26.1',
    dns: ['8.8.8.8', '8.8.4.4'],
    description: 'Реальный IP-адрес',
    macBind: null,
    arp: null
  },
  { 
    ip: '10.190.1.160', 
    isRealIp: false,
    mac: 'd8:bb:c1:5f:5c:2c', 
    hostname: 'iMacPro-mixa', 
    vendor: 'Apple Inc.',
    status: 'active' as const, 
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
    isRealIp: false, 
    mac: '74:56:3c:4c:1c:c7', 
    hostname: 'onix', 
    vendor: 'MSFT 5.0',
    status: 'active' as const, 
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
    isRealIp: false, 
    mac: 'a8:5e:45:2b:8f:3d', 
    hostname: 'MacBook-Pro', 
    vendor: null,
    status: 'active' as const, 
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
    isRealIp: false, 
    mac: 'b4:2e:99:7a:1f:cc', 
    hostname: 'printer-office', 
    vendor: 'HP',
    status: 'blocked' as const, 
    dhcp: '—',
    internet: '—',
    mask: '255.255.255.0',
    gateway: '10.190.1.1',
    dns: ['192.168.50.100'],
    description: 'Принтер 2 этаж',
    macBind: 'b4:2e:99:7a:1f:cc'
  },
];

const Index = () => {
  const [openSwitches, setOpenSwitches] = useState<number[]>([1]);
  const [selectedPorts, setSelectedPorts] = useState<number[]>([]);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [diagnosticsSwitch, setDiagnosticsSwitch] = useState<string>('');
  const [diagnosticsPort, setDiagnosticsPort] = useState<string>('');
  const [diagnosticsTab, setDiagnosticsTab] = useState<string>('graph');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIpRows, setExpandedIpRows] = useState<number[]>([]);

  const [dhcpMode, setDhcpMode] = useState('auto');
  const [ipDistributionMode] = useState<'simple' | 'advanced'>('simple');
  const [internetAccess, setInternetAccess] = useState<'closed' | 'open'>('closed');
  const [incomingSpeed, setIncomingSpeed] = useState('100');
  const [outgoingSpeed, setOutgoingSpeed] = useState('100');
  const [autoBlock, setAutoBlock] = useState<'none' | 'smtp'>('smtp');
  const [showIpAddresses, setShowIpAddresses] = useState(true);

  const [chartType, setChartType] = useState<'link' | 'traffic' | 'unicast' | 'broadcast' | 'errors'>('traffic');
  const [isRealtime, setIsRealtime] = useState(false);
  const [timeInterval, setTimeInterval] = useState<'5m' | '10m' | '30m' | '1h' | '6h' | '1d'>('10m');

  const [connectionInfo, setConnectionInfo] = useState({
    vlanNumber: '01-0179',
    description: 'Помещение правления на 1ом этаже'
  });

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
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Загружены данные для вкладки:', tab);
    setIsLoading(false);
  };

  const handleTabChange = (tab: string) => {
    setDiagnosticsTab(tab);
    loadDiagnosticsData(tab);
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

  const toggleIpRow = (index: number) => {
    setExpandedIpRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const activePortsCount = mockData.reduce(
    (acc, sw) => acc + sw.ports.filter((p) => p.status === 'active').length,
    0
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Сетевое оборудование</h1>
            <p className="text-muted-foreground">Управление коммутаторами и портами</p>
          </div>
        </div>

        <ConnectionInfoCard
          connectionInfo={connectionInfo}
          onUpdateDescription={(description) => setConnectionInfo({ ...connectionInfo, description })}
          switchCount={mockData.length}
          activePortsCount={activePortsCount}
        />

        <SwitchListCard
          switches={mockData}
          openSwitches={openSwitches}
          selectedPorts={selectedPorts}
          onToggleSwitch={toggleSwitch}
          onTogglePort={togglePort}
          onToggleAllPorts={toggleAllPorts}
          onDeletePorts={handleDeletePorts}
          onReconfigurePorts={handleReconfigurePorts}
          onAddSwitch={handleAddSwitch}
          onAddPort={handleAddPort}
          onOpenDiagnostics={openDiagnostics}
        />

        <div className="flex justify-center py-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent hover:border-primary transition-all"
          >
            <Icon name="Settings" size={16} />
            Расширенный функционал
          </a>
        </div>

        <IpLevelCard
          ipAddresses={mockIpAddresses}
          dhcpMode={dhcpMode}
          ipDistributionMode={ipDistributionMode}
          internetAccess={internetAccess}
          incomingSpeed={incomingSpeed}
          outgoingSpeed={outgoingSpeed}
          autoBlock={autoBlock}
          showIpAddresses={showIpAddresses}
          expandedIpRows={expandedIpRows}
          onDhcpModeChange={setDhcpMode}
          onInternetAccessChange={setInternetAccess}
          onIncomingSpeedChange={setIncomingSpeed}
          onOutgoingSpeedChange={setOutgoingSpeed}
          onAutoBlockChange={setAutoBlock}
          onToggleIpAddresses={() => setShowIpAddresses(!showIpAddresses)}
          onToggleIpRow={toggleIpRow}
        />
      </div>

      <DiagnosticsDialog
        open={diagnosticsOpen}
        switches={mockData}
        selectedSwitch={diagnosticsSwitch}
        selectedPort={diagnosticsPort}
        currentTab={diagnosticsTab}
        isLoading={isLoading}
        chartType={chartType}
        isRealtime={isRealtime}
        timeInterval={timeInterval}
        onOpenChange={setDiagnosticsOpen}
        onSwitchChange={setDiagnosticsSwitch}
        onPortChange={setDiagnosticsPort}
        onTabChange={handleTabChange}
        onChartTypeChange={setChartType}
        onRealtimeToggle={() => setIsRealtime(!isRealtime)}
        onTimeIntervalChange={setTimeInterval}
      />
    </div>
  );
};

export default Index;
