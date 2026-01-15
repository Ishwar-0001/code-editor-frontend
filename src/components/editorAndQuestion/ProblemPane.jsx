import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/api'; // Ensure this path is correct based on your folder structure

const ProblemPane = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the question details when the ID changes
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        // Your API returns the URL string, so we pass it to fetch()
        const response = await fetch(api.Code.getQuestionById(id));
        
        if (!response.ok) {
          throw new Error('Failed to fetch question details');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 h-full border-r border-gray-200 dark:border-gray-800">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-900 h-full border-r border-gray-200 dark:border-gray-800 p-6">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Error Loading Question</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">{error || "Question not found"}</p>
      </div>
    );
  }

  // Define difficulty colors safely
  const difficultyColors = {
    Easy: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    Medium: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    Hard: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"
  };

  const difficultyClass = difficultyColors[data.difficulty] || difficultyColors.Easy;

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 h-full overflow-y-auto p-6 border-r border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-3xl mx-auto pb-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            {data.title}
          </h1>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${difficultyClass}`}>
            {data.difficulty}
          </span>
        </div>

        {/* Description */}
        <div className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
          {/* Note: In a real app, use a safe HTML sanitizer library here */}
          <p dangerouslySetInnerHTML={{ 
            __html: data.description.replace(/\*\*(.*?)\*\*/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-pink-600 dark:text-pink-400 font-mono text-sm">$1</code>') 
          }} />
        </div>

        {/* Test Cases (Using your "testCases" array as Examples) */}
        <div className="space-y-8">
          {data.testCases && data.testCases.map((tc, index) => (
            <div key={index} className="group">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-6 w-1 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors"></span>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide">
                  Example {index + 1}:
                </h4>
              </div>
              
              <div className="bg-[#f8f9fa] dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-[13px] shadow-sm">
                <div className="mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">Input: </span>
                  <span className="text-gray-800 dark:text-gray-300">{tc.input}</span>
                </div>
                <div className="mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">Output: </span>
                  <span className="text-gray-800 dark:text-gray-300">{tc.output}</span>
                </div>
                {/* Safe check if explanation exists (it was missing in your API sample, but good to keep) */}
                {tc.explanation && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 italic text-gray-500 dark:text-gray-400 text-xs">
                    <span className="font-bold not-italic text-gray-600 dark:text-gray-300">Explanation: </span>
                    {tc.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Constraints - Conditionally Rendered */}
        {data.constraints && data.constraints.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-4">Constraints:</h4>
            <ul className="space-y-2">
              {data.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1.5">•</span>
                  <code className="bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 font-mono">
                    {c}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hints - Conditionally Rendered */}
        {data.hints && data.hints.length > 0 && (
          <div className="mt-8 p-5 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/50 shadow-sm">
            <h4 className="text-amber-800 dark:text-amber-500 font-bold text-sm mb-3 flex items-center gap-2">
              <span>💡</span> Hints
            </h4>
            <ul className="space-y-3">
              {data.hints.map((h, i) => (
                <li key={i} className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-amber-300 dark:before:bg-amber-600 before:rounded-full">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPane;