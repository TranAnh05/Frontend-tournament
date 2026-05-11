import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useUiStore } from './store/uiStore';

const NAV_ITEMS: Record<string, { label: string; icon: string; path: string }[]> = {
  ROLE_CLUB_MANAGER: [
    { label: 'Hồ sơ CLB', icon: '🏟', path: '/club' },
    { label: 'Thành viên', icon: '👥', path: '/club/members' },
    { label: 'Lịch thi đấu', icon: '📅', path: '/club/matches' },
    { label: 'Giải đấu', icon: '🏆', path: '/club/tournaments' },
    { label: 'Chốt danh sách', icon: '📋', path: '/club/roster' },
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
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold cursor-pointer transition-all ${
            toast.type === "error" ? "bg-red-500" :
            toast.type === "info"  ? "bg-blue-500" :
            "bg-green-600"
          }`}
        >
          {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"} {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-60 bg-white border-r border-gray-200 flex flex-col z-10">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-lg flex-shrink-0">
            ⚽
          </div>
          <div>
            <div className="text-sm font-extrabold text-gray-900 leading-tight">Tournament</div>
            <div className="text-xs text-gray-400">Management</div>

            {userRole === 'ROLE_CLUB_MANAGER' && user?.fullName && (
              <div className="text-xs text-green-700 font-semibold mt-0.5 truncate max-w-[120px]">
                👤 {user.fullName}
              </div>
            )}
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 pb-2">
            Menu
          </div>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all ${isActive
                  ? 'bg-green-50 text-green-700 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-gray-900 truncate">{user?.fullName}</div>
              <div className="text-xs text-gray-400">{roleLabel}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 h-14 bg-white border-b border-gray-200 flex items-center px-6 z-10">
          <span className="text-sm text-gray-500">
            Xin chào, <strong className="text-gray-900">{user?.fullName}</strong> 👋
          </span>
        </header>

        {/* Page content */}
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}