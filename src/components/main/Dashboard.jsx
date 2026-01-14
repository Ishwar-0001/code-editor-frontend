// Dashboard.jsx
import React from 'react';
import { LayoutGrid, MessageSquare, Bell, Circle } from 'lucide-react';
import ProblemCard from './ProblemCard';
import { problems } from './data';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-[#f3f6f9] p-8 font-sans">
            {/* Top Header Section */}
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Programs Dashboard</h1>
                <div className="flex items-center gap-10 text-sm font-medium text-gray-500">

                    <div className="flex items-center gap-2">
                        <LayoutGrid size={18} />
                        <span className="font-bold text-gray-800">Dashboards</span>
                    </div>
                </div>
            </header>

            {/* Sub Navigation */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <button className="px-6 py-2 bg-white rounded-lg shadow-sm text-sm font-semibold text-gray-600 border border-gray-100">
                        Programs Dashboard
                    </button>

                </div>

            </div>

            {/* Problems Grid */}
      {/* // In Dashboard.jsx, update the section: */}
            <section className="mb-12">
                {/* Changed from 3 columns to 6 columns for a smaller card appearance */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {problems.map((prob) => (
                        <ProblemCard key={prob.id} {...prob} />
                    ))}
                </div>
            </section>

        </div>
    );
};

// Helper component for the bottom section
const ProgressCard = ({ title, stats, badge = "Array" }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-800">{title}</h4>
        </div>
        <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded bg-gray-200 text-[10px] flex items-center justify-center font-bold text-gray-400 uppercase">C</div>
            <span className="text-sm font-semibold text-gray-600">{stats}</span>
        </div>
        <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-500">Agenba</span>
            <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-500">{badge}</span>
            <span className="px-4 py-1.5 bg-orange-600 text-white rounded-full text-xs font-semibold ml-auto">IB Solved</span>
        </div>
    </div>
);

export default Dashboard;