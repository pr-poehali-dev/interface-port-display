import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
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

const STATUS_META: Record<SbisStatus, { label: string; className: string }> = {
  sent_sbis: { label: 'Отправлен в Сбис', className: 'text-blue-600 bg-blue-50 border-blue-200' },
  invite_sent: { label: 'Отослано приглашение', className: 'text-blue-600 bg-blue-50 border-blue-200' },
  sent_to_counterparty: { label: 'Отправлен контрагенту', className: 'text-blue-600 bg-blue-50 border-blue-200' },
  delivered: { label: 'Доставлен контрагенту', className: 'text-blue-600 bg-blue-50 border-blue-200' },
  rejected: { label: 'Отклонён', className: 'text-red-600 bg-red-50 border-red-200' },
  undefined: { label: 'Не определён', className: 'text-red-600 bg-red-50 border-red-200' },
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

const STATS = {
  total: 128,
  sbis: 64,
  kalugaAstral: 31,
  portalPostavshikov: 18,
  paper: 15,
};

const STAT_CARDS = [
  { key: 'total', label: 'Всего документов', value: STATS.total, icon: 'FileStack', accent: 'text-foreground', bg: 'bg-slate-100' },
  { key: 'sbis', label: 'Подписано в Сбис', value: STATS.sbis, icon: 'Signature', accent: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'kaluga', label: 'Подписано в Калуга Астрал', value: STATS.kalugaAstral, icon: 'ShieldCheck', accent: 'text-violet-600', bg: 'bg-violet-50' },
  { key: 'portal', label: 'Подписано в Портал поставщиков', value: STATS.portalPostavshikov, icon: 'Building2', accent: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'paper', label: 'Подписано на бумаге', value: STATS.paper, icon: 'FileSignature', accent: 'text-slate-500', bg: 'bg-slate-100' },
];

function StatusBadge({ status }: { status: SbisStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

export default function DocSbis() {
  const problematicCount = COMPANIES.reduce(
    (sum, c) => sum + c.years.reduce((s, y) => s + y.documents.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Не завершённые документы в ЭДО</h1>
          <p className="text-muted-foreground mt-1">
            Документы, требующие внимания в системе электронного документооборота
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {STAT_CARDS.map((card) => (
            <div
              key={card.key}
              className="bg-white rounded-xl border border-border/50 shadow-sm p-4 flex flex-col gap-3"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.bg}`}>
                <Icon name={card.icon} size={17} className={card.accent} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground leading-tight">{card.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Problematic documents list */}
        <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
            <p className="font-semibold text-foreground">Проблемные документы</p>
            <span className="text-xs text-muted-foreground">{problematicCount} документов</span>
          </div>

          <Accordion type="multiple" defaultValue={COMPANIES.map((c) => String(c.id))} className="divide-y-4 divide-slate-100">
            {COMPANIES.map((company) => (
              <AccordionItem
                key={company.id}
                value={String(company.id)}
                className="border-b-0"
              >
                <AccordionTrigger className="px-5 py-3.5 bg-slate-50/80 hover:no-underline hover:bg-slate-100/80 transition-colors [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-8 h-8 rounded-lg bg-white border border-border/60 flex items-center justify-center shrink-0">
                      <Icon name="Building2" size={15} className="text-muted-foreground" />
                    </div>
                    <span className="text-[11px] text-muted-foreground/60 font-mono shrink-0">
                      ID: {company.id}
                    </span>
                    <Link
                      to={`/companies/${company.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-base font-bold text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors"
                    >
                      {company.name}
                    </Link>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-0 pt-3">
                  <div className="space-y-5 pb-4">
                    {company.years.map((yearGroup) => (
                      <div key={yearGroup.year} className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 rounded-md bg-[#b60209]/10 px-2.5 py-1">
                          <Icon name="Calendar" size={12} className="text-[#b60209]" />
                          <span className="text-xs font-bold text-[#b60209] tracking-wide">
                            {yearGroup.year}
                          </span>
                        </div>
                        <div className="space-y-1.5 pl-3 border-l-2 border-slate-200">
                          {yearGroup.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-white px-3.5 py-2.5 hover:bg-slate-50 hover:border-border/70 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Icon name="FileText" size={14} className="text-muted-foreground/70 shrink-0" />
                                <span className="text-sm text-foreground truncate">{doc.name}</span>
                              </div>
                              <StatusBadge status={doc.status} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}