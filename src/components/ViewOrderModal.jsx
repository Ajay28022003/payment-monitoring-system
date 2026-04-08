import { X, Building2, User, Calendar, DollarSign, MapPin, Hash, Package, AlignLeft, Send, History, CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ViewOrderModal({ isOpen, onClose, order, userName, userRole, onUpdateFollowUp }) {
  // Local state for the follow-up inputs
  const [remarkInput, setRemarkInput] = useState('');
  const [nextDateInput, setNextDateInput] = useState('');
  const [showFullHistory, setShowFullHistory] = useState(false);
  
  // Local state to hold the timeline so it updates instantly in the UI
  const [localHistory, setLocalHistory] = useState([]);
  const [localNextDate, setLocalNextDate] = useState('');

  // Sync with the incoming order data when the modal opens
  useEffect(() => {
    if (order) {
      setLocalHistory(order.history || [
        { date: order.invoiceDate || new Date().toISOString().split('T')[0], remark: 'Order created in system.', author: 'System' }
      ]);
      setLocalNextDate(order.nextFollowUp || '');
      setRemarkInput('');
      setNextDateInput('');
      setShowFullHistory(false);
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const StatusBadge = ({ status }) => {
    const currentStatus = status ? status.toUpperCase() : 'PENDING';
    let style = 'bg-slate-100 text-slate-700 border-slate-200';
    
    if (currentStatus === 'RECEIVED') style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (currentStatus === 'PENDING') style = 'bg-amber-50 text-amber-700 border-amber-200';
    if (currentStatus === 'DOUBTFUL') style = 'bg-rose-50 text-rose-700 border-rose-200';
    if (currentStatus === 'CANCELLED') style = 'bg-slate-100 text-slate-500 border-slate-200';

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${style}`}>
            {currentStatus}
        </span>
    );
  };

  const DetailBlock = ({ label, value, icon: Icon }) => (
      <div>
          <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
              {Icon && <Icon size={14} className="text-slate-400" />}
              {label}
          </p>
          <p className="text-sm font-semibold text-slate-900">{value || '-'}</p>
      </div>
  );

  // --- Handle Logging the New Remark ---
  const handleLogSubmit = (e) => {
    e.preventDefault();
    if (!remarkInput.trim()) return;

    const newEntry = {
        date: new Date().toISOString().split('T')[0],
        remark: remarkInput.trim(),
        author: userName || (userRole === 'admin' ? 'System Admin' : 'Employee')
    };

    // 1. Update the local UI immediately for a snappy feel
    setLocalHistory(prev => [...prev, newEntry]);
    if (nextDateInput) setLocalNextDate(nextDateInput);
    
    // 2. Pass it up to the parent component to save in the main database
    if (onUpdateFollowUp) {
        onUpdateFollowUp(order.id, newEntry, nextDateInput);
    }

    // 3. Clear inputs and expand the timeline to show the new log
    setRemarkInput('');
    setNextDateInput('');
    setShowFullHistory(true); 
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-3xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Hash size={24} className="text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{order.invoiceNo}</h2>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm font-medium text-slate-500">
                {order.orderType === 'Purchase' ? 'Purchase Order Record' : 'Sales Order Record'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            
            {/* Context Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Client Information</h3>
                    <div className="space-y-4">
                        <DetailBlock label="Customer / Entity" icon={Building2} value={order.customer} />
                        <DetailBlock label="Location" icon={MapPin} value={order.country} />
                    </div>
                </div>
                <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Internal Tracking</h3>
                    <div className="space-y-4">
                        <DetailBlock label="Account Owner" icon={User} value={order.employee} />
                        <DetailBlock label="Creation Date" icon={Calendar} value={order.invoiceDate} />
                    </div>
                </div>
            </div>

            {/* Products & Description */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Package size={16} className="text-slate-500" /> Products & Scope of Work
                </h3>
                
                {order.products && order.products.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {order.products.map(prod => (
                            <span key={prod} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-xs font-semibold">
                                {prod}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 font-medium">No specific products attached.</p>
                )}

                <div className="pt-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                        <AlignLeft size={14} className="text-slate-400" /> Description & Remarks
                    </p>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        {order.description || order.remarks || 'No detailed description provided for this order.'}
                    </p>
                </div>
            </div>

            {/* Financial Ledger */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <DetailBlock label="Grand Total" value={`OMR ${(order.grandTotal || 0).toLocaleString()}`} />
                    <DetailBlock 
                        label="Received Amount" 
                        value={`OMR ${parseFloat((order.grandTotal || 0) - (order.dueAmount || 0)).toLocaleString()}`} 
                    />
                    <div className="col-span-2 sm:col-span-1 border-l-2 border-rose-200 pl-4">
                        <p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-1">Balance Due</p>
                        <p className="text-xl font-bold text-rose-700 tabular-nums tracking-tight">
                            OMR {(order.dueAmount || 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- COMMUNICATION LOG & FOLLOW UP SYSTEM --- */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <History size={16} className="text-slate-500" /> Communication Log
                    </h3>
                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                        <CalendarDays size={14} /> Next Follow-up: <span className="text-slate-900">{localNextDate || 'Not Set'}</span>
                    </div>
                </div>
                
                {/* Timeline Display */}
                <div className="p-6 bg-white">
                    <div className="space-y-6 border-l-2 border-slate-100 ml-2 pl-4">
                        {(showFullHistory ? localHistory : localHistory.slice(-1)).map((hist, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white" />
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-xs font-bold text-indigo-600">{hist.author}</p>
                                        <p className="text-xs font-semibold text-slate-400">• {hist.date}</p>
                                    </div>
                                    <p className="text-sm text-slate-800 font-medium leading-relaxed">{hist.remark}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {localHistory.length > 1 && (
                        <button 
                            onClick={() => setShowFullHistory(!showFullHistory)}
                            className="mt-6 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 ml-2"
                        >
                            {showFullHistory ? 'Hide Previous Logs' : `View All Previous Logs (${localHistory.length - 1} more)`}
                        </button>
                    )}
                </div>

                {/* Follow-up Entry Form */}
                <form onSubmit={handleLogSubmit} className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                    <div className="relative w-full sm:w-40 shrink-0">
                        <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="date" 
                            title="Set Next Follow-up Date"
                            value={nextDateInput}
                            onChange={(e) => setNextDateInput(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                        />
                    </div>
                    
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="Add a new update or remark..."
                            value={remarkInput}
                            onChange={(e) => setRemarkInput(e.target.value)}
                            className="w-full pl-4 pr-12 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                        />
                        <button 
                            type="submit"
                            disabled={!remarkInput.trim()}
                            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex items-center justify-center shadow-sm"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
            {/* --- END COMMUNICATION LOG --- */}

        </div>
      </div>
    </div>
  );
}