import { X, FileText, Building2, User, Calendar, DollarSign, Calculator, MapPin, CheckCircle2 } from 'lucide-react';

export default function ViewOrderModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

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
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            <span className="text-[11px] font-bold tracking-widest">{currentStatus}</span>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Strip */}
        <div className="px-8 py-6 bg-gray-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Official Record</p>
              <h2 className="text-2xl font-bold tracking-tight font-mono">{order.invoiceNo}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={order.status} />
            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Details */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30 custom-scrollbar">
            
            {/* Entity & Ownership */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm space-y-4">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Building2 size={12}/> Client Details</h3>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{order.customer}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">Partner: {order.partner || 'Direct'}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {order.country || 'N/A'}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm space-y-4">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><User size={12}/> Internal Ownership</h3>
                    <div>
                        <p className="text-sm font-bold text-indigo-600">{order.employee}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">Department: {order.department || 'N/A'}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1"><Calendar size={12}/> Created: {order.invoiceDate}</p>
                    </div>
                </div>
            </div>

            {/* Products & Description */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Products & Services</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {(order.products || []).map(prod => (
                        <span key={prod} className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-bold shadow-sm">{prod}</span>
                    ))}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-[13px] text-gray-700 leading-relaxed font-medium">
                    {order.description || order.remarks || 'No detailed description provided for this order.'}
                </div>
            </div>

            {/* Financial Ledger */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm space-y-4">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Calculator size={12}/> Financial Summary</h3>
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="flex gap-8">
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Grand Total</p>
                            <p className="text-xl font-bold text-gray-900 tabular-nums">{(order.grandTotal || 0).toLocaleString()}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-200 hidden md:block" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Received</p>
                            <p className="text-xl font-bold text-emerald-500 tabular-nums">{parseFloat((order.grandTotal || 0) - (order.dueAmount || 0)).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-rose-50 px-6 py-3 rounded-xl border border-rose-100 text-right">
                        <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Outstanding Due</p>
                        <p className="text-2xl font-bold text-rose-600 tabular-nums tracking-tighter">{(order.dueAmount || 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}