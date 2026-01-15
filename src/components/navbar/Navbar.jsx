import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Code2, Bell, Compass, Layout } from 'lucide-react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle Dark Mode Class on HTML element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Reusable NavLink Component
  const NavLink = ({ href, icon: Icon, children }) => (
    <a 
      href={href} 
      className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors py-2 md:py-0"
    >
      {Icon && <Icon size={16} />}
      {children}
    </a>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 1. Logo Section */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none">
              <Code2 size={20} />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight hidden sm:block">
              CODE MASTER
            </span>
          </div>

          {/* 2. Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </span>
              <input
                type="text"
                className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:bg-gray-800 dark:focus:ring-blue-900 transition-all"
                placeholder="Search challenges..."
              />
            </div>
          </div>

          {/* 3. Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* --- ADDED: Explore & Editor Links --- */}
            <div className="flex gap-6">
              <NavLink href="/explore" icon={Compass}>Explore</NavLink>
              <NavLink href="/editor" icon={Layout}>Editor</NavLink>
            </div>
            {/* ------------------------------------- */}

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

            {/* Profile & Toggle Group */}
            <div className="flex items-center gap-4">
              <button className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <Bell size={20} />
              </button>
              
              <div className="flex items-center gap-3">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Cardell" 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">Cardell</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Pro Member</span>
                </div>
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isDark ? 'bg-slate-700' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* 4. Mobile Hamburger Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button className="text-gray-500 dark:text-gray-400">
               <Search size={20} />
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -mr-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 absolute w-full left-0 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 space-y-4">
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            {/* --- ADDED: Mobile Explore & Editor Links --- */}
            <div className="flex flex-col space-y-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <a href="/explore" className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 px-2 rounded-lg transition-colors">
                <Compass size={18} />
                Explore Challenges
              </a>
              <a href="/editor" className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 px-2 rounded-lg transition-colors">
                <Layout size={18} />
                Code Editor
              </a>
              <a href="#" className="flex items-center gap-3 py-2 text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 px-2 rounded-lg transition-colors">
                <Bell size={18} />
                Notifications
                <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
              </a>
            </div>
            {/* ------------------------------------------- */}

            <div className="flex items-center justify-between pt-2 px-2">
              <div className="flex items-center gap-3">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Cardell" 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Cardell</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-slate-700' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;