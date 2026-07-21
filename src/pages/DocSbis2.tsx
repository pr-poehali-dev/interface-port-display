import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type SbisStatus =
  | 'sent_sbis'
  | 'invite_sent'
  | 'sent_to_counterparty'
  | 'delivered'
  | 'rejected'
  | 'undefined';

const STATUS_META: Record<
  SbisStatus,
  { label: string; tone: 'blue' | 'red'; icon: string }
> = {
  sent_sbis: { label: 'Отправлен в Сбис', tone: 'blue', icon: 'Send' },
  invite_sent: { label: 'Отослано приглашение', tone: 'blue', icon: 'Mail' },
  sent_to_counterparty: { label: 'Отправлен контрагенту', tone: 'blue', icon: 'ArrowUpRight' },
  delivered: { label: 'Доставлен контрагенту', tone: 'blue', icon: 'CheckCheck' },
  rejected: { label: 'Отклонён', tone: 'red', icon: 'XCircle' },
  undefined: { label: 'Не определён', tone: 'red', icon: 'HelpCircle' },
};

const TONE_CLASSES: Record<'blue' | 'red', string> = {
  blue: 'text-blue-600 bg-blue-50 border-blue-200',
  red: 'text-red-600 bg-red-50 border-red-200',
};

interface SbisDocument {
  id: number;
  name: string;
  status: SbisStatus;
}

interface YearGroup {
  year: number;
  documents: SbisDocument[];
}

interface CompanyGroup {
  id: number;
  name: string;
  years: YearGroup[];
}

const COMPANIES: CompanyGroup[] = [
  {
    id: 10482,
    name: 'ООО "А1 АВТО"',
    years: [
      {
        year: 2026,
        documents: [
          { id: 1, name: 'А1 АВТО упд №И1389 за Май 2026 г.', status: 'sent_sbis' },
          { id: 2, name: 'А1 АВТО упд №И1350 за Апрель 2026 г.', status: 'rejected' },
          { id: 3, name: 'А1 АВТО счёт №1453-И от 3 Июня 2026 г.', status: 'invite_sent' },
        ],
      },
      {
        year: 2025,
        documents: [
          { id: 4, name: 'А1 АВТО упд №И1102 за Декабрь 2025 г.', status: 'delivered' },
        ],
      },
    ],
  },
  {
    id: 10510,
    name: 'ГСК №34 "Крылатский"',
    years: [
      {
        year: 2026,
        documents: [
          { id: 5, name: 'ГСК №34 упд №И1390 за Май 2026 г.', status: 'undefined' },
          { id: 6, name: 'ГСК №34 упд №И1391 за Июнь 2026 г.', status: 'sent_to_counterparty' },
        ],
      },
    ],
  },
  {
    id: 10633,
    name: 'ИП Горбунов А.В.',
    years: [
      {
        year: 2026,
        documents: [
          { id: 7, name: 'ИП Горбунов упд №И1402 за Май 2026 г.', status: 'rejected' },
        ],
      },
    ],
  },
];

const STATS = [
  { key: 'total', label: 'Всего документов', value: 128, icon: 'FileStack', accent: 'text-slate-700', ring: 'bg-slate-100' },
  { key: 'sbis', label: 'Подписано в Сбис', value: 64, icon: 'Signature', accent: 'text-blue-600', ring: 'bg-blue-50' },
  { key: 'kaluga', label: 'Калуга Астрал', value: 31, icon: 'ShieldCheck', accent: 'text-violet-600', ring: 'bg-violet-50' },
  { key: 'portal', label: 'Портал поставщиков', value: 18, icon: 'Building2', accent: 'text-amber-600', ring: 'bg-amber-50' },
  { key: 'paper', label: 'На бумаге', value: 15, icon: 'FileSignature', accent: 'text-slate-500', ring: 'bg-slate-100' },
];

type Filter = 'all' | 'problem';

