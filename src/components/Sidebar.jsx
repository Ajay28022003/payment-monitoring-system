import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, CalendarClock, 
  BarChart3, Database, LogOut, ChevronLeft, 
  ChevronRight, Command, ChevronDown, Users, 
  Building2, Package, Users2, ShieldCheck, Briefcase,
  Settings // <--- 1. IMPORT SETTINGS ICON
} from 'lucide-react';

export default function Sidebar({ userRole, onLogout, isCollapsed, setIsCollapsed }) {
  const [isMastersOpen, setIsMastersOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'employee'] },
    { name: 'Orders', to: '/orders', icon: ShoppingCart, roles: ['admin', 'employee'] },
    { name: 'Follow-ups', to: '/followups', icon: CalendarClock, roles: ['admin', 'employee'] },
  ];

  const adminItems = [
    { name: 'Reports', to: '/reports', icon: BarChart3, roles: ['admin'] },
  ];

  const mastersSubItems = [
    { name: 'Customers', to: '/masters/customers', icon: Users },
    { name: 'Partners', to: '/masters/partners', icon: Building2 },
    { name: 'Products', to: '/masters/products', icon: Package },
    { name: 'Users', to: '/masters/users', icon: Users2 },
    { name: 'Departments', to: '/masters/departments', icon: ShieldCheck },
    { name: 'Designations', to: '/masters/designations', icon: Briefcase },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(userRole));
  const visibleAdminItems = adminItems.filter(item => item.roles.includes(userRole));

  const isMastersActive = location.pathname.includes('/masters');

  const handleMastersClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setIsMastersOpen(true);
    } else {
      setIsMastersOpen(!isMastersOpen);
    }
  };

  return (
    <aside 
      className={`relative flex flex-col bg-white border-r border-gray-200/60 transition-all duration-300 ease-in-out z-30 ${
        isCollapsed ? 'w-[80px]' : 'w-[260px]'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Workspace / Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-100 shadow-lg">
            <Command size={18} className="text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-base font-bold text-gray-900 tracking-tight animate-in fade-in duration-500">
              ProTrack
            </span>
          )}
        </div>
      </div>

      {/* Navigation Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6 space-y-8 custom-scrollbar">
        {/* Main Section */}
        <div>
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] animate-in fade-in">
              Workspace
            </p>
          )}
          <nav className="space-y-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon size={18} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Management Section (Admin Only) */}
        {userRole === 'admin' && (
          <div>
            {!isCollapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] animate-in fade-in">
                Management
              </p>
            )}
            <nav className="space-y-1">
              {visibleAdminItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) => `
                    group flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </NavLink>
              ))}

              <div className="pt-1">
                <button 
                  onClick={handleMastersClick}
                  className={`w-full group flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isMastersActive && isCollapsed ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`flex items-center gap-3 ${isCollapsed ? 'mx-auto' : ''}`}>
                    <Database size={18} className="shrink-0" />
                    {!isCollapsed && <span>Masters</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isMastersOpen ? 'rotate-180' : ''}`} />
                  )}
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${!isCollapsed && isMastersOpen ? 'max-h-64 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-4 pl-3 border-l border-gray-100 space-y-1 py-1">
                    {mastersSubItems.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.to}
                        className={({ isActive }) => `
                          flex items-center gap-3 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200
                          ${isActive ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                        `}
                      >
                        <sub.icon size={14} className="shrink-0" />
                        <span className="truncate">{sub.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* --- 2. UPDATED PROFILE SECTION --- */}
      <div className="p-3 border-t border-gray-100 shrink-0 space-y-2">
        
        {/* Profile / Settings Link */}
        <NavLink 
          to="/settings"
          className={({ isActive }) => `
            flex items-center gap-3 p-2 rounded-xl transition-all duration-200 group
            ${isActive ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50'}
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            AN
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2">
              <p className="text-[13px] font-bold text-gray-900 truncate">Mac Allister</p>
              <p className="text-[11px] text-gray-400 truncate capitalize font-medium">{userRole}</p>
            </div>
          )}
          {!isCollapsed && (
            <Settings size={14} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
          )}
        </NavLink>

        {/* Dedicated Logout Button (Only shows when expanded or as a secondary action) */}
        {!isCollapsed && (
            <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 text-[12px] font-bold uppercase tracking-widest"
            >
                <LogOut size={16} />
                <span>Sign Out</span>
            </button>
        )}
      </div>
    </aside>
  );
}