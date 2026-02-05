import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ConnectionInfo {
  vlanNumber: string;
  description: string;
}

interface ConnectionInfoCardProps {
  connectionInfo: ConnectionInfo;
  onUpdateDescription: (description: string) => void;
  switchCount: number;
  activePortsCount: number;
}

const ConnectionInfoCard = ({ connectionInfo, onUpdateDescription, switchCount, activePortsCount }: ConnectionInfoCardProps) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(connectionInfo.description);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-red-500 to-rose-600">
              <Icon name="Info" size={20} className="text-white" />
            </div>
            Сведения о точке подключения
          </CardTitle>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Icon name="Trash2" size={20} />
          </Button>
        </div>
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
              <p className="text-2xl font-bold">{switchCount}</p>
            </div>
          </div>
          
          <div className="p-5 rounded-xl bg-muted/40 border border-border/50">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Активных портов</p>
            <div className="flex items-center gap-2">
              <Icon name="Network" size={20} className="text-primary" />
              <p className="text-2xl font-bold">{activePortsCount}</p>
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
                        onUpdateDescription(tempDescription);
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
                      onUpdateDescription(tempDescription);
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
  );
};

export default ConnectionInfoCard;
