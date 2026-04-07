import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; // Assuming you have this separately

export default function AppLayout({ userRole, onLogout }) {
  // Sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans overflow-hidden">
      
      {/* 1. Enhanced Sidebar */}
      <Sidebar 
        userRole={userRole} 
        onLogout={onLogout} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 2. Enhanced Header */}
        <Header userRole={userRole} />
        
        {/* 3. Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  );
}