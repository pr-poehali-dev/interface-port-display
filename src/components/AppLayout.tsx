import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const NAV_ITEMS = [
  { path: '/companies', label: 'Компании', icon: 'Users', desc: 'Список контрагентов' },
  { path: '/export', label: 'Экспорт в 1С', icon: 'FileDown', desc: 'Выгрузка данных' },
  { path: '/', label: 'Статистика', icon: 'BarChart2', desc: 'Аналитика и отчёты', exact: true },
  { path: '/phones', label: 'Телефония', icon: 'Phone', desc: 'Номера и звонки' },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shrink-0 shadow-sm ${
          collapsed ? 'w-[76px]' : 'w-[360px]'
        }`}
      >
        {/* Logo header */}
        <div className={`flex items-center border-b border-slate-100 min-h-[80px] ${collapsed ? 'justify-center px-3' : 'px-6'}`}>
          {!collapsed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#b60209] to-[#8a0207] rounded-2xl flex items-center justify-center shadow-md">
                  <Icon name="Zap" size={22} className="text-white" />
                </div>
                <div className="leading-snug">
                  <div className="text-lg font-bold text-slate-800 tracking-tight">Биллинг</div>
                  <div className="text-xs text-slate-400 font-medium">ООО "Система Сервис"</div>
                </div>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                title="Свернуть"
              >
                <Icon name="PanelLeftClose" size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="flex flex-col items-center gap-1 group"
              title="Развернуть"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-[#b60209] to-[#8a0207] rounded-2xl flex items-center justify-center shadow-md">
                <Icon name="Zap" size={20} className="text-white" />
              </div>
            </button>
          )}
        </div>

        {/* Nav section label */}
        {!collapsed && (
          <div className="px-6 pt-6 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Навигация</span>
          </div>
        )}

        {/* Nav items */}
        <nav className={`flex-1 space-y-1 ${collapsed ? 'px-2 py-4' : 'px-3 pb-4'}`}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path) && item.path !== '/';

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`group relative flex items-center transition-all duration-150 ${
                  collapsed
                    ? 'justify-center w-full px-0 py-3 rounded-xl'
                    : 'gap-3 px-3 py-3 rounded-xl mx-1'
                } ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {/* Active indicator */}
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#b60209]" />
                )}

                {/* Icon container */}
                <div className={`flex-shrink-0 flex items-center justify-center rounded-lg transition-all ${
                  collapsed ? 'w-10 h-10' : 'w-8 h-8'
                } ${
                  isActive
                    ? 'bg-white'
                    : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                  <Icon
                    name={item.icon}
                    size={17}
                    className={isActive ? 'text-[#b60209]' : 'text-slate-500 group-hover:text-slate-700'}
                  />
                </div>

                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold leading-tight ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.label}
                      </div>
                      <div className={`text-xs mt-0.5 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                        {item.desc}
                      </div>
                    </div>
                    {isActive && (
                      <Icon name="ChevronRight" size={16} className="flex-shrink-0 text-slate-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-slate-100 ${collapsed ? 'px-2 py-4' : 'px-6 py-4'}`}>
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={16} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-700 truncate">Администратор</div>
                <div className="text-xs text-slate-400 truncate">ver: 0.3.4.10</div>
              </div>
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                <Icon name="Settings" size={15} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Icon name="User" size={16} className="text-slate-500" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}