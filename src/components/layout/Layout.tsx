import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, Users, CreditCard, LogOut, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

export const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useStore();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Billing', path: '/billing', icon: CreditCard },
  ];

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-surface-container-low transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 kinetic-gradient rounded-lg flex items-center justify-center text-white">
              <Search size={18} />
            </div>
            <span className="text-xl font-bold tracking-tighter">TradeIntel NP</span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-white text-primary font-bold shadow-sm" 
                      : "text-on-surface-variant hover:bg-white/50"
                  )}
                >
                  <Icon size={20} className={cn(isActive ? "text-primary" : "text-on-surface-variant")} />
                  <span>{item.name}</span>
                  {isActive && <div className="ml-auto w-1 h-5 bg-primary rounded-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-outline-variant/20">
            <div className="flex items-center gap-3 mb-6 px-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user?.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.email}</p>
                <p className="text-xs text-on-surface-variant capitalize">{user?.plan} Plan</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full text-on-surface-variant hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export const Topbar = () => {
  const { user } = useStore();
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold">Trade Intelligence</h2>
      </div>
      <div className="flex items-center gap-4">
        {user?.plan === 'free' && (
          <Link to="/billing" className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
            UPGRADE TO PRO
          </Link>
        )}
        <div className="w-8 h-8 rounded-full bg-surface-container-high" />
      </div>
    </header>
  );
};
