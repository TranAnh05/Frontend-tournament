import { Menu, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = ({ title, onMenuClick }: { title: string; onMenuClick: () => void }) => {
  const location = useLocation();
  // Fix: route thực tế là /organizer/tournaments, không phải /tournaments
  const isTournamentPage = location.pathname === '/organizer/tournaments';

  const handleOpenAddModal = () => {
    window.dispatchEvent(new CustomEvent('open-add-tournament'));
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        {isTournamentPage && (
          <button
            onClick={handleOpenAddModal}
            className="
              bg-blue-600 hover:bg-blue-700 text-white
              px-5 py-2.5 rounded-xl font-bold text-sm
              flex items-center gap-2 shadow-lg shadow-blue-600/20
              transition-all active:scale-95
            "
          >
            <Plus size={18} strokeWidth={3} />
            Tạo giải mới
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;