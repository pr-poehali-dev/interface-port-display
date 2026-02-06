import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';

interface PhoneNumber {
  id: number;
  number: string;
  description?: string;
}

const mockPhoneNumbers: PhoneNumber[] = [
  {
    id: 1,
    number: '4992801445',
    description: 'Основная линия офиса',
  },
  {
    id: 2,
    number: '4951234567',
    description: 'Техническая поддержка',
  },
  {
    id: 3,
    number: '4959876543',
  },
];

const PhoneNumbers = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>(mockPhoneNumbers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<PhoneNumber | null>(null);
  const [newNumber, setNewNumber] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleDelete = (id: number) => {
    setPhoneNumbers(phoneNumbers.filter(phone => phone.id !== id));
  };

  const handleEdit = (phone: PhoneNumber) => {
    setEditingNumber(phone);
    setNewNumber(phone.number);
    setNewDescription(phone.description || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingNumber && newNumber.length === 10 && /^\d+$/.test(newNumber)) {
      setPhoneNumbers(phoneNumbers.map(phone => 
        phone.id === editingNumber.id 
          ? { ...phone, number: newNumber, description: newDescription }
          : phone
      ));
      setIsEditDialogOpen(false);
      setEditingNumber(null);
      setNewNumber('');
      setNewDescription('');
    }
  };

  const handleAdd = () => {
    if (newNumber.length === 10 && /^\d+$/.test(newNumber)) {
      const newPhone: PhoneNumber = {
        id: Math.max(...phoneNumbers.map(p => p.id), 0) + 1,
        number: newNumber,
        description: newDescription || undefined,
      };
      setPhoneNumbers([...phoneNumbers, newPhone]);
      setIsAddDialogOpen(false);
      setNewNumber('');
      setNewDescription('');
    }
  };

  const formatPhoneNumber = (number: string) => {
    return `+7 ${number}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
      <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Телефонные номера</h1>
            <p className="text-muted-foreground mt-1">Управление телефонными номерами организации</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#b60209] to-[#8b0107] hover:from-[#a00208] hover:to-[#6f0105]">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить номер
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить новый телефонный номер</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Телефонный номер</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">+7</span>
                    <Input 
                      placeholder="4992801445" 
                      maxLength={10}
                      value={newNumber}
                      onChange={(e) => setNewNumber(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  {newNumber && newNumber.length !== 10 && (
                    <p className="text-xs text-red-600">Номер должен содержать 10 цифр</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Описание (опционально)</label>
                  <Textarea 
                    placeholder="Назначение номера" 
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewNumber('');
                    setNewDescription('');
                  }}>
                    Отмена
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-[#b60209] to-[#8b0107] hover:from-[#a00208] hover:to-[#6f0105]"
                    onClick={handleAdd}
                    disabled={newNumber.length !== 10}
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {phoneNumbers.map((phone) => (
            <Card key={phone.id} className="hover:shadow-lg transition-shadow duration-200 border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-[#b60209] to-[#8b0107] flex-shrink-0">
                      <Icon name="Phone" size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Номер телефона</p>
                      <p className="text-2xl font-bold" style={{ color: '#b60209' }}>
                        {formatPhoneNumber(phone.number)}
                      </p>
                    </div>
                  </div>

                  {phone.description && (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Icon name="FileText" size={16} className="text-muted-foreground flex-shrink-0" />
                      <p className="text-sm text-muted-foreground truncate">{phone.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 md:ml-auto">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Статус</p>
                      <Badge className="bg-[#b60209] text-white hover:bg-[#b60209]">
                        <Icon name="Check" size={12} className="mr-1" />
                        Ок
                      </Badge>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(phone)}
                    >
                      <Icon name="Pencil" size={16} className="mr-2" />
                      Изменить
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(phone.id)}
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить телефонный номер</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Телефонный номер</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">+7</span>
                <Input 
                  placeholder="4992801445" 
                  maxLength={10}
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {newNumber && newNumber.length !== 10 && (
                <p className="text-xs text-red-600">Номер должен содержать 10 цифр</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Описание (опционально)</label>
              <Textarea 
                placeholder="Назначение номера" 
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setEditingNumber(null);
                setNewNumber('');
                setNewDescription('');
              }}>
                Отмена
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#b60209] to-[#8b0107] hover:from-[#a00208] hover:to-[#6f0105]"
                onClick={handleSaveEdit}
                disabled={newNumber.length !== 10}
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
