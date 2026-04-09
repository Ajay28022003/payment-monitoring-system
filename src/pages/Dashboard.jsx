import { useNavigate } from 'react-router-dom';
import { 
    Users, TrendingUp, TrendingDown, 
    Activity, DollarSign, Calendar, ArrowRight, Building2, Wallet,
    PieChart as PieIcon, BarChart3, ChevronDown, Sparkles
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { dashboardData } from '../mockData/dashboard';

// --- Modern Bento Metric Card ---
function MetricCard({ title, value, type, filterKey }) {
    const navigate = useNavigate();
    
    const config = {
        good: { icon: TrendingUp, colors: 'text-emerald-600 bg-emerald-50 border-emerald-100', hover: 'hover:border-emerald-300' },
        bad: { icon: TrendingDown, colors: 'text-rose-600 bg-rose-50 border-rose-100', hover: 'hover:border-rose-300' },
        neutral: { icon: Activity, colors: 'text-indigo-600 bg-indigo-50 border-indigo-100', hover: 'hover:border-indigo-300' }
    };
    const { icon: Icon, colors, hover } = config[type] || config.neutral;

    return (
        <div 
            onClick={() => filterKey && navigate(`/orders?filter=${filterKey}`)}
            className={`relative overflow-hidden p-5 bg-white border border-slate-200 rounded-2xl transition-all duration-300 ${
                filterKey ? `cursor-pointer ${hover} hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 group` : ''
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
                <div className={`p-2 rounded-xl border ${colors} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon size={16} strokeWidth={2.5} />
                </div>
            </div>
            <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
                {filterKey && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard() {
    // Chart Data
    const monthlyTrendData = [
        { month: 'Jan', sales: 45000, purchase: 32000 },
        { month: 'Feb', sales: 52000, purchase: 41000 },
        { month: 'Mar', sales: 48000, purchase: 38000 },
        { month: 'Apr', sales: 61000, purchase: 45000 },
    ];

    const collectionStatusData = [
        { name: 'Received', value: 65, color: '#4f46e5' }, // Indigo
        { name: 'Pending', value: 25, color: '#f59e0b' },  // Amber
        { name: 'Doubtful', value: 10, color: '#e11d48' }, // Rose
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        Dashboard Overview <Sparkles size={20} className="text-indigo-500" />
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Consolidated financial and operational metrics.</p>
                </div>
                
                <div className="relative group">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
                        <Calendar size={16} className="text-slate-400" />
                        <select className="appearance-none bg-transparent outline-none cursor-pointer pr-4">
                            <option>FY 2026 </option>
                            <option>FY 2025</option>
                            <option>All Time</option>
                        </select>
                        <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Top Bento Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left Stack (Customers & Staff) - Span 3 */}
                <div className="md:col-span-3 flex flex-col gap-6">
                    <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Building2 size={20} /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Clients</p>
                            <p className="text-2xl font-extrabold text-slate-900">{dashboardData.general.totalCustomers}</p>
                        </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Users size={20} /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Staff</p>
                            <p className="text-2xl font-extrabold text-slate-900">{dashboardData.general.totalStaff}</p>
                        </div>
                    </div>
                </div>
                
                {/* Center Hero Card (Sales) - Span 5 */}
                <div className="md:col-span-5 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-2xl p-6 flex flex-col justify-between shadow-lg shadow-indigo-900/20 group">
                    {/* Decorative Background Blob */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors duration-500"></div>
                    
                    <div className="relative z-10 flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-white/10 text-white rounded-xl border border-white/20 backdrop-blur-sm"><Wallet size={20} /></div>
                        <p className="text-sm font-bold text-indigo-100 uppercase tracking-widest">Overall Sales Pending</p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-4xl font-black text-white tracking-tight">{dashboardData.sales.find(s => s.title.includes('Overall')).value}</p>
                        {/* <p className="text-sm font-medium text-indigo-200 mt-2 flex items-center gap-1">
                            <TrendingUp size={14} className="text-emerald-400" /> +12.5% from last month
                        </p> */}
                    </div>
                </div>

                {/* Right Hero Card (Purchases) - Span 4 */}
                <div className="md:col-span-4 relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm group hover:border-rose-200 transition-colors">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-50 rounded-tl-full -z-0 group-hover:scale-110 transition-transform duration-500"></div>
                    
                    <div className="relative z-10 flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100"><DollarSign size={20} /></div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Overall Purchase Due</p>
                    </div>
                    <div className="relative z-10">
                        <p className="text-4xl font-black text-slate-900 tracking-tight">{dashboardData.purchases.find(p => p.title.includes('Overall')).value}</p>
                        {/* <p className="text-sm font-medium text-slate-400 mt-2">Awaiting vendor clearance</p> */}
                    </div>
                </div>
            </div>

            {/* Middle Row: Bento Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-50/50 border border-slate-200 p-6 rounded-3xl">
                    <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <TrendingUp size={16} className="text-indigo-600" /> Sales Breakdown
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dashboardData.sales.filter(m => !m.title.includes('Overall')).map((m, i) => <MetricCard key={i} {...m} />)}
                    </div>
                </div>
                <div className="bg-slate-50/50 border border-slate-200 p-6 rounded-3xl">
                    <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <TrendingDown size={16} className="text-rose-600" /> Purchase Breakdown
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dashboardData.purchases.filter(m => !m.title.includes('Overall')).map((m, i) => <MetricCard key={i} {...m} />)}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 size={18} className="text-indigo-600" />
                            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Cashflow Trend</h2>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: 600, paddingBottom: '20px'}} />
                                <Bar dataKey="sales" name="Inflow (Sales)" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={28} />
                                <Bar dataKey="purchase" name="Outflow (Purchase)" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={28} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                        <PieIcon size={18} className="text-indigo-600" />
                        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Collection Status</h2>
                    </div>
                    <div className="h-[280px] w-full relative">
                        {/* Center text inside donut chart */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                            <span className="text-3xl font-black text-slate-900">65%</span>
                            <span className="text-xs font-bold text-slate-500 uppercase">Received</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={collectionStatusData} innerRadius={65} outerRadius={85} paddingAngle={6} dataKey="value" stroke="none">
                                    {collectionStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: 600}} verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}