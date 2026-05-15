import { Trophy, LayoutDashboard, Users, CalendarDays, LogOut, BarChart3 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
        // Gọi đúng hàm logout của Zustand — xóa toàn bộ store (token + user + isAuthenticated)
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

  // Lấy 2 chữ cái đầu của tên để làm avatar
  const initials = user?.fullName
    ? user.fullName.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase()
    : 'BT';

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72
        bg-gradient-to-b from-blue-600 to-blue-800 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-2xl
      `}
    >
      {/* Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-xl shadow-inner">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Tournament</h1>
          <p className="text-[10px] text-blue-200 uppercase tracking-widest">Quản lý giải đấu</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5">
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
              className={`
                flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200
                ${isActive
                  ? 'bg-white text-blue-700 shadow-lg font-bold'
                  : 'text-blue-50 hover:bg-white/10 hover:translate-x-1'}
              `}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className="p-6 mt-auto border-t border-blue-500/30">
        <div className="flex items-center gap-3 bg-blue-900/20 p-4 rounded-2xl backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-blue-900 font-black shadow-md text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-white">{user?.fullName ?? 'Ban Tổ Chức'}</p>
            <p className="text-[11px] text-blue-200 truncate">{user?.email ?? ''}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-2 py-3 flex items-center justify-center gap-2 text-blue-200 hover:text-white hover:bg-blue-600/50 rounded-xl transition-all"
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;