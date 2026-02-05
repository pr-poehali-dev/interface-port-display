import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface IpAddress {
  ip: string;
  isRealIp: boolean;
  mac: string;
  hostname: string;
  vendor: string | null;
  status: 'active' | 'blocked' | 'inactive';
  dhcp: string;
  internet: string;
  mask: string;
  gateway: string;
  dns: string[];
  description: string;
  macBind: string | null;
  arp?: string | null;
}

interface IpLevelCardProps {
  ipAddresses: IpAddress[];
  dhcpMode: string;
  ipDistributionMode: 'simple' | 'advanced';
  internetAccess: 'closed' | 'open';
  incomingSpeed: string;
  outgoingSpeed: string;
  autoBlock: 'none' | 'smtp';
  showIpAddresses: boolean;
  expandedIpRows: number[];
  onDhcpModeChange: (mode: string) => void;
  onInternetAccessChange: (access: 'closed' | 'open') => void;
  onIncomingSpeedChange: (speed: string) => void;
  onOutgoingSpeedChange: (speed: string) => void;
  onAutoBlockChange: (block: 'none' | 'smtp') => void;
  onToggleIpAddresses: () => void;
  onToggleIpRow: (index: number) => void;
}

const IpLevelCard = ({
  ipAddresses,
  dhcpMode,
  ipDistributionMode,
  internetAccess,
  incomingSpeed,
  outgoingSpeed,
  autoBlock,
  showIpAddresses,
  expandedIpRows,
  onDhcpModeChange,
  onInternetAccessChange,
  onIncomingSpeedChange,
  onOutgoingSpeedChange,
  onAutoBlockChange,
  onToggleIpAddresses,
  onToggleIpRow,
}: IpLevelCardProps) => {
  return (
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
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Опции терминации</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <Icon name="Network" size={16} className="text-muted-foreground" />
                DHCP
              </label>
              <Select value={dhcpMode} onValueChange={onDhcpModeChange}>
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
                  <Button size="sm" onClick={() => onInternetAccessChange('open')}>
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
                    <Button variant="outline" size="sm" onClick={() => onInternetAccessChange('closed')}>
                      <Icon name="Lock" size={12} className="mr-1.5" />
                      Закрыть
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Входящая скорость</label>
                      <Select value={incomingSpeed} onValueChange={onIncomingSpeedChange}>
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
                      <Select value={outgoingSpeed} onValueChange={onOutgoingSpeedChange}>
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
                    <Button variant="outline" size="sm" onClick={() => onAutoBlockChange('none')}>
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
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">IPv4</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleIpAddresses}
              className="h-7 text-xs"
            >
              <Icon name="RefreshCw" size={12} className="mr-1.5" />
              {showIpAddresses ? 'Скрыть адреса' : 'Показать адреса'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {!showIpAddresses || ipAddresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Icon name="NetworkOff" size={48} className="text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">IP-адреса не найдены</p>
                  <p className="text-xs text-muted-foreground/70">Нажмите кнопку ниже, чтобы добавить первый адрес</p>
                </div>
              ) : (
                ipAddresses.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-card hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-[180px] space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                            item.status === 'active' 
                              ? 'bg-green-100 border-green-200' 
                              : item.status === 'blocked'
                              ? 'bg-red-100 border-red-200'
                              : 'bg-gray-100 border-gray-200'
                          }`}>
                            <Icon 
                              name={item.status === 'active' ? 'Check' : item.status === 'blocked' ? 'Lock' : 'Minus'} 
                              size={12} 
                              className={item.status === 'active' ? 'text-green-600' : item.status === 'blocked' ? 'text-red-600' : 'text-gray-600'}
                            />
                          </div>
                          <span className={`font-mono font-medium ${
                            item.status === 'blocked' ? 'text-gray-400' : ''
                          }`}>{item.ip}</span>
                          {item.isRealIp && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 bg-blue-50 text-blue-700 border-blue-200">
                              <Icon name="Globe" size={10} className="mr-0.5" />
                              Real
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 group">
                          <div className="text-xs text-muted-foreground">Comment:</div>
                          <div className="text-xs italic">{item.description || ''}</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0 ml-auto"
                            title={item.description ? 'Редактировать' : 'Добавить'}
                          >
                            <Icon name={item.description ? 'Pencil' : 'Plus'} size={12} />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 group">
                          <div className="text-xs text-muted-foreground">Привязан к Mac:</div>
                          <div className="text-xs font-mono">{item.macBind || ''}</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0 ml-auto"
                            title={item.macBind ? 'Изменить привязку' : 'Привязать MAC'}
                          >
                            <Icon name="Link" size={12} />
                          </Button>
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-xs space-y-0.5 text-left grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                          <span className="text-muted-foreground">Маска:</span>
                          <span className="font-mono">{item.mask}</span>
                          
                          <span className="text-muted-foreground">Шлюз:</span>
                          <span className="font-mono">{item.gateway}</span>
                          
                          {item.dns.map((dns, idx) => (
                            <>
                              <span key={`label-${idx}`} className="text-muted-foreground">DNS:</span>
                              <span key={`value-${idx}`} className="font-mono">{dns}</span>
                            </>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onToggleIpRow(index)}
                        >
                          <Icon name={expandedIpRows.includes(index) ? 'ChevronUp' : 'ChevronDown'} size={16} />
                        </Button>
                      </div>
                    </div>

                    {expandedIpRows.includes(index) && (
                      <div className="mt-3 pt-3 border-t space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <div>
                            <span className="text-muted-foreground">MAC:</span>{' '}
                            <span className="font-mono">{item.mac}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Hostname:</span>{' '}
                            <span>{item.hostname}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vendor:</span>{' '}
                            <span>{item.vendor || '—'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">DHCP:</span>{' '}
                            <span>{item.dhcp}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Internet:</span>{' '}
                            <span>{item.internet}</span>
                          </div>
                        </div>
                        {item.arp && (
                          <div>
                            <span className="text-muted-foreground">ARP:</span>{' '}
                            <span className="font-mono">{item.arp}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
              
              <button
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all w-full group"
              >
                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                  <Icon name="Plus" size={14} />
                  <span className="text-xs font-medium">Добавить IP-адрес</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default IpLevelCard;
