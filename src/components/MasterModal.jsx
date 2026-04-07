import { X, CheckCircle2, User, Users, Building2, Package, ShieldCheck, Briefcase, Mail, Phone, Hash, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MasterModal({ isOpen, onClose, type, onSave, editData }) {
    const [formData, setFormData] = useState({});

    // Reset or Populate form when modal opens or editData changes
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
        customers: { title: 'Customer', icon: User, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        partners: { title: 'Partner', icon: Building2, color: 'text-sky-600', bg: 'bg-sky-50' },
        products: { title: 'Product', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        users: { title: 'System User', icon: User, color: 'text-violet-600', bg: 'bg-violet-50' },
        departments: { title: 'Department', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
        designations: { title: 'Designation', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
    };

    const config = configs[type] || configs.customers;
    const Icon = config.icon;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use the ID from editData if we are editing, otherwise null
        const finalId = editData ? editData.id : null;
        onSave({ ...formData, id: finalId });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center shadow-sm`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{editData ? 'Edit' : 'Create'} {config.title}</h2>
                            <p className="text-xs text-gray-500 font-medium">Enter the registry details below.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900"><X size={20} /></button>
                </div>

                {/* Dynamic Form Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* TYPE: CUSTOMERS */}
                    {type === 'customers' && (
                        <>
                            <InputField label="Client Name" icon={User} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Email Address" icon={Mail} value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                            <InputField label="Phone Number" icon={Phone} value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                            <InputField label="Country" icon={MapPin} value={formData.country} onChange={v => setFormData({ ...formData, country: v })} />
                        </>
                    )}

                    {/* TYPE: PARTNERS (Added Fix) */}
                    {type === 'partners' && (
                        <>
                            <InputField label="Company Name" icon={Building2} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Email Address" icon={Mail} value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                            <InputField label="Phone Number" icon={Phone} value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                            <InputField label="Country / Location" icon={MapPin} value={formData.country} onChange={v => setFormData({ ...formData, country: v })} />
                        </>
                    )}

                    {/* TYPE: DEPARTMENTS */}
                    {type === 'departments' && (
                        <>
                            <InputField label="Dept Code" icon={Hash} value={formData.code} onChange={v => setFormData({ ...formData, code: v })} />
                            <InputField label="Department Name" icon={Building2} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Department Head" icon={User} value={formData.head} onChange={v => setFormData({ ...formData, head: v })} />
                            <InputField label="Employee Count" icon={Users} type="number" value={formData.count} onChange={v => setFormData({ ...formData, count: v })} />
                        </>
                    )}

                    {/* TYPE: DESIGNATIONS */}
                    {type === 'designations' && (
                        <>
                            <InputField label="Job Title" icon={Briefcase} value={formData.title} onChange={v => setFormData({ ...formData, title: v })} />
                            <InputField label="Associated Department" icon={ShieldCheck} value={formData.department} onChange={v => setFormData({ ...formData, department: v })} />
                            <InputField label="Seniority Level" icon={Hash} value={formData.level} onChange={v => setFormData({ ...formData, level: v })} />
                        </>
                    )}

                    {/* TYPE: USERS */}
                    {type === 'users' && (
                        <>
                            <InputField label="Full Name" icon={User} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Email Address" icon={Mail} value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">System Role</label>
                                <select
                                    value={formData.role || ''}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Select Role...</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Employee">Employee</option>
                                </select>
                            </div>
                            <InputField label="Department" icon={Briefcase} value={formData.department} onChange={v => setFormData({ ...formData, department: v })} />
                        </>
                    )}

                    {/* TYPE: PRODUCTS */}
                    {type === 'products' && (
                        <>
                            <InputField label="Product Code" icon={Hash} value={formData.code} onChange={v => setFormData({ ...formData, code: v })} />
                            <InputField label="Product Name" icon={Package} value={formData.name} onChange={v => setFormData({ ...formData, name: v })} />
                            <InputField label="Category" icon={ShieldCheck} value={formData.category} onChange={v => setFormData({ ...formData, category: v })} />
                            <InputField label="Price (AED)" icon={DollarSign} value={formData.price} onChange={v => setFormData({ ...formData, price: v })} />
                        </>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors px-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-xl shadow-gray-900/10 hover:bg-indigo-600 hover:shadow-indigo-500/20 transition-all active:scale-95"
                        >
                            <CheckCircle2 size={18} className="text-emerald-400" />
                            {editData ? 'Update Record' : 'Save Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Internal Helper for cleaner inputs
function InputField({ label, icon: Icon, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
            <div className="relative group">
                <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                    type={type}
                    required
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all shadow-sm outline-none"
                />
            </div>
        </div>
    );
}

function DollarSign({ size, className }) {
    return (
        <div className={`flex items-center justify-center text-[12px] font-bold ${className}`} style={{ width: size, height: size }}>
            AED
        </div>
    );
}