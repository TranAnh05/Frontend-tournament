import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const MainLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false); 
  

  const getPageTitle = () => {
    const path = location.pathname;
    // Fix lỗi typo 'dashbaord' → so sánh đúng path '/organizer'
    if (path === '/organizer' || path === '/organizer/') return 'Dashboard';
    if (path.includes('/tournaments')) return 'Quản lý giải đấu';
    if (path.includes('/registrations')) return 'Quản lý đăng ký & đội';
    if (path.includes('/groups-schedule')) return 'Bảng đấu & Lịch trình';
    if (path.includes('/standings')) return 'Bảng xếp hạng';
    return 'Hệ thống quản lý';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar 
        isOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
        isCollapsed={isCollapsed} 
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Header
          title={getPageTitle()}
          onMenuClick={() => setIsMobileOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;