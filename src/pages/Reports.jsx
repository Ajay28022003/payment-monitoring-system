import { useState, useMemo } from 'react';
import { 
  Download, Filter, FileSpreadsheet, RefreshCw, 
  ChevronDown, Calendar, ArrowRight, BarChart3, 
  Search, Info, Database, SlidersHorizontal, X,
  CheckCircle2, DollarSign, User, Building2, MapPin
} from 'lucide-react';
import { mockOrders } from '../mockData/orders';

export default function Reports() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '', dateTo: '',
    customer: '', partner: '',
    employee: '', invoiceNo: '',
    status: '', country: '',
    minTotal: '', maxTotal: '',
    minDue: '', maxDue: '',
    product: '', followUpFrom: '',
    remarks: ''
  });

  const handleReset = () => {
    setFilters({
      dateFrom: '', dateTo: '', customer: '', partner: '',
      employee: '', invoiceNo: '', status: '', country: '',
      minTotal: '', maxTotal: '', minDue: '', maxDue: '',
      product: '', followUpFrom: '', remarks: ''
    });
  };

  // --- 1. THE AUDIT ENGINE (Dynamic Filtering Logic) ---
  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      // Date Range
      if (filters.dateFrom && order.invoiceDate < filters.dateFrom) return false;
      if (filters.dateTo && order.invoiceDate > filters.dateTo) return false;

      // Exact Matches (Dropdowns)
      if (filters.status && order.status?.toUpperCase() !== filters.status.toUpperCase()) return false;
      if (filters.country && order.country !== filters.country) return false;
      if (filters.employee && order.employee !== filters.employee) return false;
      if (filters.product && !order.products?.includes(filters.product)) return false;

      // Partial Text Matches (Case Insensitive)
      if (filters.invoiceNo && !order.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase())) return false;
      if (filters.customer && !order.customer.toLowerCase().includes(filters.customer.toLowerCase())) return false;
      if (filters.partner && !order.partner?.toLowerCase().includes(filters.partner.toLowerCase())) return false;
      if (filters.remarks && !order.remarks?.toLowerCase().includes(filters.remarks.toLowerCase()) && !order.description?.toLowerCase().includes(filters.remarks.toLowerCase())) return false;

      // Financial Ranges
      if (filters.minTotal && order.grandTotal < Number(filters.minTotal)) return false;
      if (filters.maxTotal && order.grandTotal > Number(filters.maxTotal)) return false;
      if (filters.minDue && order.dueAmount < Number(filters.minDue)) return false;
      if (filters.maxDue && order.dueAmount > Number(filters.maxDue)) return false;

      // Follow-up Date (Matches exact or later)
      if (filters.followUpFrom && order.nextFollowUp < filters.followUpFrom) return false;

      return true; // If it passes all active filters, keep it!
    });
  }, [filters, mockOrders]); // Re-run whenever filters or data changes

  // --- 2. DYNAMIC METRICS CALCULATION ---
  const metrics = useMemo(() => {
    const total = filteredOrders.length;
    const cumulative = filteredOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    const outstanding = filteredOrders.reduce((sum, order) => sum + (order.dueAmount || 0), 0);

    return { total, cumulative, outstanding };
  }, [filteredOrders]);


  const handleExport = () => {
    const activeFilters = Object.entries(filters).filter(([_, v]) => v !== '');
    alert(`Generating .xlsx file...\nExporting ${filteredOrders.length} filtered records.\nFilters applied: ${activeFilters.length > 0 ? activeFilters.length : 'None'}`);
  };

  // --- Premium LED Status Badge (Updated to match Excel terms) ---
  const StatusBadge = ({ status }) => {
    const currentStatus = status ? status.toUpperCase() : 'PENDING';
    const config = {
        RECEIVED: { bg: "bg-emerald-400/10", text: "text-emerald-600", border: "border-emerald-500/20", dot: "bg-emerald-500" },
        PENDING: { bg: "bg-amber-400/10", text: "text-amber-600", border: "border-amber-500/20", dot: "bg-amber-500" },
        DOUBTFUL: { bg: "bg-rose-400/10", text: "text-rose-600", border: "border-rose-500/20", dot: "bg-rose-500" },
        CANCELLED: { bg: "bg-gray-400/10", text: "text-gray-600", border: "border-gray-500/20", dot: "bg-gray-500" },
    };
    const style = config[currentStatus] || config.PENDING;
    return (
      <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
        <span className={`w-1 h-1 rounded-full ${style.dot} shadow-[0_0_6px_currentColor]`} />
        <span className="text-[10px] font-bold tracking-widest">{currentStatus}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in slide-in-from-bottom-6 fade-in duration-1000">
      
      {/* --- Page Header & Primary Action --- */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-gray-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <BarChart3 size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Audit & Export Console</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Reporting</h1>
          <p className="text-sm text-gray-500 font-medium">Generate deep-filtered audit logs and export to Excel (.xlsx)</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-500 hover:text-rose-600 font-bold text-[11px] uppercase tracking-widest transition-colors"
            >
                <RefreshCw size={14} /> Clear
            </button>
            <button 
                onClick={handleExport}
                className="group flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-xl shadow-gray-900/10 hover:bg-emerald-600 transition-all duration-300 active:scale-95"
            >
                <FileSpreadsheet size={18} className="text-emerald-400 group-hover:text-white" />
                Export Active Results
            </button>
        </div>
      </div>

      {/* --- Floating Metric Bento-Strip (Now Dynamic!) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all cursor-default">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Records</p>
              <p className="text-xl font-bold tracking-tight text-gray-900">{metrics.total}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors text-gray-400">
               <Database size={20} />
            </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all cursor-default">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cumulative Value</p>
              <p className="text-xl font-bold tracking-tight text-indigo-600 tabular-nums">AED {metrics.cumulative.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors text-gray-400">
               <BarChart3 size={20} />
            </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm flex items-center justify-between group hover:border-rose-200 transition-all cursor-default">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Outstanding Debt</p>
              <p className="text-xl font-bold tracking-tight text-rose-600 tabular-nums">AED {metrics.outstanding.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors text-gray-400">
               <Info size={20} />
            </div>
        </div>
      </div>

      {/* --- Intelligent Filter Workspace --- */}
      <div className="bg-white border border-gray-200/80 rounded-[2rem] p-6 shadow-sm space-y-6">
        
        {/* Primary Row (Always Visible) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:border-indigo-500/50 transition-all">
            <Calendar size={14} className="text-gray-400" />
            <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} className="bg-transparent text-[12px] font-medium text-gray-700 w-full focus:outline-none" />
            <ArrowRight size={12} className="text-gray-300" />
            <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} className="bg-transparent text-[12px] font-medium text-gray-700 w-full focus:outline-none" />
          </div>

          {/* UPDATED STATUS OPTIONS */}
          <div className="relative group">
            <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-medium text-gray-700 px-4 py-2.5 focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer">
              <option value="">All Payment Statuses</option>
              <option value="RECEIVED">Received</option>
              <option value="PENDING">Pending</option>
              <option value="DOUBTFUL">Doubtful</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
          </div>

          <div className="relative group">
            <select value={filters.country} onChange={e => setFilters({...filters, country: e.target.value})} className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl text-[13px] font-medium text-gray-700 px-4 py-2.5 focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer">
              <option value="">All Countries</option>
              <option value="India">India</option>
              <option value="UAE">UAE</option>
              <option value="Oman">Oman</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
          </div>

          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all border ${
                showAdvanced ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-200'
            }`}
          >
            <SlidersHorizontal size={14} />
            {showAdvanced ? 'Hide Filters' : 'More Filters'}
          </button>
        </div>

        {/* Advanced Filters Grid (Collapsible) */}
        {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry Search</p>
                    <input type="text" placeholder="Invoice # (Exact or partial)" value={filters.invoiceNo} onChange={e => setFilters({...filters, invoiceNo: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] focus:bg-white outline-none" />
                    <input type="text" placeholder="Customer Name" value={filters.customer} onChange={e => setFilters({...filters, customer: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] focus:bg-white outline-none" />
                    <input type="text" placeholder="Partner / Distributor" value={filters.partner} onChange={e => setFilters({...filters, partner: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] focus:bg-white outline-none" />
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ownership & Logic</p>
                    <select value={filters.employee} onChange={e => setFilters({...filters, employee: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] focus:bg-white outline-none">
                        <option value="">All Staff Members</option>
                        <option value="Molina">Molina</option>
                        <option value="Sarah Khan">Sarah Khan</option>
                    </select>
                    <select value={filters.product} onChange={e => setFilters({...filters, product: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] focus:bg-white outline-none">
                        <option value="">Any Allocated Product</option>
                        <option value="Pro-Sales">Pro-Sales</option>
                        <option value="Pro-People">Pro-People</option>
                    </select>
                    <div className="relative">
                        <MessageSquare size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input type="text" placeholder="Search in remarks..." value={filters.remarks} onChange={e => setFilters({...filters, remarks: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] focus:bg-white outline-none" />
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Financial Range (AED)</p>
                    <div className="flex items-center gap-2">
                        <input type="number" placeholder="Min Value" value={filters.minTotal} onChange={e => setFilters({...filters, minTotal: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[12px]" />
                        <input type="number" placeholder="Max Value" value={filters.maxTotal} onChange={e => setFilters({...filters, maxTotal: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[12px]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" placeholder="Min Due" value={filters.minDue} onChange={e => setFilters({...filters, minDue: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[12px]" />
                        <input type="number" placeholder="Max Due" value={filters.maxDue} onChange={e => setFilters({...filters, maxDue: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[12px]" />
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Follow-up Window</p>
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="date" value={filters.followUpFrom} onChange={e => setFilters({...filters, followUpFrom: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[12px] focus:bg-white outline-none" />
                    </div>
                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                        <p className="text-[10px] text-indigo-600 font-bold leading-tight">TIP: Use "Min Due" to find high-priority pending accounts.</p>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Audit Trail Preview Table --- */}
      <div className="bg-white border border-gray-200/60 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Identification</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Customer & Partner</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Owner & Location</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Ledger (AED)</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {filteredOrders.length === 0 ? (
                <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-gray-500 font-medium">
                        No records match the current filter criteria.
                    </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="text-[14px] font-bold text-gray-900 font-mono tracking-tight">{order.invoiceNo}</div>
                      <div className="text-[11px] font-medium text-gray-400 mt-0.5 uppercase tracking-tighter">{order.invoiceDate}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-[14px] font-bold text-gray-900 leading-tight truncate max-w-[150px]">{order.customer}</div>
                      <div className="text-[11px] font-bold text-indigo-600/60 mt-1 uppercase tracking-widest">{order.partner || 'Direct'}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700">
                        <User size={12} className="text-gray-400" /> {order.employee}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-[0.1em]">
                        <MapPin size={10} /> {order.country}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="text-[15px] font-bold text-gray-900 tabular-nums tracking-tighter">
                        {order.grandTotal?.toLocaleString()}
                      </div>
                      <div className="text-[11px] font-bold text-rose-500 tabular-nums mt-0.5">
                        Due: {order.dueAmount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Active Results</span>
              <span className="bg-white border border-gray-200 px-3 py-1 rounded-lg text-sm font-bold text-gray-900 shadow-sm">{filteredOrders.length} Records</span>
           </div>
           <div className="text-[11px] font-medium text-gray-400 italic">
               Note: All filters applied above will reflect in the .xlsx download.
           </div>
        </div>
      </div>

    </div>
  );
}

// Internal Helper Icon
const MessageSquare = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;