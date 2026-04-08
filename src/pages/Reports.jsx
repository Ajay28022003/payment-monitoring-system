import { useState, useMemo } from 'react';
import { 
  Download, Filter, FileSpreadsheet, RefreshCw, 
  ChevronDown, Calendar, ArrowRight, BarChart3, 
  Search, Info, Database, SlidersHorizontal, X,
  CheckCircle2, DollarSign, User, Building2, MapPin, MessageSquare
} from 'lucide-react';
import { mockOrders } from '../mockData/orders';

export default function Reports() {
  const [showFilters, setShowFilters] = useState(false);
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

  // Filter logic
  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      if (filters.dateFrom && order.invoiceDate < filters.dateFrom) return false;
      if (filters.dateTo && order.invoiceDate > filters.dateTo) return false;

      if (filters.status && order.status?.toUpperCase() !== filters.status.toUpperCase()) return false;
      if (filters.country && order.country !== filters.country) return false;
      if (filters.employee && order.employee !== filters.employee) return false;
      if (filters.product && !order.products?.includes(filters.product)) return false;

      if (filters.invoiceNo && !order.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase())) return false;
      if (filters.customer && !order.customer.toLowerCase().includes(filters.customer.toLowerCase())) return false;
      if (filters.partner && !order.partner?.toLowerCase().includes(filters.partner.toLowerCase())) return false;
      if (filters.remarks && !order.remarks?.toLowerCase().includes(filters.remarks.toLowerCase()) && !order.description?.toLowerCase().includes(filters.remarks.toLowerCase())) return false;

      if (filters.minTotal && order.grandTotal < Number(filters.minTotal)) return false;
      if (filters.maxTotal && order.grandTotal > Number(filters.maxTotal)) return false;
      if (filters.minDue && order.dueAmount < Number(filters.minDue)) return false;
      if (filters.maxDue && order.dueAmount > Number(filters.maxDue)) return false;

      if (filters.followUpFrom && order.nextFollowUp < filters.followUpFrom) return false;

      return true;
    });
  }, [filters]);

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = filteredOrders.length;
    const cumulative = filteredOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
    const outstanding = filteredOrders.reduce((sum, order) => sum + (order.dueAmount || 0), 0);
    return { total, cumulative, outstanding };
  }, [filteredOrders]);

  const handleExport = () => {
    const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;
    alert(`Exporting ${filteredOrders.length} records to Excel.\nFilters applied: ${activeFiltersCount}`);
  };

  // Standard status badge
  const StatusBadge = ({ status }) => {
    const s = status ? status.toUpperCase() : 'PENDING';
    const styles = {
      RECEIVED: "bg-emerald-100 text-emerald-800",
      PENDING: "bg-amber-100 text-amber-800",
      DOUBTFUL: "bg-rose-100 text-rose-800",
      CANCELLED: "bg-gray-100 text-gray-800",
    };
    
    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${styles[s] || styles.PENDING}`}>
        {s}
      </span>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Generate filtered audit logs and export to Excel.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
                <RefreshCw size={16} /> Reset
            </button>
            <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
                <FileSpreadsheet size={16} />
                Export to Excel
            </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-400">
               <Database size={24} />
            </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Cumulative Value</p>
              <p className="text-2xl font-bold text-gray-900">OMR {metrics.cumulative.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
               <BarChart3 size={24} />
            </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Outstanding Debt</p>
              <p className="text-2xl font-bold text-gray-900">OMR {metrics.outstanding.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
               <Info size={24} />
            </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        
        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-gray-400" />
            <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} className="bg-transparent text-sm text-gray-700 w-full focus:outline-none" />
            <ArrowRight size={14} className="text-gray-400" />
            <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} className="bg-transparent text-sm text-gray-700 w-full focus:outline-none" />
          </div>

          <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg text-sm text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="">All Statuses</option>
            <option value="RECEIVED">Received</option>
            <option value="PENDING">Pending</option>
            <option value="DOUBTFUL">Doubtful</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select value={filters.country} onChange={e => setFilters({...filters, country: e.target.value})} className="w-full bg-white border border-gray-300 rounded-lg text-sm text-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="">All Countries</option>
            <option value="India">India</option>
            <option value="UAE">UAE</option>
            <option value="Oman">Oman</option>
          </select>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${
                showFilters ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            {showFilters ? 'Hide Advanced' : 'Advanced Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-200">
                <div className="space-y-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Text Search</p>
                    <input type="text" placeholder="Invoice Number" value={filters.invoiceNo} onChange={e => setFilters({...filters, invoiceNo: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    <input type="text" placeholder="Customer Name" value={filters.customer} onChange={e => setFilters({...filters, customer: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    <input type="text" placeholder="Partner" value={filters.partner} onChange={e => setFilters({...filters, partner: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>

                <div className="space-y-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Attributes</p>
                    <select value={filters.employee} onChange={e => setFilters({...filters, employee: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option value="">All Employees</option>
                        <option value="Molina">Molina</option>
                        <option value="Sarah Khan">Sarah Khan</option>
                    </select>
                    <select value={filters.product} onChange={e => setFilters({...filters, product: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        <option value="">All Products</option>
                        <option value="Pro-Sales">Pro-Sales</option>
                        <option value="Pro-People">Pro-People</option>
                    </select>
                    <input type="text" placeholder="Search Remarks..." value={filters.remarks} onChange={e => setFilters({...filters, remarks: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>

                <div className="space-y-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Financial Range</p>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Min Total" value={filters.minTotal} onChange={e => setFilters({...filters, minTotal: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                        <input type="number" placeholder="Max Total" value={filters.maxTotal} onChange={e => setFilters({...filters, maxTotal: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Min Due" value={filters.minDue} onChange={e => setFilters({...filters, minDue: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                        <input type="number" placeholder="Max Due" value={filters.maxDue} onChange={e => setFilters({...filters, maxDue: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Follow-up</p>
                    <input type="date" value={filters.followUpFrom} onChange={e => setFilters({...filters, followUpFrom: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                </div>
            </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Record ID</th>
                <th className="px-6 py-4 font-semibold">Customer / Partner</th>
                <th className="px-6 py-4 font-semibold">Owner Info</th>
                <th className="px-6 py-4 font-semibold text-right">Financials</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No records match the current filter criteria.
                    </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.invoiceNo}</div>
                      <div className="text-xs text-gray-500 mt-1">{order.invoiceDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.customer}</div>
                      <div className="text-xs text-gray-500 mt-1">{order.partner || 'Direct'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.employee}</div>
                      <div className="text-xs text-gray-500 mt-1">{order.country}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium text-gray-900">{order.grandTotal?.toLocaleString()}</div>
                      <div className="text-xs text-rose-600 mt-1">Due: {order.dueAmount?.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}