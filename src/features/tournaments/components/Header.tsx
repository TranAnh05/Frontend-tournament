import { Menu, Plus, PanelLeftClose, PanelLeft } from 'lucide-react'; 
import { useLocation } from 'react-router-dom';

const Header = ({ title, onMenuClick ,onToggleCollapse, 
  isCollapsed }: { title: string; 
  onMenuClick: () => void; 
  onToggleCollapse?: () => void; 
  isCollapsed?: boolean }) => {
  const location = useLocation();
  // Fix: route thực tế là /organizer/tournaments, không phải /tournaments
  const isTournamentPage = location.pathname === '/organizer/tournaments';

  const handleOpenAddModal = () => {
    window.dispatchEvent(new CustomEvent('open-add-tournament'));
  };

  return (
<header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Nút Hamburger cho Mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={24} />
        </button>

        {/* ✨ NÚT THU GỌN/MỞ RỘNG SIDEBAR (CHỈ HIỆN TRÊN DESKTOP) */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 text-slate-500 hover:bg-slate-200 hover:text-blue-600 rounded-lg transition-colors"
          title={isCollapsed ? "Mở rộng Menu" : "Thu gọn Menu"}
        >
          {isCollapsed ? <PanelLeft size={24} /> : <PanelLeftClose size={24} />}
        </button>

        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
   
      </div>
    </header>
  );
};

export default Header;