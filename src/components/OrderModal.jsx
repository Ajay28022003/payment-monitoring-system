import { X, Upload, ShoppingCart, Calculator, CheckCircle2, DollarSign, Calendar, Building2, Briefcase, FileText, Edit, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';

const AVAILABLE_PRODUCTS = ['Pro-Sales', 'Pro-Ticket', 'Pro-People', 'Pro-Visit', 'Custom Integration'];
const AVAILABLE_DEPARTMENTS = ['Sales & Marketing', 'Development', 'Finance', 'Support Operations'];
const STATUS_OPTIONS = ['PENDING', 'RECEIVED', 'CANCELLED', 'DOUBTFUL'];

export default function OrderModal({ isOpen, onClose, userRole, onSave, onUpdate, editData }) {
  const defaultState = {
    orderType: 'Sales',
    employee: userRole === 'admin' ? '' : 'Molina',
    department: '', customer: '', partner: '', invoiceNo: '',
    invoiceDate: '', products: [], description: '', servicesFee: '',
    vat: '', receivedAmount: '', country: '', status: 'PENDING',
    nextFollowUp: '', remarks: ''
  };

  const [formData, setFormData] = useState(defaultState);
  const [grandTotal, setGrandTotal] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);

  // Populate data on edit
  useEffect(() => {
    if (editData) {
        setFormData({
            ...defaultState,
            ...editData,
            servicesFee: editData.grandTotal || '', 
            receivedAmount: editData.grandTotal ? (editData.grandTotal - (editData.dueAmount || 0)) : ''
        });
    } else {
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
    if (userRole === 'employee' && editData) return; // Prevent toggle if employee is editing
    
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(prod) 
        ? prev.products.filter(p => p !== prod)
        : [...prev.products, prod]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.invoiceNo) {
        alert("Please provide at least a Customer and Invoice Number.");
        return;
    }

    const orderPayload = {
        id: editData ? editData.id : Date.now(),
        orderType: formData.orderType,
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

    editData ? onUpdate(orderPayload) : onSave(orderPayload);
    setFormData(defaultState);
  };

  if (!isOpen) return null;

  const isEditing = !!editData;
  const isEmployeeEditing = userRole === 'employee' && isEditing;

  // Idiomatic Tailwind input styling using the `disabled:` modifier
  const inputBase = "w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed";
  const iconInputBase = "w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      {/* Right Side Drawer Panel */}
      <div className="relative w-full max-w-3xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-sm">
              {isEditing ? <Edit size={24} /> : <ShoppingCart size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {isEditing ? `Edit Record: ${formData.invoiceNo}` : 'Create Order Assignment'}
              </h2>
              {isEmployeeEditing ? (
                  <p className="text-sm font-semibold text-rose-600 mt-1 flex items-center gap-1.5">
                      <ShieldAlert size={16} /> Restricted Mode: You may only update Follow-up and Remarks.
                  </p>
              ) : (
                  <p className="text-sm font-medium text-slate-500 mt-1">
                      Register a new client purchase and track financials.
                  </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="order-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
            
            {/* Context & Ownership */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Record Type</label>
                    <select 
                        disabled={isEmployeeEditing}
                        value={formData.orderType}
                        onChange={(e) => setFormData({...formData, orderType: e.target.value})}
                        className={`${inputBase} ${formData.orderType === 'Purchase' ? 'text-rose-700' : 'text-indigo-700'}`}
                    >
                        <option value="Sales">Sales Order</option>
                        <option value="Purchase">Purchase Order</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">System Owner</label>
                    {userRole === 'admin' ? (
                        <select 
                            disabled={isEmployeeEditing}
                            value={formData.employee}
                            onChange={(e) => setFormData({...formData, employee: e.target.value})}
                            className={inputBase}
                        >
                            <option value="">Select Employee...</option>
                            <option value="Molina">Molina</option>
                            <option value="Sarah Khan">Sarah Khan</option>
                        </select>
                    ) : (
                        <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-md">
                            <p className="text-sm font-bold text-slate-700">Molina <span className="text-slate-400 font-medium">(Auto)</span></p>
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Briefcase size={14}/> Department
                    </label>
                    <select 
                        disabled={isEmployeeEditing}
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className={inputBase}
                    >
                        <option value="">Select Dept...</option>
                        {AVAILABLE_DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                </div>
            </div>

            {/* Entity Details */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                <Building2 size={16} className="text-slate-500" /> Entity & Documentation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{formData.orderType === 'Sales' ? 'Customer / Client' : 'Supplier / Vendor'} *</label>
                  <input disabled={isEmployeeEditing} type="text" placeholder="Entity Name" value={formData.customer} onChange={(e) => setFormData({...formData, customer: e.target.value})} className={inputBase} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Partner / Distributor</label>
                  <input disabled={isEmployeeEditing} type="text" placeholder="Partner Name" value={formData.partner} onChange={(e) => setFormData({...formData, partner: e.target.value})} className={inputBase} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Country</label>
                  <select disabled={isEmployeeEditing} value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className={inputBase}>
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="UAE">UAE</option>
                      <option value="Oman">Oman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Invoice Number *</label>
                  <input disabled={isEmployeeEditing} type="text" placeholder="e.g. INV-2026-001" value={formData.invoiceNo} onChange={(e) => setFormData({...formData, invoiceNo: e.target.value})} className={`${inputBase} font-mono`} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Invoice Date *</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input disabled={isEmployeeEditing} type="date" value={formData.invoiceDate} onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})} className={iconInputBase} />
                  </div>
                </div>
              </div>
            </section>

            {/* Products & Services */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                <FileText size={16} className="text-slate-500" /> Services & Scope
              </h3>
              <div className="space-y-4">
                 <div>
                     <p className="text-sm font-semibold text-slate-700 mb-2">Product Allocation</p>
                     <div className="flex flex-wrap gap-2">
                        {AVAILABLE_PRODUCTS.map(prod => {
                            const isSelected = formData.products.includes(prod);
                            return (
                                <button
                                    key={prod}
                                    type="button"
                                    disabled={isEmployeeEditing}
                                    onClick={() => toggleProduct(prod)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all border ${
                                        isSelected
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                                            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                                >
                                    {prod}
                                </button>
                            );
                        })}
                     </div>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Detailed Description</label>
                    <textarea 
                        disabled={isEmployeeEditing}
                        rows="3" placeholder="Enter custom project details or scope of work..."
                        value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className={`${inputBase} resize-none`} 
                    />
                 </div>
              </div>
            </section>

            {/* Financial Ledger */}
            <section>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                <Calculator size={16} className="text-slate-500" /> Financial Ledger
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Services Fee <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input disabled={isEmployeeEditing} type="number" placeholder="0.00" value={formData.servicesFee} onChange={(e) => setFormData({...formData, servicesFee: e.target.value})} className={iconInputBase} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">VAT Amount</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input disabled={isEmployeeEditing} type="number" placeholder="0.00" value={formData.vat} onChange={(e) => setFormData({...formData, vat: e.target.value})} className={iconInputBase} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Received</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                    <input disabled={isEmployeeEditing} type="number" placeholder="0.00" value={formData.receivedAmount} onChange={(e) => setFormData({...formData, receivedAmount: e.target.value})} className={iconInputBase} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Grand Total (Auto)</p>
                    <p className="text-2xl font-bold text-white tabular-nums tracking-tight">OMR {grandTotal.toLocaleString()}</p>
                 </div>
                 <div className="bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-lg md:text-right">
                    <p className="text-xs font-bold text-rose-300 uppercase tracking-widest mb-1">Total Due Balance</p>
                    <p className="text-xl font-bold text-rose-400 tabular-nums tracking-tight">OMR {dueAmount.toLocaleString()}</p>
                 </div>
              </div>
            </section>

            {/* Tracking & Comments */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1">
                            Next Follow-up Date
                            {isEmployeeEditing && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Editable</span>}
                        </label>
                        <div className="relative">
                            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="date" value={formData.nextFollowUp} onChange={(e) => setFormData({...formData, nextFollowUp: e.target.value})} className={iconInputBase.replace('disabled:bg-slate-100', '')} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Record Status</label>
                        <select disabled={isEmployeeEditing} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={inputBase}>
                            {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex-1">
                        <label className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1">
                            Comments / Remarks
                            {isEmployeeEditing && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">Editable</span>}
                        </label>
                        <textarea 
                            rows="4" placeholder="Enter status updates or notes..."
                            value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                            className={`${inputBase.replace('disabled:bg-slate-100', '')} resize-none h-full min-h-[100px]`} 
                        />
                    </div>
                </div>
            </section>

            {/* Document Upload Area */}
            <section>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Supporting Documents <span className="text-slate-400 font-medium">(Optional)</span></label>
                <div className={`border-2 border-dashed border-slate-300 rounded-xl py-6 flex flex-col items-center justify-center transition-all ${isEmployeeEditing ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer group'}`}>
                    <Upload size={24} className="text-slate-400 group-hover:text-indigo-500 transition-colors mb-2" />
                    <p className="text-sm font-bold text-slate-600">Click or drag file here to attach</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                </div>
            </section>

        </form>

        {/* Sticky Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0 z-10">
          <button 
            type="button"
            onClick={onClose} 
            className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <CheckCircle2 size={18} />
            {isEditing ? 'Save Changes' : 'Confirm Order'}
          </button>
        </div>

      </div>
    </div>
  );
}