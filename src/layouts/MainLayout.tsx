import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  AlertTriangle, 
  DollarSign, 
  Wrench, 
  LogOut, 
  Menu,
  Sun,
  Moon,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/reservations', label: 'Reservas', icon: Calendar },
    { path: '/incidents', label: 'Ocorrências', icon: AlertTriangle },
    { path: '/cashier', label: 'Caixa', icon: Wallet },
    { path: '/delinquencies', label: 'Inadimplência', icon: DollarSign },
    { path: '/work-orders', label: 'Ordens de Serviço', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-50 transform transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          <h2 className="text-xl font-bold">Condomínio Hekla</h2>
        </div>
        <nav className="px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`sticky top-0 z-30 border-b border-border px-6 py-4 transition-all duration-200 ${
          isScrolled 
            ? 'bg-background/80 backdrop-blur-md' 
            : 'bg-background'
        }`}>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-foreground">Olá, {user?.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-background border-t border-border px-6 py-4 text-center text-sm text-muted-foreground">
          © 2026 Michel Oliveira. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}
