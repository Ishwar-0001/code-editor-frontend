import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Search, Filter,  Layers, Flame, Target, 
  ChevronRight, ChevronLeft, CheckCircle2, Code2, 
  Zap, LayoutGrid, List as ListIcon,  ArrowUpRight
} from 'lucide-react';
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
const ALL_DAYS = Array.from({ length: 100 }, (_, i) => i + 1);

// --- Components ---

const StatCard = React.memo(({ icon: Icon, label, value, colorClass, bgClass }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300 w-full">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bgClass}`}>
            <Icon size={20} className={`sm:w-[22px] sm:h-[22px] ${colorClass}`} />
        </div>
        <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">{label}</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">{value}</span>
        </div>
    </div>
));

const DayStrip = React.memo(({ availableDays, selectedDay, onSelectDay }) => {
    const scrollRef = useRef(null);

    const scroll = useCallback((direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
        }
    }, []);

    return (
        // Changed top-16 to top-0 for better mobile real estate, added z-30
        <div className="relative group w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-all">
            {/* Scroll Buttons - Hidden on mobile to allow swipe, visible on md+ */}
            <button onClick={() => scroll('left')} className="hidden md:flex absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 items-center text-slate-400 hover:text-indigo-600 transition-colors">
                <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="hidden md:flex absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-white via-white to-transparent dark:from-slate-900 dark:via-slate-900 items-center text-slate-400 hover:text-indigo-600 transition-colors">
                <ChevronRight size={20} />
            </button>

            <div ref={scrollRef} className="flex gap-2 overflow-x-auto no-scrollbar px-4 sm:px-10 py-3 items-center scroll-smooth">
                <button
                    onClick={() => onSelectDay("All")}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all whitespace-nowrap ${
                        selectedDay === "All"
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200 dark:shadow-none"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                >
                    <Layers size={14} /> <span>All</span>
                </button>
                
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 flex-shrink-0"></div>

                {ALL_DAYS.map(day => {
                    const hasContent = availableDays.includes(day);
                    const isSelected = selectedDay === day;
                    
                    if (!hasContent && !isSelected && day > 100) return null;

                    return (
                        <button
                            key={day}
                            onClick={() => onSelectDay(day)}
                            className={`flex-shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold transition-all relative border ${
                                isSelected
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 transform scale-105"
                                : hasContent
                                    ? "bg-white border-emerald-200 text-slate-700 hover:border-emerald-400 hover:shadow-sm dark:bg-slate-800 dark:border-emerald-900/50 dark:text-slate-200"
                                    : "bg-slate-50/50 border-transparent text-slate-300 dark:bg-slate-800/50 dark:text-slate-600"
                            }`}
                        >
                            <span className="opacity-70">Day</span>
                            <span className="text-sm leading-none">{day}</span>
                            {hasContent && !isSelected && (
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white dark:border-slate-800"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

// --- Internal List Item Component (For List View) ---
const ProblemListItem = ({ title, difficulty, topic, day, _id }) => {
    const diffColor = 
        difficulty?.toLowerCase() === 'easy' ? 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900' :
        difficulty?.toLowerCase() === 'medium' ? 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900' :
        'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-900';

    return (
        <div className="group flex items-center p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex-1 flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                    <Code2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors truncate pr-2">{title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${diffColor}`}>{difficulty}</span>
                        <span className="text-[10px] text-slate-400 hidden xs:inline">•</span>
                        <span className="text-[10px] text-slate-500 font-medium truncate">{topic}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6 pl-2">
                {day && (
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Day</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{day}</span>
                    </div>
                )}
                <button className="w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <ArrowUpRight size={18} />
                </button>
            </div>
        </div>
    );
};

// --- Main Dashboard ---

const Dashboard = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    
    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDifficulty, setFilterDifficulty] = useState("All");
    const [filterTopic, setFilterTopic] = useState("All");
    const [filterDay, setFilterDay] = useState("All"); 

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(api.Code.getAllQuestions);
            const data = Array.isArray(response.data) ? response.data : 
                         (response.data && Array.isArray(response.data.questions)) ? response.data.questions : []; 
            setProblems(data);
        } catch (err) {
            console.error("Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQuestions(); }, []);

    const availableDays = useMemo(() => {
        const days = new Set();
        problems.forEach(p => { if (p.day) days.add(parseInt(p.day)); });
        return Array.from(days).sort((a, b) => a - b);
    }, [problems]);

    const filteredProblems = useMemo(() => {
        return problems.filter(prob => {
            const safeTitle = prob.title?.toLowerCase() || "";
            const safeDiff = prob.difficulty?.toLowerCase() || "";
            return safeTitle.includes(searchQuery.toLowerCase()) &&
                   (filterDifficulty === "All" || safeDiff === filterDifficulty.toLowerCase()) &&
                   (filterTopic === "All" || prob.topic === filterTopic) &&
                   (filterDay === "All" || parseInt(prob.day) === parseInt(filterDay));
        }).sort((a, b) => (a.day || 0) - (b.day || 0));
    }, [problems, searchQuery, filterDifficulty, filterTopic, filterDay]);

    const stats = useMemo(() => ({
        total: problems.length,
        easy: problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length,
        medium: problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length,
        hard: problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length
    }), [problems]);

    const clearFilters = () => {
        setSearchQuery("");
        setFilterDifficulty("All");
        setFilterTopic("All");
        setFilterDay("All");
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 selection:text-indigo-800 pb-20">
  
            <div className="max-w-7xl mx-auto">
                
                {/* --- Hero Stats Section --- */}
                <div className="px-4 sm:px-6 py-6 sm:py-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6">Hello, Coder! 👋</h1>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <StatCard icon={Target} label="Total" value={stats.total} bgClass="bg-blue-50 dark:bg-blue-900/20" colorClass="text-blue-600" />
                        <StatCard icon={CheckCircle2} label="Easy" value={stats.easy} bgClass="bg-emerald-50 dark:bg-emerald-900/20" colorClass="text-emerald-600" />
                        <StatCard icon={Zap} label="Medium" value={stats.medium} bgClass="bg-amber-50 dark:bg-amber-900/20" colorClass="text-amber-600" />
                        <StatCard icon={Flame} label="Hard" value={stats.hard} bgClass="bg-rose-50 dark:bg-rose-900/20" colorClass="text-rose-600" />
                    </div>
                </div>

                {/* --- Timeline Strip --- */}
                <DayStrip availableDays={availableDays} selectedDay={filterDay} onSelectDay={setFilterDay} />

                <div className="px-4 sm:px-6 py-6">
                    
                    {/* --- Filter Toolbar --- */}
                    {/* Changed to flex-col on mobile, row on large screens */}
                    <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between mb-6">
                        
                        {/* Search & Topic - Stack on mobile */}
                        <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-3">
                            <div className="relative group w-full sm:min-w-[280px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="relative w-full sm:min-w-[200px]">
                                <select 
                                    value={filterTopic}
                                    onChange={(e) => setFilterTopic(e.target.value)}
                                    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    <option value="All">All Topics</option>
                                    {TOPIC_PROGRESSION.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Difficulty & View Toggle - Flex on mobile, row on large */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end w-full xl:w-auto gap-3 sm:gap-4">
                            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center flex-1 sm:flex-none justify-between sm:justify-start overflow-x-auto">
                                {["All", "Easy", "Medium", "Hard"].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setFilterDifficulty(d)}
                                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                            filterDifficulty === d 
                                            ? 'bg-white dark:bg-slate-700 text-slate-900 shadow-sm' 
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg shadow-sm">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        <ListIcon size={18} />
                                    </button>
                                </div>

                                {(searchQuery || filterDifficulty !== "All" || filterTopic !== "All" || filterDay !== "All") && (
                                    <button onClick={clearFilters} className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors whitespace-nowrap">
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- Content Area --- */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                                {Array(8).fill(0).map((_, i) => (
                                    <div key={i} className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 animate-pulse ${viewMode === 'grid' ? 'h-48' : 'h-20'}`}></div>
                                ))}
                            </div>
                        ) : filteredProblems.length > 0 ? (
                            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                                {filteredProblems.map((prob) => (
                                    viewMode === 'grid' ? (
                                        <ProblemCard 
                                            key={prob._id} 
                                            {...prob}
                                            id={prob._id}
                                        />
                                    ) : (
                                        <ProblemListItem 
                                            key={prob._id}
                                            {...prob}
                                        />
                                    )
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 mx-4 sm:mx-0">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Search className="text-slate-300" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">No problems found</h3>
                                <p className="text-slate-500 text-sm mb-4">Try adjusting your filters or search terms.</p>
                                <button onClick={clearFilters} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default Dashboard;