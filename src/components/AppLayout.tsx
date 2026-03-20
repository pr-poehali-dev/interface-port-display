import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const NAV_ITEMS = [
  { path: '/companies', label: 'Компании', icon: 'Users' },
  { path: '/export', label: 'Экспорт в 1с', icon: 'FileDown' },
  { path: '/', label: 'Статистика', icon: 'BarChart2', exact: true },
  { path: '/phones', label: 'Телефония', icon: 'Phone' },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white border-r border-border transition-all duration-300 shrink-0 ${
          collapsed ? 'w-[72px]' : 'w-[280px]'
        }`}
      >
        {/* Logo header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border min-h-[72px]">
          {!collapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0 w-10 h-10 bg-[#b60209] rounded-lg flex items-center justify-center shadow-sm">
                <Icon name="Zap" size={20} className="text-white" />
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-base font-bold text-foreground truncate">Биллинг</div>
                <div className="text-xs text-muted-foreground truncate">ООО "Система Сервис"</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto w-10 h-10 bg-[#b60209] rounded-lg flex items-center justify-center shadow-sm">
              <Icon name="Zap" size={20} className="text-white" />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-2 flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icon name="PanelLeftClose" size={18} />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-4 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Icon name="PanelLeftOpen" size={18} />
          </button>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path) && item.path !== '/';

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#b60209] text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={`flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer version */}
        {!collapsed && (
          <div className="px-5 py-4 border-t border-border">
            <p className="text-[11px] text-muted-foreground/50 text-center">ver: 0.3.4.10</p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}