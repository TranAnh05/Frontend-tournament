import { Bell, Search } from 'lucide-react';

export const AdminHeader = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        
        {/* Global Season Filter */}
        <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500">
          <option>Mùa giải 2025</option>
          <option>Mùa giải 2026</option>
        </select>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-5">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">Admin Manager</p>
            <p className="text-xs text-gray-500 uppercase tracking-tighter font-bold">Hệ thống</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border-2 border-blue-50">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};