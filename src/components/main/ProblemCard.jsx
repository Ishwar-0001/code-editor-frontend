import React from 'react';
import { Eye, ArrowRight, Code2, Clock, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Removed unused import 'Workspace' to keep code clean

const ProblemCard = ({ id, title, difficulty, views }) => {
  const navigate = useNavigate();

  const difficultyConfig = {
    easy: { 
      // added dark: opacity classes for better contrast in dark mode
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800', 
      icon: <Zap size={14} />, 
      label: 'Easy' 
    },
    medium: { 
      color: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800', 
      icon: <Code2 size={14} />, 
      label: 'Medium' 
    },
    hard: { 
      color: 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800', 
      icon: <AlertCircle size={14} />, 
      label: 'Hard' 
    }
  };

  const config = difficultyConfig[difficulty?.toLowerCase()] || difficultyConfig.easy;

  const handleSolve = (e) => {
    e.stopPropagation(); 
    // UPDATED: Now navigates to /workspace/solve/ID
    navigate(`/workspace/solve/${id}`);
  };

  return (
    <div 
      onClick={handleSolve}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleSolve(e)}
      // Added dark:bg-gray-800 dark:border-gray-700
      className="group relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-100 dark:hover:border-blue-900 transition-all duration-300 cursor-pointer overflow-hidden active:scale-[0.99]"
    >
      {/* Top Gradient Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${config.color.split(' ')[1].replace('bg-', 'bg-linear-to-r from-transparent via-')}-400 to-transparent opacity-50`} />

      <div className="p-5 flex flex-col h-full relative z-10">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-4">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 uppercase tracking-wide ${config.color}`}>
            {config.icon}
            {config.label}
          </div>
          
          {/* Added dark:bg-gray-700 dark:text-gray-300 */}
          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-400 text-xs font-medium bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
             <Eye size={12} /> {views ? views.toLocaleString() : 0}
          </div>
        </div>

        {/* Content */}
        {/* Added dark:text-white */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2">
          {title}
        </h3>
        
        {/* Added dark:text-gray-400 */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 grow">
          Write efficient code to solve this challenge. Includes automated test cases.
        </p>

        {/* Footer */}
        {/* Added dark:border-gray-700 */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Clock size={14} />
            <span>~15 mins</span>
          </div>
          
          <button className="flex items-center gap-1.5 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl 
            transition-all duration-300 
            opacity-100 translate-x-0 
            md:opacity-0 md:translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0
            hover:bg-blue-600 hover:text-white
            dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white">
            Solve <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProblemCard);