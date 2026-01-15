import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Loader2, AlertCircle, Copy, Check, Lightbulb, 
  AlertTriangle, Tag, Calendar, Terminal 
} from 'lucide-react';
import axios from 'axios';
import api from '../../api/api'; 

// --- Component: Text Skeleton (Shimmer Effect) ---
const ProblemSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6 space-y-8 animate-pulse">
    {/* Header Skeleton */}
    <div className="space-y-4 border-b border-gray-100 dark:border-gray-800 pb-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-md w-1/3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
      </div>
    </div>
    {/* Examples Skeleton */}
    <div className="space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
    </div>
  </div>
);

// --- Component: Copy Button ---
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 transition-all active:scale-95"
      title="Copy to clipboard"
    >
      {copied ? <Check size={14} className="text-green-600 dark:text-green-400" /> : <Copy size={14} />}
    </button>
  );
};

// --- Component: Safe Text Renderer ---
const SafeDescription = ({ text }) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => (
    <p key={i} className="mb-3 leading-7 text-gray-700 dark:text-gray-300">
      {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Highlighted/Bold text style
          return (
            <span key={j} className="font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-1 rounded-sm">
              {part.slice(2, -2)}
            </span>
          );
        }
        return part;
      })}
    </p>
  ));
};

// --- Main Component ---
const ProblemPane = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(api.Code.getQuestionById(id));
        setProblem(response.data);
      } catch (err) {
        console.error("Error fetching question:", err);
        setError("Unable to load problem data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuestion();
  }, [id]);

  if (loading) return <ProblemSkeleton />;

  if (error || !problem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full p-6 bg-white dark:bg-gray-900">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Problem Not Found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{error || "The requested problem does not exist."}</p>
      </div>
    );
  }

  // Visual Styles Mapping
  const difficultyStyles = {
    Easy: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800",
    Medium: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800",
    Hard: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-900/20 dark:border-rose-800"
  };
  const diffStyle = difficultyStyles[problem.difficulty] || difficultyStyles.Easy;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/50 scroll-smooth">
      <div className="max-w-4xl mx-auto px-6 py-8 pb-32">
        
        {/* --- Header Section --- */}
        <header className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div className="flex flex-col gap-4">
             <div className="flex items-start justify-between">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                  {problem.id ? `${problem.id}. ` : ''}{problem.title}
                </h1>
             </div>
             
             <div className="flex items-center gap-3">
                 <span className={`px-3 py-1 text-xs font-bold rounded-full border ${diffStyle}`}>
                   {problem.difficulty}
                 </span>
                 
                 {problem.day && (
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700">
                        <Calendar size={12} />
                        Day {problem.day}
                    </span>
                 )}

                 {problem.topic && (
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-800">
                        <Tag size={12} />
                        {problem.topic}
                    </span>
                 )}
             </div>
          </div>
          
          <div className="mt-6 text-[16px]">
            <SafeDescription text={problem.description} />
          </div>
        </header>

        {/* --- Examples Section --- */}
        <section className="space-y-8 mb-10">
          {problem.testCases?.map((tc, index) => (
            <div key={index} className="group relative">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                Example {index + 1}
              </h4>
              
              {/* Terminal/Code Block Look */}
              <div className="bg-gray-50 dark:bg-[#0d1117] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* Input Area */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 relative">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 select-none">Input</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3">
                             <CopyButton text={tc.input} />
                        </div>
                    </div>
                    <code className="block font-mono text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                        {tc.input}
                    </code>
                </div>

                {/* Output Area */}
                <div className="p-4 bg-white dark:bg-[#0d1117]/50">
                    <div className="mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 select-none">Output</span>
                    </div>
                    <code className="block font-mono text-sm text-gray-800 dark:text-gray-300 font-semibold">
                        {tc.output}
                    </code>
                </div>

                {/* Explanation Area */}
                {tc.explanation && (
                  <div className="px-4 py-3 bg-indigo-50/50 dark:bg-indigo-900/10 border-t border-indigo-100 dark:border-indigo-900/30 text-sm">
                    <span className="font-semibold text-indigo-900 dark:text-indigo-300 mr-2">Explanation:</span>
                    <span className="text-indigo-800 dark:text-indigo-200/80">{tc.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* --- Constraints Section --- */}
        {problem.constraints && (
          <section className="mb-10">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide">
                <AlertTriangle size={16} className="text-gray-400" />
                Constraints
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(problem.constraints) ? (
                problem.constraints.map((constraint, i) => (
                  <div key={i} className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300 shadow-sm">
                    {constraint}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300 shadow-sm">
                   {problem.constraints}
                </div>
              )}
            </div>
          </section>
        )}

        {/* --- Hints Section --- */}
        {problem.hints?.length > 0 && (
            <section>
                <details className="group open:bg-amber-50/50 dark:open:bg-amber-900/10 rounded-2xl transition-all duration-300">
                    <summary className="list-none cursor-pointer py-4 flex items-center gap-3 font-semibold text-gray-600 dark:text-gray-400 group-open:text-amber-600 dark:group-open:text-amber-500 select-none transition-colors">
                        <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-open:bg-amber-200 dark:group-open:bg-amber-800/50 transition-colors">
                             <Lightbulb size={18} className="text-amber-600 dark:text-amber-500" />
                        </div>
                        <span>Show Hints</span>
                        <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 group-open:bg-amber-200 dark:group-open:bg-amber-800/30 transition-colors"></div>
                    </summary>
                    
                    <div className="pl-12 pr-4 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {problem.hints.map((hint, i) => (
                            <div key={i} className="relative pl-4 text-sm text-gray-700 dark:text-gray-300">
                                <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                {hint}
                            </div>
                        ))}
                    </div>
                </details>
            </section>
        )}

      </div>
    </div>
  );
};

export default ProblemPane;