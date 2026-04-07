import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Bell, Search, Command, HelpCircle, ChevronRight } from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

export default function Header({ userRole }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false); // State for drawer
  const location = useLocation();

  // Logic to convert path names into readable breadcrumbs
  // e.g., /dashboard -> Dashboard, /masters -> Masters
  const pathnames = location.pathname.split('/').filter((x) => x);
  const currentPage = pathnames[0] ? pathnames[0].charAt(0).toUpperCase() + pathnames[0].slice(1) : 'Overview';

  return (
    <>
      <header className="sticky top-0 z-20 h-16 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 flex items-center justify-between transition-all">

        {/* --- Left: Dynamic Breadcrumbs --- */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-[13px] font-medium text-gray-400 group cursor-pointer hover:text-gray-900 transition-colors">
            <span className="px-1.5 py-0.5 rounded-md hover:bg-gray-100 transition-colors">Admin</span>
          </div>
          <ChevronRight size={14} className="text-gray-300" />
          <div className="flex items-center text-[13px] font-semibold text-gray-900 tracking-tight">
            <span className="px-1.5 py-0.5 rounded-md bg-gray-50 border border-gray-200/50">
              {currentPage === 'Masters' ? 'Master Data' : currentPage}
            </span>
          </div>
        </div>

        {/* --- Center/Right: Action Suite --- */}
        <div className="flex items-center gap-4">

          {/* Modern Search Trigger (Command Palette Style) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100/50 border border-gray-200/80 rounded-lg text-gray-400 hover:border-gray-300 hover:bg-gray-100 transition-all cursor-pointer group">
            <Search size={14} className="group-hover:text-gray-600 transition-colors" />
            <span className="text-[12px] font-medium pr-8">Search anything...</span>
            {/* <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-gray-200 font-mono text-[10px] font-bold bg-white text-gray-400 shadow-sm">
            <Command size={10} />
            <span>K</span>
          </div> */}
          </div>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          {/* Notification & Help Icons */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all relative group">
              <HelpCircle size={18} strokeWidth={2} />
              {/* <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Support Center
            </span> */}
            </button>

            <button
              onClick={() => setIsNotifOpen(true)} // Open on click
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all relative group"
            >
              <Bell size={18} strokeWidth={2} />
              {/* The Notification Dot */}
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white shadow-[0_0_4px_rgba(79,70,229,0.5)]"></span>

              {/* <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Notifications
            </span> */}
            </button>
          </div>

          {/* Responsive Role Badge (Visible only on mobile/tablet) */}
          <div className="lg:hidden px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{userRole}</span>
          </div>
        </div>
      </header>
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </>
  );
}