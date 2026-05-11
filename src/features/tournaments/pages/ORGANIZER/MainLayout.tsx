import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ListTournamentsPage from './TournamentListPage';

const MainLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Mapping tiêu đề dựa trên route hiện tại
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashbaord') return 'Dashboard';
    if (path.includes('/tournaments')) return 'Quản lý Giải đấu';
    if (path.includes('/registrations')) return 'Quản lý Đăng ký & Đội';
    return 'Hệ thống Quản lý';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar - Cố định bên trái với Gradient */}
      <Sidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header - Tiêu đề và Nút thao tác */}
        <Header 
          title={getPageTitle()} 
          onMenuClick={() => setIsMobileOpen(true)} 
        />

        {/* Nội dung trang thay đổi tại đây */}
        <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
            
                
            <Outlet />
  </div>
         
        </main>
      </div>
    </div>
  );
};
export default MainLayout;

