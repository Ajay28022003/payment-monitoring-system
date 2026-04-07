import { useState } from 'react';
import { 
  User, Building, Bell, Shield, Mail, Lock, 
  Globe, Camera, Save, RefreshCw, CheckCircle2, 
  CreditCard, Percent, Smartphone 
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // --- Tab Configuration ---
  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'company', label: 'Company Info', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Configuration synced successfully.");
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 fade-in duration-1000">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage your identity, company defaults, and security preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- Navigation Sidebar (Tabs) --- */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white border border-gray-200 text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* --- Dynamic Content Area --- */}
        <div className="flex-1 bg-white border border-gray-200/60 rounded-[2rem] shadow-sm overflow-hidden p-8 md:p-10">
          
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-3xl font-bold border-2 border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                    AN
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 bg-white border border-gray-200 rounded-xl shadow-lg text-gray-500 hover:text-indigo-600 transition-all">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Mac Allister</h3>
                  <p className="text-sm text-gray-500 font-medium">Administrator • Matrix Technologies</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" icon={User} placeholder="Maxc" />
                <InputGroup label="Email Address" icon={Mail} placeholder="mac@matrix.com" />
                <InputGroup label="Current Password" icon={Lock} type="password" placeholder="••••••••" />
                <InputGroup label="New Password" icon={Lock} type="password" placeholder="Leave empty to keep current" />
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY INFO (Matches Manager's requirements) */}
          {activeTab === 'company' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Entity Details</h3>
                <p className="text-sm text-gray-500">These details will appear on generated PDF invoices.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Company Legal Name" icon={Building} placeholder="Matrix Technologies" />
                <InputGroup label="VAT Registration No" icon={Hash} placeholder="TRN-1002345678" />
                <div className="relative">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Default Currency</label>
                  <div className="relative group">
                    <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
                    <select className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none outline-none cursor-pointer">
                      <option>AED - United Arab Emirates Dirham</option>
                      <option>INR - Indian Rupee</option>
                      <option>OMR - Omani Rial</option>
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Standard VAT Rate (%)</label>
                  <div className="relative group">
                    <Percent size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
                    <input type="number" placeholder="5" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                <ToggleSwitch label="Payment Due Alerts" description="Get notified when an invoice becomes overdue." defaultChecked />
                <ToggleSwitch label="New Order Assignments" description="Receive an email when an admin assigns you a new client." defaultChecked />
                <ToggleSwitch label="Daily Summary Reports" description="A morning digest of all pending follow-ups for the day." />
                <ToggleSwitch label="Browser Notifications" description="Real-time alerts while using the PayTrack console." defaultChecked />
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[1.5rem] flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                    <CheckCircle2 size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-emerald-900">Two-Factor Authentication (2FA) is Active</h4>
                    <p className="text-xs text-emerald-700/80 mt-1 font-medium">Your account is secured with biometric verification and email codes.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Device Sessions</h3>
                  <div className="space-y-3">
                    <DeviceItem name="Chrome on MacBook Pro" location="Dubai, UAE" status="Active Now" />
                    <DeviceItem name="PayTrack Mobile App (iPhone 15)" location="Abu Dhabi, UAE" status="Last seen 2h ago" />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// --- Internal Helper Components ---

function InputGroup({ label, icon: Icon, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
      <div className="relative group">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type={type}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all outline-none"
        />
      </div>
    </div>
  );
}

function ToggleSwitch({ label, description, defaultChecked = false }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 font-medium">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );
}

function DeviceItem({ name, location, status }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg text-gray-400">
          <Smartphone size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500 font-medium">{location}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest ${status === 'Active Now' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
        {status}
      </span>
    </div>
  );
}

const Hash = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>;