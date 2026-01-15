import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, AlertCircle, Sparkles, X, Calendar, Layers, Trophy, Flame, Target } from 'lucide-react';
import axios from 'axios';
import api from "../../api/api";
import ProblemCard from './ProblemCard'; 

// --- Constants ---
const TOPIC_PROGRESSION = [
  "Arrays", "Strings", "Linked Lists", "Stacks", "Queues", "Hashing", "Trees", 
  "Binary Search Trees", "Heaps", "Recursion", "Sorting and Searching", "Bit Manipulation", 
  "Greedy Algorithms", "Backtracking", "Dynamic Programming", "Graphs", "Tries", 
  "Segment Trees", "Disjoint Set Union", "Advanced Graph Algorithms"
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

// --- UI Components ---

// 1. Updated StatBadge for Dark Mode
const StatBadge = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm border border-white/50 dark:border-gray-700 p-3 rounded-2xl shadow-sm min-w-[140px]">
        <div className={`p-2 rounded-xl ${color} shadow-sm`}>
            <Icon size={18} className="text-white" />
        </div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

// 2. Updated Skeleton for Dark Mode (Shimmer effect colors)
const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#0d1117] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse h-56 flex flex-col relative overflow-hidden">
    <div className="flex justify-between mb-6">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      <div className="w-20 h-6 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
    </div>
    <div className="space-y-3 grow">
      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-3/4"></div>
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
    </div>
    <div className="w-full h-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl mt-4"></div>
  </div>
);

