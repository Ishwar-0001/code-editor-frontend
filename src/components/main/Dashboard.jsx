import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Filter, AlertCircle, Sparkles, X, Calendar, Layers, Trophy, Flame, Target, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
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

// --- UI Sub-Components ---

const StatBadge = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl shadow-sm min-w-[140px] transition-transform hover:scale-105">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
            <Icon size={20} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{label}</p>
            <p className="text-xl font-extrabold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse h-64 flex flex-col">
    <div className="flex justify-between mb-6">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
    </div>
    <div className="space-y-3 grow">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-2/3"></div>
    </div>
  </div>
);

const FilterChip = ({ active, label, onClick, icon: Icon }) => (
    <button 
        onClick={onClick}
        className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border select-none flex items-center gap-2 ${
            active 
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none' 
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-gray-700'
        }`}
    >
        {Icon && <Icon size={14} className={active ? "text-indigo-200" : "text-gray-400"} />}
        {label}
    </button>
);

// --- Day Strip Component (New) ---
const DayStrip = ({ availableDays, selectedDay, onSelectDay }) => {
    const scrollRef = useRef(null);

    // Create an array of 100 days
    const allDays = Array.from({ length: 100 }, (_, i) => i + 1);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group mb-8">
            {/* Scroll Buttons */}
            <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0">
                <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} />
            </button>

            {/* Scroll Area */}
            <div 
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto no-scrollbar py-4 px-2 mask-gradient-sides scroll-smooth"
            >
                <button
                    onClick={() => onSelectDay("All")}
                    className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${
                        selectedDay === "All"
                        ? "border-indigo-500 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-105"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-indigo-300"
                    }`}
                >
                    <Layers size={20} />
                    <span className="text-xs font-bold">All</span>
                </button>

                {allDays.map(day => {
                    const hasContent = availableDays.includes(day);
                    const isSelected = selectedDay === day;
                    
                    return (
                        <button
                            key={day}
                            onClick={() => onSelectDay(day)}
                            className={`relative flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                                isSelected
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-md scale-105 z-10"
                                : hasContent
                                    ? "border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-emerald-400"
                                    : "border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-gray-300 dark:text-gray-600"
                            }`}
                        >
                            <span className="text-xs font-medium uppercase">Day</span>
                            <span className="text-xl font-extrabold">{day}</span>
                            
                            {/* Dot indicator if day has content */}
                            {hasContent && (
                                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-500' : 'bg-emerald-400'}`}></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Dashboard ---

const Dashboard = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDifficulty, setFilterDifficulty] = useState("All");
    const [filterTopic, setFilterTopic] = useState("All");
    const [filterDay, setFilterDay] = useState("All"); // Can be "All" or number (e.g. 5)

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(api.Code.getAllQuestions);
            // Ensure data is array
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

    // Extract unique days available in the database
    const availableDays = useMemo(() => {
        const days = new Set();
        problems.forEach(p => {
            if (p.day) days.add(parseInt(p.day)); // Ensure we store as numbers
        });
        return Array.from(days).sort((a, b) => a - b);
    }, [problems]);

    // Main Filtering Logic
    const filteredProblems = useMemo(() => {
        let result = problems.filter(prob => {
            const matchesSearch = prob.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDiff = filterDifficulty === "All" || prob.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
            const matchesTopic = filterTopic === "All" || prob.topic === filterTopic;
            
            // CRITICAL FIX: Ensure type safety (string '5' == number 5)
            const matchesDay = filterDay === "All" || parseInt(prob.day) === parseInt(filterDay);

            return matchesSearch && matchesDiff && matchesTopic && matchesDay;
        });
        // Sort by Day first, then Difficulty
        return result.sort((a, b) => (a.day || 0) - (b.day || 0));
    }, [problems, searchQuery, filterDifficulty, filterTopic, filterDay]);

    const clearFilters = () => {
        setSearchQuery("");
        setFilterDifficulty("All");
        setFilterTopic("All");
        setFilterDay("All");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 pb-20 transition-colors duration-300">
            
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20" 
                 style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px', color: '#94a3b8' }}>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                                Challenge
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            100 Days of Code
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                            Consistency is key. Track your daily algorithmic progress.
                        </p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full md:w-64 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-gray-500">Coverage</span>
                            <span className="text-indigo-600">{availableDays.length}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(availableDays.length, 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">Days with active problems</p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/50 dark:border-gray-800 rounded-3xl p-6 shadow-sm mb-8">
                    
                    {/* 1. Day Challenge Strip (The Main UI Upgrade) */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                                <Calendar size={14} /> Select Day
                            </span>
                            {filterDay !== "All" && (
                                <span className="text-sm font-bold text-indigo-600">
                                    Viewing Day {filterDay}
                                </span>
                            )}
                        </div>
                        <DayStrip 
                            availableDays={availableDays} 
                            selectedDay={filterDay} 
                            onSelectDay={setFilterDay} 
                        />
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-gray-800 w-full mb-6"></div>

                    {/* 2. Secondary Filters (Search, Diff, Topic) */}
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                        
                        {/* Search */}
                        <div className="relative w-full lg:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
                                placeholder="Search by title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {DIFFICULTIES.map(diff => (
                                <FilterChip key={diff} label={diff} active={filterDifficulty === diff} onClick={() => setFilterDifficulty(filterDifficulty === diff ? "All" : diff)} />
                            ))}
                        </div>

                        {/* Topic Dropdown (Optional if space is tight) */}
                         <select 
                            value={filterTopic}
                            onChange={(e) => setFilterTopic(e.target.value)}
                            className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="All">All Topics</option>
                            {TOPIC_PROGRESSION.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>

                        {/* Reset Button */}
                        {(filterDifficulty !== "All" || filterTopic !== "All" || searchQuery !== "" || filterDay !== "All") && (
                            <button onClick={clearFilters} className="ml-auto text-sm text-red-500 font-bold hover:underline flex items-center gap-1">
                                <X size={14} /> Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : filteredProblems.length > 0 ? (
                        filteredProblems.map((prob, index) => (
                            <ProblemCard 
                                key={prob._id || index} 
                                {...prob}
                                // Ensure these props are passed if ProblemCard expects them directly
                                id={prob._id}
                                title={prob.title}
                                description={prob.description}
                                difficulty={prob.difficulty}
                                topic={prob.topic}
                                day={prob.day}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                                {filterDay !== "All" ? <Calendar size={40} className="text-gray-400" /> : <Sparkles size={40} className="text-amber-400" />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {filterDay !== "All" ? `Day ${filterDay} is empty` : "No problems found"}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                {filterDay !== "All" 
                                    ? "You haven't added any problems for this day of the challenge yet." 
                                    : `We couldn't find any problems matching "${searchQuery}".`}
                            </p>
                            {filterDay !== "All" && (
                                <button onClick={() => setFilterDay("All")} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                                    View All Days
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>
            
            {/* CSS for hiding scrollbars but keeping functionality */}
            <style dangerouslySetInnerHTML={{__html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default Dashboard;