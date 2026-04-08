import { X, User, Building2, Package, ShieldCheck, Briefcase, Mail, Phone, Hash, MapPin, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MasterModal({ isOpen, onClose, type, onSave, editData }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({});
        }
    }, [isOpen, editData]);

    if (!isOpen) return null;

    // Configuration for different master types
    const configs = {
        customers: { title: 'Customer', icon: User },
        partners: { title: 'Partner', icon: Building2 },
        products: { title: 'Product', icon: Package },
        users: { title: 'System User', icon: User },
        departments: { title: 'Department', icon: ShieldCheck },
        designations: { title: 'Designation', icon: Briefcase },
    };

    const config = configs[type] || configs.customers;
    const Icon = config.icon;

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalId = editData ? editData.id : Date.now();
        onSave({ ...formData, id: finalId });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={onClose} 
            />

            {/* Right Side Drawer Panel */}
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                            <Icon size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">{editData ? 'Edit' : 'Create'} {config.title}</h2>
                            <p className="text-xs font-medium text-slate-500">Provide the required details for the registry.</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <form id="master-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

                    {type === 'customers' && (
                        <>
                            <InputField label="Customer Name" icon={User} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Email Address" icon={Mail} value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                            <InputField label="Phone Number" icon={Phone} value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                            <InputField label="Country" icon={MapPin} value={formData.country} onChange={v => setFormData({ ...formData, country: v })} />
                        </>
                    )}

                    {type === 'partners' && (
                        <>
                            <InputField label="Partner Name" icon={Building2} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Email Address" icon={Mail} value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                            <InputField label="Contact Phone" icon={Phone} value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                            <InputField label="Location" icon={MapPin} value={formData.country} onChange={v => setFormData({ ...formData, country: v })} />
                        </>
                    )}

                    {type === 'departments' && (
                        <>
                            <InputField label="Department Code" icon={Hash} value={formData.code} onChange={v => setFormData({ ...formData, code: v })} />
                            <InputField label="Department Name" icon={Building2} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Department Head" icon={User} value={formData.head} onChange={v => setFormData({ ...formData, head: v })} />
                        </>
                    )}

                    {type === 'designations' && (
                        <>
                            <InputField label="Designation Title" icon={Briefcase} value={formData.title} onChange={v => setFormData({ ...formData, title: v })} />
                            <InputField label="Department" icon={ShieldCheck} value={formData.department} onChange={v => setFormData({ ...formData, department: v })} />
                        </>
                    )}

                    {type === 'users' && (
                        <>
                            <InputField label="Full Name" icon={User} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Email Address" icon={Mail} value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">System Role</label>
                                <select
                                    value={formData.role || ''}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">Select Role...</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Employee">Employee</option>
                                </select>
                            </div>
                        </>
                    )}

                    {type === 'products' && (
                        <>
                            <InputField label="Product Code" icon={Hash} value={formData.code} onChange={v => setFormData({ ...formData, code: v })} />
                            <InputField label="Product Name" icon={Package} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Standard Price (AED)" icon={DollarSign} value={formData.price} onChange={v => setFormData({ ...formData, price: v })} type="number" />
                        </>
                    )}

                </form>

                {/* Sticky Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="master-form"
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                        {editData ? 'Update Entry' : 'Save Entry'}
                    </button>
                </div>

            </div>
        </div>
    );
}

// Reusable input component with human-authored styles
function InputField({ label, icon: Icon, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon size={16} />
                </div>
                <input
                    type={type}
                    required
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
            </div>
        </div>
    );
}