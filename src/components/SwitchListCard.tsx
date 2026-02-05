import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface SwitchListCardProps {
  switches: Switch[];
  openSwitches: number[];
  selectedPorts: number[];
  onToggleSwitch: (id: number) => void;
  onTogglePort: (id: number) => void;
  onToggleAllPorts: (switchItem: Switch) => void;
  onDeletePorts: (switchId: number) => void;
  onReconfigurePorts: (switchId: number) => void;
  onAddSwitch: () => void;
  onAddPort: (switchId: number) => void;
  onOpenDiagnostics: (switchId: number, portId: number) => void;
}

const SwitchListCard = ({
  switches,
  openSwitches,
  selectedPorts,
  onToggleSwitch,
  onTogglePort,
  onToggleAllPorts,
  onDeletePorts,
  onReconfigurePorts,
  onAddSwitch,
  onAddPort,
  onOpenDiagnostics,
}: SwitchListCardProps) => {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
              <Icon name="Network" size={20} className="text-white" />
            </div>
            Физические порты подключения (Level-2 OSI)
          </CardTitle>
          <Button onClick={onAddSwitch} className="gap-2">
            <Icon name="Plus" size={18} />
            Добавить коммутатор
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {switches.map((switchItem) => {
            const activePorts = switchItem.ports.filter((p) => p.status === 'active').length;
            const totalPorts = switchItem.ports.length;
            const isOpen = openSwitches.includes(switchItem.id);

            return (
              <Card key={switchItem.id} className="overflow-hidden transition-all hover:shadow-md border-border/50">
                <Collapsible open={isOpen} onOpenChange={() => onToggleSwitch(switchItem.id)}>
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
                          onCheckedChange={() => onToggleAllPorts(switchItem)}
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
                            <Button onClick={() => onReconfigurePorts(switchItem.id)} variant="outline" size="sm" className="gap-1.5 h-7 px-2 text-xs">
                              <Icon name="Settings" size={12} />
                              Перенастроить
                            </Button>
                            <Button onClick={() => onDeletePorts(switchItem.id)} variant="destructive" size="sm" className="gap-1.5 h-7 px-2 text-xs">
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
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${getStatusColor(port.status)}`}
                          >
                            <Checkbox
                              checked={selectedPorts.includes(port.id)}
                              onCheckedChange={() => onTogglePort(port.id)}
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
                                <DropdownMenuItem onClick={() => onOpenDiagnostics(switchItem.id, port.id)}>
                                  <Icon name="Activity" size={14} className="mr-2" />
                                  Диагностика
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}

                        <button
                          onClick={() => onAddPort(switchItem.id)}
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

        {switches.length === 0 && (
          <div className="p-12 text-center">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Коммутаторы не найдены</p>
            <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SwitchListCard;
