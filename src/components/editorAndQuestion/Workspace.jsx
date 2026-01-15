// Workspace.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import ProblemPane from './ProblemPane';
import EditorPane from './EditorPane'; // This is your CodeEditor component
import api from '../../api/api';

const Workspace = () => {
  const { id } = useParams();
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await fetch(api.Code.getQuestionById(id));
        if (!response.ok) throw new Error('Failed to fetch question');
        const result = await response.json();
        setQuestionData(result);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuestion();
  }, [id]);

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center bg-[#1e1e1e] text-white">
      <Loader2 className="animate-spin mr-2" /> Loading Environment...
    </div>
  );

  if (error) return (
    <div className="w-full h-screen flex items-center justify-center bg-[#1e1e1e] text-red-500">
      <AlertCircle className="mr-2" /> {error}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row w-full h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
      
      {/* Problem Pane */}
      <div className="w-full h-1/2 md:w-1/2 md:h-full p-3 md:pr-1.5 overflow-hidden">
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="h-full overflow-y-auto scrollbar-thin">
            <ProblemPane question={questionData || {}} /> 
          </div>
        </div>
      </div>

      {/* Editor Pane */}
      <div className="w-full h-1/2 md:w-1/2 md:h-full p-3 md:pl-1.5 pt-0 md:pt-3">
        {/* --- PASSING DATA HERE --- */}
        <EditorPane 
          // Map API 'template' to the prop 'starterCode'
          starterCode={questionData?.template} 
          // Pass test cases array
          testCases={questionData?.testCases} 
        />
      </div>

    </div>
  );
};

export default Workspace;