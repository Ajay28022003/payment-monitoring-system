import { useNavigate } from 'react-router-dom';
import { 
    Users, TrendingUp, TrendingDown, 
    Activity, DollarSign, Calendar, ArrowRight, Building2, Wallet,
    PieChart as PieIcon, BarChart3, ChevronDown
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { dashboardData } from '../mockData/dashboard';

// Compact & High-Visibility Metric Card
function MetricCard({ title, value, type, filterKey }) {
    const navigate = useNavigate();
    
    const config = {
        good: { icon: TrendingUp, colors: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
        bad: { icon: TrendingDown, colors: 'text-rose-700 bg-rose-50 border-rose-200' },
        neutral: { icon: Activity, colors: 'text-indigo-700 bg-indigo-50 border-indigo-200' }
    };
    const { icon: Icon, colors } = config[type] || config.neutral;

    return (
        <div 
            onClick={() => filterKey && navigate(`/orders?filter=${filterKey}`)}
            className={`p-4 bg-white border border-slate-200 rounded-lg transition-all ${
                filterKey ? 'cursor-pointer hover:border-indigo-400 hover:shadow-sm group' : ''
            }`}
        >
            <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-semibold text-slate-600">{title}</p>
                <div className={`p-1.5 rounded-md border ${colors}`}>
                    <Icon size={14} strokeWidth={2.5} />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-slate-900 leading-none tracking-tight">{value}</p>
                {filterKey && <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />}
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
        { name: 'Received', value: 65, color: '#059669' },
        { name: 'Pending', value: 25, color: '#d97706' },
        { name: 'Doubtful', value: 10, color: '#dc2626' },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            
            {/* Standard Header - Updated for Overall Context */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                    {/* Changed from April 2026 to a Year-to-Date / Overall description */}
                    <p className="text-sm font-medium text-slate-500">Consolidated financial and operational metrics (Year-to-Date).</p>
                </div>
                
                {/* Upgraded Date Selector */}
                <div className="relative group">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                        <Calendar size={16} className="text-slate-500" />
                        <select className="appearance-none bg-transparent outline-none cursor-pointer pr-4">
                            <option>FY 2026 (YTD)</option>
                            <option>FY 2025</option>
                            <option>All Time</option>
                        </select>
                        <ChevronDown size={14} className="text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Top Row: Overall Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Customers" value={dashboardData.general.totalCustomers} type="neutral" />
                <MetricCard title="Active Staff" value={dashboardData.general.totalStaff} type="neutral" />
                
                <div className="bg-indigo-600 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-indigo-700 text-indigo-100 rounded-md border border-indigo-500"><Wallet size={14} /></div>
                        <p className="text-sm font-semibold text-indigo-50">Overall Sales Pending</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{dashboardData.sales.find(s => s.title.includes('Overall')).value}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-rose-50 text-rose-700 rounded-md border border-rose-100"><DollarSign size={14} /></div>
                        <p className="text-sm font-semibold text-slate-600">Overall Purchase Due</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{dashboardData.purchases.find(p => p.title.includes('Overall')).value}</p>
                </div>
            </div>

            {/* Middle Row: Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={16} className="text-indigo-600" />
                        <h2 className="text-base font-bold text-slate-900">Monthly Cashflow Trend</h2>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                                <Tooltip contentStyle={{borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px'}} />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{fontSize: '12px', paddingBottom: '15px'}} />
                                <Bar dataKey="sales" name="Sales" fill="#4f46e5" radius={[3, 3, 0, 0]} barSize={24} />
                                <Bar dataKey="purchase" name="Purchase" fill="#f43f5e" radius={[3, 3, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <PieIcon size={16} className="text-emerald-600" />
                        <h2 className="text-base font-bold text-slate-900">Collection Status</h2>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={collectionStatusData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                                    {collectionStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" wrapperStyle={{fontSize: '11px'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Detailed Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h2 className="text-base font-bold text-slate-800 px-1">Sales Breakdown</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {dashboardData.sales.filter(m => !m.title.includes('Overall')).map((m, i) => <MetricCard key={i} {...m} />)}
                    </div>
                </div>
                <div className="space-y-3">
                    <h2 className="text-base font-bold text-slate-800 px-1">Purchase Breakdown</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {dashboardData.purchases.filter(m => !m.title.includes('Overall')).map((m, i) => <MetricCard key={i} {...m} />)}
                    </div>
                </div>
            </div>

        </div>
    );
}