import React from 'react';
import { Flame, Star, PlayCircle } from 'lucide-react';

const ProblemCard = ({ id, title, difficulty, views }) => {
  return (
    // Reduced padding (p-3) and rounded corners (rounded-2xl)
    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden h-full">
      <div className="flex justify-between items-start">
        <div>
          {/* Reduced text size (text-sm) */}
          <h3 className="text-sm font-bold text-gray-800 leading-tight">
            #{id} {title}
          </h3>
          <p className="text-[10px] text-gray-400">{difficulty}</p>
        </div>
        {/* Smaller icon container */}
        <div className={`p-1 rounded-full ${id % 3 === 0 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
          {id % 3 === 0 ? <Star size={12} fill="currentColor" /> : <Flame size={12} fill="currentColor" />}
        </div>
      </div>

      <p className="text-[9px] text-gray-400 leading-tight line-clamp-2">
        Sample description text for the problem statement.
      </p>

      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex gap-1">
          {/* Compact button */}
          <button className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[8px] font-bold rounded-md uppercase">
            Tasks
          </button>
        </div>
        <div className="flex items-center gap-1 text-blue-900 font-bold text-[9px]">
          <PlayCircle size={10} />
          {views}
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;