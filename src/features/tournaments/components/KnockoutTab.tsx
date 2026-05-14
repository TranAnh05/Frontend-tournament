import React, { useState } from 'react';
import { Button, Spin, message, Tag, Modal, Radio,Select } from 'antd';
import { Trophy, Swords, ShieldCheck, ListOrdered, CalendarDays } from 'lucide-react';
import { tournamentApi } from '../api/tournamentApi';
import { type FirstKnockoutRoundRequest } from '../types';

interface KnockoutTabProps {
  tournamentId: number | string;
  matches: any[];        // Danh sách trận đấu từ Component Cha
  loading: boolean;      // Trạng thái loading từ Component Cha
  onRefresh: () => void; // Hàm tải lại dữ liệu
  clubs: any[];          // Danh sách toàn bộ đội bóng trong giải
}

const KnockoutTab: React.FC<KnockoutTabProps> = ({ tournamentId, matches, loading, onRefresh, clubs }) => {
  // --- STATES ---
  const [generating, setGenerating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'auto' | 'manual'>('manual');
  const [selectedClubIds, setSelectedClubIds] = useState<number[]>([]);
  
  // (Dành cho tính năng tự động sau này)
  const [autoQualifiedClubs] = useState<any[]>([]); 

  // --- LOGIC LỌC DỮ LIỆU ---
  // Lọc ra các trận đấu thuộc vòng Knockout dựa trên StageType hoặc tên GroupStage
  const knockoutMatches = (matches as any[] || []).filter((m: any) => {
    // Kiểm tra an toàn cho groupStage
    const isKnockoutType = m?.groupStage?.stageType === 'KNOCKOUT';
    
    // Ép kiểu về string và xử lý null/undefined trước khi toLowerCase
    const stageName = String(m?.groupStageName || m?.groupStage?.name || '').toLowerCase();
    
    return isKnockoutType || stageName.includes('trực tiếp');
  });

  // --- XỬ LÝ API ---
 const handleConfirmGenerate = async () => {
    // ✨ Bước 1: Xử lý mảng đầu vào để tách các chuỗi có chứa dấu cách hoặc dấu phẩy
    let rawInputs: any[] = [];
    (selectedClubIds as any[]).forEach(val => {
      if (typeof val === 'string') {
        // Tách chuỗi bằng khoảng trắng hoặc dấu phẩy
        const parts = val.split(/[\s,]+/).filter(p => p.trim() !== '');
        rawInputs.push(...parts);
      } else {
        rawInputs.push(val);
      }
    });

    // ✨ Bước 2: Ánh xạ từ Input sang ID thật
    const finalIds = rawInputs.map(val => {
      // Nếu là số hoặc chuỗi có thể chuyển thành số (ID nhập trực tiếp)
      if (!isNaN(Number(val))) return Number(val);
      
      // Nếu là tên đội bóng, tìm ID tương ứng trong danh sách clubs
      const found = (clubs as any[] || []).find((c: any) => 
        String(c?.name || '').toLowerCase() === String(val).toLowerCase()
      );
      return found ? found.id : null;
    }).filter(id => id !== null) as number[];

    // Kiểm tra lại số lượng sau khi đã xử lý
    if (finalIds.length < 2) {
      message.warning("Vui lòng nhập hoặc chọn ít nhất 2 đội hợp lệ!");
      return;
    }

    console.log("Dữ liệu gửi đi:", { qualifiedClubIds: finalIds }); // Kiểm tra log trước khi gọi API

    setGenerating(true);
    try {
      await tournamentApi.generateFirstKnockoutRound(tournamentId, { qualifiedClubIds: finalIds });
      message.success("Bốc thăm Vòng Knockout thành công!");
      setIsModalVisible(false);
      onRefresh();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setGenerating(false);
    }
  };
  if (loading) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

  return (
    <div className="p-6 bg-slate-50 min-h-[500px] rounded-b-xl border-x border-b border-slate-200 overflow-x-auto">
      
      {/* ================= TRẠNG THÁI 1: CHƯA CÓ LỊCH KNOCKOUT ================= */}
      {knockoutMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-600 bg-white rounded-xl border border-dashed border-slate-300">
          <Trophy size={64} className="text-yellow-400 mb-6" />
          <p className="text-lg font-medium mb-2">Vòng Loại Trực Tiếp chưa bắt đầu</p>
          <p className="text-slate-500 mb-6 max-w-md text-center">
            Sau khi kết thúc vòng bảng, hãy chọn danh sách các đội đi tiếp để bắt đầu bốc thăm chia nhánh loại trực tiếp.
          </p>
          <Button 
            type="primary" 
            size="large"
            icon={<Swords size={18} />} 
            onClick={() => setIsModalVisible(true)}
            className="bg-red-600 hover:bg-red-700 border-none rounded-lg px-8 h-12 text-base font-medium shadow-md shadow-red-200"
          >
            Bốc thăm vòng Knockout
          </Button>
        </div>
      ) : (
        /* ================= TRẠNG THÁI 2: HIỂN THỊ SƠ ĐỒ BRACKET ================= */
        <div className="min-w-[1000px]">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Sơ đồ Vòng Loại Trực Tiếp
            </h2>
            <Tag color="red" className="px-3 py-1 font-bold border-0">Chế độ Knockout</Tag>
          </div>

          <div className="flex gap-12 items-center">
            {/* CỘT VÒNG 1 (Ví dụ: Tứ Kết) */}
            <div className="flex flex-col gap-8 w-80">
              {knockoutMatches.map((match, idx) => (
                <div key={idx} className="bg-white border border-slate-300 rounded-lg shadow-sm relative group hover:border-blue-400 transition-colors">
                  {/* Đường nối sang vòng tiếp theo */}
                  <div className="absolute top-1/2 -right-12 w-12 h-[2px] bg-slate-300 group-hover:bg-blue-300"></div>

                  <div className="flex items-center justify-between p-2 bg-slate-50 border-b border-slate-200 rounded-t-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trận {idx + 1}</span>
                    <Tag color="blue" className="m-0 border-0 text-[10px] scale-90">{match.status}</Tag>
                  </div>
                  
                  {/* Đội nhà */}
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                      <ShieldCheck size={16} className={match.homeClub ? "text-blue-500" : "text-slate-300"} />
                      <span className="truncate w-40">{match.homeClub?.name || "???"}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-400">-</span>
                  </div>

                  {/* Đội khách */}
                  <div className="flex items-center justify-between p-3 border-t border-slate-100 bg-slate-50/30">
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                      <ShieldCheck size={16} className={match.awayClub ? "text-red-500" : "text-slate-300"} />
                      <span className="truncate w-40">
                        {match.awayClub?.name || (match.status === 'FINISHED' ? "MIỄN ĐẤU" : "Đang chờ...")}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-400">-</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CỘT VÒNG 2 (Placeholder Bán Kết) */}
            <div className="flex flex-col gap-24 w-80">
               {[1, 2].map((_, i) => (
                  <div key={i} className="bg-slate-100/50 border border-dashed border-slate-300 h-28 rounded-lg flex items-center justify-center text-slate-400 font-medium relative italic text-sm">
                    <div className="absolute top-1/2 -left-12 w-12 h-[2px] bg-slate-300"></div>
                    Chờ kết quả Vòng 1
                  </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CẤU HÌNH BỐC THĂM ================= */}
      <Modal
        title={<div className="flex items-center gap-2"><ListOrdered className="text-blue-600"/> Cấu hình Vòng Loại Trực Tiếp</div>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleConfirmGenerate}
        confirmLoading={generating}
        okText="Chốt danh sách & Bốc thăm"
        cancelText="Hủy"
        destroyOnHidden
        width={700}
        centered
      >
        <div className="py-4">
          {/* LỰA CHỌN CHẾ ĐỘ */}
          <div className="flex justify-center mb-8">
            <Radio.Group 
              value={selectionMode} 
              onChange={(e) => setSelectionMode(e.target.value)}
              buttonStyle="solid"
              size="large"
            >
              <Radio.Button value="auto">
                <span className="flex items-center gap-2 px-2"><Trophy size={16}/> Tự động (Từ BXH)</span>
              </Radio.Button>
              <Radio.Button value="manual">
                <span className="flex items-center gap-2 px-2"><Swords size={16}/> Chọn thủ công</span>
              </Radio.Button>
            </Radio.Group>
          </div>

          {selectionMode === 'auto' ? (
            <div className="bg-amber-50 border border-amber-200 p-8 rounded-xl text-center">
              <p className="text-amber-700 font-medium mb-0">
                Chức năng đang được đồng bộ với Bảng Xếp Hạng thực tế. <br/>
                Vui lòng đảm bảo tất cả trận vòng bảng đã được chốt kết quả (FINALIZED).
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex justify-between items-end">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Chọn hạt giống đi tiếp</h4>
                  <p className="text-xs text-slate-500 m-0">Gõ tên để tìm nhanh hoặc click trực tiếp vào lưới bên dưới.</p>
                </div>
                <Button size="small" type="link" onClick={() => setSelectedClubIds([])} danger>Xóa tất cả</Button>
              </div>

              {/* ✨ 1. Ô NHẬP TAY (TÌM KIẾM NHANH) */}
              <div className="mb-4">
                <Select
                 
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  mode="tags"
                  
                  placeholder="✍️ Gõ tên đội bóng để tìm và chọn nhanh..."
                  value={selectedClubIds}
                  onChange={(values) => setSelectedClubIds(values)}
                  options={clubs?.map(c => ({
                    value: c.id,
                    label: c.name,
                    
                    // Lưu luôn chuỗi chữ thường để tìm kiếm không phân biệt hoa/thường
                    searchString: (c.name || '').toLowerCase() 
                  }))}
                  optionFilterProp="searchString"
                  className="custom-select-seeds"
                  defaultActiveFirstOption={true}
                />
              </div>

              {/* ✨ 2. LƯỚI HIỂN THỊ TRỰC QUAN (Không bao giờ bị ẩn) */}
              {clubs && clubs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {clubs.map(club => {
                    const sIndex = selectedClubIds.indexOf(club.id);
                    const isSelected = sIndex !== -1;
                    return (
                      <div 
                        key={club.id}
                        onClick={() => {
                          if (isSelected) setSelectedClubIds(prev => prev.filter(id => id !== club.id));
                          else setSelectedClubIds(prev => [...prev, club.id]);
                        }}
                        className={`
                          cursor-pointer p-3 rounded-lg border transition-all flex items-center gap-2 select-none text-sm
                          ${isSelected 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'}
                        `}
                      >
                        {isSelected ? (
                          <span className="bg-white text-blue-700 rounded-full min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold px-1">
                            {sIndex + 1}
                          </span>
                        ) : (
                          <ShieldCheck size={14} className="text-slate-300" />
                        )}
                        <span className="truncate font-medium">{club.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-300 rounded-lg bg-slate-50 text-center flex flex-col items-center justify-center">
                   <ShieldCheck size={32} className="text-slate-300 mb-2" />
                   <p className="text-slate-500 font-medium m-0">Giải đấu này chưa có đội bóng nào được duyệt!</p>
                </div>
              )}

              {/* THANH THÔNG BÁO TRẠNG THÁI */}
              {selectedClubIds.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <ShieldCheck size={18} />
                  <span className="text-sm font-semibold">Đã xác định {selectedClubIds.length} đội tham gia vòng loại trực tiếp.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
      
    </div>
  );
};

export default KnockoutTab;