import { useState } from 'react';
import Icon from '@/components/ui/icon';

const fmt = (v: number) =>
  v.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' руб.';

const fmtSigned = (v: number) => {
  const s = fmt(Math.abs(v));
  return v < 0 ? `−${s}` : `+${s}`;
};

interface ServiceRow {
  article: string;
  name: string;
  upd: number;
  nds: number;
  deductions: number;
  total: number;
}

interface MonthData {
  month: string;
  services: ServiceRow[];
  credited: number;
}

interface YearData {
  year: number;
  months: MonthData[];
}

const YEARS: YearData[] = [
  {
    year: 2025,
    months: [
      {
        month: 'Октябрь 2025',
        credited: 400248.12,
        services: [
          { article: '5000', name: 'Интернет', upd: -14000, nds: 666.67, deductions: 266.67, total: 933.34 },
        ],
      },
      {
        month: 'Сентябрь 2025',
        credited: 925138.16,
        services: [
          { article: '5000', name: 'Интернет', upd: -839790, nds: 39990, deductions: 15996, total: 55986 },
          { article: '5010', name: 'Подключение абонента', upd: -63000, nds: 3000, deductions: 0, total: 3000 },
          { article: '5030', name: 'Внешний IP', upd: -10670, nds: 508.1, deductions: 0, total: 508.1 },
          { article: '5040', name: 'Дополнительная услуга', upd: -132.64, nds: 6.32, deductions: 0, total: 6.32 },
          { article: '6000', name: 'Абонентская плата за номера', upd: -1980, nds: 94.29, deductions: 37.71, total: 132 },
          { article: '6010', name: 'Абонентская плата за соединительные линии без номеров', upd: -59780, nds: 2846.67, deductions: 1138.67, total: 3985.34 },
          { article: '6050', name: 'Превышение местного исходящего трафика', upd: -8649.39, nds: 411.88, deductions: 164.75, total: 576.63 },
          { article: '6070', name: 'Услуга местного завершения вызова', upd: -4126.5, nds: 196.5, deductions: 78.6, total: 275.1 },
          { article: '8000', name: 'Размещение оборудования', upd: -5750, nds: 273.81, deductions: 0, total: 273.81 },
          { article: '9000', name: 'ЛКС', upd: -22900, nds: 1090.48, deductions: 0, total: 1090.48 },
          { article: '10000', name: 'Аренда каналов связи', upd: -3000, nds: 142.86, deductions: 0, total: 142.86 },
        ],
      },
    ],
  },
  {
    year: 2024,
    months: [
      {
        month: 'Декабрь 2024',
        credited: 1105000,
        services: [
          { article: '5000', name: 'Интернет', upd: -950000, nds: 45238.1, deductions: 19000, total: 64238.1 },
          { article: '5010', name: 'Подключение абонента', upd: -45000, nds: 2142.86, deductions: 0, total: 2142.86 },
          { article: '6000', name: 'Абонентская плата за номера', upd: -2400, nds: 114.29, deductions: 45.71, total: 160 },
        ],
      },
    ],
  },
];

const TOTALS = {
  upd: YEARS.flatMap(y => y.months).flatMap(m => m.services).reduce((s, r) => s + r.upd, 0),
  credited: YEARS.flatMap(y => y.months).reduce((s, m) => s + m.credited, 0),
  nds: YEARS.flatMap(y => y.months).flatMap(m => m.services).reduce((s, r) => s + r.nds, 0),
  deductions: YEARS.flatMap(y => y.months).flatMap(m => m.services).reduce((s, r) => s + r.deductions, 0),
  total: YEARS.flatMap(y => y.months).flatMap(m => m.services).reduce((s, r) => s + r.total, 0),
};

