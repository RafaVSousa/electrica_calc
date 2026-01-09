// TransCalc - Header Component

import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';

interface HeaderProps {
  user?: {
    email: string;
    name?: string;
  } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">TransCalc</span>
              <span className="hidden sm:block text-xs text-gray-500">
                Transformadores de Potencia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/new"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Novo Calculo
                </Link>
                <Link
                  to="/history"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Historico
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <User className="w-5 h-5" />
                    <span className="max-w-[150px] truncate">
                      {user.name || user.email}
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    leftIcon={<LogOut className="w-4 h-4" />}
                  >
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Entrar
                </Link>
                <Link to="/register">
                  <Button size="sm">Criar Conta</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-2">
            {user ? (
              <>
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/new"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Novo Calculo
                </Link>
                <Link
                  to="/history"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Historico
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Configuracoes
                </Link>
                <hr className="my-2" />
                <button
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-primary-600 text-white text-center rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Criar Conta
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
