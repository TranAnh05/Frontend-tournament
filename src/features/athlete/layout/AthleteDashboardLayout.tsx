import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

const NAV = [
  { label: 'Danh sách CLB',   icon: '🏟️', path: '/athlete/clubs' },
  { label: 'Đơn ứng tuyển',   icon: '📋', path: '/athlete/applications' },
  { label: 'Hồ sơ của tôi',   icon: '👤', path: '/athlete/profile' },
];

export default function AthleteDashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="fixed top-0 left-0 bottom-0 w-60 bg-white border-r border-gray-200 flex flex-col z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-lg">
            ⚽
          </div>
          <div>
            <div className="text-sm font-extrabold text-gray-900">Tournament</div>
            <div className="text-xs text-gray-400">Vận động viên</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3">
          {NAV.map(item => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all
                ${isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <span>{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="text-xs font-bold text-gray-900 mb-2">{user?.fullName}</div>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-full px-3 py-1.5 rounded-lg border text-gray-500 text-xs hover:bg-gray-50 cursor-pointer">
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      <main className="ml-60 flex-1 flex flex-col">
        <header className="sticky top-0 h-14 bg-white border-b flex items-center px-6">
          <span className="text-sm text-gray-500">
            Xin chào, <strong>{user?.fullName}</strong> 👋
          </span>
        </header>
        <div className="p-6 flex-1"><Outlet /></div>
      </main>
    </div>
  );
}