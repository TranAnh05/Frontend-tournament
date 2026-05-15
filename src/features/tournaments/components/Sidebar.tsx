import { Trophy, LayoutDashboard, Users, CalendarDays, LogOut, BarChart3 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

const Sidebar = ({ isOpen, onClose ,isCollapsed = false}: { isOpen: boolean; onClose: () => void ,isCollapsed?: boolean}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
      okText: 'Đăng xuất',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        logout();
        navigate('/login', { replace: true });
      },
    });
  };

  const menuItems = [
    { path: '/organizer', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/organizer/tournaments', label: 'Quản lý giải đấu', icon: Trophy },
    { path: '/organizer/registrations', label: 'Quản lý đăng ký & đội', icon: Users },
    { path: '/organizer/groups-schedule', label: 'Bảng đấu & Lịch trình', icon: CalendarDays },
    { path: '/organizer/standings', label: 'Bảng xếp hạng', icon: BarChart3 },
  ];

  const initials = user?.fullName
    ? user.fullName.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase()
    : 'BT';

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50 
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} w-72 
        bg-gradient-to-b from-blue-600 to-blue-800 text-white
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-2xl overflow-hidden
      `}
    >
      {/* Logo */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} h-24`}>
        <div className="bg-white/20 p-2 rounded-xl shadow-inner shrink-0">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
          <h1 className="text-xl font-bold tracking-tight">Tournament</h1>
          <p className="text-[10px] text-blue-200 uppercase tracking-widest">Quản lý giải đấu</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems.map((item) => {
          const isActive =
            item.path === '/organizer'
              ? location.pathname === '/organizer' || location.pathname === '/organizer/'
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              title={isCollapsed ? item.label : ''} // Hiện tooltip khi đang thu gọn
              className={`
                flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-4 px-4'} py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-white text-blue-700 shadow-lg font-bold'
                  : 'text-blue-50 hover:bg-white/10 hover:translate-x-1'}
              `}
            >
              <item.icon size={22} className="shrink-0" />
              <span className={`text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className={`mt-auto border-t border-blue-500/30 ${isCollapsed ? 'p-3' : 'p-5'}`}>
        <div className={`flex items-center bg-blue-900/30 rounded-2xl backdrop-blur-sm ${isCollapsed ? 'p-2 justify-center' : 'p-3 gap-3'}`}>
          <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-blue-900 font-black shadow-md text-sm shrink-0">
            {initials}
          </div>
          <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
            <p className="text-sm font-bold truncate text-white">{user?.fullName ?? 'Ban Tổ Chức'}</p>
            <p className="text-[11px] text-blue-200 truncate">{user?.email ?? ''}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title={isCollapsed ? "Đăng xuất" : ""}
          className={`w-full mt-2 flex items-center text-blue-200 hover:text-white hover:bg-blue-600/50 rounded-xl transition-all
            ${isCollapsed ? 'p-3 justify-center' : 'py-3 justify-center gap-2'}
          `}
        >
          <LogOut size={20} strokeWidth={2.5} className="shrink-0" />
          <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
            Đăng xuất
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;