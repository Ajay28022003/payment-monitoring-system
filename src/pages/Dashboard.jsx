import { Users, UserSquare2, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, Activity, DollarSign, Calendar } from 'lucide-react';
import { dashboardData } from '../mockData/dashboard';

// --- Professional Mini Sparkline (SVG) ---
// This adds "life" to the cards without needing heavy chart libraries
const MiniSparkline = ({ color }) => (
    <svg className={`w-16 h-8 ${color} opacity-40`} viewBox="0 0 100 40">
        <path
            d="M0 35 Q 20 10, 40 25 T 80 5 T 100 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
        />
    </svg>
);

// --- Premium Bento Stat Card ---
function BentoCard({ title, value, type, subtitle }) {
    const config = {
        good: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500', trend: '+12%' },
        bad: { icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-500', trend: '-4%' },
        neutral: { icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-500', trend: 'Stable' }
    };
    const { icon: Icon, color, bg, trend } = config[type] || config.neutral;

    return (
        <div className="group relative bg-white border border-gray-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden">
            {/* Glossy Overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent opacity-50 pointer-events-none" />

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
                </div>
                <div className={`p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:${color} group-hover:bg-white transition-all duration-300 border border-transparent group-hover:border-gray-100 group-hover:shadow-sm`}>
                    <Icon size={18} />
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold ${color} px-2 py-0.5 rounded-full bg-gray-50`}>{trend}</span>
                    <span className="text-[11px] text-gray-400 font-medium">vs last month</span>
                </div>
                <MiniSparkline color={color} />
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <div className="space-y-8 max-w-[1600px] mx-auto animate-in slide-in-from-bottom-6 fade-in duration-1000">

            {/* Header with Glass Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-gray-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight">Financial Hub</h1>
                    <p className="text-gray-400 mt-2 text-sm max-w-md leading-relaxed">
                        Real-time monitoring of <span className="text-white font-medium">Sales, Purchases,</span> and <span className="text-white font-medium">Cashflow</span> metrics.
                    </p>
                </div>

                <div className="flex gap-3 relative z-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-sm font-semibold">Live System</span>
                        </div>
                    </div>
                    <div className="bg-indigo-600 px-5 py-3 rounded-2xl shadow-lg shadow-indigo-900/40 flex items-center gap-3">
                        <Calendar size={18} />
                        <span className="text-sm font-bold">April 2026</span>
                    </div>
                </div>

                {/* Background Decorative Circles */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20" />
                <div className="absolute -left-10 -top-10 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10" />
            </div>

            {/* Hero Metrics - The "Heavy" Bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Stat Card - Spans 2 */}
                <div className="lg:col-span-2 relative overflow-hidden bg-white border border-gray-200/60 rounded-[2rem] p-8 group shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="relative z-10 flex justify-between h-full">
                        <div className="space-y-6 flex flex-col justify-between">
                            <div>
                                <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    Net Cash Position {/* Changed from Primary Liquidity */}
                                </h2>
                                <p className="text-5xl font-bold text-gray-900 tracking-tighter">
                                    AED 342,900
                                </p>
                                <p className="text-sm text-gray-500 mt-2 font-medium flex items-center gap-1">
                                    <TrendingUp size={14} className="text-emerald-500" />
                                    <span className="text-emerald-600 font-bold">+12.4%</span>
                                    increase in actual collections this month
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-colors">View Details</button>
                                <button className="px-5 py-2.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">Generate Audit</button>
                            </div>
                        </div>
                        <div className="hidden md:block w-1/2 bg-gray-50 rounded-2xl border border-gray-100 p-4 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity size={80} className="text-indigo-100" />
                            </div>
                            {/* Mock Internal Data List */}
                            <div className="space-y-3 relative z-10">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                                        <div className="w-8 h-8 rounded bg-gray-50 animate-pulse" />
                                        <div className="w-24 h-2 bg-gray-100 rounded animate-pulse" />
                                        <div className="w-12 h-2 bg-indigo-50 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Callout Cards */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-200">
                        <div className="flex justify-between items-center mb-4">
                            <Users size={24} className="text-indigo-200" />
                            <ArrowUpRight size={20} />
                        </div>
                        <p className="text-[11px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Total Customers</p>
                        <p className="text-3xl font-bold tracking-tight">{dashboardData.general.totalCustomers}</p>
                    </div>
                    <div className="bg-white border border-gray-200/60 rounded-[2rem] p-6 shadow-sm hover:border-sky-200 transition-colors group">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg group-hover:bg-sky-600 group-hover:text-white transition-colors">
                                <UserSquare2 size={24} />
                            </div>
                            <span className="text-[11px] font-bold text-sky-600">+2 New</span>
                        </div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Staff</p>
                        <p className="text-3xl font-bold text-gray-900 tracking-tight">{dashboardData.general.totalStaff}</p>
                    </div>
                </div>
            </div>

            {/* Grid Layout for Detailed Sales & Purchase */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 pt-6">

                {/* Sales Overview */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                            <DollarSign size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Receivables Engine</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {dashboardData.sales.map((metric, idx) => (
                            <BentoCard key={idx} {...metric} />
                        ))}
                    </div>
                </section>

                {/* Purchase Overview */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100">
                            <Activity size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Payables Pipeline</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {dashboardData.purchases.map((metric, idx) => (
                            <BentoCard key={idx} {...metric} />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}