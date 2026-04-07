import { X, Upload, ShoppingCart, Calculator, CheckCircle2, DollarSign, Calendar, Building2, Briefcase, FileText,Edit } from 'lucide-react';
import { useState, useEffect } from 'react';

const AVAILABLE_PRODUCTS = ['Pro-Sales', 'Pro-Ticket', 'Pro-People', 'Pro-Visit', 'Custom Integration'];
const AVAILABLE_DEPARTMENTS = ['Sales & Marketing', 'Development', 'Finance', 'Support Operations'];
const STATUS_OPTIONS = ['PENDING', 'RECEIVED', 'CANCELLED', 'DOUBTFUL'];

export default function OrderModal({ isOpen, onClose, userRole, onSave, onUpdate, editData }) {
  const defaultState = {
    employee: userRole === 'admin' ? '' : 'Molina',
    department: '', customer: '', partner: '', invoiceNo: '',
    invoiceDate: '', products: [], description: '', servicesFee: '',
    vat: '', receivedAmount: '', country: '', status: 'PENDING',
    nextFollowUp: '', remarks: ''
  };

  const [formData, setFormData] = useState(defaultState);
  const [grandTotal, setGrandTotal] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);

  // --- POPULATE DATA IF EDITING ---
  useEffect(() => {
    if (editData) {
        // If editing, map the existing data into the form
        setFormData({
            ...defaultState,
            ...editData,
            servicesFee: editData.grandTotal || '', // Simplified mapping for mock data
            receivedAmount: editData.grandTotal ? (editData.grandTotal - editData.dueAmount) : ''
        });
    } else {
        // If creating new, reset to empty
        setFormData(defaultState);
    }
  }, [editData, isOpen]);

  // Auto-Calculate Financials
  useEffect(() => {
    const fee = parseFloat(formData.servicesFee) || 0;
    const tax = parseFloat(formData.vat) || 0;
    const received = parseFloat(formData.receivedAmount) || 0;
    
    const calculatedGrand = fee + tax;
    const calculatedDue = calculatedGrand - received;

    setGrandTotal(calculatedGrand);
    setDueAmount(calculatedDue);
  }, [formData.servicesFee, formData.vat, formData.receivedAmount]);

  const toggleProduct = (prod) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(prod) 
        ? prev.products.filter(p => p !== prod)
        : [...prev.products, prod]
    }));
  };

  const handleSubmit = () => {
    if (!formData.customer || !formData.invoiceNo) {
        alert("Please provide at least a Customer and Invoice Number.");
        return;
    }

    const orderPayload = {
        id: editData ? editData.id : Date.now(), // Keep ID if editing
        invoiceNo: formData.invoiceNo,
        invoiceDate: formData.invoiceDate || new Date().toISOString().split('T')[0],
        customer: formData.customer,
        partner: formData.partner,
        employee: formData.employee ,
        department: formData.department,
        products: formData.products.length > 0 ? formData.products : ['N/A'],
        description: formData.description,
        grandTotal: grandTotal,
        dueAmount: dueAmount,
        country: formData.country,
        status: formData.status,
        nextFollowUp: formData.nextFollowUp,
        remarks: formData.remarks
    };

    if (editData) {
        onUpdate(orderPayload);
    } else {
        onSave(orderPayload);
    }
    
    setFormData(defaultState);
  };

  if (!isOpen) return null;

  const isEditing = !!editData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
              {isEditing ? <Edit size={24} strokeWidth={2} /> : <ShoppingCart size={24} strokeWidth={2} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {isEditing ? `Edit Order: ${formData.invoiceNo}` : 'Create Order Assignment'}
              </h2>
              <p className="text-[13px] font-medium text-gray-500 mt-0.5">
                  {isEditing ? 'Modify financial records and details.' : 'Register a new client purchase and track financials.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50/30">
          <div className="max-w-3xl mx-auto space-y-8">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">System Record Owner</p>
                    {userRole === 'admin' ? (
                        <select 
                            value={formData.employee}
                            onChange={(e) => setFormData({...formData, employee: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer"
                        >
                            <option value="">Select Employee Override...</option>
                            <option value="Molina">Molina</option>
                            <option value="Sarah Khan">Sarah Khan</option>
                        </select>
                    ) : (
                        <div className="px-4 py-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                            <p className="text-[13px] font-bold text-indigo-700">Molina <span className="text-indigo-400 font-medium">(Auto-captured)</span></p>
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5"><Briefcase size={12}/> Department</p>
                    <select 
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="">Select Associated Dept...</option>
                        {AVAILABLE_DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>
            </div>

            <section className="space-y-5">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Building2 size={14} /> Entity & Documentation
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Customer / Client Name *</label>
                  <input type="text" placeholder="Customer Name" value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Partner / Distributor</label>
                  <input type="text" placeholder="Partner Name" value={formData.partner} onChange={(e) => setFormData({...formData, partner: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Invoice Number *</label>
                  <input type="text" placeholder="e.g. INV-2026-001" value={formData.invoiceNo} onChange={(e) => setFormData({...formData, invoiceNo: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Invoice Date *</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" value={formData.invoiceDate} onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText size={14}/> Services & Description
              </h3>
              <div className="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm space-y-5">
                 <div>
                     <p className="text-[12px] text-gray-700 font-bold mb-3">Product Allocation (Multi-Select)</p>
                     <div className="flex flex-wrap gap-2">
                        {AVAILABLE_PRODUCTS.map(prod => (
                            <button
                                key={prod}
                                type="button"
                                onClick={() => toggleProduct(prod)}
                                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all border ${
                                    formData.products.includes(prod)
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                            >
                                {prod}
                            </button>
                        ))}
                     </div>
                 </div>
                 <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Detailed Description</label>
                    <textarea 
                        rows="2" placeholder="Enter custom project details or scope of work..."
                        value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none custom-scrollbar" 
                    />
                 </div>
              </div>
            </section>

            <section className="space-y-5">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Calculator size={14} /> Financial Ledger
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Services Fee <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="number" placeholder="0.00" 
                        value={formData.servicesFee} onChange={(e) => setFormData({...formData, servicesFee: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] tabular-nums focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">VAT Amount</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="number" placeholder="0.00" 
                        value={formData.vat} onChange={(e) => setFormData({...formData, vat: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] tabular-nums focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Received Amount</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="number" placeholder="0.00" 
                        value={formData.receivedAmount} onChange={(e) => setFormData({...formData, receivedAmount: e.target.value})}
                        className="w-full pl-9 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-[13px] tabular-nums focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-gray-900/10">
                 <div className="flex items-center gap-6">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Grand Total (Auto)</p>
                        <p className="text-xl font-bold text-white tabular-nums tracking-tight">{grandTotal.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-700 hidden md:block" />
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Payment Received</p>
                        <p className="text-xl font-bold text-emerald-400 tabular-nums tracking-tight">{parseFloat(formData.receivedAmount || 0).toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="bg-rose-500/10 border border-rose-500/20 px-5 py-3 rounded-xl text-right">
                    <p className="text-[10px] font-bold text-rose-300 uppercase tracking-widest mb-0.5">Total Due Balance</p>
                    <p className="text-2xl font-bold text-rose-500 tabular-nums tracking-tighter">{dueAmount.toLocaleString()}</p>
                 </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-5">
                    <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Next Follow-up Date</label>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="date" value={formData.nextFollowUp} onChange={(e) => setFormData({...formData, nextFollowUp: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Record Status</label>
                        <select 
                            value={formData.status} 
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                        >
                            {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Country / Territory</label>
                        <select 
                            value={formData.country}
                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="UAE">UAE</option>
                            <option value="Oman">Oman</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex-1">
                        <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Initial Comments / Remarks</label>
                        <textarea 
                            rows="2" placeholder="Enter comments here..."
                            value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                            className="w-full h-[calc(100%-28px)] px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none custom-scrollbar" 
                        />
                    </div>
                    <div>
                        <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Document Upload <span className="text-gray-400 font-medium">(Max 1MB)</span></label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl py-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all cursor-pointer group">
                            <Upload size={20} className="text-gray-300 group-hover:text-indigo-400 transition-colors mb-1.5" />
                            <p className="text-xs font-bold text-gray-600">Click or drag file here</p>
                        </div>
                    </div>
                </div>
            </section>

          </div>
        </div>

        {/* --- Sticky Footer --- */}
        <div className="px-8 py-5 border-t border-gray-100 bg-white flex items-center justify-between shrink-0 z-10">
          <button onClick={onClose} className="px-5 py-2.5 text-[13px] font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit}
            className="group flex items-center gap-2 px-8 py-2.5 bg-gray-900 text-white rounded-xl text-[13px] font-bold shadow-xl shadow-gray-900/10 hover:bg-indigo-600 hover:shadow-indigo-500/20 transition-all duration-300 active:scale-95"
          >
            <CheckCircle2 size={16} className="text-emerald-400 group-hover:text-white transition-colors" />
            {isEditing ? 'Save Changes' : 'Create Official Order'}
          </button>
        </div>

      </div>
    </div>
  );
}