function MonthTable({ data }: { data: MonthData }) {
  const totalUpd = data.services.reduce((s, r) => s + r.upd, 0);
  const totalNds = data.services.reduce((s, r) => s + r.nds, 0);
  const totalDed = data.services.reduce((s, r) => s + r.deductions, 0);
  const totalTotal = data.services.reduce((s, r) => s + r.total, 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            <th className="text-left px-5 py-3 font-semibold text-slate-600 w-[30%]">Наименование</th>
            <th className="text-right px-5 py-3 font-semibold text-slate-600">Выставлено УПД</th>
            <th className="text-right px-5 py-3 font-semibold text-slate-600">Зачислено</th>
            <th className="text-right px-5 py-3 font-semibold text-slate-600">НДС, 5%</th>
            <th className="text-right px-5 py-3 font-semibold text-slate-600">Отчисления, 2%</th>
            <th className="text-right px-5 py-3 font-semibold text-slate-600">Итого</th>
          </tr>
        </thead>
        <tbody>
          {data.services.map((row, i) => (
            <tr
              key={row.article}
              className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}
            >
              <td className="px-5 py-3.5">
                <div className="text-[11px] text-slate-400 font-medium">(артикул {row.article})</div>
                <div className="text-slate-700 font-medium leading-tight">{row.name}</div>
              </td>
              <td className="px-5 py-3.5 text-right font-mono text-red-600 font-medium whitespace-nowrap">
                {fmtSigned(row.upd)}
              </td>
              <td className="px-5 py-3.5 text-right text-slate-300 text-xs">—</td>
              <td className="px-5 py-3.5 text-right font-mono text-slate-700 whitespace-nowrap">{fmt(row.nds)}</td>
              <td className="px-5 py-3.5 text-right font-mono text-slate-700 whitespace-nowrap">{fmt(row.deductions)}</td>
              <td className="px-5 py-3.5 text-right font-mono text-slate-800 font-semibold whitespace-nowrap">{fmt(row.total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-200 bg-slate-50">
            <td className="px-5 py-4 font-bold text-slate-800">Всего</td>
            <td className="px-5 py-4 text-right font-mono font-bold text-red-600 whitespace-nowrap">{fmtSigned(totalUpd)}</td>
            <td className="px-5 py-4 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">+{fmt(data.credited)}</td>
            <td className="px-5 py-4 text-right font-mono font-bold text-slate-800 whitespace-nowrap">{fmt(totalNds)}</td>
            <td className="px-5 py-4 text-right font-mono font-bold text-slate-800 whitespace-nowrap">{fmt(totalDed)}</td>
            <td className="px-5 py-4 text-right font-mono font-bold text-slate-800 whitespace-nowrap">{fmt(totalTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function YearSection({ data }: { data: YearData }) {
  const [open, setOpen] = useState(data.year === 2025);
  const [openMonths, setOpenMonths] = useState<Set<string>>(new Set(data.months.map(m => m.month)));

  const toggleMonth = (month: string) => {
    setOpenMonths(prev => {
      const next = new Set(prev);
      if (next.has(month)) { next.delete(month); } else { next.add(month); }
      return next;
    });
  };

  const yearUpd = data.months.flatMap(m => m.services).reduce((s, r) => s + r.upd, 0);
  const yearCredited = data.months.reduce((s, m) => s + m.credited, 0);
  const yearNds = data.months.flatMap(m => m.services).reduce((s, r) => s + r.nds, 0);
  const yearDed = data.months.flatMap(m => m.services).reduce((s, r) => s + r.deductions, 0);
  const yearTotal = data.months.flatMap(m => m.services).reduce((s, r) => s + r.total, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Year header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b60209] to-[#8a0207] flex items-center justify-center shadow-sm">
            <Icon name="CalendarDays" size={18} className="text-white" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-800">{data.year} год</div>
            <div className="text-xs text-slate-400 mt-0.5">{data.months.length} месяц(ев)</div>
          </div>
        </div>
        <div className="flex items-center gap-8">
          {open && (
            <div className="hidden md:flex items-center gap-6 text-sm text-slate-500">
              <span>УПД: <span className="font-semibold text-red-600">{fmtSigned(yearUpd)}</span></span>
              <span>Зачислено: <span className="font-semibold text-emerald-600">+{fmt(yearCredited)}</span></span>
              <span>Итого: <span className="font-semibold text-slate-700">{fmt(yearTotal)}</span></span>
            </div>
          )}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 group-hover:bg-slate-200 transition-all ${open ? 'rotate-180' : ''}`}>
            <Icon name="ChevronDown" size={16} className="text-slate-500 transition-transform duration-300" />
          </div>
        </div>
      </button>

      {/* Year summary when collapsed */}
      {!open && (
        <div className="px-6 pb-4 flex flex-wrap gap-4">
          <div className="text-sm text-slate-500">УПД: <span className="font-semibold text-red-600">{fmtSigned(yearUpd)}</span></div>
          <div className="text-sm text-slate-500">Зачислено: <span className="font-semibold text-emerald-600">+{fmt(yearCredited)}</span></div>
          <div className="text-sm text-slate-500">НДС: <span className="font-semibold text-slate-700">{fmt(yearNds)}</span></div>
          <div className="text-sm text-slate-500">Отчисления: <span className="font-semibold text-slate-700">{fmt(yearDed)}</span></div>
          <div className="text-sm text-slate-500">Итого: <span className="font-semibold text-slate-800">{fmt(yearTotal)}</span></div>
        </div>
      )}

      {/* Months */}
      {open && (
        <div className="border-t border-slate-100 divide-y divide-slate-100">
          {data.months.map((month) => {
            const isMonthOpen = openMonths.has(month.month);
            return (
              <div key={month.month}>
                <button
                  onClick={() => toggleMonth(month.month)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/70 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="CalendarCheck" size={16} className="text-[#b60209]" />
                    <span className="font-semibold text-slate-700">{month.month}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {month.services.length} услуг
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      Зачислено: <span className="font-semibold text-emerald-600">+{fmt(month.credited)}</span>
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 group-hover:bg-slate-200 transition-all ${isMonthOpen ? 'rotate-180' : ''}`}>
                      <Icon name="ChevronDown" size={14} className="text-slate-500 transition-transform duration-300" />
                    </div>
                  </div>
                </button>

                {isMonthOpen && (
                  <div className="px-4 pb-5">
                    <MonthTable data={month} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Statistics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
      <div className="w-full max-w-[1400px] mx-auto p-6 md:p-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Статистика</h1>
          <p className="text-slate-500 mt-1">Сводная информация по выставленным УПД и зачислениям</p>
        </div>

        {/* Total cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {[
            { label: 'Выставлено УПД', value: fmtSigned(TOTALS.upd), color: 'text-red-600', icon: 'FileText', bg: 'bg-red-50', border: 'border-red-100' },
            { label: 'Зачислено', value: `+${fmt(TOTALS.credited)}`, color: 'text-emerald-600', icon: 'ArrowDownToLine', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'НДС, 5%', value: fmt(TOTALS.nds), color: 'text-blue-600', icon: 'Percent', bg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'Отчисления, 2%', value: fmt(TOTALS.deductions), color: 'text-amber-600', icon: 'TrendingDown', bg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'Итого', value: fmt(TOTALS.total), color: 'text-slate-800', icon: 'Sigma', bg: 'bg-slate-100', border: 'border-slate-200' },
          ].map((card) => (
            <div
              key={card.label}
              className={`bg-white rounded-2xl border ${card.border} shadow-sm p-5 flex flex-col gap-3`}
            >
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                <Icon name={card.icon} size={18} className={card.color} />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">{card.label}</div>
                <div className={`text-base font-bold font-mono ${card.color} leading-tight`}>{card.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Years */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-700">По годам</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          {YEARS.map((year) => (
            <YearSection key={year.year} data={year} />
          ))}
        </div>

      </div>
    </div>
  );
}