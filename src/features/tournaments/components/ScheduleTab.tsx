import React, { useState, useEffect } from 'react';
import { Button, Spin, message, Tag ,Radio} from 'antd';
import { CalendarDays, Zap, Clock, MapPin,ShieldCheck, ShieldAlert } from 'lucide-react';
// Nhớ import file API thực tế của bạn:
import { tournamentApi } from '../api/tournamentApi';

interface ScheduleTabProps {
  tournamentId: number | string;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ tournamentId }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
 

  // Lấy danh sách trận đấu từ Backend
  const fetchMatches = async () => {
    if (!tournamentId) return;
    setLoading(true);
    try {
      const res = await tournamentApi.getMatchesByTournament(tournamentId);
      
      // Xử lý bóc vỏ Axios Interceptor an toàn
      const responseData = res.data ? res.data : res;
      setMatches(responseData.result || []);
      
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải lịch thi đấu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [tournamentId]);

  // Gọi API tự động tạo lịch thi đấu (Round-Robin)
  const handleGenerateSchedule = async () => {
    setGenerating(true);
    try {
      await tournamentApi.generateGroupSchedule(tournamentId);
      message.success("Hệ thống đã tự động sinh lịch thi đấu vòng bảng!");
      
      // Tạo lịch xong thì gọi lại API lấy danh sách để render ra màn hình
      fetchMatches(); 
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi tạo lịch! Hoặc giải đấu này đã có lịch rồi.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

  return (
    <div className="p-6">
      {/* TRẠNG THÁI 1: CHƯA CÓ LỊCH THI ĐẤU */}
      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-600 bg-white rounded-xl border border-dashed border-slate-300">
          <CalendarDays size={64} className="text-slate-300 mb-6" />
          <p className="text-lg font-medium mb-2">Chưa có lịch thi đấu</p>
          <p className="text-slate-500 mb-6 max-w-md text-center">
            Hệ thống sẽ tự động bắt cặp các đội trong từng bảng theo thể thức vòng tròn tính điểm.
          </p>
          <Button 
            type="primary" 
            size="large"
            icon={<Zap size={18} />} 
            onClick={handleGenerateSchedule}
            loading={generating}
            className="bg-amber-500 hover:bg-amber-600 border-none rounded-lg px-8 h-12 text-base font-medium flex items-center gap-2 shadow-md shadow-amber-200"
          >
            Tự động sinh lịch vòng bảng
          </Button>
        </div>
      ) : (
        /* TRẠNG THÁI 2: ĐÃ CÓ LỊCH (HIỂN THỊ DANH SÁCH) */
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="text-blue-600" /> Lịch thi đấu vòng bảng
            </h2>
            <Tag color="blue" className="px-3 py-1 rounded-full text-sm font-medium border-0">
              Tổng cộng {matches.length} trận
            </Tag>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {matches.map((match, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                
                {/* Header Card */}
                <div className="flex justify-between items-center mb-4 text-xs text-slate-500 font-medium">
                  {/* Sử dụng đúng chuẩn DTO mới: match.groupStageName */}
                  <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full border border-blue-100">
                    {match.groupStageName || "Bảng đấu"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {match.scheduledTime ? new Date(match.scheduledTime).toLocaleDateString('vi-VN') : "Chưa xếp lịch"}
                  </span>
                </div>

                {/* Body Card: Hai đội bóng */}
                <div className="flex items-center justify-between px-2 mb-4">
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-sm overflow-hidden">
                      {/* Nếu có logo thì hiện logo, không thì lấy chữ cái đầu */}
                      {match.homeClub?.logo ? (
                        <img src={match.homeClub.logo} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        match.homeClub?.name ? match.homeClub.name.charAt(0).toUpperCase() : "H"
                      )}
                    </div>
                    <span className="font-semibold text-slate-800 text-center line-clamp-1">
                      {match.homeClub?.name || "Đội nhà"}
                    </span>
                  </div>
                  
                  <div className="px-4 text-slate-400 font-bold text-sm bg-slate-50 py-1 rounded-full border border-slate-100">
                    VS
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-sm overflow-hidden">
                      {match.awayClub?.logo ? (
                        <img src={match.awayClub.logo} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        match.awayClub?.name ? match.awayClub.name.charAt(0).toUpperCase() : "A"
                      )}
                    </div>
                    <span className="font-semibold text-slate-800 text-center line-clamp-1">
                      {match.awayClub?.name || "Đội khách"}
                    </span>
                  </div>
                </div>

               {/* Footer Card */}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-end text-sm">
                  
                  {/* Cột trái: Thông tin Sân và Trọng tài */}
                  <div className="space-y-1.5 flex-1">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin size={14}/> {match.stadium || "Sân chưa xếp"}
                    </span>
                    
                    {/* ✨ Logic hiển thị Trạng thái Trọng tài */}
                    {match.referee ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium bg-green-50 w-fit px-2 py-0.5 rounded">
                        <ShieldCheck size={14} /> TT: {match.referee.fullName}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-500 bg-amber-50 w-fit px-2 py-0.5 rounded">
                        <ShieldAlert size={14} /> Chưa phân TT
                      </span>
                    )}
                  </div>

                  {/* Cột phải: Trạng thái trận đấu */}
                  <Tag color="orange" className="m-0 border-0 h-fit">
                    {match.status === 'SCHEDULED' ? 'Chờ thi đấu' : match.status}
                  </Tag>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;