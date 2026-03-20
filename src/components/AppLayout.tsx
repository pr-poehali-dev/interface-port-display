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
          collapsed ? 'w-[68px]' : 'w-[220px]'
        }`}
      >
        {/* Logo header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border min-h-[64px]">
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex-shrink-0 w-8 h-8 bg-[#b60209] rounded-md flex items-center justify-center">
                <Icon name="Zap" size={16} className="text-white" />
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-sm font-semibold text-foreground truncate">Биллинг</div>
                <div className="text-[11px] text-muted-foreground truncate">ООО "Система Сервис"</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto w-8 h-8 bg-[#b60209] rounded-md flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-white" />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-1 flex-shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icon name="PanelLeftClose" size={16} />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mt-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Icon name="PanelLeftOpen" size={16} />
          </button>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path) && item.path !== '/';

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#b60209]/10 text-[#b60209]'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  className={`flex-shrink-0 transition-colors ${
                    isActive ? 'text-[#b60209]' : 'text-slate-400 group-hover:text-foreground'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#b60209]" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer version */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-border">
            <p className="text-[10px] text-muted-foreground/60 text-center">ver: 0.3.4.10</p>
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
