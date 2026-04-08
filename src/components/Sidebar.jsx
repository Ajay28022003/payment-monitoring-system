import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, CalendarClock,
  BarChart3, Database, LogOut, ChevronLeft,
  ChevronRight, Command, ChevronDown, Users,
  Building2, Package, Users2, ShieldCheck, Briefcase,
  Settings
} from 'lucide-react';

export default function Sidebar({ userRole, onLogout, isCollapsed, setIsCollapsed }) {
  const [isMastersOpen, setIsMastersOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'employee'] },
    { name: 'Orders', to: '/orders', icon: ShoppingCart, roles: ['admin', 'employee'] },
    // { name: 'Follow-ups', to: '/followups', icon: CalendarClock, roles: ['admin', 'employee'] },
  ];

  const adminItems = [
    // { name: 'Reports', to: '/reports', icon: BarChart3, roles: ['admin'] },
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
      className={`relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-30 ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-600 hover:text-indigo-700 hover:border-indigo-400 shadow-sm transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="h-16 flex items-center px-6 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="shrink-0 w-8 h-8 bg-indigo-700 rounded-md flex items-center justify-center shadow-sm">
            <Command size={20} className="text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-extrabold text-slate-900 whitespace-nowrap tracking-tight">
              ProTrack
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6 space-y-8 custom-scrollbar">

        {/* Main Section */}
        <div>
          {!isCollapsed && (
            <p className="px-3 mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Workspace
            </p>
          )}
          <nav className="space-y-1">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                {/* Now using the render prop pattern for children to fix the error */}
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className="shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Management Section */}
        {userRole === 'admin' && (
          <div>
            {!isCollapsed && (
              <p className="px-3 mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                Management
              </p>
            )}
            <nav className="space-y-1">
              {visibleAdminItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={18} className="shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </>
                  )}
                </NavLink>
              ))}

              <div className="pt-1">
                <button
                  onClick={handleMastersClick}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${isMastersActive && isCollapsed ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <div className={`flex items-center gap-3 ${isCollapsed ? 'mx-auto' : ''}`}>
                    <Database size={18} className="shrink-0" strokeWidth={isMastersActive ? 2.5 : 2} />
                    {!isCollapsed && <span>Masters</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isMastersOpen ? 'rotate-180' : ''}`} />
                  )}
                </button>

                <div className={`overflow-hidden transition-all duration-200 ease-in-out ${!isCollapsed && isMastersOpen ? 'max-h-[400px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-4 pl-3 border-l-2 border-slate-200 space-y-1 py-1">
                    {mastersSubItems.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.to}
                        className={({ isActive }) => `
                          flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                          ${isActive ? 'text-indigo-700 font-bold' : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            <sub.icon size={16} className="shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="truncate">{sub.name}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="p-4 border-t border-slate-200 shrink-0 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) => `
            flex items-center gap-3 p-2 rounded-lg transition-colors group
            ${isActive ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 text-sm font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            AN
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">Mac Allister</p>
              <p className="text-xs text-slate-600 font-semibold truncate capitalize">{userRole}</p>
            </div>
          )}
          {!isCollapsed && (
            <Settings size={18} className="text-slate-400 group-hover:text-indigo-700 transition-colors" />
          )}
        </NavLink>

        {!isCollapsed && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-sm font-bold"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}