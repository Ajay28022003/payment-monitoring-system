import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search, Plus, Download, FileText, Edit, Eye, Globe,
    CalendarClock, MapPin, User, MessageSquare, Briefcase, 
    Trash2, X, SlidersHorizontal
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

    // Advanced Filters
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const initialFilters = {
        orderType: '',
        status: '',
        department: '',
        country: '',
        employee: '',
        product: '',
        customer: '',
        partner: ''
    };

    const [draftFilters, setDraftFilters] = useState(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState(initialFilters);

    const activeFilterCount = Object.values(appliedFilters).filter(val => val !== '').length;

    const filterLabels = {
        'sales-today-followup': "Sales: Today's Followups",
        'sales-month-followup': "Sales: Month Followups",
        'sales-month-pending': "Sales: Month Pending",
        'sales-month-received': "Sales: Month Received",
        'sales-balance': "Sales: Balance Due",
        'sales-overall-pending': "Sales: Overall Pending",
        'purchase-today-due': "Purchase: Today's Due",
        'purchase-month-due': "Purchase: Month Due",
        'purchase-amount-paid': "Purchase: Amount Paid",
        'purchase-month-payable': "Purchase: Month Payable",
        'purchase-month-paid': "Purchase: Month Paid",
        'purchase-balance': "Purchase: Balance",
        'purchase-overall-due': "Purchase: Overall Due",
    };

    const clearDashboardFilter = () => {
        searchParams.delete('filter');
        setSearchParams(searchParams);
    };

    // Filter Logic
    const filteredOrders = ordersData.filter(order => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = (
            (order.invoiceNo || '').toLowerCase().includes(term) ||
            (order.customer || '').toLowerCase().includes(term) ||
            (order.employee || '').toLowerCase().includes(term) ||
            (order.country || '').toLowerCase().includes(term)
        );

        let matchesDashboard = true;
        const isSales = order.orderType === 'Sales';
        const isPurchase = order.orderType === 'Purchase';
        const currentMonth = '2026-04'; 
        const today = '2026-04-08';     

        if (activeDashboardFilter) {
            switch(activeDashboardFilter) {
                case 'sales-today-followup': matchesDashboard = isSales && order.nextFollowUp === today; break;
                case 'sales-month-followup': matchesDashboard = isSales && order.nextFollowUp.startsWith(currentMonth); break;
                case 'sales-month-pending': matchesDashboard = isSales && order.dueAmount > 0 && order.invoiceDate.startsWith(currentMonth); break;
                case 'sales-month-received': matchesDashboard = isSales && order.receivedAmount > 0 && order.invoiceDate.startsWith(currentMonth); break;
                case 'sales-balance': 
                case 'sales-overall-pending': matchesDashboard = isSales && order.dueAmount > 0; break;
                case 'purchase-today-due': matchesDashboard = isPurchase && order.nextFollowUp === today; break;
                case 'purchase-month-due': 
                case 'purchase-month-payable': matchesDashboard = isPurchase && order.dueAmount > 0 && order.invoiceDate.startsWith(currentMonth); break;
                case 'purchase-amount-paid': 
                case 'purchase-month-paid': matchesDashboard = isPurchase && order.receivedAmount > 0; break;
                case 'purchase-balance': 
                case 'purchase-overall-due': matchesDashboard = isPurchase && order.dueAmount > 0; break;
                default: matchesDashboard = true;
            }
        }

        // Apply advanced form filters
        const f = appliedFilters;
        const matchType = !f.orderType || order.orderType === f.orderType;
        const matchStatus = !f.status || order.status === f.status;
        const matchDept = !f.department || order.department === f.department;
        const matchCountry = !f.country || order.country === f.country;
        const matchEmployee = !f.employee || order.employee === f.employee;
        const matchProduct = !f.product || (order.products && order.products.includes(f.product));
        const matchCustomer = !f.customer || (order.customer || '').toLowerCase().includes(f.customer.toLowerCase());
        const matchPartner = !f.partner || (order.partner || '').toLowerCase().includes(f.partner.toLowerCase());

        return matchesSearch && matchesDashboard && matchType && matchStatus && matchDept && matchCountry && matchEmployee && matchProduct && matchCustomer && matchPartner;
    });

    const handleApplyFilters = () => {
        setAppliedFilters(draftFilters); 
        setIsFilterOpen(false); 
    };

    const handleClearFilters = () => {
        setDraftFilters(initialFilters);
        setAppliedFilters(initialFilters);
        setIsFilterOpen(false);
    };

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
        let bg = 'bg-gray-100', text = 'text-gray-600', dot = 'bg-gray-500';
        
        if (currentStatus === 'RECEIVED') { bg = 'bg-emerald-50'; text = 'text-emerald-700'; dot = 'bg-emerald-500'; }
        if (currentStatus === 'PENDING') { bg = 'bg-amber-50'; text = 'text-amber-700'; dot = 'bg-amber-500'; }
        if (currentStatus === 'DOUBTFUL') { bg = 'bg-rose-50'; text = 'text-rose-700'; dot = 'bg-rose-500'; }

        return (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${bg} ${text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                <span className="text-xs font-semibold">{currentStatus}</span>
            </div>
        );
    };

    return (
        <div className="max-w-[1600px] mx-auto p-4 space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders & Assignments</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage all sales and purchase records.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Download size={16} /> Export
                    </button>
                    <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                        <Plus size={16} /> New Order
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    
                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search invoice, client, etc..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${
                                isFilterOpen || activeFilterCount > 0 
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <SlidersHorizontal size={16} /> Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-indigo-100 text-indigo-700 px-1.5 rounded-md text-xs">{activeFilterCount}</span>
                            )}
                        </button>

                        {/* Expanded Filter Form */}
                        {isFilterOpen && (
                            <div className="absolute top-full left-0 mt-2 w-[500px] bg-white border border-gray-200 rounded-lg shadow-xl p-6 z-50">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Order Type</label>
                                        <select value={draftFilters.orderType} onChange={(e) => setDraftFilters({...draftFilters, orderType: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm">
                                            <option value="">All Types</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Purchase">Purchase</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                                        <select value={draftFilters.status} onChange={(e) => setDraftFilters({...draftFilters, status: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm">
                                            <option value="">All Statuses</option>
                                            <option value="RECEIVED">Received</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="DOUBTFUL">Doubtful</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
                                        <select value={draftFilters.department} onChange={(e) => setDraftFilters({...draftFilters, department: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm">
                                            <option value="">All Departments</option>
                                            <option value="Sales & Marketing">Sales & Marketing</option>
                                            <option value="Finance">Finance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Country</label>
                                        <input type="text" placeholder="e.g. India" value={draftFilters.country} onChange={(e) => setDraftFilters({...draftFilters, country: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Customer / Client</label>
                                        <input type="text" placeholder="Search customer..." value={draftFilters.customer} onChange={(e) => setDraftFilters({...draftFilters, customer: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Partner / Distributor</label>
                                        <input type="text" placeholder="Search partner..." value={draftFilters.partner} onChange={(e) => setDraftFilters({...draftFilters, partner: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Employee Owner</label>
                                        <input type="text" placeholder="e.g. Molina" value={draftFilters.employee} onChange={(e) => setDraftFilters({...draftFilters, employee: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Product Included</label>
                                        <select value={draftFilters.product} onChange={(e) => setDraftFilters({...draftFilters, product: e.target.value})} className="w-full p-2 border border-gray-300 rounded text-sm">
                                            <option value="">All Products</option>
                                            <option value="Pro-Sales">Pro-Sales</option>
                                            <option value="Pro-Ticket">Pro-Ticket</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button onClick={handleClearFilters} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Clear</button>
                                    <button onClick={handleApplyFilters} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700">Apply Filters</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {activeDashboardFilter && (
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <span className="text-xs font-semibold text-blue-700">{filterLabels[activeDashboardFilter] || activeDashboardFilter}</span>
                            <button onClick={clearDashboardFilter} className="text-blue-400 hover:text-blue-600"><X size={14} /></button>
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden z-10 relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Record Details</th>
                                <th className="px-6 py-4 font-semibold">Client Info</th>
                                <th className="px-6 py-4 font-semibold">Department & Owner</th>
                                <th className="px-6 py-4 font-semibold text-right">Financials</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No matching records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-indigo-600">{order.invoiceNo}</div>
                                            <div className="text-xs text-gray-500 mt-1">{order.orderType || 'Sales'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.customer}</div>
                                            <div className="text-xs text-gray-500 mt-1">{order.country || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.employee}</div>
                                            <div className="text-xs text-gray-500 mt-1">{order.department || 'General'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-medium text-gray-900">{order.grandTotal.toLocaleString()}</div>
                                            {order.dueAmount > 0 && <div className="text-xs text-rose-600 mt-1">Due: {order.dueAmount.toLocaleString()}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                            <div className="text-xs text-gray-500 mt-2">Next: {order.nextFollowUp || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-gray-400">
                                                <button onClick={() => setViewingOrder(order)} className="hover:text-indigo-600"><Eye size={18} /></button>
                                                <button onClick={() => setEditingOrder(order)} className="hover:text-emerald-600"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteOrder(order.id)} className="hover:text-rose-600"><Trash2 size={18} /></button>
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