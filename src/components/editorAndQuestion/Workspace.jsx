import React from 'react';
import ProblemPane from './ProblemPane';
import EditorPane from './EditorPane';
import { questionData } from './QuestionData';

const Workspace = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
     
      {/* Main Container */}
      <main className="flex flex-1 overflow-hidden p-3 gap-3">
        {/* Left Side: Description */}
        <div className="w-1/2 rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
          <ProblemPane data={questionData} />
        </div>

        {/* Right Side: Editor */}
        <div className="w-1/2">
          <EditorPane starterCode={questionData.starterCode} />
        </div>
      </main>
    </div>
  );
};

export default Workspace;