import { X, Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose }) {
  // Mock notifications data
  const notifications = [
    { id: 1, type: 'success', title: 'Payment Received', desc: 'Invoice #INV-2024 has been paid.', time: '2m ago' },
    { id: 2, type: 'alert', title: 'Pending Approval', desc: 'Order #882 requires manager sign-off.', time: '1h ago' },
    { id: 3, type: 'info', title: 'System Update', desc: 'New logistics modules are now live.', time: '5h ago' },
  ];

  return (
    <>
      {/* Backdrop: Darkens the background when open */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[40] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-[50] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">3 Unread Messages</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto h-[calc(100%-88px)] p-4 space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer group">
              <div className="flex gap-4">
                <div className="mt-1">
                  {n.type === 'success' && <CheckCircle2 className="text-emerald-500" size={18} />}
                  {n.type === 'alert' && <AlertCircle className="text-rose-500" size={18} />}
                  {n.type === 'info' && <Info className="text-indigo-500" size={18} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-gray-900">{n.title}</h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{n.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State Action */}
          <button className="w-full py-3 text-[11px] font-bold text-gray-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}