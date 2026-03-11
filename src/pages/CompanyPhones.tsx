import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

const companies: Company[] = [
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

const CompanyPhones = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
      <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Телефония</h1>
          <p className="text-muted-foreground mt-1">Компании и их телефонные номера</p>
        </div>

        <div className="space-y-4">
          {companies.map((company) => (
            <Card key={company.id} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#b60209] to-[#8b0107]">
                    <Icon name="Building2" size={18} className="text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">{company.name}</CardTitle>
                    <Badge variant="secondary" className="mt-0.5 text-xs">
                      {company.phones.length}{' '}
                      {company.phones.length === 1
                        ? 'номер'
                        : company.phones.length < 5
                          ? 'номера'
                          : 'номеров'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPhones;
