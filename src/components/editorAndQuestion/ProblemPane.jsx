import React from 'react';

const ProblemPane = ({ data }) => {
  return (
    <div className="flex-1 bg-white h-full overflow-y-auto p-6 border-r border-gray-200">
      <div className="max-w-3xl mx-auto pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            {data.id}. {data.title}
          </h1>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
            {data.difficulty}
          </span>
        </div>

        {/* Description */}
        <div className="text-gray-700 text-[15px] leading-relaxed mb-8 border-b border-gray-50 pb-6">
          <p dangerouslySetInnerHTML={{ __html: data.description.replace(/\*\*(.*?)\*\*/g, '<code class="bg-gray-100 px-1 rounded text-pink-600 font-mono text-sm">$1</code>') }} />
        </div>

        {/* Multiple Examples Section */}
        <div className="space-y-8">
          {data.examples.map((ex, index) => (
            <div key={ex.id} className="group">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-6 w-1 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors"></span>
                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  Example {index + 1}:
                </h4>
              </div>
              
              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-gray-200 font-mono text-[13px] shadow-sm">
                <div className="mb-2">
                  <span className="text-blue-600 font-bold">Input: </span>
                  <span className="text-gray-800">{ex.input}</span>
                </div>
                <div className="mb-2">
                  <span className="text-blue-600 font-bold">Output: </span>
                  <span className="text-gray-800">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="mt-2 pt-2 border-t border-gray-200 italic text-gray-500 text-xs">
                    <span className="font-bold not-italic text-gray-600">Explanation: </span>
                    {ex.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <h4 className="font-bold text-gray-800 text-sm mb-4">Constraints:</h4>
          <ul className="space-y-2">
            {data.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1.5">•</span>
                <code className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-xs text-gray-600 font-mono">
                  {c}
                </code>
              </li>
            ))}
          </ul>
        </div>

        {/* Hints */}
        <div className="mt-8 p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 shadow-sm">
          <h4 className="text-amber-800 font-bold text-sm mb-3 flex items-center gap-2">
            <span>💡</span> Hints
          </h4>
          <ul className="space-y-3">
            {data.hints.map((h, i) => (
              <li key={i} className="text-xs text-amber-700 leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-amber-300 before:rounded-full">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemPane;