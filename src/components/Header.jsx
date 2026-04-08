import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Bell, Search, HelpCircle, ChevronRight } from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

export default function Header({ userRole }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();

  // Convert path names into readable breadcrumbs
  const pathnames = location.pathname.split('/').filter((x) => x);
  const currentPage = pathnames[0] ? pathnames[0].charAt(0).toUpperCase() + pathnames[0].slice(1) : 'Overview';

  return (
    <>
      <header className="sticky top-0 z-20 h-16 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
            <span className="px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">Admin</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
          <div className="flex items-center text-sm font-semibold text-gray-900">
            <span className="px-2 py-1 rounded-md bg-gray-50 border border-gray-200">
              {currentPage === 'Masters' ? 'Master Data' : currentPage}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-400 hover:border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer group">
            <Search size={16} className="group-hover:text-gray-600 transition-colors" />
            <span className="text-sm font-medium text-gray-500 pr-12">Search anything...</span>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          {/* Icons */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <HelpCircle size={20} />
            </button>

            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>

          {/* Mobile Role Badge */}
          <div className="lg:hidden px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-md">
            <span className="text-xs font-semibold text-indigo-700 uppercase">{userRole}</span>
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