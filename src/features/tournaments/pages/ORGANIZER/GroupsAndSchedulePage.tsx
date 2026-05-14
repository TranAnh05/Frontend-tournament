import React, { useState, useEffect } from 'react';
import { Tabs, Spin, Pagination, message } from 'antd';
import { Trophy, CalendarDays, Users, LayoutList, CheckCircle, Clock } from 'lucide-react';

 import { tournamentApi } from '@/features/tournaments/api/tournamentApi';
 import { useTournamentDetail } from '@/features/tournaments/hooks/useTournamentDetail';
 import DrawTab from './../../components/DrawTab';

 import ScheduleTab from '../../components/ScheduleTab';
 import RefereeTab from '../../components/RefereeTab';

const GroupsAndSchedulePage = () => {
  // --- STATE DANH SÁCH GIẢI ---
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [totalTours, setTotalTours] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  
  
  // State quản lý giải đấu đang được chọn
  const [selectedTour, setSelectedTour] = useState<any>(null);

  // ✨ GỌI HOOK CHI TIẾT (An toàn tuyệt đối nhờ đã bọc chốt chặn ở bên trong Hook)
  const { detail: tourDetail, loading: loadingDetail } = useTournamentDetail(selectedTour?.id);

  // --- HÀM LẤY DANH SÁCH GIẢI ĐẤU ---
  const fetchReadyTournaments = async (page = 0) => {
    setLoadingList(true);
    try {
      const res = await tournamentApi.getReadyForGrouping(page, 10);
      const responseData = res.data ? res.data : res;
      
      const { content, totalElements } = responseData.result;
      setTournaments(content);
      setTotalTours(totalElements);
      
      // Tự động chọn giải đầu tiên nếu danh sách có dữ liệu và chưa chọn giải nào
      if (content.length > 0 && !selectedTour) {
        setSelectedTour(content[0]);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách giải:", error);
      message.error("Không thể tải danh sách giải đấu!");
    } finally {
      setLoadingList(false);
    }
  };

  // Tự động fetch khi đổi trang
  useEffect(() => {
    fetchReadyTournaments(currentPage);
  }, [currentPage]);

  // --- CẤU HÌNH TABS ---
  const tabItems = [
    {
      key: 'draw',
      label: <span className="flex items-center gap-2"><LayoutList size={18} /> Bốc thăm chia bảng</span>,
     children: <DrawTab tournamentId={selectedTour?.id} />,
    },
    {
      key: 'referee',
      label: <span className="flex items-center gap-2"><Users size={18} /> Phân công trọng tài</span>,
      children: <RefereeTab tournamentId={selectedTour?.id} />,
    },
    {
      key: 'schedule',
      label: <span className="flex items-center gap-2"><Clock size={18} /> Lịch thi đấu</span>,
    children: <ScheduleTab tournamentId={selectedTour?.id} />,
    }
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-100 p-6 gap-6">
      
      {/* ================= PANEL TRÁI: DANH SÁCH GIẢI ================= */}
      <div className="w-1/3 min-w-[300px] max-w-[400px] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Giải đã đóng đăng ký</h2>
          <p className="text-slate-500 text-sm">{totalTours} giải đấu</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {loadingList ? (
             <div className="flex justify-center py-10"><Spin /></div>
          ) : (
            tournaments.map((tour) => (
              <div 
                key={tour.id}
                onClick={() => setSelectedTour(tour)}
                className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                  selectedTour?.id === tour.id 
                    ? 'bg-blue-50 border-blue-500 border-l-4 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <h3 className={`font-bold mb-2 ${selectedTour?.id === tour.id ? 'text-blue-700' : 'text-slate-800'}`}>
                  {tour.name}
                </h3>
                <div className="text-sm text-slate-500 space-y-1 mb-3">
                  <p className="flex items-center gap-2"><Trophy size={14}/> {tour.sport}</p>
                  <p className="flex items-center gap-2">
                    <Users size={14}/> 
                    <span className="font-medium text-slate-700">{tour.approvedClubs?.length || 0} đội</span>
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded flex items-center gap-1">Chưa bốc thăm</span>
                  <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded flex items-center gap-1">Chưa phân TT</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        {totalTours > 10 && (
          <div className="p-3 border-t border-slate-100 flex justify-center">
             <Pagination size="small" current={currentPage + 1} total={totalTours} onChange={(page) => setCurrentPage(page - 1)} />
          </div>
        )}
      </div>

      {/* ================= PANEL PHẢI: CHI TIẾT GIẢI ================= */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {selectedTour ? (
          <>
            {/* Header thông tin giải */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white relative">
              {loadingDetail && (
                <div className="absolute top-4 right-4"><Spin size="small" className="text-white"/></div>
              )}
              <h1 className="text-2xl font-bold mb-3">{selectedTour.name}</h1>
              <div className="flex flex-wrap gap-6 text-blue-100 text-sm">
                <span className="flex items-center gap-2">
                  <CalendarDays size={16}/> 
                  {tourDetail?.startDate || 'Chưa cập nhật'} - {tourDetail?.endDate || 'Chưa cập nhật'}
                </span>
                <span className="flex items-center gap-2"><LayoutList size={16}/> Vòng bảng</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <Tabs defaultActiveKey="draw" items={tabItems} className="mt-2" size="large" />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 flex-col gap-3">
            <LayoutList size={48} className="opacity-50" />
            <p>Vui lòng chọn một giải đấu ở bên trái để xem chi tiết</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default GroupsAndSchedulePage;