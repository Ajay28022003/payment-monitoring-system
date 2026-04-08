import { X, Building2, User, Calendar, DollarSign, MapPin, Hash, Package, AlignLeft } from 'lucide-react';

export default function ViewOrderModal({ isOpen, onClose, order }) {
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

  // Helper component for standardizing label/value pairs
  const DetailBlock = ({ label, value, icon: Icon }) => (
      <div>
          <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
              {Icon && <Icon size={14} className="text-slate-400" />}
              {label}
          </p>
          <p className="text-sm font-semibold text-slate-900">{value || '-'}</p>
      </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* Right Side Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
        
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
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Details */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Entity & Ownership */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Client Information</h3>
                    <div className="space-y-4">
                        <DetailBlock label="Customer / Entity" icon={Building2} value={order.customer} />
                        <DetailBlock label="Partner" icon={Building2} value={order.partner || 'Direct'} />
                        <DetailBlock label="Location" icon={MapPin} value={order.country} />
                    </div>
                </div>

                <div className="space-y-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Internal Tracking</h3>
                    <div className="space-y-4">
                        <DetailBlock label="Account Owner" icon={User} value={order.employee} />
                        <DetailBlock label="Department" icon={Building2} value={order.department} />
                        <DetailBlock label="Creation Date" icon={Calendar} value={order.invoiceDate} />
                    </div>
                </div>
            </div>

            {/* Products & Description */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <Package size={16} className="text-slate-500" /> Products & Services
                </h3>
                
                {order.products && order.products.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {order.products.map(prod => (
                            <span key={prod} className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-xs font-semibold">
                                {prod}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 font-medium">No specific products attached.</p>
                )}

                <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                        <AlignLeft size={14} className="text-slate-400" /> Description & Remarks
                    </p>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                        {order.description || order.remarks || 'No detailed description provided for this order.'}
                    </p>
                </div>
            </div>

            {/* Financial Ledger */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <DollarSign size={16} className="text-slate-500" /> Financial Ledger
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
                    <DetailBlock label="Grand Total" value={`AED ${(order.grandTotal || 0).toLocaleString()}`} />
                    <DetailBlock 
                        label="Received Amount" 
                        value={`AED ${parseFloat((order.grandTotal || 0) - (order.dueAmount || 0)).toLocaleString()}`} 
                    />
                    
                    <div className="col-span-2 sm:col-span-1 bg-rose-50 p-3 rounded-lg border border-rose-200">
                        <p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-1">Balance Due</p>
                        <p className="text-xl font-bold text-rose-700 tabular-nums tracking-tight">
                            AED {(order.dueAmount || 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}