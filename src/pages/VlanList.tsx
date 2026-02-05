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

interface Vlan {
  id: number;
  number: string;
  description?: string;
  internetAccess: 'open' | 'closed';
  ipCount: number;
  portCount: number;
}

const mockVlans: Vlan[] = [
  {
    id: 1,
    number: '01-0719',
    description: 'Серверная на 2ом этаже у входа',
    internetAccess: 'open',
    ipCount: 24,
    portCount: 12,
  },
  {
    id: 2,
    number: '01-0179',
    description: 'Офисная зона этаж 3',
    internetAccess: 'open',
    ipCount: 48,
    portCount: 24,
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
  },
];

const VlanList = () => {
  const [vlans, setVlans] = useState<Vlan[]>(mockVlans);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">VLAN Подключения</h1>
            <p className="text-muted-foreground mt-1">Управление виртуальными локальными сетями</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: '#b60209' }} className="hover:opacity-90">
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
                  <Button style={{ backgroundColor: '#b60209' }} className="hover:opacity-90">
                    Создать
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vlans.map((vlan) => (
            <Card key={vlan.id} className="hover:shadow-lg transition-shadow duration-200 border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#b60209' }}>
                      <Icon name="Network" size={20} className="text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Подключение</CardTitle>
                      <p className="text-xl font-bold text-primary mt-1">{vlan.number}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Icon name="MoreVertical" size={18} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {vlan.description && (
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <Icon name="MapPin" size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{vlan.description}</span>
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Доступ в интернет</span>
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Icon name="Globe" size={14} />
                        <span className="text-xs font-medium">IP адресов</span>
                      </div>
                      <p className="text-xl font-bold">{vlan.ipCount}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Icon name="Cable" size={14} />
                        <span className="text-xs font-medium">Портов</span>
                      </div>
                      <p className="text-xl font-bold">{vlan.portCount}</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  <Icon name="Eye" size={16} className="mr-2" />
                  Подробнее
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VlanList;