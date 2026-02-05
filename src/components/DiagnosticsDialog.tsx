import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Port {
  id: number;
  number: number;
  device?: string;
}

interface Switch {
  id: number;
  name: string;
  location: string;
  ports: Port[];
}

interface DiagnosticsDialogProps {
  open: boolean;
  switches: Switch[];
  selectedSwitch: string;
  selectedPort: string;
  currentTab: string;
  isLoading: boolean;
  chartType: 'link' | 'traffic' | 'unicast' | 'broadcast' | 'errors';
  isRealtime: boolean;
  timeInterval: '5m' | '10m' | '30m' | '1h' | '6h' | '1d';
  onOpenChange: (open: boolean) => void;
  onSwitchChange: (switchId: string) => void;
  onPortChange: (portId: string) => void;
  onTabChange: (tab: string) => void;
  onChartTypeChange: (type: 'link' | 'traffic' | 'unicast' | 'broadcast' | 'errors') => void;
  onRealtimeToggle: () => void;
  onTimeIntervalChange: (interval: '5m' | '10m' | '30m' | '1h' | '6h' | '1d') => void;
}

const DiagnosticsDialog = ({
  open,
  switches,
  selectedSwitch,
  selectedPort,
  currentTab,
  isLoading,
  chartType,
  isRealtime,
  timeInterval,
  onOpenChange,
  onSwitchChange,
  onPortChange,
  onTabChange,
  onChartTypeChange,
  onRealtimeToggle,
  onTimeIntervalChange,
}: DiagnosticsDialogProps) => {
  const getAvailablePorts = () => {
    if (!selectedSwitch) return [];
    const switchData = switches.find(s => s.id.toString() === selectedSwitch);
    return switchData?.ports || [];
  };

  const intervals: typeof timeInterval[] = ['5m', '10m', '30m', '1h', '6h', '1d'];
  
  const getIntervalLabel = (interval: typeof timeInterval) => {
    switch (interval) {
      case '5m': return '5 мин';
      case '10m': return '10 мин';
      case '30m': return '30 мин';
      case '1h': return '1 час';
      case '6h': return '6 ч';
      case '1d': return '1 день';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Диагностика порта</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Коммутатор</label>
              <Select value={selectedSwitch} onValueChange={onSwitchChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите коммутатор" />
                </SelectTrigger>
                <SelectContent>
                  {switches.map((sw) => (
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
                value={selectedPort} 
                onValueChange={onPortChange}
                disabled={!selectedSwitch}
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
              onClick={() => onOpenChange(false)}
              className="mt-6"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <Tabs value={currentTab} onValueChange={onTabChange}>
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
                    <CardTitle className="text-lg">График трафика</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
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
                            onClick={() => onChartTypeChange(type.value as any)}
                            className="gap-1.5 h-9"
                          >
                            <Icon name={type.icon as any} size={14} />
                            {type.label}
                          </Button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                        <Button
                          variant={isRealtime ? 'default' : 'outline'}
                          size="sm"
                          onClick={onRealtimeToggle}
                          className="gap-1.5 h-8"
                        >
                          <Icon name={isRealtime ? 'Zap' : 'Clock'} size={14} />
                          Realtime
                        </Button>

                        <div className="h-6 w-px bg-border" />

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              const currentIndex = intervals.indexOf(timeInterval);
                              if (currentIndex > 0) {
                                onTimeIntervalChange(intervals[currentIndex - 1]);
                              }
                            }}
                            disabled={timeInterval === '5m'}
                          >
                            <Icon name="Minus" size={14} />
                          </Button>
                          <div className="min-w-[70px] text-center px-2 py-1 bg-background rounded border">
                            <span className="text-xs font-medium">
                              {getIntervalLabel(timeInterval)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              const currentIndex = intervals.indexOf(timeInterval);
                              if (currentIndex < intervals.length - 1) {
                                onTimeIntervalChange(intervals[currentIndex + 1]);
                              }
                            }}
                            disabled={timeInterval === '1d'}
                          >
                            <Icon name="Plus" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center p-12 bg-muted/10 rounded-lg border-2 border-dashed">
                      <div className="text-center space-y-2">
                        <Icon name="LineChart" size={48} className="mx-auto text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">График трафика</p>
                        <p className="text-xs text-muted-foreground/70">Данные будут отображены здесь</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diagnostics" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Инструменты диагностики</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center p-12 bg-muted/10 rounded-lg border-2 border-dashed">
                      <div className="text-center space-y-2">
                        <Icon name="Activity" size={48} className="mx-auto text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">Инструменты диагностики</p>
                        <p className="text-xs text-muted-foreground/70">Ping, Traceroute, DNS lookup</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticsDialog;
