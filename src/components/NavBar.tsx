
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Menu, X, User, LogOut } from 'lucide-react';
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

  return (
    <header className="sticky top-0 bg-hacker-dark z-40 border-b border-secondary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <Logo />
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center p-2"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`py-1 px-2 font-medium hover:text-primary border-b-2 transition-colors ${isActive('/')}`}>
              Home
            </Link>
            
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className={`py-1 px-2 font-medium hover:text-primary border-b-2 transition-colors ${isActive(`/category/${category.slug}`)}`}
              >
                {category.name}
              </Link>
            ))}
            
            <Link to="/ctf" className={`py-1 px-2 font-medium hover:text-primary border-b-2 transition-colors ${isActive('/ctf')}`}>
              CTF
            </Link>
            
            <Link to="/forum" className={`py-1 px-2 font-medium hover:text-primary border-b-2 transition-colors ${isActive('/forum')}`}>
              Forum
            </Link>
            
            <Link to="/youtube-channels" className={`py-1 px-2 font-medium hover:text-primary border-b-2 transition-colors ${isActive('/youtube-channels')}`}>
              YouTube
            </Link>

            {isAuthenticated ? (
              <div className="relative ml-4 flex items-center space-x-4">
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
              <div className="ml-4 flex items-center space-x-2">
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
          <nav className="md:hidden py-4 space-y-3">
            <Link 
              to="/" 
              className={`block py-2 px-4 hover:bg-secondary/50 rounded-md ${isActive('/')}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className={`block py-2 px-4 hover:bg-secondary/50 rounded-md ${isActive(`/category/${category.slug}`)}`}
                onClick={closeMenu}
              >
                {category.name}
              </Link>
            ))}
            
            <Link 
              to="/ctf" 
              className={`block py-2 px-4 hover:bg-secondary/50 rounded-md ${isActive('/ctf')}`}
              onClick={closeMenu}
            >
              CTF
            </Link>
            
            <Link 
              to="/forum" 
              className={`block py-2 px-4 hover:bg-secondary/50 rounded-md ${isActive('/forum')}`}
              onClick={closeMenu}
            >
              Forum
            </Link>
            
            <Link 
              to="/youtube-channels" 
              className={`block py-2 px-4 hover:bg-secondary/50 rounded-md ${isActive('/youtube-channels')}`}
              onClick={closeMenu}
            >
              YouTube
            </Link>

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
