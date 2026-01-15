import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react'; 
import { 
  Play, Send, Settings, RotateCcw, ChevronDown, Copy, Check, 
  Terminal, X, Loader2, Code2 
} from 'lucide-react';

const EditorPane = ({ starterCode, testCases }) => {
  
  // Default code for the Playground (/editor route)
  const defaultPlaygroundCode = `// Write JavaScript here and press Run
function solution(arr) {
  let l = 0;
  let r = arr.length - 1;
  while(l < r){
      [arr[l], arr[r]] = [arr[r], arr[l]];
      l++;
      r--;
  }
  return arr;
}

// Manually test your code here:
console.log("Result:", solution([1, 2, 3, 4]));
`;

  const [code, setCode] = useState(starterCode || defaultPlaygroundCode);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null); 
  const [copied, setCopied] = useState(false);
  
  const editorRef = useRef(null);

  // If we switch between questions, update the code. 
  // If no starterCode (Playground mode), keep existing or default.
  useEffect(() => {
    if (starterCode) {
      setCode(starterCode);
    }
  }, [starterCode]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // --- CORE RUN LOGIC ---
  const handleRun = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsConsoleOpen(true);
    setOutput(null); // Clear previous output

    setTimeout(() => {
      // 1. Prepare to Capture Console Logs
      const capturedLogs = [];
      const originalLog = console.log; // Save real console.log
      
      // Override console.log to trap output
      const customLog = (...args) => {
          // Convert args to strings for display
          const logLine = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ');
          capturedLogs.push(logLine);
      };

      try {
        // 2. Decide: Playground Run vs Test Case Run
        
        // Scenario A: Test Cases Exist (Challenge Mode)
        if (testCases && testCases.length > 0) {
            
            // ... (Your existing Test Case logic here) ...
            // We reuse the new Function approach
             const userCodeBlock = `${code}\nreturn solution;`;
             const userFn = new Function(userCodeBlock)();
             
             let passedCount = 0;
             let results = [];

             testCases.forEach((test, i) => {
                 try {
                     const input = JSON.parse(test.input);
                     const expected = JSON.parse(test.output);
                     const result = userFn(input);
                     
                     const resultStr = JSON.stringify(result);
                     const expectedStr = JSON.stringify(expected);
                     const passed = resultStr === expectedStr;
                     
                     if(passed) passedCount++;
                     
                     results.push({
                         id: i + 1,
                         status: passed ? "Passed" : "Failed",
                         input: test.input,
                         expected: test.output,
                         actual: resultStr
                     });
                 } catch (e) {
                     results.push({ id: i+1, status: "Error", actual: e.message });
                 }
             });

             setOutput({
                 mode: "test",
                 passed: passedCount,
                 total: testCases.length,
                 logs: results
             });

        } 
        // Scenario B: No Test Cases (Playground Mode)
        else {
            // We run the code "raw" inside a wrapper that swaps console.log
            // We wrap it in an IIFE (Immediately Invoked Function Expression)
            const playgroundCode = `
               const console = { log: customLog };
               ${code}
            `;
            
            // Execute!
            // We pass 'customLog' into the function scope
            new Function("customLog", playgroundCode)(customLog);

            setOutput({
                mode: "console",
                logs: capturedLogs // Array of strings
            });
        }

      } catch (err) {
        setOutput({
            mode: "error",
            message: err.message
        });
      } finally {
        // Restore console.log safety check (though our `new Function` scope handled it safely)
        console.log = originalLog; 
        setIsRunning(false);
      }
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const resetValue = starterCode || defaultPlaygroundCode;
    setCode(resetValue);
    if(editorRef.current) editorRef.current.setValue(resetValue);
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#1e1e1e] text-gray-300 font-sans border-l border-gray-800">
      
      {/* TOOLBAR */}
      <div className="flex h-12 bg-[#252526] border-b border-[#1e1e1e] select-none shrink-0">
        <div className="flex items-center px-4 text-sm text-gray-100 min-w-37.5">
          <Code2 size={15} className="mr-2 text-yellow-400" />
          <span className="mr-2 font-medium">
             {testCases ? "solution.js" : "playground.js"}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-end px-4 gap-3">
            <button onClick={handleReset} className="p-1.5 hover:bg-[#3d3d3d] rounded text-gray-400" title="Reset"><RotateCcw size={16} /></button>
            <button onClick={handleCopy} className="p-1.5 hover:bg-[#3d3d3d] rounded text-gray-400" title="Copy">
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
        </div>
      </div>

      {/* EDITOR */}
      <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={setCode}
          onMount={handleEditorDidMount}
          options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
        />
      </div>

      {/* CONSOLE DRAWER */}
      <div className={`bg-[#1e1e1e] border-t border-[#333] transition-all duration-300 flex flex-col ${isConsoleOpen ? 'h-[40%]' : 'h-0'}`}>
        
        {/* Console Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333] shrink-0">
          <div className="flex gap-4 text-xs font-semibold text-gray-400">
             <span>Console Output</span>
             {/* Show Pass/Fail only if in Test Mode */}
             {output?.mode === "test" && (
                <span className={output.passed === output.total ? "text-green-500" : "text-red-500"}>
                    {output.passed}/{output.total} Passed
                </span>
             )}
          </div>
          <button onClick={() => setIsConsoleOpen(false)} className="text-gray-500 hover:text-white"><ChevronDown size={16} /></button>
        </div>
        
        {/* Console Body */}
        <div className="flex-1 p-4 font-mono text-sm overflow-y-auto text-gray-300 bg-[#1e1e1e]">
           {isRunning && <div className="flex items-center gap-2 text-gray-500"><Loader2 size={16} className="animate-spin" /> Running...</div>}

           {/* ERROR DISPLAY */}
           {!isRunning && output?.mode === "error" && (
             <div className="text-red-400 p-3 bg-red-900/10 border border-red-900/30 rounded">{output.message}</div>
           )}

           {/* PLAYGROUND OUTPUT (Just Logs) */}
           {!isRunning && output?.mode === "console" && (
             <div className="space-y-1">
                {output.logs.length === 0 && <span className="text-gray-500 italic">Code ran successfully. No output returned (did you forget console.log?)</span>}
                {output.logs.map((log, i) => (
                    <div key={i} className="border-b border-gray-800 pb-1 mb-1 last:border-0 text-gray-300 whitespace-pre-wrap">
                        <span className="text-gray-500 mr-2 opacity-50">&gt;</span>{log}
                    </div>
                ))}
             </div>
           )}

           {/* TEST CASE OUTPUT (Table) */}
           {!isRunning && output?.mode === "test" && (
             <div className="space-y-3">
               {output.logs.map((log, i) => (
                 <div key={i} className={`p-3 rounded border ${log.status === "Passed" ? "border-green-900/30 bg-green-900/10" : "border-red-900/30 bg-red-900/10"}`}>
                   <div className="flex items-center gap-2 font-bold mb-1">
                     {log.status === "Passed" ? <Check size={16} className="text-green-500"/> : <X size={16} className="text-red-500"/>}
                     <span className={log.status === "Passed" ? "text-green-500" : "text-red-500"}>Test Case {log.id}</span>
                   </div>
                   {log.status !== "Passed" && (
                       <div className="pl-6 text-xs text-gray-400 grid grid-cols-[70px_1fr] gap-1">
                          <span>Input:</span> <span className="text-gray-200">{log.input}</span>
                          <span>Expected:</span> <span className="text-gray-200">{log.expected}</span>
                          <span>Actual:</span> <span className="text-red-300">{log.actual}</span>
                       </div>
                   )}
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="h-14 bg-[#252526] border-t border-[#1e1e1e] flex items-center justify-between px-4 shrink-0 z-10">
        <button onClick={() => setIsConsoleOpen(!isConsoleOpen)} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white"><Terminal size={14} /> Console</button>
        <button onClick={handleRun} disabled={isRunning} className="flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold bg-green-700 hover:bg-green-600 text-white">
          {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} Run
        </button>
      </div>
    </div>
  );
};

export default EditorPane;