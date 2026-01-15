import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, AlertCircle, Sparkles, Code2 } from 'lucide-react';
import ProblemCard from './ProblemCard';
import api from "../../api/api";
import axios from 'axios';

// --- Sub-Components ---

const SkeletonCard = () => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-64 flex flex-col">
    <div className="flex justify-between mb-4">
      <div className="w-16 h-6 bg-gray-100 rounded-md"></div>
      <div className="w-8 h-6 bg-gray-100 rounded-md"></div>
    </div>
    <div className="space-y-3 grow">
      <div className="h-6 bg-gray-100 rounded w-3/4"></div>
      <div className="h-4 bg-gray-100 rounded w-full"></div>
    </div>
    <div className="h-8 bg-gray-100 rounded w-24 mt-4 ml-auto"></div>
  </div>
);

const FilterBadge = ({ active, label, onClick }) => (
    <button 
        onClick={onClick}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border select-none ${
            active 
            ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200' 
            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
        }`}
    >
        {label}
    </button>
);

// --- Main Dashboard ---

const Dashboard = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // UI States
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDifficulty, setFilterDifficulty] = useState("All");

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(api.Code.getAllQuestions);
            setProblems(response.data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const filteredProblems = useMemo(() => {
        return problems.filter(prob => {
            const matchesSearch = prob.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDiff = filterDifficulty === "All" || prob.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
            return matchesSearch && matchesDiff;
        });
    }, [problems, searchQuery, filterDifficulty]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 pb-20 selection:bg-blue-100 selection:text-blue-900">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Mobile Scrollable Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar mask-linear-fade">
                        <div className="flex items-center gap-2 pr-4">
                            <Filter size={16} className="text-gray-400 shrink-0" />
                            {["All", "Easy", "Medium", "Hard"].map(diff => (
                                <FilterBadge 
                                    key={diff} 
                                    label={diff} 
                                    active={filterDifficulty === diff} 
                                    onClick={() => setFilterDifficulty(diff)} 
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="hidden sm:block text-sm text-gray-500 font-medium">
                        Showing {filteredProblems.length} Problems
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-4 mb-8 flex flex-col sm:flex-row items-center gap-4 text-red-800">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-medium text-center sm:text-left">{error}</span>
                        <button 
                            onClick={fetchQuestions}
                            className="text-sm font-bold bg-white px-4 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 transition-colors shadow-sm ml-auto"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : filteredProblems.length > 0 ? (
                        filteredProblems.map((prob, index) => (
                            <ProblemCard 
                                key={prob._id || index} 
                                id={prob._id} 
                                title={prob.title} 
                                difficulty={prob.difficulty} 
                                views={prob.views || 0}
                            />
                        ))
                    ) : (
                        // Empty State
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <Sparkles className="text-amber-400" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No problems found</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">We couldn't find any problems matching your search criteria.</p>
                            <button 
                                onClick={() => {setSearchQuery(""); setFilterDifficulty("All");}}
                                className="text-sm font-semibold text-white bg-gray-900 px-6 py-2.5 rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;