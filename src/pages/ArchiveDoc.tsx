import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type SbisStatus =
  | null
  | 'waiting_sign'
  | 'sent_to_counterparty'
  | 'signed'
  | 'rejected'
  | 'cancelled';

type SignedBy = null | 'director' | 'accountant' | 'attorney';

const sbisStatusConfig: Record<
  Exclude<SbisStatus, null>,
  { label: string; color: string; icon: string }
> = {
  waiting_sign: { label: 'Ожидает подписания', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'Clock' },
  sent_to_counterparty: { label: 'Отправлен контрагенту', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'Send' },
  signed: { label: 'Подписан', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'CheckCircle2' },
  rejected: { label: 'Отклонён', color: 'bg-red-50 text-red-700 border-red-200', icon: 'XCircle' },
  cancelled: { label: 'Аннулирован', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: 'Ban' },
};

const signedByOptions: { value: Exclude<SignedBy, null>; label: string; icon: string }[] = [
  { value: 'director', label: 'Директор', icon: 'UserCheck' },
  { value: 'accountant', label: 'Бухгалтер', icon: 'Calculator' },
  { value: 'attorney', label: 'По доверенности', icon: 'ScrollText' },
];

interface ServiceRow {
  id: number;
  name: string;
  type: string;
  period: string;
  amount: number;
  serviceFrom: string;
  serviceTo: string;
  updNumber: string;
  field5b: string;
  updStatus: 'ok' | 'error' | null;
  onecStatus: 'ok' | 'error' | null;
}

interface Invoice {
  id: number;
  number: string;
  date: string;
  sbisStatus: SbisStatus;
}

interface Upd {
  id: number;
  number: string;
  period: string;
  sbisStatus: SbisStatus;
  signedBy: SignedBy;
}

interface Contract {
  id: number;
  title: string;
  contractNumber: string;
  contractDate: string;
  rows: ServiceRow[];
  invoices: Invoice[];
  upds: Upd[];
}

const mockContracts: Contract[] = [
  {
    id: 1,
    title: 'Интернет',
    contractNumber: '178-02-07-2015',
    contractDate: '22.07.2015',
    rows: [
      {
        id: 1,
        name: 'Внешний IP',
        type: 'Услуги связи по...',
        period: 'Ежемесячно',
        amount: 200,
        serviceFrom: '01.05.2026',
        serviceTo: '31.05.2026',
        updNumber: '1389',
        field5b: '-',
        updStatus: 'ok',
        onecStatus: 'error',
      },
      {
        id: 2,
        name: 'Интернет',
        type: 'Услуги связи по...',
        period: 'Ежемесячно',
        amount: 27500,
        serviceFrom: '01.05.2026',
        serviceTo: '31.05.2026',
        updNumber: '1389',
        field5b: '-',
        updStatus: 'ok',
        onecStatus: 'error',
      },
    ],
    invoices: [
      { id: 1, number: '1453-И', date: '3 Июня 2026 г.', sbisStatus: null },
    ],
    upds: [
      { id: 1, number: 'И1389', period: 'за Май 2026 г.', sbisStatus: 'sent_to_counterparty', signedBy: 'director' },
    ],
  },
  {
    id: 2,
    title: 'Телефония',
    contractNumber: '65963',
    contractDate: '15.03.2018',
    rows: [
      {
        id: 3,
        name: 'АП за номера',
        type: 'Услуги телефонии',
        period: 'Ежемесячно',
        amount: 1980,
        serviceFrom: '01.05.2026',
        serviceTo: '31.05.2026',
        updNumber: '1390',
        field5b: '-',
        updStatus: 'ok',
        onecStatus: null,
      },
    ],
    invoices: [
      { id: 2, number: '1454-И', date: '3 Июня 2026 г.', sbisStatus: 'waiting_sign' },
    ],
    upds: [
      { id: 2, number: 'И1390', period: 'за Май 2026 г.', sbisStatus: null, signedBy: null },
    ],
  },
];

const fmt = (v: number) =>
  v.toLocaleString('ru-RU', { minimumFractionDigits: 2 }) + ' руб.';

function SbisStatusBadge({ status }: { status: SbisStatus }) {
  if (!status) return null;
  const cfg = sbisStatusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}>
      <Icon name={cfg.icon as never} size={11} />
      {cfg.label}
    </span>
  );
}

