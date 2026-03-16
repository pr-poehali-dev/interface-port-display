import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Icon from '@/components/ui/icon';

interface Company {
  id: number;
  name: string;
  balance: number;
  status: 'active' | 'archived';
  contractNumber: string;
  comment: string;
  problems?: string[];
}

const mockCompanies: Company[] = [
  { id: 1, name: 'ООО "Система Сервис"', balance: 12500.0, status: 'active', contractNumber: '65727', comment: 'Основной клиент, приоритетная поддержка' },
  { id: 2, name: 'ГСК №34 "Крылатский"', balance: -3200.5, status: 'active', contractNumber: '65963', comment: 'Задолженность за февраль', problems: ['Неправильно заполнены реквизиты', 'У компании закрыт доступ в интернет'] },
  { id: 3, name: 'ИП Горбунов А.В.', balance: 0, status: 'active', contractNumber: '66104', comment: '', problems: ['У компании нет ни одного подключения'] },
  { id: 4, name: 'ООО "Автобан"', balance: 45000.0, status: 'active', contractNumber: '64812', comment: 'VIP-клиент' },
  { id: 5, name: 'ЖСК "Новые Черёмушки"', balance: -750.0, status: 'active', contractNumber: '66291', comment: 'Оплата в процессе', problems: ['Неправильно заполнены реквизиты'] },
  { id: 6, name: 'ООО "Техносфера"', balance: 8900.0, status: 'archived', contractNumber: '63540', comment: 'Переезд в другой регион' },
  { id: 7, name: 'ЗАО "МедиаГрупп"', balance: 1200.0, status: 'active', contractNumber: '66415', comment: '' },
  { id: 8, name: 'ООО "РемСтрой"', balance: -18400.0, status: 'archived', contractNumber: '62987', comment: 'Расторгнут договор' },
  { id: 9, name: 'ИП Сидорова Е.К.', balance: 300.0, status: 'active', contractNumber: '66589', comment: 'Новый клиент с мая', problems: ['У компании нет ни одного подключения', 'У компании закрыт доступ в интернет'] },
  { id: 10, name: 'ГСК №12 "Восток"', balance: 5600.0, status: 'active', contractNumber: '65102', comment: '' },
  { id: 11, name: 'ООО "АльфаТрейд"', balance: -900.0, status: 'archived', contractNumber: '63211', comment: 'Ликвидирована' },
  { id: 12, name: 'ФГУП "Спецстрой"', balance: 22100.0, status: 'active', contractNumber: '64455', comment: 'Госконтракт' },
];

type FilterStatus = 'all' | 'active' | 'archived';

const formatBalance = (value: number) => {
  const abs = Math.abs(value).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (value > 0) return `+${abs} ₽`;
  if (value < 0) return `−${abs} ₽`;
  return `0.00 ₽`;
};

const exportCSV = (companies: Company[]) => {
  const header = ['ID', 'Название', 'Баланс', 'Статус', 'Номер договора', 'Комментарий'];
  const rows = companies.map((c) => [
    c.id,
    `"${c.name.replace(/"/g, '""')}"`,
    c.balance.toFixed(2),
    c.status === 'active' ? 'Активная' : 'В архиве',
    c.contractNumber,
    `"${c.comment.replace(/"/g, '""')}"`,
  ]);
  const csv = [header.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'companies.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const CompanyList = () => {
  const [filter, setFilter] = useState<FilterStatus>('active');

  const filtered = useMemo(() => {
    if (filter === 'all') return mockCompanies;
    return mockCompanies.filter((c) => (filter === 'active' ? c.status === 'active' : c.status === 'archived'));
  }, [filter]);

  const activeCount = mockCompanies.filter((c) => c.status === 'active').length;
  const archivedCount = mockCompanies.filter((c) => c.status === 'archived').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
      <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Компании</h1>
            <p className="text-muted-foreground mt-1">
              Всего: {mockCompanies.length} · Активных: {activeCount} · В архиве: {archivedCount}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
            <SelectTrigger className="w-44 bg-white border-border/60 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="archived">В архиве</SelectItem>
              <SelectItem value="all">Все</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="bg-white border-border/60 shadow-sm hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
            title="Экспорт в CSV"
            onClick={() => exportCSV(filtered)}
          >
            <Icon name="FileSpreadsheet" size={16} />
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-slate-50/70">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-12">#</th>
                  <th className="w-8 px-2 py-3"></th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Название</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground w-36">Баланс</th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground w-28">Статус</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-32">Договор №</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Комментарий</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      Нет компаний
                    </td>
                  </tr>
                )}
                {filtered.map((company, idx) => (
                  <tr
                    key={company.id}
                    className={`border-b border-border/30 hover:bg-slate-50/60 transition-colors ${idx % 2 === 0 ? '' : 'bg-slate-50/30'}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{company.id}</td>
                    <td className="px-2 py-3 text-center">
                      {company.problems && company.problems.length > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors">
                              <Icon name="TriangleAlert" size={13} className="text-amber-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-56 p-0 overflow-hidden">
                            <div className="bg-amber-50 border-b border-amber-200 px-3 py-2">
                              <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                                <Icon name="TriangleAlert" size={12} />
                                Проблемы ({company.problems.length})
                              </p>
                            </div>
                            <ul className="px-3 py-2 space-y-1">
                              {company.problems.map((p, i) => (
                                <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                                  <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/companies/${company.id}`}
                        className="font-medium text-foreground hover:text-[#b60209] transition-colors flex items-center gap-1.5 group"
                      >
                        {company.name}
                        <Icon
                          name="ArrowUpRight"
                          size={13}
                          className="opacity-0 group-hover:opacity-100 text-[#b60209] transition-opacity shrink-0"
                        />
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">
                      <span
                        className={
                          company.balance > 0
                            ? 'text-emerald-600'
                            : company.balance < 0
                              ? 'text-red-600'
                              : 'text-muted-foreground'
                        }
                      >
                        {formatBalance(company.balance)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {company.status === 'active' ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-normal text-xs">
                          Активная
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-muted-foreground font-normal text-xs">
                          В архиве
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground text-xs">{company.contractNumber}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs">
                      <div className="flex items-center gap-1.5 group">
                        <span className="truncate">{company.comment || <span className="opacity-30">—</span>}</span>
                        <button
                          onClick={() => {}}
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center w-5 h-5 rounded hover:bg-slate-200 text-muted-foreground hover:text-foreground"
                        >
                          <Icon name="Pencil" size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-2.5 border-t border-border/30 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Показано: {filtered.length} из {mockCompanies.length}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyList;