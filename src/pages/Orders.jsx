import { useState } from 'react';
import {
    Search, Plus, Download, FileText,
    Edit, BellRing, Eye, SlidersHorizontal, ArrowUpRight, Globe,
    CalendarClock, MapPin, User, MessageSquare, Briefcase, Trash2
} from 'lucide-react';
import { mockOrders } from '../mockData/orders';
import OrderModal from '../components/OrderModal';
import ViewOrderModal from '../components/ViewOrderModal';

export default function Orders({ userRole }) {
    const [ordersData, setOrdersData] = useState(mockOrders);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = ordersData.filter(order => {
        const term = searchTerm.toLowerCase();
        return (
            (order.invoiceNo || '').toLowerCase().includes(term) ||
            (order.customer || '').toLowerCase().includes(term) ||
            (order.employee || '').toLowerCase().includes(term) ||
            (order.country || '').toLowerCase().includes(term)
        );
    });

    const handleAddOrder = (newOrder) => {
        setOrdersData([newOrder, ...ordersData]);
        setIsCreateOpen(false);
    };

    const handleUpdateOrder = (updatedOrder) => {
        setOrdersData(ordersData.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setEditingOrder(null);
    };

    const handleDeleteOrder = (id) => {
        if(window.confirm("Are you sure you want to permanently delete this order?")) {
            setOrdersData(ordersData.filter(order => order.id !== id));
        }
    };

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
            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shadow-[0_0_8px_currentColor] ${currentStatus === 'PENDING' || currentStatus === 'DOUBTFUL' ? 'animate-pulse' : ''}`} />
                <span className="text-[11px] font-bold tracking-wider">{currentStatus}</span>
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto animate-in slide-in-from-bottom-6 fade-in duration-1000 p-4">

            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-gray-200/60">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Globe size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Global Logistics</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders & Assignments</h1>
                    <p className="text-sm text-gray-500">Monitor financial health and employee assignments.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                            <Download size={14} className="text-emerald-500" /> EXCEL
                        </button>
                        <div className="w-px h-4 bg-gray-200 self-center mx-1" />
                        <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                            <FileText size={14} className="text-rose-500" /> PDF
                        </button>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="group flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-xl shadow-indigo-900/10 hover:bg-indigo-600 hover:shadow-indigo-500/20 transition-all duration-300"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Assign New Product
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-[400px] group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200/80 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all shadow-sm"
                />
            </div>

            {/* Table Section */}
            <div className="bg-white border border-gray-200/60 rounded-[2rem] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-auto">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] w-[220px]">Identification</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Client & Territory</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Owner & Dept</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Financial Ledger</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Follow-up Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/80">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-10 text-center text-gray-500 font-medium">No orders found.</td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                        {/* Identification: Removed absolute div, used border-l-4 on first cell instead */}
                                        <td className="px-8 py-5 border-l-4 border-transparent group-hover:border-indigo-600 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-indigo-600 transition-colors border border-transparent group-hover:border-indigo-100 shadow-sm shrink-0">
                                                    <FileText size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-[14px] font-bold text-gray-900 font-mono tracking-tight truncate">{order.invoiceNo}</div>
                                                    <div className="text-[11px] font-medium text-gray-400 uppercase tracking-tighter mt-0.5">{order.invoiceDate}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-5">
                                            <div className="text-[14px] font-bold text-gray-900 leading-tight truncate max-w-[180px]">{order.customer}</div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 truncate max-w-[100px]">
                                                    {order.partner || 'Direct'}
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
                                                    <MapPin size={10} /> {order.country || 'N/A'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700 mb-1">
                                                <User size={12} className="text-gray-400" /> {order.employee}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
                                                <Briefcase size={10} /> {order.department || 'Sales & Mktg'}
                                            </div>
                                            <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                                                {order.products.map(prod => (
                                                    <span key={prod} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 rounded text-[10px] font-bold shadow-sm">
                                                        {prod}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        <td className="px-8 py-5 text-right">
                                            <div className="text-[15px] font-bold text-gray-900 tabular-nums tracking-tighter">
                                                {order.grandTotal.toLocaleString()}
                                            </div>
                                            <div className="flex flex-col items-end gap-0.5 mt-1">
                                                <div className="text-[11px] font-bold text-emerald-500 tabular-nums">
                                                    Rec: {parseFloat(order.grandTotal - (order.dueAmount || 0)).toLocaleString()}
                                                </div>
                                                {order.dueAmount > 0 && (
                                                    <div className="text-[11px] font-bold text-rose-500 tabular-nums">
                                                        Due: {order.dueAmount.toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-8 py-5">
                                            <div className="mb-2">
                                                <StatusBadge status={order.status} />
                                            </div>
                                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-2 max-w-[200px]">
                                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
                                                    <CalendarClock size={12} /> {order.nextFollowUp || 'Unscheduled'}
                                                </div>
                                                <div className="flex items-start gap-1.5 text-[11px] text-gray-500 font-medium">
                                                    <MessageSquare size={12} className="shrink-0 mt-0.5 text-gray-400" />
                                                    <span className="truncate" title={order.remarks || 'No remarks provided'}>
                                                        {order.remarks || 'No recent remarks...'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button 
                                                    onClick={() => setViewingOrder(order)}
                                                    className="p-2 bg-white text-gray-400 hover:text-indigo-600 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => setEditingOrder(order)}
                                                    className="p-2 bg-white text-gray-400 hover:text-emerald-600 rounded-xl shadow-sm border border-gray-100 hover:border-emerald-200"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="p-2 bg-white text-gray-400 hover:text-rose-600 rounded-xl shadow-sm border border-gray-100 hover:border-rose-200"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
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