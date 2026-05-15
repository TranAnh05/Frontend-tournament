import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useUiStore } from './store/uiStore';

const NAV_ITEMS: Record<string, { label: string; icon: string; path: string }[]> = {
  ROLE_CLUB_MANAGER: [
    { label: 'Hồ sơ CLB', icon: '🏟', path: '/club' },
    { label: 'Thành viên', icon: '👥', path: '/club/members' },
    { label: 'Lịch thi đấu', icon: '📅', path: '/club/matches' },
    { label: 'Giải đấu', icon: '🏆', path: '/club/tournaments' },
  ],
  ROLE_ADMIN: [{ label: 'Tổng quan', icon: '📊', path: '/admin' }],
  ROLE_ORGANIZER: [{ label: 'Tổng quan', icon: '📊', path: '/organizer' }],
  ROLE_REFEREE: [{ label: 'Tổng quan', icon: '📊', path: '/referee' }],
  ROLE_ATHLETE: [{ label: 'Tổng quan', icon: '📊', path: '/athlete' }],
};

const ROLE_LABELS: Record<string, string> = {
  ROLE_ADMIN: 'Quản trị viên',
  ROLE_ORGANIZER: 'Ban tổ chức',
  ROLE_CLUB_MANAGER: 'Quản lý CLB',
  ROLE_REFEREE: 'Trọng tài',
  ROLE_ATHLETE: 'Vận động viên',
};

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast, clearToast } = useUiStore();

  const userRole = user?.roles?.[0] ?? '';
  const navItems = NAV_ITEMS[userRole] ?? [];
  const roleLabel = ROLE_LABELS[userRole] ?? userRole;
  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {toast && (
        <div
          onClick={clearToast}
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl cursor-pointer select-none ${
            toast.type === "error" ? "bg-red-500" :
            toast.type === "info"  ? "bg-blue-500" :
            "bg-blue-600"
          }`}
          style={{ minWidth: 280, maxWidth: 420 }}
        >
          <span className="text-2xl flex-shrink-0">
            {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"}
          </span>
          <span className="text-white text-[15px] font-bold leading-snug flex-1">
            {toast.message}
          </span>
          <span className="text-white/70 text-lg ml-2">×</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-gray-900 text-white flex flex-col z-10 shadow-xl">

        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">CLUB HUB</h1>
          {userRole === 'ROLE_CLUB_MANAGER' && user?.fullName && (
            <p className="text-xs text-gray-400 mt-1 truncate">👤 {user.fullName}</p>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border border-blue-500">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-gray-100 truncate">{user?.fullName}</div>
              <div className="text-xs text-gray-400 truncate">{roleLabel}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-700 bg-transparent text-gray-300 text-xs font-semibold hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 h-14 bg-white border-b border-gray-200 flex items-center px-6 z-10 shadow-sm">
          <span className="text-sm text-gray-500">
            Xin chào, <strong className="text-gray-900">{user?.fullName}</strong> 👋
          </span>
        </header>

        {/* Page content */}
        <div className="p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}