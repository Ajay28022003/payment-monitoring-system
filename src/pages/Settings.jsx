import { useState } from 'react';
import { 
  User, Building, Bell, Shield, Mail, Lock, 
  Globe, Camera, Save, RefreshCw, CheckCircle2, 
  Percent, Smartphone, Hash
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'company', label: 'Company Info', icon: Building },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    // { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully.");
    }, 800);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account, company defaults, and security.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-5 pb-6 border-b border-gray-200">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-2xl font-bold border border-gray-200">
                    AN
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-300 rounded-full shadow-sm text-gray-600 hover:text-indigo-600">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Mac Allister</h3>
                  <p className="text-sm text-gray-500">Administrator • Matrix Technologies</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" icon={User} placeholder="Mac Allister" />
                <InputGroup label="Email Address" icon={Mail} placeholder="mac@matrix.com" />
                <InputGroup label="Current Password" icon={Lock} type="password" placeholder="••••••••" />
                <InputGroup label="New Password" icon={Lock} type="password" placeholder="Leave blank to keep current" />
              </div>
            </div>
          )}

          {/* Company Info Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Entity Details</h3>
                <p className="text-sm text-gray-500">These details appear on generated documents and reports.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Company Legal Name" icon={Building} placeholder="Matrix Technologies" />
                <InputGroup label="VAT Registration No" icon={Hash} placeholder="TRN-1002345678" />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option>AED - United Arab Emirates Dirham</option>
                      <option>INR - Indian Rupee</option>
                      <option>OMR - Omani Rial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Standard VAT Rate (%)</label>
                  <div className="relative">
                    <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" placeholder="5" className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Notification Preferences</h3>
                <p className="text-sm text-gray-500">Manage how and when you receive alerts.</p>
              </div>
              <div className="space-y-4">
                <ToggleSwitch label="Payment Due Alerts" description="Get notified when an invoice becomes overdue." defaultChecked />
                <ToggleSwitch label="New Order Assignments" description="Receive an email when assigned a new client." defaultChecked />
                <ToggleSwitch label="Daily Summary Reports" description="A morning digest of all pending follow-ups." />
                <ToggleSwitch label="Browser Notifications" description="Real-time alerts while using the console." defaultChecked />
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 size={20} className="text-emerald-600 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-emerald-900">Two-Factor Authentication Active</h4>
                    <p className="text-sm text-emerald-700 mt-1">Your account is secured with email verification.</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Active Sessions</h3>
                <div className="space-y-3">
                  <DeviceItem name="Chrome on MacBook Pro" location="Dubai, UAE" status="Active Now" isActive />
                  <DeviceItem name="Mobile App (iPhone 15)" location="Abu Dhabi, UAE" status="Last seen 2h ago" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Helper Components

function InputGroup({ label, icon: Icon, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type={type}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}

function ToggleSwitch({ label, description, defaultChecked = false }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );
}

function DeviceItem({ name, location, status, isActive = false }) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-md text-gray-500">
          <Smartphone size={16} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{location}</p>
        </div>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    </div>
  );
}