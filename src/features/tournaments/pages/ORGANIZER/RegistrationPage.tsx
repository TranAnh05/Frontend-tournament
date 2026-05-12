import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Calendar, Users, ChevronRight, Search, Filter, 
  Download, User, Mail, Phone, CheckCircle, XCircle, Eye, FileText
} from 'lucide-react';
import { Button, Input, Tag, Spin, message, Modal, Table } from 'antd';
import { registrationApi } from '../../api/tournamentApi'; // Import API

const RegistrationPage = () => {
  // --- STATES ---
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
  
  const [loadingTours, setLoadingTours] = useState(false);
  const [loadingRegs, setLoadingRegs] = useState(false);

  //  STATE CHO CHI TIẾT
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

// --- EFFECT 1: Load danh sách giải đấu đang mở đăng ký ---
  const handleOpenDetail = async (regId: number) => {
    if (!selectedTourId) return;
    
    setIsDetailModalOpen(true);
    setLoadingDetail(true);
    try {
      const res = await registrationApi.getRegistrationDetail(selectedTourId, regId);
      // Xử lý bọc lót interceptor giống như lúc lấy danh sách
      const responseData = res.data ? res.data : res; 
      
      setDetailData(responseData.result);
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      message.error("Không thể tải dữ liệu chi tiết!");
      setIsDetailModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

useEffect(() => {
    const fetchTournaments = async () => {
      setLoadingTours(true);
      try {
        const res = await registrationApi.getOpeningTournaments();
        
        // ✨ Khắc phục: Xử lý an toàn cho cả 2 trường hợp Axios
        const responseData = res.data ? res.data : res; 
        
        // Log ra để kiểm tra chắc chắn
        console.log("Dữ liệu giải đấu:", responseData);
        
        setTournaments(responseData.result || []);
      } catch (error) {
        console.error("Lỗi API Tournaments:", error);
        message.error("Lỗi khi tải danh sách giải đấu");
      } finally {
        setLoadingTours(false);
      }
    };
    fetchTournaments();
  }, []);

  // --- EFFECT 2: Load danh sách đăng ký khi chọn 1 giải ---
  useEffect(() => {
    if (!selectedTourId) return;

    const fetchRegistrations = async () => {
      setLoadingRegs(true);
      try {
        const res = await registrationApi.getRegistrations(selectedTourId, { size: 100 });
        
        // ✨ Khắc phục tương tự
        const responseData = res.data ? res.data : res;
        
        // Pageable của Spring Boot bọc data trong result.content
        setRegistrations(responseData.result?.content || []);
      } catch (error) {
        console.error("Lỗi API Registrations:", error);
        message.error("Lỗi khi tải danh sách đội đăng ký");
      } finally {
        setLoadingRegs(false);
      }
    };
    fetchRegistrations();
  }, [selectedTourId]);

  const selectedTournament = tournaments.find(t => t.id === selectedTourId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
      
      {/* ================= LEFT PANEL ================= */}
      <div className="w-full lg:w-1/3 xl:w-1/4 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Giải đang mở đăng ký</h2>
          <p className="text-sm text-slate-500">{tournaments.length} giải đấu</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 relative">
          {loadingTours ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
               <Spin description="Đang tải giải đấu..." />
            </div>
          ) : (
            tournaments.map((tour) => {
              const isSelected = selectedTourId === tour.id;
              
              // TẠM THỜI: Fallback dữ liệu do DTO Backend hiện tại chỉ có id và name
              const sport = tour.sport || 'Chưa cập nhật';
              const registered = tour.registeredCount || 0;
             
              
              return (
                <div 
                  key={tour.id}
                  onClick={() => setSelectedTourId(tour.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' 
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold pr-4 ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                      {tour.name}
                    </h3>
                    <ChevronRight size={18} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                  </div>
                  
                 
                  <div className="space-y-1.5 text-sm text-slate-600 mb-1">
      <p className="flex items-center gap-2"><Trophy size={14} /> {sport}</p>
      <p className="flex items-center gap-2 font-medium">
        <Users size={14} className="text-blue-500" /> {registered} đội đã duyệt
      </p>
    </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="flex-1 bg-slate-50/50 rounded-2xl flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {!selectedTournament ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 rounded-2xl"
            >
              <Trophy size={64} className="mb-4 opacity-20" />
              <h2 className="text-xl font-bold text-slate-600">Chọn một giải đấu</h2>
              <p>Chọn giải đấu từ danh sách bên trái để xem danh sách đăng ký</p>
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              {/* Header Thống kê - Bạn có thể tính toán logic từ mảng 'registrations' */}
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">{selectedTournament.name}</h2>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                    <p className="text-3xl font-bold mb-1">{registrations.length}</p>
                    <p className="text-sm text-blue-100">Tổng đăng ký</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                    <p className="text-3xl font-bold mb-1 text-green-300">
                      {registrations.filter(r => r.status === 'APPROVED').length}
                    </p>
                    <p className="text-sm text-blue-100">Đã duyệt</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                    <p className="text-3xl font-bold mb-1 text-yellow-300">
                      {registrations.filter(r => r.status === 'PENDING').length}
                    </p>
                    <p className="text-sm text-blue-100">Chờ duyệt</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                    <p className="text-3xl font-bold mb-1 text-red-300">
                      {registrations.filter(r => r.status === 'REJECTED').length}
                    </p>
                    <p className="text-sm text-blue-100">Từ chối</p>
                  </div>
                </div>
              </div>

              {/* Danh sách Card CLB */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 relative">
                {loadingRegs && (
                   <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-10">
                     <Spin description="Đang tải hồ sơ..." />
                   </div>
                )}
                
                {!loadingRegs && registrations.map((reg) => (
                  <div key={reg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{reg.clubName}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Calendar size={14}/> Đăng ký: {reg.appliedAt?.substring(0, 10)}</span>
                        </div>
                      </div>
                      
                      {reg.status === 'APPROVED' && <Tag color="success" className="px-3 py-1 rounded-full text-sm border-none bg-green-100 text-green-700 font-semibold flex items-center gap-1"><CheckCircle size={14}/> Đã duyệt</Tag>}
                      {reg.status === 'PENDING' && <Tag color="warning" className="px-3 py-1 rounded-full text-sm border-none bg-yellow-100 text-yellow-700 font-semibold">Chờ duyệt</Tag>}
                      {reg.status === 'REJECTED' && <Tag color="error" className="px-3 py-1 rounded-full text-sm border-none bg-red-100 text-red-700 font-semibold flex items-center gap-1"><XCircle size={14}/> Từ chối</Tag>}
                    </div>

                    {/* TẠM THỜI: Fallback thông tin liên hệ nếu DTO chưa có */}
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="flex items-center gap-2"><User size={14} className="text-slate-400"/> {reg.repName || 'Đang cập nhật'}</p>
                      <p className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {reg.phone || 'Đang cập nhật'}</p>
                    </div>

                    {reg.rejectReason && (
                      <p className="text-sm text-red-600 mb-4 flex items-start gap-2 bg-red-50 p-2 rounded-lg">
                        <FileText size={16} className="mt-0.5 text-red-400 shrink-0"/> 
                        <span className="italic">Lý do từ chối: {reg.rejectReason}</span>
                      </p>
                    )}

                    <div className="flex gap-2">
                      {reg.status === 'PENDING' && (
                        <>
                          <Button type="primary" className="bg-green-600 hover:bg-green-700 border-none rounded-lg flex items-center gap-1 font-medium"><CheckCircle size={16}/> Duyệt</Button>
                          <Button type="primary" danger className="rounded-lg flex items-center gap-1 font-medium"><XCircle size={16}/> Từ chối</Button>
                          <Button 
    onClick={() => handleOpenDetail(reg.id)}
    className="rounded-lg flex items-center gap-1 text-slate-600"
  >
    <Eye size={16}/> Chi tiết
  </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* ================= MODAL CHI TIẾT ĐĂNG KÝ ================= */}
      <Modal
        title={
          <div className="flex items-center gap-2 border-b pb-3">
            <Trophy className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-slate-800 m-0">Hồ sơ đăng ký giải đấu</h3>
          </div>
        }
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setDetailData(null); // Clear dữ liệu cũ tránh bị chớp hình
        }}
        footer={null} // Ẩn nút OK/Cancel vì đây là modal xem
        width={850} // Kéo rộng Modal để hiển thị bảng cho đẹp
        centered
      >
        {loadingDetail ? (
           <div className="py-20 flex justify-center">
             <Spin description="Đang tải dữ liệu hồ sơ..." size="large" />
           </div>
        ) : detailData ? (
          <div className="space-y-6 pt-4">
            
            {/* THÔNG TIN CLB & LIÊN HỆ (Layout 2 cột) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
              {/* Cột 1: Đội bóng */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                  <Users size={18} className="text-blue-500" /> Thông tin Đội bóng
                </h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-slate-500">Tên CLB:</span>
                  <span className="col-span-2 font-bold text-slate-800">{detailData.clubName}</span>
                  
                  <span className="text-slate-500">Áo sân nhà:</span>
                  <span className="col-span-2 font-medium">{detailData.homeKitColor || 'Chưa cập nhật'}</span>
                  
                  <span className="text-slate-500">Áo sân khách:</span>
                  <span className="col-span-2 font-medium">{detailData.awayKitColor || 'Chưa cập nhật'}</span>
                </div>
              </div>

              {/* Cột 2: Liên hệ */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                  <User size={18} className="text-emerald-500" /> Người đại diện
                </h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-slate-500">Họ và tên:</span>
                  <span className="col-span-2 font-bold text-slate-800">{detailData.repName}</span>
                  
                  <span className="text-slate-500">Điện thoại:</span>
                  <span className="col-span-2 font-medium">{detailData.phone}</span>
                  
                  <span className="text-slate-500">Email:</span>
                  <span className="col-span-2 font-medium">{detailData.email}</span>
                </div>
              </div>
            </div>

            {/* BẢNG DANH SÁCH VẬN ĐỘNG VIÊN */}
            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Users size={18} className="text-blue-500"/> Danh sách Vận động viên ({detailData.roster?.length || 0})
              </h4>
              <Table 
                dataSource={detailData.roster || []} 
                rowKey="id"
                pagination={false} // Không phân trang vì danh sách VĐV thường < 30 người
                size="small"
                bordered
                scroll={{ y: 300 }} // Cuộn dọc nếu danh sách quá dài
                columns={[
                  { 
                    title: 'Số áo', 
                    dataIndex: 'jerseyNumber', 
                    key: 'jerseyNumber', 
                    width: 70, 
                    align: 'center',
                    render: (num) => <span className="font-bold">{num}</span>
                  },
                  { 
                    title: 'Mã VĐV', 
                    dataIndex: 'athleteName', 
                    key: 'athleteName',
                    render: (text) => <span className="font-medium text-slate-700">{text}</span>
                  },
                  { 
                    title: 'Vị trí', 
                    dataIndex: 'position', 
                    key: 'position' 
                  },
                  { 
                    title: 'Vai trò', 
                    dataIndex: 'role', 
                    key: 'role',
                    align: 'center',
                    render: (role) => (
                      <Tag color={role === 'CAPTAIN' ? 'magenta' : 'blue'} className="m-0 font-medium">
                        {role === 'CAPTAIN' ? 'Đội trưởng' : 'Cầu thủ'}
                      </Tag>
                    )
                  },
                  { 
                    title: 'Trạng thái', 
                    dataIndex: 'status', 
                    key: 'status',
                    align: 'center',
                    render: (status) => {
                      let color = 'green';
                      let label = 'Hợp lệ';
                      if (status === 'SUSPENDED') { color = 'red'; label = 'Đình chỉ'; }
                      else if (status === 'INJURED') { color = 'orange'; label = 'Chấn thương'; }
                      return <Tag color={color} className="m-0 border-none">{label}</Tag>
                    }
                  }
                ]}
              />
            </div>

          </div>
        ) : (
          <div className="py-10 text-center text-slate-500">
            Không có dữ liệu chi tiết
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RegistrationPage;