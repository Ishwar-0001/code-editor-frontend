import React from 'react';
import { Play, Send, Settings, RotateCcw } from 'lucide-react';

const EditorPane = ({ starterCode }) => {
  return (
    <div className="flex-1 bg-[#1e1e1e] h-full flex flex-col rounded-xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Toolbar */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
        <select className="bg-gray-700 text-white text-xs px-3 py-1.5 rounded-md outline-none cursor-pointer hover:bg-gray-600 transition-colors">
          <option>JavaScript</option>
          <option>Python 3</option>
          <option>C++</option>
          <option>Java</option>
        </select>
        
        <div className="flex gap-4 text-gray-400">
          <RotateCcw size={16} className="cursor-pointer hover:text-white transition-colors" title="Reset Code" />
          <Settings size={16} className="cursor-pointer hover:text-white transition-colors" title="Settings" />
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative group">
        <textarea 
          className="w-full h-full bg-transparent text-gray-300 p-6 font-mono text-sm resize-none focus:outline-none leading-relaxed"
          placeholder="// Write your solution here..."
          defaultValue={starterCode}
        />
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-[#2d2d2d] border-t border-gray-700 flex justify-between items-center">
        <button className="px-4 py-1.5 text-gray-400 hover:text-white text-sm font-medium transition-colors">
          Console
        </button>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-5 py-1.5 bg-[#3a3a3a] text-white text-sm rounded-md font-semibold hover:bg-[#4a4a4a] transition-all">
            <Play size={14} fill="currentColor" /> Run
          </button>
          <button className="flex items-center gap-2 px-5 py-1.5 bg-green-600 text-white text-sm rounded-md font-semibold hover:bg-green-500 transition-all shadow-lg shadow-green-900/20">
            <Send size={14} /> Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorPane;