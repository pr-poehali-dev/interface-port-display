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

  const [activeTab, setActiveTab] = useState('finance');

  const TABS = [
    { id: 'main', label: 'Главная' },
    { id: 'requisites', label: 'Реквизиты' },
    { id: 'sorm', label: 'СОРМ' },
    { id: 'archive', label: 'Архив' },
    { id: 'vlan', label: 'Vlan', count: 2 },
    { id: 'phones', label: 'Телефоны', count: 2 },
    { id: 'finance', label: 'Финансы' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-6 space-y-4">
      {/* Company header card */}
      <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h1 className="text-xl font-bold text-foreground leading-tight">
                  {company.name}
                </h1>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="ExternalLink" size={14} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                {isArchived ? (
                  <Badge className="text-[11px] px-2 py-0.5 h-5 bg-slate-100 text-slate-500 border border-slate-200 font-medium hover:bg-slate-100">
                    <Icon name="Archive" size={10} className="mr-1" />
                    В архиве
                  </Badge>
                ) : (
                  <Badge className="text-[11px] px-2 py-0.5 h-5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium hover:bg-emerald-50">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    Активна
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <Icon name="UserRound" size={13} className="shrink-0" />
                <span>Менеджеры не назначены</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 shrink-0 mt-1">
              <Icon name="Archive" size={13} />
              В архив
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex items-end gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#b60209] text-[#b60209]'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-1 text-[10px] font-bold align-super ${activeTab === tab.id ? 'text-[#b60209]' : 'text-muted-foreground'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Finance block */}
      <div className="rounded-xl overflow-hidden shadow-sm border border-border/50">

        {/* Header */}
        <div className="bg-white px-6 pt-5 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-base font-semibold text-foreground">Финансовые операции</h2>
                {selectedContractObj ? (
                  selectedContractObj.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Договор №{selectedContractObj.number} · активен
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{color: '#b60209'}}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: '#b60209'}} />
                      Договор №{selectedContractObj.number} · архив
                    </span>
                  )
                ) : (
                  <span className="text-[11px] text-muted-foreground/50">все договора</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {[
                  { icon: 'ArrowDownLeft', bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Зачисление' },
                  { icon: 'ArrowUpRight',  bg: 'bg-orange-100',  color: 'text-orange-500',  label: 'Списание' },
                  { icon: 'Scale',         bg: 'bg-amber-100',   color: 'text-amber-500',   label: 'Сальдо' },
                  { icon: 'Ban',           bg: 'bg-rose-100',    color: 'text-rose-400',     label: 'Отменено' },
                ].map(({ icon, bg, color, label }) => (
                  <span key={label} className="flex items-center gap-1 text-[11px] text-muted-foreground bg-slate-100 rounded-full px-2 py-0.5">
                    <span className={`w-3.5 h-3.5 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                      <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={9} className={color} />
                    </span>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <Select value={selectedContract} onValueChange={setSelectedContract}>
              <SelectTrigger className="w-48 h-8 text-xs border-border/60 bg-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2">
                    <Icon name="Layers" size={13} className="text-muted-foreground" />
                    Все договора
                  </span>
                </SelectItem>
                {CONTRACTS.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    <span className="flex items-center gap-2">
                      {c.status === 'active'
                        ? <Icon name="FileText" size={13} className="text-emerald-500" />
                        : <Icon name="Archive" size={13} className="text-slate-400" />}
                      №{c.number}
                      {c.status === 'archived' && <span className="text-[11px] text-slate-400">архив</span>}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {/* Balance */}
            <div className="rounded-lg border border-border/60 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Баланс</span>
                <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center">
                  <Icon name="Wallet" size={12} className="text-slate-500" />
                </div>
              </div>
              <div className={`text-xl font-mono font-bold tabular-nums leading-none ${balance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {balance < 0 ? '−' : '+'}{formatMoney(Math.abs(balance), false)}
                <span className="text-sm font-normal text-muted-foreground ml-1">₽</span>
              </div>
            </div>

            {/* Credited */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-emerald-700/70 uppercase tracking-wide">Зачислено</span>
                <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
                  <Icon name="ArrowDownLeft" size={12} className="text-emerald-600" />
                </div>
              </div>
              <div className="text-xl font-mono font-bold tabular-nums leading-none text-emerald-700">
                +{formatMoney(filtered.filter(op => op.type === 'payment' && !op.isCancelled).reduce((s, op) => s + op.amount, 0), false)}
                <span className="text-sm font-normal text-emerald-600/50 ml-1">₽</span>
              </div>
            </div>

            {/* Charged */}
            <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-orange-700/70 uppercase tracking-wide">Списано</span>
                <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                  <Icon name="ArrowUpRight" size={12} className="text-orange-500" />
                </div>
              </div>
              <div className="text-xl font-mono font-bold tabular-nums leading-none text-orange-700">
                −{formatMoney(Math.abs(filtered.filter(op => op.type === 'charge').reduce((s, op) => s + op.amount, 0)), false)}
                <span className="text-sm font-normal text-orange-600/50 ml-1">₽</span>
              </div>
            </div>
          </div>
        </div>


        {/* Table */}
        <div className="bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-slate-50">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Операция</th>
                  <th className="text-right px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider w-40">Сумма, с НДС</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider w-36">Период</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider w-44">Дата операции</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider w-32">Пользователь</th>
                  <th className="w-32 px-5 py-3" />
                </tr>
              </thead>
              <tbody>
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

                  return (
                    <tr
                      key={op.id}
                      className={`group border-b border-border/40 last:border-0 transition-colors hover:bg-slate-50/70 ${isCancelled ? 'bg-rose-50/40' : ''}`}
                    >
                      {/* Operation */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0">
                            {isCancelled && isSaldo ? (
                              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center relative">
                                <Icon name="Scale" size={14} className="text-amber-400 opacity-40" />
                                <Icon name="Ban" size={10} className="text-rose-400 absolute bottom-0.5 right-0.5" />
                              </div>
                            ) : isCancelled ? (
                              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                                <Icon name="Ban" size={14} className="text-rose-400" />
                              </div>
                            ) : isSaldo ? (
                              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Icon name="Scale" size={14} className="text-amber-500" />
                              </div>
                            ) : isCharge ? (
                              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Icon name="ArrowUpRight" size={14} className="text-orange-500" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Icon name="ArrowDownLeft" size={14} className="text-emerald-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] text-muted-foreground/60 font-mono mb-0.5">
                              Договор №{op.contractNumber}
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`font-semibold text-sm leading-none ${isCancelled ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {isCharge ? 'Списание' : 'Зачисление средств'}
                              </span>
                              {isCancelled && (
                                <Badge className="text-[10px] px-1.5 h-4 bg-rose-100 text-rose-600 border border-rose-200 font-medium hover:bg-rose-100">отменено</Badge>
                              )}
                              {isSaldo && (
                                <Badge className="text-[10px] px-1.5 h-4 bg-amber-100 text-amber-700 border border-amber-200 font-medium hover:bg-amber-100">сальдо</Badge>
                              )}
                            </div>
                            {isCharge && op.serviceName && (
                              <div className="text-xs text-muted-foreground mt-0.5">{op.serviceName}</div>
                            )}
                            {op.comment && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground/70 mt-0.5 italic">
                                <Icon name="MessageSquare" size={10} />
                                {op.comment}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 text-right">
                        <span className={`font-mono font-bold text-sm tabular-nums whitespace-nowrap ${
                          isCancelled ? 'line-through text-muted-foreground/50'
                          : op.amount < 0 ? 'text-red-600' : 'text-emerald-600'
                        }`}>
                          {formatMoney(op.amount)}
                        </span>
                      </td>

                      {/* Period */}
                      <td className="px-5 py-3.5">
                        {op.periodFrom && op.periodTo ? (
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            <div>с {op.periodFrom}</div>
                            <div>по {op.periodTo}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30 text-xs">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5">
                        <div className="text-sm text-foreground tabular-nums font-medium">{op.date.split(' ')[0]}</div>
                        <div className="text-xs text-muted-foreground tabular-nums">{op.date.split(' ')[1]}</div>
                      </td>

                      {/* Initiator */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-foreground">
                          {op.initiator === 'Система'
                            ? <Icon name="Monitor" size={12} className="text-muted-foreground shrink-0" />
                            : <Icon name="User" size={12} className="text-muted-foreground shrink-0" />
                          }
                          <span className="font-mono">{op.initiator === 'Система' ? 'система' : op.initiator}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditComment(op)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Комментарий"
                          >
                            <Icon name="PencilLine" size={13} />
                          </Button>

                          {op.type === 'payment' && !isCancelled && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 gap-1"
                                >
                                  <Icon name="RotateCcw" size={12} />
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