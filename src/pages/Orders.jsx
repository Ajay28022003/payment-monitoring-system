import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search, Plus, Edit, Eye, Trash2, X, SlidersHorizontal, 
    Database, BarChart3, Info, Calendar, ArrowRight, 
    FileSpreadsheet, RefreshCw, CalendarClock, MapPin
} from 'lucide-react';
import { mockOrders } from '../mockData/orders';
import OrderModal from '../components/OrderModal';
import ViewOrderModal from '../components/ViewOrderModal';

export default function Orders({ userRole }) {
    const [ordersData, setOrdersData] = useState(mockOrders);
    
    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    
    // URL Search Params (Dashboard links)
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const activeDashboardFilter = searchParams.get('filter');

    // Advanced Filters State
    const [showFilters, setShowFilters] = useState(false);
    
    const initialFilters = {
        orderType: '', status: '', department: '', country: '',
        employee: '', product: '', customer: '', partner: '', invoiceNo: '',
        dateFrom: '', dateTo: '', minTotal: '', maxTotal: '',
        minDue: '', maxDue: '', followUpFrom: '', remarks: ''
    };

    const [draftFilters, setDraftFilters] = useState(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState(initialFilters);

    const activeFilterCount = Object.values(appliedFilters).filter(val => val !== '').length;

    const filterLabels = {
        'sales-today-followup': "Sales: Today's Followups",
        'sales-month-pending': "Sales: Month Pending",
        'sales-balance': "Sales: Balance Due",
        'purchase-today-due': "Purchase: Today's Due",
        'purchase-month-payable': "Purchase: Month Payable",
        'purchase-balance': "Purchase: Balance",
    };

    const clearDashboardFilter = () => {
        searchParams.delete('filter');
        setSearchParams(searchParams);
    };

    // Unified Filter Logic
    const filteredOrders = useMemo(() => {
        return ordersData.filter(order => {
            // 1. Quick Search
            const term = searchTerm.toLowerCase();
            const matchesSearch = (
                (order.invoiceNo || '').toLowerCase().includes(term) ||
                (order.customer || '').toLowerCase().includes(term) ||
                (order.employee || '').toLowerCase().includes(term)
            );

            // 2. Dashboard URL Filters
            let matchesDashboard = true;
            const isSales = order.orderType === 'Sales';
            const isPurchase = order.orderType === 'Purchase';
            const currentMonth = '2026-04'; 
            const today = '2026-04-08';     

            if (activeDashboardFilter) {
                switch(activeDashboardFilter) {
                    case 'sales-today-followup': matchesDashboard = isSales && order.nextFollowUp === today; break;
                    case 'sales-month-pending': matchesDashboard = isSales && order.dueAmount > 0 && order.invoiceDate.startsWith(currentMonth); break;
                    case 'sales-balance': matchesDashboard = isSales && order.dueAmount > 0; break;
                    case 'purchase-today-due': matchesDashboard = isPurchase && order.nextFollowUp === today; break;
                    case 'purchase-month-payable': matchesDashboard = isPurchase && order.dueAmount > 0 && order.invoiceDate.startsWith(currentMonth); break;
                    case 'purchase-balance': matchesDashboard = isPurchase && order.dueAmount > 0; break;
                    default: matchesDashboard = true;
                }
            }

            // 3. Advanced Report Filters
            const f = appliedFilters;
            if (f.dateFrom && order.invoiceDate < f.dateFrom) return false;
            if (f.dateTo && order.invoiceDate > f.dateTo) return false;
            if (f.orderType && order.orderType !== f.orderType) return false;
            if (f.status && order.status?.toUpperCase() !== f.status.toUpperCase()) return false;
            if (f.department && order.department !== f.department) return false;
            if (f.country && order.country !== f.country) return false;
            if (f.employee && order.employee !== f.employee) return false;
            if (f.product && !order.products?.includes(f.product)) return false;
            
            if (f.invoiceNo && !order.invoiceNo.toLowerCase().includes(f.invoiceNo.toLowerCase())) return false;
            if (f.customer && !order.customer.toLowerCase().includes(f.customer.toLowerCase())) return false;
            if (f.partner && !order.partner?.toLowerCase().includes(f.partner.toLowerCase())) return false;
            if (f.remarks && !order.remarks?.toLowerCase().includes(f.remarks.toLowerCase()) && !order.description?.toLowerCase().includes(f.remarks.toLowerCase())) return false;

            if (f.minTotal && order.grandTotal < Number(f.minTotal)) return false;
            if (f.maxTotal && order.grandTotal > Number(f.maxTotal)) return false;
            if (f.minDue && order.dueAmount < Number(f.minDue)) return false;
            if (f.maxDue && order.dueAmount > Number(f.maxDue)) return false;
            if (f.followUpFrom && order.nextFollowUp < f.followUpFrom) return false;

            return matchesSearch && matchesDashboard;
        });
    }, [ordersData, searchTerm, activeDashboardFilter, appliedFilters]);

    // Dynamic Report Metrics
    const metrics = useMemo(() => {
        const total = filteredOrders.length;
        const totalSales = filteredOrders.filter(o => o.orderType === 'Sales').reduce((sum, o) => sum + (o.grandTotal || 0), 0);
        const totalOutstanding = filteredOrders.reduce((sum, o) => sum + (o.dueAmount || 0), 0);
        return { total, totalSales, totalOutstanding };
    }, [filteredOrders]);

    const handleApplyFilters = () => { setAppliedFilters(draftFilters); setShowFilters(false); };
    const handleClearFilters = () => { setDraftFilters(initialFilters); setAppliedFilters(initialFilters); setShowFilters(false); };
    const handleExport = () => alert(`Exporting ${filteredOrders.length} records to Excel.\nFilters applied: ${activeFilterCount}`);

    // CRUD Handlers
    const handleAddOrder = (newOrder) => { setOrdersData([newOrder, ...ordersData]); setIsCreateOpen(false); };
    const handleUpdateOrder = (updatedOrder) => { setOrdersData(ordersData.map(o => o.id === updatedOrder.id ? updatedOrder : o)); setEditingOrder(null); };
    const handleDeleteOrder = (id) => { if(window.confirm("Are you sure you want to permanently delete this record?")) setOrdersData(ordersData.filter(order => order.id !== id)); };

    const StatusBadge = ({ status }) => {
        const currentStatus = status ? status.toUpperCase() : 'PENDING';
        let style = 'bg-slate-100 text-slate-700 border-slate-200';
        if (currentStatus === 'RECEIVED') style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        if (currentStatus === 'PENDING') style = 'bg-amber-50 text-amber-800 border-amber-200';
        if (currentStatus === 'DOUBTFUL') style = 'bg-rose-50 text-rose-800 border-rose-200';
        if (currentStatus === 'CANCELLED') style = 'bg-slate-100 text-slate-500 border-slate-200';

        return <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${style}`}>{currentStatus}</span>;
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders & Reports</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage records, filter data, and generate financial reports.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleExport} className="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-colors">
                        <FileSpreadsheet size={18} className="text-emerald-600" /> Export Excel
                    </button>
                    <button onClick={() => setIsCreateOpen(true)} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md flex items-center gap-2 transition-colors">
                        <Plus size={18} /> New Order
                    </button>
                </div>
            </div>

            {/* Spacious Report Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Total Records</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{metrics.total}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400"><Database size={24} /></div>
                </div>
                <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-indigo-600 mb-1">Total Sales</p>
                        <p className="text-2xl font-bold text-indigo-900 tracking-tight">AED {metrics.totalSales.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white border border-indigo-100 rounded-xl text-indigo-500"><BarChart3 size={24} /></div>
                </div>
                <div className="bg-rose-50/50 p-6 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-rose-600 mb-1">Total Due</p>
                        <p className="text-2xl font-bold text-rose-900 tracking-tight">AED {metrics.totalOutstanding.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white border border-rose-100 rounded-xl text-rose-500"><Info size={24} /></div>
                </div>
            </div>

            {/* Toolbar & Filters Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                
                {/* Search & Toggles Row */}
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full">
                        
                        <div className="relative w-full lg:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Quick search invoice or client..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>

                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                                showFilters || activeFilterCount > 0 
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <SlidersHorizontal size={18} /> Report Filters
                            {activeFilterCount > 0 && <span className="bg-indigo-600 text-white px-2 rounded-md text-xs py-0.5">{activeFilterCount}</span>}
                        </button>

                        {(activeFilterCount > 0 || activeDashboardFilter || searchTerm) && (
                            <button onClick={() => { handleClearFilters(); setSearchTerm(''); clearDashboardFilter(); }} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                <RefreshCw size={16} /> Reset All
                            </button>
                        )}

                        {activeDashboardFilter && (
                             <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 rounded-lg ml-auto">
                                <span className="text-xs font-bold text-indigo-700 uppercase tracking-tight">{filterLabels[activeDashboardFilter] || activeDashboardFilter}</span>
                                <button onClick={clearDashboardFilter} className="text-indigo-400 hover:text-indigo-700 transition-colors"><X size={16} strokeWidth={3} /></button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Expanded Advanced Filters */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-200 animate-in slide-in-from-top-2 duration-200">
                        {/* Dates & Status - FIXED ALIGNMENT */}
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Timeline & Status</p>
                            
                            <div className="flex gap-2">
                                <input 
                                    type="date" 
                                    title="Start Date"
                                    value={draftFilters.dateFrom} 
                                    onChange={e => setDraftFilters({...draftFilters, dateFrom: e.target.value})} 
                                    className="w-full px-1 py-1 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                                <input 
                                    type="date" 
                                    title="End Date"
                                    value={draftFilters.dateTo} 
                                    onChange={e => setDraftFilters({...draftFilters, dateTo: e.target.value})} 
                                    className="w-full px-1 py-1 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                            </div>

                            <select value={draftFilters.orderType} onChange={e => setDraftFilters({...draftFilters, orderType: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="">All Record Types</option>
                                <option value="Sales">Sales Orders</option>
                                <option value="Purchase">Purchase Orders</option>
                            </select>
                            <select value={draftFilters.status} onChange={e => setDraftFilters({...draftFilters, status: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="">All Statuses</option>
                                <option value="RECEIVED">Received</option>
                                <option value="PENDING">Pending</option>
                                <option value="DOUBTFUL">Doubtful</option>
                            </select>
                        </div>

                        {/* Entities */}
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entities</p>
                            <input type="text" placeholder="Customer / Client Name" value={draftFilters.customer} onChange={e => setDraftFilters({...draftFilters, customer: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                            <input type="text" placeholder="Partner / Vendor" value={draftFilters.partner} onChange={e => setDraftFilters({...draftFilters, partner: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                            <select value={draftFilters.employee} onChange={e => setDraftFilters({...draftFilters, employee: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="">All Owners / Employees</option>
                                <option value="Molina">Molina</option>
                                <option value="Sarah Khan">Sarah Khan</option>
                            </select>
                        </div>

                        {/* Financials */}
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Financial Bounds</p>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Min Total" value={draftFilters.minTotal} onChange={e => setDraftFilters({...draftFilters, minTotal: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                                <input type="number" placeholder="Max Total" value={draftFilters.maxTotal} onChange={e => setDraftFilters({...draftFilters, maxTotal: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Min Due" value={draftFilters.minDue} onChange={e => setDraftFilters({...draftFilters, minDue: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                                <input type="number" placeholder="Max Due" value={draftFilters.maxDue} onChange={e => setDraftFilters({...draftFilters, maxDue: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <select value={draftFilters.product} onChange={e => setDraftFilters({...draftFilters, product: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="">All Products</option>
                                <option value="Pro-Sales">Pro-Sales</option>
                                <option value="Pro-Ticket">Pro-Ticket</option>
                            </select>
                        </div>

                        {/* Context */}
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Context Tracking</p>
                            <input type="text" placeholder="Search by Remarks..." value={draftFilters.remarks} onChange={e => setDraftFilters({...draftFilters, remarks: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Follow-ups After</label>
                                <input type="date" value={draftFilters.followUpFrom} onChange={e => setDraftFilters({...draftFilters, followUpFrom: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={handleClearFilters} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Clear</button>
                                <button onClick={handleApplyFilters} className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">Apply Filters</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Spacious Table Section */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden z-10 relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">Invoice Details</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">Client & Entity</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">Owner / Dept</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Financial Ledger</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider">Current Status</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium">
                                        No matching records found based on your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className={`text-base font-bold font-mono tracking-tight ${order.orderType === 'Purchase' ? 'text-rose-700' : 'text-indigo-700'}`}>
                                                {order.invoiceNo}
                                            </div>
                                            <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-tighter">
                                                {order.orderType === 'Purchase' ? 'Purchase Order' : 'Sales Order'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900">{order.customer}</div>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-1 uppercase">
                                                <MapPin size={12} className="text-slate-400" /> {order.country || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-slate-900">{order.employee}</div>
                                            <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-tighter">{order.department || 'General'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="text-base font-bold text-slate-900 tabular-nums">
                                                {order.grandTotal.toLocaleString()}
                                            </div>
                                            {order.dueAmount > 0 && (
                                                <div className="text-xs font-bold text-rose-600 mt-1 tabular-nums">
                                                    Due: {order.dueAmount.toLocaleString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-2">
                                                <CalendarClock size={14} className="text-slate-400" /> {order.nextFollowUp || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-slate-400">
                                                <button onClick={() => setViewingOrder(order)} className="p-2 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Eye size={18} /></button>
                                                <button onClick={() => setEditingOrder(order)} className="p-2 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteOrder(order.id)} className="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <OrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} userRole={userRole} onSave={handleAddOrder} />
            <OrderModal isOpen={!!editingOrder} onClose={() => setEditingOrder(null)} userRole={userRole} editData={editingOrder} onUpdate={handleUpdateOrder} />
            <ViewOrderModal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} order={viewingOrder} />
        </div>
    );
}