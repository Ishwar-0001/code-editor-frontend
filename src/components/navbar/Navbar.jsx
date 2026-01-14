import React, { useState } from 'react';
import { Search } from 'lucide-react'; // Using lucide-react for the search icon

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 font-sans">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-green-400">
          <span className="text-white font-bold text-lg">C</span>
        </div>
        <span className="font-bold text-gray-800 text-lg tracking-tight">CODE MASTER</span>
      </div>

      {/* Center-Left: Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-gray-200 transition-all"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Right: Links, Profile, and Toggle */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-blue-600 transition-colors">Explore</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Cardell" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-800">Cardell</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">#3355 Streamed</span>
          </div>
        </div>

        {/* Theme Toggle Switch */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            isDark ? 'bg-blue-600' : 'bg-slate-800'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isDark ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;