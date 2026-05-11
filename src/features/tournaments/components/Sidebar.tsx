import { Trophy, LayoutDashboard, Users, CalendarDays, AlertTriangle, LogOut } from 'lucide-react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { Modal } from 'antd'; // ✨ Import Modal từ antd


const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
      okText: 'Đăng xuất',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        // 1. Xóa Token khỏi Local Storage hoặc Session Storage
        localStorage.removeItem('token'); // Hoặc tên key bạn dùng để lưu token
        localStorage.removeItem('user'); 
        
        // 2. Chuyển hướng về trang đăng nhập
        navigate('/login', { replace: true }); 
        // Dùng replace: true để người dùng không thể bấm nút Back (Trở lại) trên trình duyệt
      }
    });
  };

  const menuItems = [
    { path: '/organizer', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/organizer/tournaments', label: 'Quản lý Giải đấu', icon: Trophy },
    { path: '/organizer/registrations', label: 'Quản lý Đăng ký & Đội', icon: Users },
    { path: '/schedule', label: 'Bảng đấu & Lịch trình', icon: CalendarDays },
    { path: '/operations', label: 'Vận hành & Sự cố', icon: AlertTriangle },
  ];

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50 w-72 
      bg-gradient-to-b from-blue-600 to-blue-800 text-white 
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      flex flex-col shadow-2xl
    `}>
      {/* Logo Section */}
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
          
          // ✨ CẬP NHẬT LOGIC ACTIVE Ở ĐÂY ✨
          // Nếu path là trang chủ Dashboard, bắt buộc phải khớp chính xác 100%
          // Nếu là các trang khác, dùng startsWith để bọc lót cho các trang chi tiết bên trong
          const isActive = item.path === '/organizer' 
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
                  ? 'bg-white text-blue-700 shadow-lg font-bold' // Nền trắng chữ xanh khi được chọn
                  : 'text-blue-50 hover:bg-white/10 hover:translate-x-1'} // Xóa nền trắng nếu không được chọn
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
          <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-blue-900 font-black shadow-md">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-white">Admin User</p>
            <p className="text-[11px] text-blue-200 truncate">admin@Orannize.vn</p>
          </div>
        </div>
      </div>
      <button 
  onClick={handleLogout}
  className="w-full mt-2 py-3 flex items-center justify-center gap-2 text-blue-200 hover:text-white hover:bg-blue-600/50 rounded-xl transition-all"
>
  <LogOut size={18} strokeWidth={2.5} />
  <span className="font-medium">Đăng xuất</span>
</button>
    </aside>
  );
  
};
export default Sidebar;