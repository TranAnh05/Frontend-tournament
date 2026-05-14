import React, { useState } from 'react';
import { Button, Spin, message, Tag, Modal, Select } from 'antd';
import { Trophy, Swords, ShieldCheck, ListOrdered } from 'lucide-react';
import { tournamentApi } from '../api/tournamentApi';

interface KnockoutTabProps {
  tournamentId: number | string;
  matches: any[];
  loading: boolean;
  onRefresh: () => void;
  clubs: any[]; // ✨ Thêm prop nhận danh sách đội
}

const KnockoutTab: React.FC<KnockoutTabProps> = ({ tournamentId, matches, loading, onRefresh, clubs }) => {
  const [generating, setGenerating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClubIds, setSelectedClubIds] = useState<number[]>([]);

  const knockoutMatches = matches.filter(m => m.groupStage?.stageType === 'KNOCKOUT' || m.groupStageName?.includes('Trực Tiếp'));

  // Xử lý Gửi API sau khi đã chọn xong đội
  const handleConfirmGenerate = async () => {
    if (selectedClubIds.length < 2) {
      message.warning("Vui lòng chọn ít nhất 2 đội để tạo vòng đấu!");
      return;
    }

    setGenerating(true);
    try {
      // ✨ Gọi API với danh sách ID thật mà người dùng vừa chọn
      await tournamentApi.generateFirstKnockoutRound(tournamentId, { qualifiedClubIds: selectedClubIds });
      message.success("Bốc thăm Vòng Knockout thành công!");
      setIsModalVisible(false); // Tắt modal
      onRefresh(); // Tải lại toàn bộ dữ liệu
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo lịch!";
      message.error(errorMsg);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

  return (
    <div className="p-6 bg-slate-50 min-h-[500px] rounded-b-xl border-x border-b border-slate-200 overflow-x-auto">
      
      {/* TRẠNG THÁI 1: CHƯA CÓ TRẬN KNOCKOUT NÀO */}
      {knockoutMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-600 bg-white rounded-xl border border-dashed border-slate-300">
          <Trophy size={64} className="text-yellow-400 mb-6" />
          <p className="text-lg font-medium mb-2">Vòng Loại Trực Tiếp chưa diễn ra</p>
          <p className="text-slate-500 mb-6 max-w-md text-center">
            Sau khi tất cả các trận Vòng bảng kết thúc (FINALIZED), hãy chốt danh sách đội đi tiếp và bốc thăm vòng này.
          </p>
          <Button 
            type="primary" 
            size="large"
            icon={<Swords size={18} />} 
            onClick={() => setIsModalVisible(true)} // ✨ Mở modal thay vì gọi API luôn
            className="bg-red-600 hover:bg-red-700 border-none rounded-lg px-8 h-12 text-base font-medium shadow-md shadow-red-200"
          >
            Bốc thăm vòng Knockout
          </Button>
        </div>
      ) : (
        /* TRẠNG THÁI 2: HIỂN THỊ SƠ ĐỒ NHÁNH ĐẤU (BRACKET) */
        <div className="min-w-[800px]">
            {/* ... Giữ nguyên toàn bộ phần Giao diện Sơ đồ nhánh đấu của bạn ở đây ... */}
            {/* (Mình không chép lại để tiết kiệm chữ, bạn copy phần flexbox sơ đồ cây dán lại nhé) */}
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-8">
              <Trophy className="text-yellow-500" /> Sơ đồ Vòng Loại Trực Tiếp
            </h2>
            <div className="flex gap-10 justify-start items-center">
              <div className="flex flex-col gap-6 w-72">
                {knockoutMatches.map((match, idx) => (
                  <div key={idx} className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden relative">
                    <div className="absolute top-1/2 -right-10 w-10 h-[1px] bg-slate-300"></div>
                    <div className="flex items-center justify-between p-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-400">Trận {idx + 1}</span>
                      <Tag color={match.status === 'FINALIZED' ? 'green' : 'orange'} className="m-0 border-0 text-[10px]">
                        {match.status}
                      </Tag>
                    </div>
                    <div className="flex items-center justify-between p-3 hover:bg-slate-50">
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        {match.homeClub?.name || "Đội 1"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border-t border-slate-100 hover:bg-slate-50">
                      <div className="flex items-center gap-2 font-medium text-slate-800">
                        {match.awayClub?.name ? match.awayClub.name : <span className="text-slate-400 italic">Đặc cách (Bye)</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      )}

      {/* ✨ MODAL CHỌN ĐỘI ĐI TIẾP */}
      <Modal
        title={<div className="flex items-center gap-2"><ListOrdered className="text-blue-600"/> Chọn danh sách đội lọt vào vòng trong</div>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleConfirmGenerate}
        confirmLoading={generating}
        okText="Chốt danh sách & Bốc thăm"
        cancelText="Hủy"
        destroyOnHidden
        width={600}
      >
        <div className="py-4">
          <p className="text-slate-500 mb-4 text-sm">
            Vui lòng chọn và sắp xếp các đội đi tiếp theo thứ tự Hạt giống (Đội mạnh nhất chọn trước, đội yếu hơn chọn sau). Hệ thống sẽ tự động bắt cặp chéo để các đội mạnh không gặp nhau quá sớm.
          </p>
          
          <label className="font-semibold text-slate-700 mb-2 block">Danh sách các đội:</label>
          <Select
            mode="multiple" // ✨ Cho phép chọn nhiều đội
            allowClear
            style={{ width: '100%' }}
            placeholder="Click để chọn các đội đi tiếp..."
            value={selectedClubIds}
            onChange={(values) => setSelectedClubIds(values)}
            options={clubs.map(c => ({
              value: c.id,
              label: c.name
            }))}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />

          {selectedClubIds.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <span className="text-blue-700 font-medium text-sm">Đã chọn {selectedClubIds.length} đội đi tiếp.</span>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default KnockoutTab;