// 3. Updated Filter Chips for Dark Mode
const FilterChip = ({ active, label, onClick, icon: Icon }) => (
    <button 
        onClick={onClick}
        className={`whitespace-nowrap pl-3 pr-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border select-none flex items-center gap-2 group ${
            active 
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none ring-2 ring-indigo-100 dark:ring-indigo-900' 
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
    >
        {Icon && <Icon size={15} className={`transition-colors ${active ? "text-indigo-200" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />}
        {label}
    </button>
);

// --- Main Dashboard ---

const Dashboard = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDifficulty, setFilterDifficulty] = useState("All");
    const [filterTopic, setFilterTopic] = useState("All");
    const [filterDay, setFilterDay] = useState("All");

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(api.Code.getAllQuestions);
            const data = Array.isArray(response.data) ? response.data : [];
            setProblems(data);
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

    const availableDays = useMemo(() => {
        const days = new Set(problems.map(p => p.day).filter(d => d !== undefined && d !== null));
        return Array.from(days).sort((a, b) => a - b);
    }, [problems]);

    const filteredProblems = useMemo(() => {
        let result = problems.filter(prob => {
            const matchesSearch = prob.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDiff = filterDifficulty === "All" || prob.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
            const matchesTopic = filterTopic === "All" || prob.topic === filterTopic;
            const matchesDay = filterDay === "All" || prob.day === filterDay;
            return matchesSearch && matchesDiff && matchesTopic && matchesDay;
        });
        return result.sort((a, b) => (a.day || 0) - (b.day || 0));
    }, [problems, searchQuery, filterDifficulty, filterTopic, filterDay]);

    const clearFilters = () => {
        setSearchQuery("");
        setFilterDifficulty("All");
        setFilterTopic("All");
        setFilterDay("All");
    };

    const isFiltered = filterDifficulty !== "All" || filterTopic !== "All" || filterDay !== "All" || searchQuery !== "";

    return (
        // 4. Global Background updated (bg-slate-50 -> dark:bg-gray-950)
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 pb-20 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
            
            {/* 5. Background Decor (Dot Pattern) adapted for Dark Mode */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20" 
                 style={{ 
                    backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', 
                    backgroundSize: '24px 24px', 
                    color: '#CBD5E1' // In CSS modules we would use current text color, but inline needs distinct handling or CSS variable
                 }}>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* --- Hero / Stats Section --- */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight bg-clip-text">
                                Problem Set
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                                Your daily path to algorithmic mastery.
                            </p>
                        </div>
                        
                        {/* 6. Interactive Search Bar Dark Mode */}
                        <div className="relative w-full md:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl leading-5 placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all shadow-sm hover:shadow-md dark:shadow-none"
                                placeholder="Search problems..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <div className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full p-1 transition-colors">
                                        <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-4 overflow-x-auto pb-2 no-scrollbar">
                        <StatBadge icon={Target} label="Total Problems" value={problems.length} color="bg-blue-500 shadow-blue-200 dark:shadow-none" />
                        <StatBadge icon={Flame} label="Easy" value={problems.filter(p => p.difficulty === 'Easy').length} color="bg-emerald-500 shadow-emerald-200 dark:shadow-none" />
                        <StatBadge icon={Layers} label="Medium" value={problems.filter(p => p.difficulty === 'Medium').length} color="bg-amber-500 shadow-amber-200 dark:shadow-none" />
                        <StatBadge icon={Trophy} label="Hard" value={problems.filter(p => p.difficulty === 'Hard').length} color="bg-rose-500 shadow-rose-200 dark:shadow-none" />
                    </div>
                </div>

                {/* --- Control Center (Filters) --- */}
                {/* 7. Control Center Background Dark Mode */}
                <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-800 rounded-3xl p-6 shadow-sm mb-10 ring-1 ring-gray-100 dark:ring-gray-800">
                    <div className="flex flex-col gap-6">
                        
                        {/* Topics Filter */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                    <Layers size={14} /> Topics Progression
                                </span>
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mask-gradient-right">
                                <FilterChip label="All Topics" active={filterTopic === "All"} onClick={() => setFilterTopic("All")} />
                                {TOPIC_PROGRESSION.map(topic => (
                                    <FilterChip key={topic} label={topic} active={filterTopic === topic} onClick={() => setFilterTopic(topic)} />
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                        {/* Bottom Row: Difficulty & Day */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            
                            {/* Difficulty */}
                            <div className="flex-1 overflow-hidden">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-3">
                                    <Filter size={14} /> Difficulty
                                </span>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                    <FilterChip label="All" active={filterDifficulty === "All"} onClick={() => setFilterDifficulty("All")} />
                                    {DIFFICULTIES.map(diff => (
                                        <FilterChip key={diff} label={diff} active={filterDifficulty === diff} onClick={() => setFilterDifficulty(diff)} />
                                    ))}
                                </div>
                            </div>

                            {/* Days */}
                            <div className="flex-1 overflow-hidden">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-3">
                                    <Calendar size={14} /> Day Challenge
                                </span>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                    <FilterChip label="All Days" active={filterDay === "All"} onClick={() => setFilterDay("All")} />
                                    {availableDays.map(day => (
                                        <FilterChip key={day} label={`Day ${day}`} active={filterDay === day} onClick={() => setFilterDay(day)} />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {filterTopic !== "All" ? filterTopic : "All Problems"}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                            Showing {filteredProblems.length} results
                        </p>
                    </div>
                    {isFiltered && (
                        <button 
                            onClick={clearFilters} 
                            className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 transition-all shadow-sm"
                        >
                            <X size={14} className="group-hover:rotate-90 transition-transform" /> 
                            Reset Filters
                        </button>
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6 mb-8 flex flex-col md:flex-row items-center gap-4 text-red-800 dark:text-red-300 shadow-sm">
                        <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="font-bold">Connection Error</h3>
                            <p className="text-sm opacity-90">{error}</p>
                        </div>
                        <button 
                            onClick={fetchQuestions}
                            className="text-sm font-bold bg-white dark:bg-gray-800 px-6 py-2.5 rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all shadow-sm md:ml-auto"
                        >
                            Try Again
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
                                description={prob.description} 
                                difficulty={prob.difficulty} 
                                topic={prob.topic}             
                                day={prob.day}                 
                                views={prob.views || 0}
                            />
                        ))
                    ) : (
                        // 8. Empty State Dark Mode
                        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-full shadow-lg shadow-gray-100 dark:shadow-none mb-6 ring-4 ring-gray-50 dark:ring-gray-700/50">
                                <Sparkles className="text-amber-400" size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No problems found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                                We couldn't find any problems matching "{searchQuery}" with the current filters. Try adjusting your criteria.
                            </p>
                            <button 
                                onClick={clearFilters}
                                className="flex items-center gap-2 text-sm font-bold text-white bg-gray-900 dark:bg-indigo-600 px-8 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-indigo-500 hover:scale-105 hover:shadow-xl transition-all"
                            >
                                <Target size={18} />
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Scrollbar hider (unchanged) */}
            <style dangerouslySetInnerHTML={{__html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
};

export default Dashboard;