import { Routes, Route } from "react-router-dom";
import Navbar from './components/navbar/Navbar';
import Dashboard from './components/main/Dashboard';
import Workspace from './components/editorAndQuestion/Workspace';
import EditorPane from './components/editorAndQuestion/EditorPane';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/explore" element={<Dashboard />} />
        <Route path="/workspace/solve/:id" element={<Workspace />} />
        <Route 
          path="/editor" 
          element={
            <div className="h-[calc(100vh-4rem)] overflow-hidden">
               <EditorPane />
            </div>
          } 
        />
      </Routes>

    </div>
  );
}