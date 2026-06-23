import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type SbisStatus =
  | null
  | 'sending'
  | 'waiting_sign'
  | 'sent_to_counterparty'
  | 'signed'
  | 'rejected'
  | 'cancelled';

type SignedBy = null | 'director' | 'accountant' | 'attorney';

interface Invoice {
  id: number;
  number: string;
  date: string;
  amount: number;
  url: string;
  sbisStatus: SbisStatus;
}

interface Upd {
  id: number;
  number: string;
  date: string;
  amount: number;
  url: string;
  sbisStatus: SbisStatus;
  signedBy: SignedBy;
}

interface Contract {
  id: number;
  company: string;
  contractNumber: string;
  contractDate: string;
  services: string[];
  invoices: Invoice[];
  upds: Upd[];
}

const sbisStatusConfig: Record<
  Exclude<SbisStatus, null | 'sending'>,
  { label: string; color: string; icon: string }
> = {
  waiting_sign: {
    label: 'Ожидает подписания',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'Clock',
  },
  sent_to_counterparty: {
    label: 'Отправлен контрагенту',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'Send',
  },
  signed: {
    label: 'Подписан',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'CheckCircle',
  },
  rejected: {
    label: 'Отклонён',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: 'XCircle',
  },
  cancelled: {
    label: 'Аннулирован',
    color: 'bg-slate-100 text-slate-500 border-slate-200',
    icon: 'Ban',
  },
};

const signedByOptions: { value: SignedBy; label: string; icon: string }[] = [
  { value: 'director', label: 'Директор', icon: 'UserCheck' },
  { value: 'accountant', label: 'Бухгалтер', icon: 'Calculator' },
  { value: 'attorney', label: 'По доверенности', icon: 'FileSignature' },
];

const mockContracts: Contract[] = [
  {
    id: 1,
    company: 'ООО "Система Сервис"',
    contractNumber: '178-02-07-2015',
    contractDate: '22.07.2015',
    services: ['Внешний IP Услуги связи', 'Интернет Услуги связи'],
    invoices: [
      {
        id: 1,
        number: '1453-И',
        date: '3 Июня 2026 г.',
        amount: 27700,
        url: '#',
        sbisStatus: null,
      },
      {
        id: 2,
        number: '1210-И',
        date: '2 Мая 2026 г.',
        amount: 27700,
        url: '#',
        sbisStatus: 'signed',
      },
    ],
    upds: [
      {
        id: 1,
        number: 'И1389',
        date: 'Май 2026 г.',
        amount: 27700,
        url: '#',
        sbisStatus: 'sent_to_counterparty',
        signedBy: 'director',
      },
      {
        id: 2,
        number: 'И1210',
        date: 'Апрель 2026 г.',
        amount: 27700,
        url: '#',
        sbisStatus: null,
        signedBy: null,
      },
    ],
  },
  {
    id: 2,
    company: 'ГСК №34 "Крылатский"',
    contractNumber: '65963',
    contractDate: '15.03.2018',
    services: ['Интернет Услуги связи'],
    invoices: [
      {
        id: 3,
        number: '1454-И',
        date: '3 Июня 2026 г.',
        amount: 5000,
        url: '#',
        sbisStatus: 'waiting_sign',
      },
    ],
    upds: [
      {
        id: 3,
        number: 'И1390',
        date: 'Май 2026 г.',
        amount: 5000,
        url: '#',
        sbisStatus: null,
        signedBy: null,
      },
    ],
  },
];

const formatAmount = (v: number) =>
  v.toLocaleString('ru-RU', { minimumFractionDigits: 2 }) + ' руб.';

const SbisStatusBadge = ({ status }: { status: SbisStatus }) => {
  if (!status || status === 'sending') return null;
  const cfg = sbisStatusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}
    >
      <Icon name={cfg.icon as never} size={11} />
      {cfg.label}
    </span>
  );
};

