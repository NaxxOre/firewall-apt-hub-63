
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Menu, X, User, LogOut, Home } from 'lucide-react';
import Logo from './Logo';
import { CATEGORIES } from '@/lib/constants';

const NavBar = () => {
  const { isAuthenticated, currentUser, logout } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    if (isOpen) setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary border-primary' : 'text-foreground border-transparent';
  };

  const mainNavItems = [
    { name: 'Home', path: '/', icon: Home },
    ...CATEGORIES.map(category => ({ 
      name: category.name, 
      path: `/category/${category.slug}` 
    })),
  ];

  return (
    <header className="sticky top-0 bg-hacker-dark z-40 border-b border-secondary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <Logo />
          </Link>

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex items-center p-2"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {/* Main navigation items */}
            {mainNavItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`py-1 px-2 font-medium hover:text-primary border-b-2 transition-colors ${isActive(item.path)}`}
              >
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="relative ml-2 xl:ml-4 flex items-center space-x-2 xl:space-x-4">
                <Link 
                  to={currentUser?.isAdmin ? '/admin' : '/profile'} 
                  className="flex items-center space-x-1 bg-secondary hover:bg-secondary/80 text-foreground py-1.5 px-3 rounded-md transition-colors"
                >
                  <User size={16} />
                  <span>{currentUser?.isAdmin ? 'Admin' : 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-primary/20 hover:bg-primary/30 text-primary py-1.5 px-3 rounded-md transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="ml-2 xl:ml-4 flex items-center space-x-2">
                <Link
                  to="/login"
                  className="py-1.5 px-4 hover:bg-secondary/80 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary/80 py-1.5 px-4 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden py-4 space-y-3">
            {/* Main navigation items */}
            {mainNavItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`block py-2 px-4 hover:bg-secondary/50 rounded-md ${isActive(item.path)}`}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link 
                  to={currentUser?.isAdmin ? '/admin' : '/profile'} 
                  className="flex items-center space-x-2 py-2 px-4 bg-secondary/50 rounded-md"
                  onClick={closeMenu}
                >
                  <User size={16} />
                  <span>{currentUser?.isAdmin ? 'Admin' : 'Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center space-x-2 py-2 px-4 bg-primary/20 text-primary rounded-md"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="block text-center py-2 px-4 border border-primary/30 hover:bg-secondary/50 rounded-md"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center py-2 px-4 bg-primary hover:bg-primary/80 rounded-md"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default NavBar;
