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

const CONTRACTS: Contract[] = [
  { id: 1, number: '2000-25', status: 'active' },
  { id: 2, number: '1998-24', status: 'archived' },
  { id: 3, number: '2045-26', status: 'active' },
];

const OPERATIONS: FinanceOperation[] = [
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

function formatAmount(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);
  return (amount >= 0 ? '+' : '−') + formatted;
}

function formatBalance(amount: number): string {
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return (amount < 0 ? '−' : '+') + formatted;
}

export default function AllFinance() {
  const [selectedContract, setSelectedContract] = useState<string>('all');
  const [editCommentOp, setEditCommentOp] = useState<FinanceOperation | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [operations, setOperations] = useState<FinanceOperation[]>(OPERATIONS);

  const filtered =
    selectedContract === 'all'
      ? operations
      : operations.filter((op) => op.contractId === Number(selectedContract));

  const balance = filtered
    .filter((op) => !op.isCancelled)
    .reduce((sum, op) => sum + op.amount, 0);

  const handleSaveComment = () => {
    if (!editCommentOp) return;
    setOperations((prev) =>
      prev.map((op) =>
        op.id === editCommentOp.id ? { ...op, comment: commentDraft } : op
      )
    );
    setEditCommentOp(null);
  };

  const handleStorno = (opId: number) => {
    setOperations((prev) =>
      prev.map((op) => (op.id === opId ? { ...op, isCancelled: true } : op))
    );
  };

  const openEditComment = (op: FinanceOperation) => {
    setEditCommentOp(op);
    setCommentDraft(op.comment ?? '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-rose-50/20">
      <div className="max-w-[1400px] mx-auto px-6 py-6">

        {/* Header */}
        <div className="bg-white rounded-xl border border-border/50 shadow-sm mb-4">
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Icon name="CreditCard" size={20} className="text-[#b60209]" />
                  Финансовые операции
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm text-muted-foreground">Баланс:</span>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      balance < 0
                        ? 'text-red-600'
                        : balance > 0
                        ? 'text-emerald-600'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatBalance(balance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Contract filter */}
            <div className="flex items-center gap-2">
              <Icon name="Filter" size={15} className="text-muted-foreground shrink-0" />
              <Select value={selectedContract} onValueChange={setSelectedContract}>
                <SelectTrigger className="w-56 h-9 text-sm">
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
                        <Icon
                          name={c.status === 'active' ? 'FileText' : 'Archive'}
                          size={14}
                          className={
                            c.status === 'active' ? 'text-emerald-500' : 'text-slate-400'
                          }
                        />
                        <span>№{c.number}</span>
                        {c.status === 'archived' && (
                          <span className="text-[11px] text-slate-400 ml-0.5">(архив)</span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-slate-50/70">
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground">
                    Операция
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground w-36">
                    Сумма, с НДС
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground w-44">
                    Период
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground w-44">
                    Дата операции
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground w-36">
                    Пользователь
                  </th>
                  <th className="w-28 px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Icon name="Inbox" size={36} className="text-slate-300" />
                        <span className="text-sm">Операций не найдено</span>
                      </div>
                    </td>
                  </tr>
                )}

                {filtered.map((op, idx) => {
                  const isCharge = op.type === 'charge';
                  const isPayment = op.type === 'payment';
                  const isCancelled = !!op.isCancelled;
                  const isSaldo = !!op.isSaldo;

                  let rowBg = idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white';
                  if (isCancelled) rowBg = 'bg-red-50/60';
                  if (isSaldo) rowBg = 'bg-amber-50/60';

                  return (
                    <tr
                      key={op.id}
                      className={`border-b border-border/30 last:border-0 transition-colors hover:bg-slate-50/70 group ${rowBg} ${isCancelled ? 'opacity-70' : ''}`}
                    >
                      {/* Operation cell */}
                      <td className="px-5 py-3">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={`mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                              isCancelled
                                ? 'bg-red-100'
                                : isCharge
                                ? 'bg-orange-100'
                                : isSaldo
                                ? 'bg-amber-100'
                                : 'bg-emerald-50'
                            }`}
                          >
                            <Icon
                              name={
                                isCancelled
                                  ? 'Ban'
                                  : isCharge
                                  ? 'Minus'
                                  : isSaldo
                                  ? 'ArrowLeftRight'
                                  : 'Plus'
                              }
                              size={14}
                              className={
                                isCancelled
                                  ? 'text-red-400'
                                  : isCharge
                                  ? 'text-orange-500'
                                  : isSaldo
                                  ? 'text-amber-500'
                                  : 'text-emerald-600'
                              }
                            />
                          </div>

                          <div className="min-w-0">
                            {/* Contract number */}
                            <div className="text-xs text-muted-foreground mb-0.5">
                              Договор №{op.contractNumber}
                            </div>

                            {/* Type + badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`font-medium ${
                                  isCancelled
                                    ? 'text-muted-foreground line-through'
                                    : 'text-foreground'
                                }`}
                              >
                                {isCharge ? 'Списание' : 'Зачисление средств'}
                              </span>

                              {isCancelled && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0 h-4 bg-red-100 text-red-500 border border-red-200 font-medium"
                                >
                                  отменено
                                </Badge>
                              )}

                              {isSaldo && !isCancelled && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0 h-4 bg-amber-100 text-amber-600 border border-amber-200 font-medium"
                                >
                                  Сальдо
                                </Badge>
                              )}
                            </div>

                            {/* Service name (charges only) */}
                            {isCharge && op.serviceName && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                услуга: {op.serviceName}
                              </div>
                            )}

                            {/* Comment */}
                            {op.comment && (
                              <div className="text-xs text-slate-400 mt-0.5 italic">
                                {op.comment}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3 text-right tabular-nums">
                        <span
                          className={`font-semibold text-sm ${
                            isCancelled
                              ? 'text-muted-foreground line-through'
                              : op.amount < 0
                              ? 'text-red-500'
                              : 'text-emerald-600'
                          }`}
                        >
                          {formatAmount(op.amount)}
                        </span>
                      </td>

                      {/* Period */}
                      <td className="px-5 py-3">
                        {op.periodFrom && op.periodTo ? (
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            <div>с {op.periodFrom}</div>
                            <div>по {op.periodTo}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40 text-xs">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3">
                        <span className="text-sm text-foreground tabular-nums">
                          {op.date}
                        </span>
                      </td>

                      {/* Initiator */}
                      <td className="px-5 py-3">
                        {op.initiator === 'Система' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            <Icon name="Bot" size={13} className="text-slate-400" />
                            Система
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-mono">
                            <Icon name="User" size={13} className="text-slate-400" />
                            {op.initiator}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 justify-end">
                          {/* Edit comment */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditComment(op)}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Изменить комментарий"
                          >
                            <Icon name="MessageSquarePen" size={13} className="mr-1" />
                            Комментарий
                          </Button>

                          {/* Storno button — only for non-cancelled payments */}
                          {isPayment && !isCancelled && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                >
                                  <Icon name="RotateCcw" size={13} className="mr-1" />
                                  Сторно
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Сторнировать платёж?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Зачисление на сумму{' '}
                                    <strong>{formatAmount(op.amount)}</strong> по договору
                                    №{op.contractNumber} будет отменено. Это действие
                                    нельзя отменить.
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

          {/* Footer stats */}
          {filtered.length > 0 && (
            <div className="border-t border-border/30 px-5 py-3 bg-slate-50/50 flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <span>Операций: {filtered.length}</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-orange-200 inline-block"></span>
                  Списания
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-emerald-200 inline-block"></span>
                  Зачисления
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-red-200 inline-block"></span>
                  Сторнированные
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-amber-200 inline-block"></span>
                  Сальдо
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit comment modal */}
      <Dialog open={!!editCommentOp} onOpenChange={(open) => !open && setEditCommentOp(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="MessageSquarePen" size={18} className="text-[#b60209]" />
              Комментарий к операции
            </DialogTitle>
          </DialogHeader>
          {editCommentOp && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground bg-slate-50 rounded-lg px-3 py-2 border border-border/40">
                <div className="text-xs mb-0.5">
                  Договор №{editCommentOp.contractNumber}
                </div>
                <div className="font-medium text-foreground">
                  {editCommentOp.type === 'charge' ? 'Списание' : 'Зачисление средств'}
                  {editCommentOp.type === 'charge' && editCommentOp.serviceName
                    ? ` (${editCommentOp.serviceName})`
                    : ''}
                </div>
                <div className="text-xs mt-0.5">{editCommentOp.date}</div>
              </div>
              <Textarea
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="Введите комментарий..."
                className="resize-none"
                rows={3}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCommentOp(null)}>
              Отмена
            </Button>
            <Button
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