export default function ArchiveDoc() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [signTarget, setSignTarget] = useState<{ contractId: number; updId: number } | null>(null);

  const sendToSbis = (contractId: number, type: 'invoice' | 'upd', docId: number) => {
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== contractId) return c;
        if (type === 'invoice') {
          return {
            ...c,
            invoices: c.invoices.map((inv) =>
              inv.id === docId ? { ...inv, sbisStatus: 'waiting_sign' as SbisStatus } : inv
            ),
          };
        } else {
          return {
            ...c,
            upds: c.upds.map((upd) =>
              upd.id === docId ? { ...upd, sbisStatus: 'waiting_sign' as SbisStatus } : upd
            ),
          };
        }
      })
    );
  };

  const deleteInvoice = (contractId: number, invoiceId: number) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? { ...c, invoices: c.invoices.filter((inv) => inv.id !== invoiceId) }
          : c
      )
    );
  };

  const openSignDialog = (contractId: number, updId: number) => {
    setSignTarget({ contractId, updId });
    setSignDialogOpen(true);
  };

  const setSignedBy = (value: SignedBy) => {
    if (!signTarget) return;
    setContracts((prev) =>
      prev.map((c) =>
        c.id !== signTarget.contractId
          ? c
          : {
              ...c,
              upds: c.upds.map((upd) =>
                upd.id !== signTarget.updId ? upd : { ...upd, signedBy: value }
              ),
            }
      )
    );
    setSignDialogOpen(false);
  };

  const currentSignedBy = (() => {
    if (!signTarget) return null;
    const c = contracts.find((c) => c.id === signTarget.contractId);
    return c?.upds.find((u) => u.id === signTarget.updId)?.signedBy ?? null;
  })();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Документы</h1>
        <p className="text-muted-foreground mt-1">Счета и УПД по договорам</p>
      </div>

      <div className="space-y-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden"
          >
            {/* Contract header */}
            <div className="px-5 py-4 border-b border-border/40 bg-slate-50/60">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{contract.company}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Договор №{contract.contractNumber} от {contract.contractDate}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {contract.services.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="text-xs bg-white text-muted-foreground"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="divide-y divide-border/30">
              {/* Invoices */}
              {contract.invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Type pill */}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
                    <Icon name="Receipt" size={12} />
                    Счёт
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">
                      А1 АВТО счёт №{inv.number} за {inv.date}
                    </span>
                  </div>

                  {/* Amount */}
                  <span className="text-sm text-muted-foreground tabular-nums shrink-0">
                    {formatAmount(inv.amount)}
                  </span>

                  {/* SBIS status or send button */}
                  <div className="shrink-0">
                    {inv.sbisStatus ? (
                      <SbisStatusBadge status={inv.sbisStatus} />
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300"
                        onClick={() => sendToSbis(contract.id, 'invoice', inv.id)}
                      >
                        <Icon name="Send" size={12} />
                        Отправить в СБИС
                      </Button>
                    )}
                  </div>

                  {/* Actions menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors shrink-0">
                        <Icon name="MoreHorizontal" size={15} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => window.open(inv.url, '_blank')}
                        className="gap-2 cursor-pointer"
                      >
                        <Icon name="Eye" size={14} />
                        Просмотреть
                      </DropdownMenuItem>
                      {!inv.sbisStatus && (
                        <DropdownMenuItem
                          onClick={() => sendToSbis(contract.id, 'invoice', inv.id)}
                          className="gap-2 cursor-pointer text-violet-700 focus:text-violet-700 focus:bg-violet-50"
                        >
                          <Icon name="Send" size={14} />
                          Отправить в СБИС
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteInvoice(contract.id, inv.id)}
                        className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-red-50"
                      >
                        <Icon name="Trash2" size={14} />
                        Удалить счёт
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {/* UPDs */}
              {contract.upds.map((upd) => (
                <div
                  key={upd.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Type pill */}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <Icon name="FileCheck" size={12} />
                    УПД
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">
                      А1 АВТО упд №{upd.number} за {upd.date}
                    </span>
                    {upd.signedBy && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        · {signedByOptions.find((o) => o.value === upd.signedBy)?.label}
                      </span>
                    )}
                  </div>

                  {/* Amount */}
                  <span className="text-sm text-muted-foreground tabular-nums shrink-0">
                    {formatAmount(upd.amount)}
                  </span>

                  {/* SBIS status or send button */}
                  <div className="shrink-0">
                    {upd.sbisStatus ? (
                      <SbisStatusBadge status={upd.sbisStatus} />
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300"
                        onClick={() => sendToSbis(contract.id, 'upd', upd.id)}
                      >
                        <Icon name="Send" size={12} />
                        Отправить в СБИС
                      </Button>
                    )}
                  </div>

                  {/* Actions menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors shrink-0">
                        <Icon name="MoreHorizontal" size={15} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem
                        onClick={() => window.open(upd.url, '_blank')}
                        className="gap-2 cursor-pointer"
                      >
                        <Icon name="Eye" size={14} />
                        Просмотреть
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openSignDialog(contract.id, upd.id)}
                        className="gap-2 cursor-pointer"
                      >
                        <Icon name="UserCheck" size={14} />
                        Кем подписан
                      </DropdownMenuItem>
                      {!upd.sbisStatus && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => sendToSbis(contract.id, 'upd', upd.id)}
                            className="gap-2 cursor-pointer text-violet-700 focus:text-violet-700 focus:bg-violet-50"
                          >
                            <Icon name="Send" size={14} />
                            Отправить в СБИС
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {contract.invoices.length === 0 && contract.upds.length === 0 && (
                <div className="px-5 py-6 text-sm text-muted-foreground text-center">
                  Документов нет
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sign dialog */}
      <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Кем подписан УПД?</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-1">
            {signedByOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSignedBy(opt.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-colors text-left
                  ${
                    currentSignedBy === opt.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-slate-50 text-foreground'
                  }`}
              >
                <Icon name={opt.icon as never} size={16} />
                {opt.label}
                {currentSignedBy === opt.value && (
                  <Icon name="Check" size={14} className="ml-auto text-primary" />
                )}
              </button>
            ))}
            {currentSignedBy && (
              <button
                onClick={() => setSignedBy(null)}
                className="w-full text-xs text-muted-foreground hover:text-foreground py-1 transition-colors"
              >
                Сбросить выбор
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