export default function DocSbis2() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMPANIES.map((company) => {
      const years = company.years
        .map((year) => {
          const documents = year.documents.filter((doc) => {
            const matchQuery =
              !q ||
              doc.name.toLowerCase().includes(q) ||
              company.name.toLowerCase().includes(q);
            const matchFilter =
              filter === 'all' ||
              STATUS_META[doc.status].tone === 'red';
            return matchQuery && matchFilter;
          });
          return { ...year, documents };
        })
        .filter((year) => year.documents.length > 0);
      return { ...company, years };
    }).filter((company) => company.years.length > 0);
  }, [query, filter]);

  const totalDocs = COMPANIES.reduce(
    (sum, c) => sum + c.years.reduce((s, y) => s + y.documents.length, 0),
    0
  );
  const problemDocs = COMPANIES.reduce(
    (sum, c) =>
      sum +
      c.years.reduce(
        (s, y) => s + y.documents.filter((d) => STATUS_META[d.status].tone === 'red').length,
        0
      ),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Не завершённые документы в ЭДО</h1>
            <p className="text-muted-foreground mt-1">
              Документы, требующие внимания в системе электронного документооборота
            </p>
          </div>
          {problemDocs > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 shadow-sm">
              <Icon name="TriangleAlert" size={18} className="text-red-600" />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-red-700">{problemDocs} с ошибками</div>
                <div className="text-xs text-red-500/80">Отклонены или не определены</div>
              </div>
            </div>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {STATS.map((card) => (
            <div
              key={card.key}
              className="group bg-white rounded-xl border border-border/50 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.ring}`}>
                <Icon name={card.icon} size={17} className={card.accent} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground leading-tight tabular-nums">
                  {card.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по документу или компании..."
              className="pl-9 bg-white border-border/60 shadow-sm"
            />
          </div>
          <div className="inline-flex rounded-lg border border-border/60 bg-white p-0.5 shadow-sm">
            {([
              { key: 'all', label: 'Все' },
              { key: 'problem', label: 'С ошибками' },
            ] as { key: Filter; label: string }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.key
                    ? 'bg-[#b60209] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {tab.key === 'problem' && problemDocs > 0 && (
                  <span
                    className={`ml-1.5 text-xs ${
                      filter === tab.key ? 'text-white/80' : 'text-red-500'
                    }`}
                  >
                    {problemDocs}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Problematic documents list */}
        <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <p className="font-semibold text-foreground">Проблемные документы</p>
            <span className="text-xs text-muted-foreground">
              {filter === 'all' ? totalDocs : problemDocs} документов
            </span>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Icon name="SearchX" size={22} className="text-muted-foreground/60" />
              </div>
              <p className="text-sm text-muted-foreground">Документы не найдены</p>
            </div>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={COMPANIES.map((c) => String(c.id))}
            >
              {filteredCompanies.map((company) => {
                const count = company.years.reduce((s, y) => s + y.documents.length, 0);
                return (
                  <AccordionItem
                    key={company.id}
                    value={String(company.id)}
                    className="border-b border-border/40 last:border-b-0"
                  >
                    <AccordionTrigger className="px-5 py-3 hover:no-underline hover:bg-slate-50/70 transition-colors [&[data-state=open]>svg]:rotate-180">
                      <div className="flex items-center gap-2 text-left min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Icon name="Building2" size={15} className="text-slate-500" />
                        </div>
                        <span className="text-[11px] text-muted-foreground/60 font-mono shrink-0">
                          ID: {company.id}
                        </span>
                        <Link
                          to={`/companies/${company.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-semibold text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors truncate"
                        >
                          {company.name}
                        </Link>
                        <span className="text-xs text-muted-foreground bg-slate-100 rounded-full px-2 py-0.5 shrink-0">
                          {count}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-0">
                      <div className="space-y-4 pb-3">
                        {company.years.map((yearGroup) => (
                          <div key={yearGroup.year} className="space-y-2">
                            <div className="flex items-center gap-2 pl-3 border-l-2 border-[#b60209]/40">
                              <Icon name="Calendar" size={12} className="text-muted-foreground/60" />
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                {yearGroup.year}
                              </span>
                            </div>
                            <div className="space-y-1.5 pl-3">
                              {yearGroup.documents.map((doc) => {
                                const meta = STATUS_META[doc.status];
                                return (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-slate-50/50 px-3.5 py-2.5 hover:bg-white hover:border-border/70 hover:shadow-sm transition-all"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Icon
                                        name="FileText"
                                        size={14}
                                        className="text-muted-foreground/70 shrink-0"
                                      />
                                      <span className="text-sm text-foreground truncate">
                                        {doc.name}
                                      </span>
                                    </div>
                                    <span
                                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${TONE_CLASSES[meta.tone]}`}
                                    >
                                      <Icon name={meta.icon} size={12} />
                                      {meta.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}
