import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';

interface Manager {
  id: number;
  name: string;
  avatar?: string;
}

interface NavTab {
  id: string;
  label: string;
  badge?: number;
  warning?: string; // tooltip текст предупреждения
}

interface Company {
  id: number;
  name: string;
  externalUrl: string;
  status: 'active' | 'archived';
  managers: Manager[];
}

const NAV_TABS: NavTab[] = [
  { id: 'requisites', label: 'Реквизиты', warning: 'Реквизиты не заполнены' },
  { id: 'sorm', label: 'СОРМ' },
  { id: 'agreement', label: '65446' },
  { id: 'archive', label: 'Архив' },
  { id: 'vlan', label: 'Vlan', badge: 0 },
  { id: 'phones', label: 'Телефоны', badge: 0 },
];

const mockCompany: Company = {
  id: 1,
  name: 'ТСЖ "Крылатское-16"',
  externalUrl: 'https://example.com/company/1',
  status: 'active',
  managers: [],
};

function ManagerAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600 text-[11px] font-semibold ring-2 ring-white shadow-sm">
      {initials}
    </span>
  );
}

export default function CompanyInfo() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company>(mockCompany);
  const [activeTab, setActiveTab] = useState('requisites');

  const isArchived = company.status === 'archived';

  const handleArchive = () => {
    setCompany((prev) => ({ ...prev, status: 'archived' }));
  };

  const handleRestore = () => {
    setCompany((prev) => ({ ...prev, status: 'active' }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header card */}
      <div className="bg-white border-b border-border/50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4">

          {/* Top row: name + status badge + action */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-start gap-3 min-w-0">
              {/* Status indicator strip */}
              <div
                className={`mt-1.5 shrink-0 w-1 h-8 rounded-full ${
                  isArchived ? 'bg-slate-300' : 'bg-emerald-400'
                }`}
              />
              <div className="min-w-0">
                <a
                  href={company.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1.5"
                >
                  <h1 className="text-xl font-bold text-foreground group-hover:text-[#b60209] transition-colors leading-tight break-words">
                    {company.name}
                  </h1>
                  <Icon
                    name="ExternalLink"
                    size={14}
                    className="mt-1 shrink-0 text-muted-foreground/50 group-hover:text-[#b60209] transition-colors"
                  />
                </a>
                <div className="flex items-center gap-2 mt-1">
                  {isArchived ? (
                    <Badge
                      variant="secondary"
                      className="text-[11px] px-2 py-0 h-5 bg-slate-100 text-slate-500 border border-slate-200 font-medium"
                    >
                      <Icon name="Archive" size={10} className="mr-1" />
                      В архиве
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-[11px] px-2 py-0 h-5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                      Активна
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Archive / Restore button */}
            <div className="shrink-0 pt-0.5">
              {isArchived ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                    >
                      <Icon name="ArchiveRestore" size={14} />
                      Восстановить
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Восстановить компанию?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Компания «{company.name}» будет переведена в статус активной.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRestore}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Восстановить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5 border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700"
                    >
                      <Icon name="Archive" size={14} />
                      В архив
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Отправить в архив?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Компания «{company.name}» будет переведена в архив. Вы сможете
                        восстановить её в любой момент.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleArchive}
                        className="bg-[#b60209] hover:bg-[#9a0208] text-white"
                      >
                        Отправить в архив
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {/* Managers row */}
          <div className="flex items-center gap-2 mb-4 pl-4">
            <Icon name="Users" size={13} className="text-muted-foreground/60 shrink-0" />
            {company.managers.length === 0 ? (
              <span className="text-xs text-muted-foreground">Менеджеры не назначены</span>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1.5">
                  {company.managers.slice(0, 4).map((m) => (
                    <ManagerAvatar key={m.id} name={m.name} />
                  ))}
                  {company.managers.length > 4 && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-[11px] font-semibold ring-2 ring-white">
                      +{company.managers.length - 4}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground ml-1">
                  {company.managers.map((m) => m.name).join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Nav tabs */}
          <nav className="flex items-center gap-0 border-b border-transparent -mb-4">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#b60209] text-[#b60209]'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <span className="relative inline-flex items-center gap-1">
                  {tab.label}

                  {/* Предупреждение: жёлтый треугольник с ! */}
                  {tab.warning && (
                    <span
                      title={tab.warning}
                      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-sm bg-amber-400 text-white text-[9px] font-black leading-none cursor-help select-none"
                      style={{ fontSize: 9 }}
                    >
                      !
                    </span>
                  )}

                  {/* Счётчик: абсолютно в правом верхнем углу (супер-скрипт) */}
                  {tab.badge !== undefined && (
                    <span
                      className={`absolute -top-2 -right-3 inline-flex items-center justify-center min-w-[16px] h-[16px] px-[3px] rounded-full text-[9px] font-bold leading-none ${
                        activeTab === tab.id
                          ? 'bg-[#b60209] text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Page content placeholder */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="text-sm text-muted-foreground">
          Содержимое вкладки <strong>{NAV_TABS.find((t) => t.id === activeTab)?.label}</strong>
        </div>
      </div>
    </div>
  );
}