export default function ArchiveDoc() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [selected, setSelected] = useState<Record<number, Set<number>>>({});
  const [signDialog, setSignDialog] = useState<{ contractId: number; updId: number } | null>(null);

  const toggleRow = (contractId: number, rowId: number) => {
    setSelected((prev) => {
      const s = new Set(prev[contractId] ?? []);
      if (s.has(rowId)) { s.delete(rowId); } else { s.add(rowId); }
      return { ...prev, [contractId]: s };
    });
  };

  const toggleAll = (contractId: number, rowIds: number[]) => {
    setSelected((prev) => {
      const s = prev[contractId] ?? new Set<number>();
      const allSelected = rowIds.every((id) => s.has(id));
      const next = new Set(allSelected ? [] : rowIds);
      return { ...prev, [contractId]: next };
    });
  };

  const sendToSbis = (contractId: number, type: 'invoice' | 'upd', docId: number) => {
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== contractId) return c;
        if (type === 'invoice') {
          return { ...c, invoices: c.invoices.map((inv) => inv.id === docId ? { ...inv, sbisStatus: 'waiting_sign' as SbisStatus } : inv) };
        }
        return { ...c, upds: c.upds.map((u) => u.id === docId ? { ...u, sbisStatus: 'waiting_sign' as SbisStatus } : u) };
      })
    );
  };

  const deleteInvoice = (contractId: number, invoiceId: number) => {
    setContracts((prev) =>
      prev.map((c) => c.id === contractId ? { ...c, invoices: c.invoices.filter((inv) => inv.id !== invoiceId) } : c)
    );
  };

  const setSignedBy = (value: SignedBy) => {
    if (!signDialog) return;
    setContracts((prev) =>
      prev.map((c) =>
        c.id !== signDialog.contractId ? c : {
          ...c,
          upds: c.upds.map((u) => u.id !== signDialog.updId ? u : { ...u, signedBy: value }),
        }
      )
    );
    setSignDialog(null);
  };

  const currentSignedBy = signDialog
    ? contracts.find((c) => c.id === signDialog.contractId)?.upds.find((u) => u.id === signDialog.updId)?.signedBy ?? null
    : null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Документы</h1>
        <p className="text-muted-foreground mt-1">Счета и УПД по договорам</p>
      </div>

      <div className="space-y-4">
        {contracts.map((contract) => {
          const contractSelected = selected[contract.id] ?? new Set<number>();
          const rowIds = contract.rows.map((r) => r.id);
          const allChecked = rowIds.length > 0 && rowIds.every((id) => contractSelected.has(id));
          const someChecked = rowIds.some((id) => contractSelected.has(id)) && !allChecked;

          return (
            <div key={contract.id} className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
                <div>
                  <p className="font-semibold text-foreground">{contract.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Договор №{contract.contractNumber} от {contract.contractDate}
                  </p>
                </div>
                <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors">
                  <Icon name="MoreVertical" size={16} />
                </button>
              </div>

              {/* Service rows table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-slate-50/70">
                      <th className="px-4 py-2.5 w-8">
                        <Checkbox
                          checked={allChecked}
                          ref={(el) => { if (el) (el as HTMLButtonElement).dataset.indeterminate = someChecked ? 'true' : 'false'; }}
                          onCheckedChange={() => toggleAll(contract.id, rowIds)}
                          className="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                        />
                      </th>
                      <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Наименование</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground">Период</th>
                      <th className="text-right px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Сумма, с НДС</th>
                      <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Период оказания</th>
                      <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">№ УПД</th>
                      <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">Поле 5Б</th>
                      <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">УПД статус</th>
                      <th className="text-center px-3 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">1С статус</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.rows.map((row, idx) => {
                      const isChecked = contractSelected.has(row.id);
                      return (
                        <tr
                          key={row.id}
                          className={`border-b border-border/30 transition-colors ${isChecked ? 'bg-primary/5' : idx % 2 === 1 ? 'bg-slate-50/40 hover:bg-slate-50' : 'hover:bg-slate-50/60'}`}
                        >
                          <td className="px-4 py-3 w-8">
                            <Checkbox checked={isChecked} onCheckedChange={() => toggleRow(contract.id, row.id)} />
                          </td>
                          <td className="px-3 py-3">
                            <span className="font-medium text-foreground">{row.name}</span>
                            <span className="text-muted-foreground"> {row.type}</span>
                          </td>
                          <td className="px-3 py-3 text-muted-foreground">{row.period}</td>
                          <td className="px-3 py-3 text-right font-mono text-foreground whitespace-nowrap">{fmt(row.amount)}</td>
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap text-xs">
                            {row.serviceFrom} – {row.serviceTo}
                          </td>
                          <td className="px-3 py-3 text-center text-muted-foreground">{row.updNumber}</td>
                          <td className="px-3 py-3 text-center text-muted-foreground">{row.field5b}</td>
                          <td className="px-3 py-3 text-center">
                            {row.updStatus === 'ok' && <Icon name="Check" size={16} className="text-emerald-500 mx-auto" />}
                            {row.updStatus === 'error' && <Icon name="X" size={16} className="text-red-500 mx-auto" />}
                            {row.updStatus === null && <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {row.onecStatus === 'ok' && <Icon name="Check" size={16} className="text-emerald-500 mx-auto" />}
                            {row.onecStatus === 'error' && <Icon name="Ban" size={16} className="text-red-500 mx-auto" />}
                            {row.onecStatus === null && <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="px-2 py-3">
                            <button className="w-6 h-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors">
                              <Icon name="MoreVertical" size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Documents footer */}
              <div className="border-t border-border/40 bg-slate-50/40 px-5 py-3">
                <div className="flex flex-wrap items-center gap-6">

                  {/* Invoices */}
                  <div className="flex flex-wrap items-center gap-3">
                    {contract.invoices.map((inv) => (
                      <div key={inv.id} className="flex items-center gap-2">
                        {/* Icon + label */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon name="FileText" size={13} className="text-slate-400" />
                          <span>А1 АВТО счёт №{inv.number} от {inv.date}</span>
                        </div>

                        {/* Status or send button */}
                        {inv.sbisStatus ? (
                          <SbisStatusBadge status={inv.sbisStatus} />
                        ) : (
                          <button
                            onClick={() => sendToSbis(contract.id, 'invoice', inv.id)}
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 transition-colors font-medium"
                          >
                            <Icon name="Send" size={11} />
                            СБИС
                          </button>
                        )}

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-slate-200 transition-colors">
                              <Icon name="MoreHorizontal" size={13} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-44">
                            <DropdownMenuItem onClick={() => window.open('#', '_blank')} className="gap-2 cursor-pointer text-xs">
                              <Icon name="Eye" size={13} />
                              Просмотреть
                            </DropdownMenuItem>
                            {!inv.sbisStatus && (
                              <DropdownMenuItem onClick={() => sendToSbis(contract.id, 'invoice', inv.id)} className="gap-2 cursor-pointer text-xs text-violet-700 focus:text-violet-700 focus:bg-violet-50">
                                <Icon name="Send" size={13} />
                                Отправить в СБИС
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => deleteInvoice(contract.id, inv.id)} className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-red-50">
                              <Icon name="Trash2" size={13} />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  {contract.invoices.length > 0 && contract.upds.length > 0 && (
                    <div className="w-px h-5 bg-border/60" />
                  )}

                  {/* UPDs */}
                  <div className="flex flex-wrap items-center gap-3">
                    {contract.upds.map((upd) => (
                      <div key={upd.id} className="flex items-center gap-2">
                        {/* Icon + label */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon name="FileCheck" size={13} className="text-slate-400" />
                          <span>А1 АВТО упд №{upd.number} {upd.period}</span>
                        </div>

                        {/* Signed by tag */}
                        {upd.signedBy && (
                          <span className="text-xs text-muted-foreground/70 bg-slate-100 px-1.5 py-0.5 rounded">
                            {signedByOptions.find((o) => o.value === upd.signedBy)?.label}
                          </span>
                        )}

                        {/* Status or send button */}
                        {upd.sbisStatus ? (
                          <SbisStatusBadge status={upd.sbisStatus} />
                        ) : (
                          <button
                            onClick={() => sendToSbis(contract.id, 'upd', upd.id)}
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 transition-colors font-medium"
                          >
                            <Icon name="Send" size={11} />
                            СБИС
                          </button>
                        )}

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-slate-200 transition-colors">
                              <Icon name="MoreHorizontal" size={13} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuItem onClick={() => window.open('#', '_blank')} className="gap-2 cursor-pointer text-xs">
                              <Icon name="Eye" size={13} />
                              Просмотреть
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSignDialog({ contractId: contract.id, updId: upd.id })} className="gap-2 cursor-pointer text-xs">
                              <Icon name="UserCheck" size={13} />
                              Кем подписан
                            </DropdownMenuItem>
                            {!upd.sbisStatus && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => sendToSbis(contract.id, 'upd', upd.id)} className="gap-2 cursor-pointer text-xs text-violet-700 focus:text-violet-700 focus:bg-violet-50">
                                  <Icon name="Send" size={13} />
                                  Отправить в СБИС
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Sign dialog */}
      <Dialog open={!!signDialog} onOpenChange={(open) => !open && setSignDialog(null)}>
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
                  ${currentSignedBy === opt.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:bg-slate-50 text-foreground'}`}
              >
                <Icon name={opt.icon as never} size={16} />
                {opt.label}
                {currentSignedBy === opt.value && <Icon name="Check" size={14} className="ml-auto text-primary" />}
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