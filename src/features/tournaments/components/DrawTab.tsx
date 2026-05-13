import React, { useState, useEffect } from 'react';
import { Button, Spin, message, Modal, InputNumber } from 'antd';
import { LayoutList, Shuffle, Users } from 'lucide-react';
// Nhớ import file API thực tế của bạn:
import { tournamentApi } from '../api/tournamentApi';

interface DrawTabProps {
  tournamentId: number | string;
}

const DrawTab: React.FC<DrawTabProps> = ({ tournamentId }) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State cho việc bốc thăm
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [numGroups, setNumGroups] = useState<number>(4); // Mặc định chia 4 bảng

  // Lấy dữ liệu bảng đấu từ Backend
  const fetchGroups = async () => {
    if (!tournamentId) return;
    setLoading(true);
    try {
     
      const res = await tournamentApi.getGroupsByTournament(Number(tournamentId));
      const responseData = res.data ? res.data : res;
      setGroups(responseData.result || []);
      
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải dữ liệu bảng đấu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [tournamentId]);

  // Hàm xử lý khi xác nhận bốc thăm trong Modal
  const handleConfirmDraw = async () => {
    setDrawing(true);
    try {
      // Gọi API POST để thực thi bốc thăm ở Backend
       await tournamentApi.executeGroupDraw(Number(tournamentId), { numberOfGroups: numGroups });
      
      message.success(`Bốc thăm chia ${numGroups} bảng thành công!`);
      setIsModalVisible(false);
      
      // Fetch lại dữ liệu để hiển thị
      fetchGroups(); 
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi bốc thăm!");
    } finally {
      setDrawing(false);
    }
  };

  // Nếu đang gọi API thì hiện Spin loading
  if (loading) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

  return (
    <div className="p-6">
      {/* TRẠNG THÁI 1: CHƯA BỐC THĂM (Hiển thị UI giống ảnh thiết kế của bạn) */}
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-600">
          <Shuffle size={64} className="opacity-10 mb-6 text-blue-500" />
          <p className="text-lg font-medium mb-6">Chưa thực hiện bốc thăm</p>
          <Button 
            type="primary" 
            size="large"
            icon={<Shuffle size={18} />} 
            onClick={() => setIsModalVisible(true)}
            className="bg-[#1677ff] hover:bg-blue-600 border-none rounded-lg px-8 h-12 text-base flex items-center gap-2 shadow-md shadow-blue-200"
          >
            Tiến hành bốc thăm
          </Button>
        </div>
      ) : (
        /* TRẠNG THÁI 2: ĐÃ BỐC THĂM (Hiển thị danh sách bảng đấu) */
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <LayoutList className="text-blue-600" /> Kết quả bốc thăm
            </h2>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Đã chia {groups.length} bảng
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {groups.map((group, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="bg-blue-600 px-4 py-3 text-white font-bold text-center">
                  {group.name}
                </div>
                <div className="p-2">
                  {group.teams?.map((team: any, tIdx: number) => (
                    <div key={tIdx} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                          {tIdx + 1}
                        </div>
                        <span className="font-medium text-slate-700">{team.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: HỘP THOẠI CẤU HÌNH BỐC THĂM */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <Shuffle className="text-blue-600" size={20} />
            Cấu hình bốc thăm vòng bảng
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="Bắt đầu bốc thăm"
        cancelText="Hủy"
        onOk={handleConfirmDraw}
        confirmLoading={drawing}
        okButtonProps={{ className: "bg-blue-600" }}
        centered
      >
        <div className="py-6 space-y-4">
          <p className="text-slate-600">
            Hệ thống sẽ tiến hành xáo trộn ngẫu nhiên và chia đều các đội đã duyệt vào các bảng đấu. Vui lòng chọn số lượng bảng:
          </p>
          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-700 flex items-center gap-2">
              <Users size={16}/> Số lượng bảng đấu:
            </span>
            <InputNumber 
              min={2} 
              max={16} 
              value={numGroups} 
              onChange={(val) => setNumGroups(val || 2)} 
              className="w-24"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DrawTab;