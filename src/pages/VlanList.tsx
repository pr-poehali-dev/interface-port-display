import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Switch {
  name: string;
  location: string;
  ports: number[];
}

interface Vlan {
  id: number;
  number: string;
  description?: string;
  internetAccess: 'open' | 'closed';
  ipCount: number;
  portCount: number;
  switches?: Switch[];
}

const mockVlans: Vlan[] = [
  {
    id: 1,
    number: '01-0719',
    description: 'Серверная на 2ом этаже у входа',
    internetAccess: 'open',
    ipCount: 24,
    portCount: 12,
    switches: [
      { name: 'sw-0028', location: 'Autoban_19-1', ports: [3, 4, 7, 8, 9, 10, 11, 12] },
      { name: 'sw-0045', location: 'Automoll_28_5', ports: [11, 17] },
      { name: 'sw-0111', location: 'Automoll_28_6', ports: [1] },
      { name: 'sw-0125', location: 'Automoll_37_10', ports: [2, 4, 7] },
      { name: 'sw-0367', location: 'Autoban_autokit', ports: [4, 6] },
      { name: 'sw-0375', location: 'Automoll_28_20', ports: [4] },
      { name: 'sw-0533', location: 'Automoll_28_20', ports: [6, 10, 18] },
      { name: 'sw-2114', location: 'Gorb_vl14_yug', ports: [21] },
      { name: 'sw-3141', location: 'Gorb_vl63_sever', ports: [16, 19] },
    ],
  },
  {
    id: 2,
    number: '01-0179',
    description: 'Офисная зона этаж 3',
    internetAccess: 'open',
    ipCount: 48,
    portCount: 24,
    switches: [
      { name: 'sw-0012', location: 'Office_floor3_A', ports: [1, 2, 3, 5] },
      { name: 'sw-0034', location: 'Office_floor3_B', ports: [7, 8] },
    ],
  },
  {
    id: 3,
    number: '01-0520',
    internetAccess: 'closed',
    ipCount: 8,
    portCount: 4,
  },
  {
    id: 4,
    number: '01-0892',
    description: 'Конференц-зал',
    internetAccess: 'open',
    ipCount: 16,
    portCount: 8,
    switches: [
      { name: 'sw-0099', location: 'Conf_hall_main', ports: [2, 4] },
    ],
  },
];

const VlanList = () => {
  const [vlans, setVlans] = useState<Vlan[]>(mockVlans);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
      <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">VLAN Подключения</h1>
            <p className="text-muted-foreground mt-1">Управление виртуальными локальными сетями</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#b60209] to-[#8b0107] hover:from-[#a00208] hover:to-[#6f0105]">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить VLAN
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить новое VLAN подключение</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Номер VLAN</label>
                  <Input placeholder="01-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Описание (опционально)</label>
                  <Textarea placeholder="Описание местоположения или назначения" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Доступ в интернет</label>
                  <Select defaultValue="closed">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Открыт</SelectItem>
                      <SelectItem value="closed">Закрыт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Количество IP</label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Количество портов</label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button className="bg-gradient-to-r from-[#b60209] to-[#8b0107] hover:from-[#a00208] hover:to-[#6f0105]">
                    Создать
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {vlans.map((vlan) => (
            <Card key={vlan.id} className="hover:shadow-lg transition-shadow duration-200 border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Основная строка */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-[#b60209] to-[#8b0107] flex-shrink-0">
                        <Icon name="GitBranch" size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Подключение</p>
                        <p className="text-2xl font-bold" style={{ color: '#b60209' }}>{vlan.number}</p>
                      </div>
                    </div>

                    {vlan.description && (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Icon name="MapPin" size={16} className="text-muted-foreground flex-shrink-0" />
                        <p className="text-sm text-muted-foreground truncate">{vlan.description}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-6 md:ml-auto flex-wrap">
                      <div className="flex gap-2">
                        <Icon name="Globe" size={16} className="text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">IP адресов</p>
                          <p className="text-lg font-bold text-center">{vlan.ipCount}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Icon name="Network" size={16} className="text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Портов</p>
                          <p className="text-lg font-bold text-center">{vlan.portCount}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Доступ в интернет</p>
                        <Badge 
                          variant={vlan.internetAccess === 'open' ? 'default' : 'secondary'}
                          className={vlan.internetAccess === 'open' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                            : 'bg-red-100 text-red-700 hover:bg-red-100'}
                        >
                          <Icon 
                            name={vlan.internetAccess === 'open' ? 'Unlock' : 'Lock'} 
                            size={12} 
                            className="mr-1" 
                          />
                          {vlan.internetAccess === 'open' ? 'Открыт' : 'Закрыт'}
                        </Badge>
                      </div>

                      <Button variant="outline" size="sm">
                        <Icon name="Eye" size={16} className="mr-2" />
                        Подробнее
                      </Button>
                    </div>
                  </div>

                  {/* Коммутаторы */}
                  {vlan.switches && vlan.switches.length > 0 && (
                    <div className="border-t border-border/50 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon name="Server" size={14} className="text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Коммутаторы</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {vlan.switches.map((sw) => (
                          <div key={sw.name} className="flex items-center gap-3 bg-slate-50 rounded-md px-3 py-1.5">
                            <span className="text-xs font-mono font-bold text-[#b60209] shrink-0 w-28">{sw.name}</span>
                            <span className="text-xs text-muted-foreground shrink-0 w-32 truncate">{sw.location}</span>
                            <div className="flex flex-wrap gap-0.5">
                              {sw.ports.map((port) => (
                                <span
                                  key={port}
                                  className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-medium bg-white border border-border text-foreground"
                                >
                                  {port}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VlanList;