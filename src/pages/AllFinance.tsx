import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Contract {
  id: number;
  number: string;
  status: 'active' | 'archived';
}

type OperationType = 'charge' | 'payment';

interface FinanceOperation {
  id: number;
  contractId: number;
  contractNumber: string;
  type: OperationType;
  serviceName?: string;
  comment?: string;
  amount: number;
  periodFrom?: string;
  periodTo?: string;
  date: string;
  initiator: string;
  isCancelled?: boolean;
  isSaldo?: boolean;
}

interface MockCompany {
  name: string;
  status: 'active' | 'archived';
}

const MOCK_COMPANY: MockCompany = {
  name: 'ООО "ПроАвто+"',
  status: 'active',
};

const CONTRACTS: Contract[] = [
  { id: 1, number: '2000-25', status: 'active' },
  { id: 2, number: '1998-24', status: 'archived' },
  { id: 3, number: '2045-26', status: 'active' },
];

const INITIAL_OPERATIONS: FinanceOperation[] = [
  {
    id: 1,
    contractId: 1,
    contractNumber: '2000-25',
    type: 'charge',
    serviceName: 'Интернет',
    amount: -150,
    periodFrom: '17.03.2026',
    periodTo: '24.03.2026',
    date: '25.03.2026 00:05:00',
    initiator: 'Система',
  },
  {
    id: 2,
    contractId: 1,
    contractNumber: '2000-25',
    type: 'payment',
    comment: 'tyuytutyu',
    amount: 1,
    date: '10.03.2026 15:29:23',
    initiator: 'urec',
  },
  {
    id: 3,
    contractId: 1,
    contractNumber: '2000-25',
    type: 'payment',
    amount: 1,
    date: '10.03.2026 15:29:15',
    initiator: 'urec',
  },
  {
    id: 4,
    contractId: 1,
    contractNumber: '2000-25',
    type: 'payment',
    amount: 99,
    date: '10.03.2026 15:29:01',
    initiator: 'urec',
  },
  {
    id: 5,
    contractId: 1,
    contractNumber: '2000-25',
    type: 'charge',
    serviceName: 'Интернет',
    amount: -100,
    periodFrom: '10.03.2026',
    periodTo: '11.03.2026',
    date: '10.03.2026 15:28:52',
    initiator: 'urec',
  },
  {
    id: 6,
    contractId: 1,
    contractNumber: '2000-25',
    type: 'payment',
    amount: 500,
    date: '10.03.2026 15:27:20',
    initiator: 'urec',
    isCancelled: true,
  },
  {
    id: 7,
    contractId: 1,
    contractNumber: '2000-25',
    type: 'payment',
    amount: -200,
    date: '05.03.2026 10:00:00',
    initiator: 'admin',
    isSaldo: true,
    comment: 'Сальдо на начало периода',
  },
  {
    id: 8,
    contractId: 2,
    contractNumber: '1998-24',
    type: 'payment',
    amount: 300,
    date: '01.02.2026 12:00:00',
    initiator: 'urec',
  },
  {
    id: 9,
    contractId: 3,
    contractNumber: '2045-26',
    type: 'charge',
    serviceName: 'Телефония',
    amount: -50,
    periodFrom: '01.03.2026',
    periodTo: '31.03.2026',
    date: '01.03.2026 09:00:00',
    initiator: 'Система',
  },
];

function formatMoney(amount: number, showSign = true): string {
  const abs = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  if (!showSign) return abs;
  return (amount >= 0 ? '+' : '−') + abs;
}

