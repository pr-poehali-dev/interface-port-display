import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface PhoneNumber {
  id: number;
  number: string;
  description?: string;
}

interface Company {
  id: number;
  name: string;
  phones: PhoneNumber[];
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'ООО "Автобан"',
    phones: [
      { id: 1, number: '4992801445', description: 'Основная линия' },
      { id: 2, number: '4951234567', description: 'Отдел продаж' },
      { id: 3, number: '4959876543' },
    ],
  },
  {
    id: 2,
    name: 'ООО "Автомолл"',
    phones: [
      { id: 4, number: '4997654321', description: 'Ресепшн' },
      { id: 5, number: '4993456789' },
    ],
  },
  {
    id: 3,
    name: 'ИП Горбунов А.В.',
    phones: [
      { id: 6, number: '9031112233', description: 'Мобильный директора' },
    ],
  },
];

const formatPhone = (number: string) => {
  const d = number.replace(/\D/g, '');
  if (d.length === 10) {
    return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`;
  }
  return `+7 ${d}`;
};

const PhoneNumbers = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);

  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const [addPhoneOpen, setAddPhoneOpen] = useState(false);
  const [addPhoneCompanyId, setAddPhoneCompanyId] = useState<number | null>(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newPhoneDesc, setNewPhoneDesc] = useState('');

  const [editPhoneOpen, setEditPhoneOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<{ companyId: number; phone: PhoneNumber } | null>(null);
  const [editNumber, setEditNumber] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleAddCompany = () => {
    if (!newCompanyName.trim()) return;
    const newCompany: Company = {
      id: Math.max(...companies.map((c) => c.id), 0) + 1,
      name: newCompanyName.trim(),
      phones: [],
    };
    setCompanies([...companies, newCompany]);
    setAddCompanyOpen(false);
    setNewCompanyName('');
  };

  const handleDeleteCompany = (id: number) => {
    setCompanies(companies.filter((c) => c.id !== id));
  };

  const openAddPhone = (companyId: number) => {
    setAddPhoneCompanyId(companyId);
    setNewPhoneNumber('');
    setNewPhoneDesc('');
    setAddPhoneOpen(true);
  };

  const handleAddPhone = () => {
    if (!addPhoneCompanyId || newPhoneNumber.length !== 10) return;
    const nextId = Math.max(...companies.flatMap((c) => c.phones.map((p) => p.id)), 0) + 1;
    setCompanies(
      companies.map((c) =>
        c.id === addPhoneCompanyId
          ? {
              ...c,
              phones: [
                ...c.phones,
                { id: nextId, number: newPhoneNumber, description: newPhoneDesc || undefined },
              ],
            }
          : c,
      ),
    );
    setAddPhoneOpen(false);
  };

  const openEditPhone = (companyId: number, phone: PhoneNumber) => {
    setEditingPhone({ companyId, phone });
    setEditNumber(phone.number);
    setEditDesc(phone.description || '');
    setEditPhoneOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingPhone || editNumber.length !== 10) return;
    setCompanies(
      companies.map((c) =>
        c.id === editingPhone.companyId
          ? {
              ...c,
              phones: c.phones.map((p) =>
                p.id === editingPhone.phone.id
                  ? { ...p, number: editNumber, description: editDesc || undefined }
                  : p,
              ),
            }
          : c,
      ),
    );
    setEditPhoneOpen(false);
    setEditingPhone(null);
  };

  const handleDeletePhone = (companyId: number, phoneId: number) => {
    setCompanies(
      companies.map((c) =>
        c.id === companyId ? { ...c, phones: c.phones.filter((p) => p.id !== phoneId) } : c,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
      <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Телефония</h1>
            <p className="text-muted-foreground mt-1">
              Компании и их телефонные номера
            </p>
          </div>
          <Dialog open={addCompanyOpen} onOpenChange={setAddCompanyOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#b60209] to-[#8b0107] hover:from-[#a00208] hover:to-[#6f0105]">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить компанию
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая компания</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Название компании</label>
                  <Input
                    placeholder='ООО "Название"'
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCompany()}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setAddCompanyOpen(false)}>
                    Отмена
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#b60209] to-[#8b0107] hover:from-[#a00208] hover:to-[#6f0105]"
                    onClick={handleAddCompany}
                    disabled={!newCompanyName.trim()}
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow duration-200 border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#b60209] to-[#8b0107]">
                      <Icon name="Building2" size={18} className="text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">{company.name}</CardTitle>
                      <Badge variant="secondary" className="mt-0.5 text-xs">
                        {company.phones.length} {company.phones.length === 1 ? 'номер' : company.phones.length < 5 ? 'номера' : 'номеров'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddPhone(company.id)}
                    >
                      <Icon name="PhonePlus" size={14} className="mr-1.5" />
                      Добавить номер
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteCompany(company.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {company.phones.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic py-2">Нет номеров</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {company.phones.map((phone) => (
                      <div
                        key={phone.id}
                        className="flex items-center gap-3 bg-slate-50 rounded-md px-3 py-2"
                      >
                        <Icon name="Phone" size={14} className="text-[#b60209] shrink-0" />
                        <span className="font-mono font-semibold text-sm text-[#b60209] shrink-0 w-44">
                          {formatPhone(phone.number)}
                        </span>
                        {phone.description && (
                          <span className="text-xs text-muted-foreground truncate">
                            {phone.description}
                          </span>
                        )}
                        <div className="ml-auto flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => openEditPhone(company.id, phone)}
                          >
                            <Icon name="Pencil" size={13} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeletePhone(company.id, phone.id)}
                          >
                            <Icon name="Trash2" size={13} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Диалог добавления номера */}
      <Dialog open={addPhoneOpen} onOpenChange={setAddPhoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить телефонный номер</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Телефонный номер (10 цифр)</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">+7</span>
                <Input
                  placeholder="4992801445"
                  maxLength={10}
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {newPhoneNumber && newPhoneNumber.length !== 10 && (
                <p className="text-xs text-red-600">Номер должен содержать 10 цифр</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Описание (опционально)</label>
              <Input
                placeholder="Основная линия, отдел продаж..."
                value={newPhoneDesc}
                onChange={(e) => setNewPhoneDesc(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setAddPhoneOpen(false)}>
                Отмена
              </Button>
              <Button
                className="bg-gradient-to-r from-[#b60209] to-[#8b0107] hover:from-[#a00208] hover:to-[#6f0105]"
                onClick={handleAddPhone}
                disabled={newPhoneNumber.length !== 10}
              >
                Добавить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования номера */}
      <Dialog open={editPhoneOpen} onOpenChange={setEditPhoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить телефонный номер</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Телефонный номер (10 цифр)</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">+7</span>
                <Input
                  placeholder="4992801445"
                  maxLength={10}
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {editNumber && editNumber.length !== 10 && (
                <p className="text-xs text-red-600">Номер должен содержать 10 цифр</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Описание (опционально)</label>
              <Input
                placeholder="Основная линия, отдел продаж..."
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditPhoneOpen(false)}>
                Отмена
              </Button>
              <Button
                className="bg-gradient-to-r from-[#b60209] to-[#8b0107] hover:from-[#a00208] hover:to-[#6f0105]"
                onClick={handleSaveEdit}
                disabled={editNumber.length !== 10}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhoneNumbers;