export default function AllFinance() {
  const [company] = useState<MockCompany>(MOCK_COMPANY);
  const [selectedContract, setSelectedContract] = useState<string>('all');
  const [operations, setOperations] = useState<FinanceOperation[]>(INITIAL_OPERATIONS);
  const [editCommentOp, setEditCommentOp] = useState<FinanceOperation | null>(null);
  const [commentDraft, setCommentDraft] = useState('');

  const isArchived = company.status === 'archived';

  const filtered =
    selectedContract === 'all'
      ? operations
      : operations.filter((op) => op.contractId === Number(selectedContract));

  const balance = filtered
    .filter((op) => !op.isCancelled)
    .reduce((sum, op) => sum + op.amount, 0);

  const selectedContractObj =
    selectedContract !== 'all'
      ? CONTRACTS.find((c) => c.id === Number(selectedContract))
      : null;

  const handleStorno = (opId: number) => {
    setOperations((prev) =>
      prev.map((op) => (op.id === opId ? { ...op, isCancelled: true } : op))
    );
  };

  const openEditComment = (op: FinanceOperation) => {
    setEditCommentOp(op);
    setCommentDraft(op.comment ?? '');
  };

  const handleSaveComment = () => {
    if (!editCommentOp) return;
    setOperations((prev) =>
      prev.map((op) =>
        op.id === editCommentOp.id ? { ...op, comment: commentDraft || undefined } : op
      )
    );
    setEditCommentOp(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/20 to-rose-50/10">
      {/* Company header */}
      <div className="bg-white border-b border-border/50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`shrink-0 w-1 h-9 rounded-full ${
                  isArchived ? 'bg-slate-300' : 'bg-emerald-400'
                }`}
              />
              <div>
                <h1 className="text-xl font-bold text-foreground leading-tight">
                  {company.name}
                </h1>
                <div className="mt-1">
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
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-5">

        {/* Page title + controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Финансовые операции</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {selectedContractObj
                ? `Договор №${selectedContractObj.number}`
                : `Все договора · ${filtered.length} операций`}
            </p>
          </div>

          <Select value={selectedContract} onValueChange={setSelectedContract}>
            <SelectTrigger className="w-60 bg-white border-border/60 shadow-sm h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="flex items-center gap-2">
                  <Icon name="Layers" size={14} className="text-muted-foreground" />
                  Все договора
                </span>
              </SelectItem>
              {CONTRACTS.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  <span className="flex items-center gap-2">
                    {c.status === 'active' ? (
                      <Icon name="FileText" size={14} className="text-emerald-500" />
                    ) : (
                      <Icon name="Archive" size={14} className="text-slate-400" />
                    )}
                    №{c.number}
                    {c.status === 'archived' && (
                      <span className="text-[11px] text-slate-400">архив</span>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Balance card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-border/50 shadow-sm px-5 py-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Баланс
            </div>
            <div
              className={`text-lg font-mono font-semibold tabular-nums whitespace-nowrap ${
                balance < 0
                  ? 'text-red-600'
                  : balance > 0
                  ? 'text-emerald-600'
                  : 'text-muted-foreground'
              }`}
            >
              {formatMoney(balance, false)}
              <span className="text-sm font-normal text-muted-foreground ml-1">₽</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border/50 shadow-sm px-5 py-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Зачислено
            </div>
            <div className="text-lg font-mono font-semibold tabular-nums text-emerald-600 whitespace-nowrap">
              {formatMoney(
                filtered
                  .filter((op) => op.type === 'payment' && !op.isCancelled)
                  .reduce((s, op) => s + op.amount, 0),
                false
              )}
              <span className="text-sm font-normal text-muted-foreground ml-1">₽</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border/50 shadow-sm px-5 py-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Списано
            </div>
            <div className="text-lg font-mono font-semibold tabular-nums text-red-600 whitespace-nowrap">
              {formatMoney(
                Math.abs(
                  filtered
                    .filter((op) => op.type === 'charge')
                    .reduce((s, op) => s + op.amount, 0)
                ),
                false
              )}
              <span className="text-sm font-normal text-muted-foreground ml-1">₽</span>
            </div>
          </div>
        </div>

        {/* Operations table */}
        <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
          {/* Legend */}
          <div className="px-5 py-3 border-b border-border/30 bg-slate-50/60 flex items-center gap-5 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-orange-100 flex items-center justify-center">
                <Icon name="ArrowUpRight" size={12} className="text-orange-500" />
              </div>
              Списание
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center">
                <Icon name="ArrowDownLeft" size={12} className="text-emerald-600" />
              </div>
              Зачисление
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center">
                <Icon name="Scale" size={12} className="text-amber-500" />
              </div>
              Сальдо
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-rose-100 flex items-center justify-center">
                <Icon name="Ban" size={12} className="text-rose-400" />
              </div>
              Отменено
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Операция
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide w-36">
                    Сумма
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide w-40">
                    Период услуги
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide w-44">
                    Дата
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide w-32">
                    Инициатор
                  </th>
                  <th className="w-36 px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                          <Icon name="ReceiptText" size={22} className="text-slate-400" />
                        </div>
                        <span className="text-sm">Операций не найдено</span>
                      </div>
                    </td>
                  </tr>
                )}

                {filtered.map((op) => {
                  const isCharge = op.type === 'charge';
                  const isCancelled = !!op.isCancelled;
                  const isSaldo = !!op.isSaldo;

                  let rowCls = '';
                  if (isCancelled) rowCls = 'bg-emerald-50/50';
                  else if (isSaldo) rowCls = 'bg-emerald-50/50';
                  else if (isCharge) rowCls = 'bg-orange-50/60';
                  else rowCls = 'bg-emerald-50/50';

                  return (
                    <tr
                      key={op.id}
                      className={`group transition-colors hover:brightness-95 ${rowCls} ${isCancelled ? 'opacity-60' : ''}`}
                    >
                      {/* Operation */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-start gap-3">
                          {/* Type dot */}
                          <div className="mt-0.5 shrink-0">
                            {isCancelled ? (
                              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                                <Icon name="Ban" size={15} className="text-rose-400" />
                              </div>
                            ) : isSaldo ? (
                              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Icon name="Scale" size={15} className="text-amber-500" />
                              </div>
                            ) : isCharge ? (
                              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Icon name="ArrowUpRight" size={15} className="text-orange-500" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Icon name="ArrowDownLeft" size={15} className="text-emerald-600" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            {/* Contract */}
                            <div className="text-[11px] text-muted-foreground/70 mb-0.5 font-mono">
                              Договор №{op.contractNumber}
                            </div>

                            {/* Title row */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`font-semibold text-sm ${
                                  isCancelled ? 'line-through text-muted-foreground' : 'text-foreground'
                                }`}
                              >
                                {isCharge ? 'Списание' : 'Зачисление'}
                              </span>



                              {isCancelled && (
                                <Badge className="text-[10px] px-1.5 h-4 bg-rose-100 text-rose-600 border border-rose-200 font-medium hover:bg-rose-100">
                                  отменено
                                </Badge>
                              )}

                              {isSaldo && !isCancelled && (
                                <Badge className="text-[10px] px-1.5 h-4 bg-amber-100 text-amber-700 border border-amber-200 font-medium hover:bg-amber-100">
                                  сальдо
                                </Badge>
                              )}
                            </div>

                            {/* Service name */}
                            {isCharge && op.serviceName && (
                              <div className="mt-0.5 text-xs text-muted-foreground">
                                <span className="text-muted-foreground/50 mr-1">услуга:</span>
                                {op.serviceName}
                              </div>
                            )}

                            {/* Comment */}
                            {op.comment && (
                              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/80">
                                <Icon name="MessageSquare" size={11} />
                                <span className="italic">{op.comment}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 text-right">
                        <span
                          className={`font-mono font-medium text-sm tabular-nums whitespace-nowrap ${
                            isCancelled
                              ? 'line-through text-muted-foreground/60'
                              : op.amount < 0
                              ? 'text-red-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {formatMoney(op.amount)}
                        </span>
                      </td>

                      {/* Period */}
                      <td className="px-5 py-3.5">
                        {op.periodFrom && op.periodTo ? (
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground/50">с</span>
                              {op.periodFrom}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground/50">по</span>
                              {op.periodTo}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30 text-xs">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5">
                        <div className="text-sm text-foreground tabular-nums">
                          {op.date.split(' ')[0]}
                        </div>
                        <div className="text-xs text-muted-foreground tabular-nums">
                          {op.date.split(' ')[1]}
                        </div>
                      </td>

                      {/* Initiator */}
                      <td className="px-5 py-3.5">
                        {op.initiator === 'Система' ? (
                          <div className="flex items-center gap-1 text-xs text-foreground">
                            <Icon name="Microchip" size={12} className="text-muted-foreground shrink-0" />
                            <span className="font-mono">система</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-foreground">
                            <Icon name="User" size={12} className="text-muted-foreground shrink-0" />
                            <span className="font-mono">{op.initiator}</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          {/* Comment edit */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditComment(op)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Комментарий"
                          >
                            <Icon name="MessageSquarePen" size={14} />
                          </Button>

                          {/* Storno */}
                          {op.type === 'payment' && !isCancelled && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 gap-1"
                                >
                                  <Icon name="RotateCcw" size={13} />
                                  Отменить
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Отменить платёж?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Зачисление{' '}
                                    <strong>{formatMoney(op.amount)} ₽</strong> по договору
                                    №{op.contractNumber} от {op.date} будет отменено.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleStorno(op.id)}
                                    className="bg-[#b60209] hover:bg-[#9a0208] text-white"
                                  >
                                    Сторнировать
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit comment dialog */}
      <Dialog open={!!editCommentOp} onOpenChange={(open) => !open && setEditCommentOp(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Комментарий к операции</DialogTitle>
          </DialogHeader>
          {editCommentOp && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border/50 bg-slate-50 px-3 py-2.5 text-sm">
                <div className="text-xs text-muted-foreground mb-0.5 font-mono">
                  Договор №{editCommentOp.contractNumber}
                </div>
                <div className="font-medium">
                  {editCommentOp.type === 'charge' ? 'Списание' : 'Зачисление'}
                  {editCommentOp.type === 'charge' && editCommentOp.serviceName
                    ? ` · ${editCommentOp.serviceName}`
                    : ''}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{editCommentOp.date}</div>
              </div>
              <Textarea
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="Введите комментарий..."
                rows={3}
                className="resize-none"
                autoFocus
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditCommentOp(null)}>
              Отмена
            </Button>
            <Button
              size="sm"
              onClick={handleSaveComment}
              className="bg-[#b60209] hover:bg-[#9a0208] text-white"
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}