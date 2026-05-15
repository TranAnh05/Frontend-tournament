import React, { useState, useEffect, useMemo } from 'react';
import { Button, Spin, message, Tag, Modal, Radio, Select,Form,InputNumber } from 'antd';
import { Trophy, Swords, ShieldCheck, ListOrdered, CalendarDays,CheckCircle } from 'lucide-react';
import { tournamentApi } from '../api/tournamentApi';

interface KnockoutTabProps {
  tournamentId: number | string;
  clubs: any[];          
  onRefresh?: () => void; 
}

const KnockoutTab: React.FC<KnockoutTabProps> = ({ tournamentId, clubs, onRefresh }) => {
  // --- STATES BỐC THĂM ---
  const [generating, setGenerating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'auto' | 'manual'>('manual');
  const [selectedClubIds, setSelectedClubIds] = useState<number[]>([]);

  // ✨ STATES LƯU TRỮ DỮ LIỆU API MỚI
  const [bracketData, setBracketData] = useState<any>(null);
  const [loadingBracket, setLoadingBracket] = useState<boolean>(true);


   const [isScoreModalVisible, setIsScoreModalVisible] = useState(false);
  const [updatingScore, setUpdatingScore] = useState(false);
  
  const [scoreForm] = Form.useForm();

  // ✨ HÀM GỌI API ĐỘC LẬP CHO TAB
  const fetchKnockoutBracket = async () => {
    setLoadingBracket(true);
    try {
      const res = await tournamentApi.getKnockoutBracket(tournamentId);
      const responseData = res.data ? res.data : res;
      setBracketData(responseData.result || responseData || []); 
    } catch (error) {
      console.error("Lỗi lấy sơ đồ nhánh:", error);
    } finally {
      setLoadingBracket(false);
    }
  };

  // Tự động gọi API khi Tab được render hoặc khi tournamentId thay đổi
  useEffect(() => {
    if (tournamentId) fetchKnockoutBracket();
  }, [tournamentId]);

  // --- TRÍCH XUẤT VÀ PHÂN VÒNG ---
  const getNextId = (m: any) => m.nextMatchId || m.next_match_id || m.nextMatch?.id;
  const getPosition = (m: any) => m.bracketPosition ?? m.bracket_position;

  const knockoutMatches = useMemo(() => {
    return Array.isArray(bracketData) ? bracketData : [];
  }, [bracketData]);

  const rounds = useMemo(() => {
    if (knockoutMatches.length === 0) return [];

    const matchMap = new Map();
    knockoutMatches.forEach((m: any) => matchMap.set(String(m.id), m));

    const calculateDepth = (match: any): number => {
      const nextId = getNextId(match);
      if (!nextId) return 0;
      const nextMatch = matchMap.get(String(nextId));
      if (!nextMatch) return 0;
      return 1 + calculateDepth(nextMatch);
    };

    const groups: { [key: number]: any[] } = {};
    knockoutMatches.forEach((m: any) => {
      const depth = calculateDepth(m);
      if (!groups[depth]) groups[depth] = [];
      groups[depth].push(m);
    });

    return Object.keys(groups).map(Number).sort((a: any, b: any) => b - a).map((depth: any) => ({
      name: depth === 0 ? "Chung Kết" : depth === 1 ? "Bán Kết" : `Vòng ${depth + 1}`,
      matches: groups[depth].sort((a: any, b: any) => getPosition(a) - getPosition(b))
    }));
  }, [knockoutMatches]);
 const openScoreModal = (match: any) => {
    // Chỉ cho phép nhập điểm nếu trận đấu đã có đủ 2 đội
    if (!match.homeClub || !match.awayClub) {
      message.warning("Trận đấu này chưa xác định đủ 2 đội bóng!");
      return;
    }
    // Không cho sửa nếu đã FINALIZED (Tùy logic nghiệp vụ của bạn, có thể bỏ if này nếu muốn cho sửa lại)
    if (match.status === 'FINALIZED') {
      message.info("Trận đấu này đã kết thúc!");
      // Vẫn cho mở nhưng có thể disable nút lưu, ở đây mình tạm thời vẫn cho mở để test
    }

    setSelectedMatch(match);
    scoreForm.setFieldsValue({
      homeScore: match.homeClub?.score || 0,
      awayScore: match.awayClub?.score || 0,
    });
    setIsScoreModalVisible(true);
  };
  const handleUpdateScore = async () => {
    try {
      const values = await scoreForm.validateFields();
      
      if (values.homeScore === values.awayScore) {
        message.error("Thể thức Loại trực tiếp không được có kết quả hòa!");
        return;
      }

      setUpdatingScore(true);
      // Gọi API cập nhật kết quả mà ta vừa tạo ở Backend
      await tournamentApi.updateMatchResult(selectedMatch.id, {
        homeScore: values.homeScore,
        awayScore: values.awayScore
      });

      message.success("Cập nhật tỷ số thành công!");
      setIsScoreModalVisible(false);
      
      // Tải lại sơ đồ để thấy đội thắng tự động được đẩy lên vòng trong!
      fetchKnockoutBracket();
      if (onRefresh) onRefresh();

    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || "Lỗi khi cập nhật tỷ số!");
    } finally {
      setUpdatingScore(false);
    }
  };
  // Thêm vào trong component KnockoutTab
const [isFinalizeModalVisible, setIsFinalizeModalVisible] = useState(false);
const [selectedMatch, setSelectedMatch] = useState<any>(null);
const [loadingSubmit, setLoadingSubmit] = useState(false);
const [finalizeForm] = Form.useForm();

// Hàm mở Modal dành cho BTC
const openFinalizeModal = (match: any) => {
  if (!match.homeClub || !match.awayClub) {
    message.warning("Trận đấu này chưa xác định đủ 2 đối thủ!");
    return;
  }
  setSelectedMatch(match);
  finalizeForm.setFieldsValue({
    homeScore: match.homeClub.score || 0,
    awayScore: match.awayClub.score || 0,
  });
  setIsFinalizeModalVisible(true);
};

// Hàm gọi API chốt sổ
const handleFinalizeMatch = async () => {
  try {
    const values = await finalizeForm.validateFields();
    
    // Quy tắc Knockout: Phải có đội thắng
    if (values.homeScore === values.awayScore) {
      message.error("Vòng loại trực tiếp không thể kết thúc với kết quả hòa! Vui lòng nhập tỷ số sau hiệp phụ hoặc penalty.");
      return;
    }

    setLoadingSubmit(true);
    // Gọi API PUT /api/matches/{id}/result mà chúng ta đã build ở Backend
    await tournamentApi.updateMatchResult(selectedMatch.id, values);
    
    message.success(`Trận #${selectedMatch.id} đã chốt! ${values.homeScore > values.awayScore ? selectedMatch.homeClub.name : selectedMatch.awayClub.name} đã đi tiếp.`);
    setIsFinalizeModalVisible(false);
    
    // Refresh lại sơ đồ để thấy "nước chảy" lên vòng trong
    fetchKnockoutBracket(); 
  } catch (error: any) {
    message.error(error.response?.data?.message || "Có lỗi khi chốt kết quả");
  } finally {
    setLoadingSubmit(false);
  }
};
  

  // --- XỬ LÝ BỐC THĂM ---
  const handleConfirmGenerate = async () => {
    let rawInputs: any[] = [];
    (selectedClubIds as any[]).forEach((val: any) => {
      if (typeof val === 'string') {
        const parts = val.split(/[\s,]+/).filter((p: any) => p.trim() !== '');
        rawInputs.push(...parts);
      } else {
        rawInputs.push(val);
      }
    });

    const finalIds = rawInputs.map((val: any) => {
      if (!isNaN(Number(val))) return Number(val);
      const found = (clubs as any[] || []).find((c: any) => 
        String(c?.name || '').toLowerCase() === String(val).toLowerCase()
      );
      return found ? found.id : null;
    }).filter((id: any) => id !== null) as number[];

    if (finalIds.length < 2) {
      message.warning("Vui lòng nhập hoặc chọn ít nhất 2 đội hợp lệ!");
      return;
    }

    setGenerating(true);
    try {
      await tournamentApi.generateFirstKnockoutRound(tournamentId, { qualifiedClubIds: finalIds });
      message.success("Bốc thăm Vòng Knockout thành công!");
      setIsModalVisible(false);
      
      // ✨ Gọi lại API để load ngay sơ đồ mới bốc thăm
      fetchKnockoutBracket();
      if (onRefresh) onRefresh();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setGenerating(false);
    }
  };

  if (loadingBracket) return <div className="flex justify-center p-20"><Spin size="large" /></div>;

  return (
    <div className="p-6 bg-slate-50 min-h-[500px] rounded-b-xl border-x border-b border-slate-200 overflow-x-auto">
      
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
        <div className="min-w-[1200px] pb-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Sơ đồ Nhánh Đấu Vòng Loại Trực Tiếp
            </h2>
            <Button onClick={fetchKnockoutBracket} size="small" icon={<CalendarDays size={14}/>}>Làm mới</Button>
          </div>

          <div className="flex justify-start items-start gap-24 px-4">
            {rounds.map((round: any, rIdx: any) => (
              <div key={rIdx} className="flex flex-col justify-around gap-8 min-h-[500px]">
                <div className="text-center">
                  <Tag color="orange" className="uppercase font-bold tracking-widest px-4 py-1">{round.name}</Tag>
                </div>
                
                <div className="flex flex-col justify-around flex-grow gap-12">
                  {round.matches.map((match: any, mIdx: any) => (
                    <div key={mIdx} className="relative group">
                      {/* CARD TRẬN ĐẤU */}
                      <div
                      onClick={() => openScoreModal(match)}
                       className="w-72 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:border-blue-400 transition-all z-10 relative
                       ${match.homeClub && match.awayClub ? 'cursor-pointer hover:border-blue-500 border-slate-200 hover:shadow-md' : 'border-slate-200 opacity-80'}"
                       >
                        <div className="p-1.5 bg-slate-50 border-b flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Match #{match.id}</span>
                          <span className={`text-[10px] px-2 rounded-full font-bold ${match.status === 'FINALIZED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            {match.status}
                          </span>
                        </div>

                        {/* Đội Nhà */}
                        <div className={`flex justify-between p-3 items-center ${match.winner?.id === match.homeClub?.id && match.homeClub ? 'bg-blue-50/50' : ''}`}>
                          <div className="flex items-center gap-3">
                            <ShieldCheck size={18} className={match.homeClub ? "text-blue-500" : "text-slate-300"} />
                            <span className={`text-sm font-bold truncate w-40 ${!match.homeClub ? 'text-slate-300 italic' : 'text-slate-700'}`}>
                              {match.homeClub?.name || "Chờ cặp đấu trước..."}
                            </span>
                          </div>
                          <span className="text-lg font-black">{match.homeClub?.score ?? '-'}</span>
                        </div>

                        <div className="border-t border-slate-100"></div>

                        {/* Đội Khách */}
                        <div className={`flex justify-between p-3 items-center ${match.winner?.id === match.awayClub?.id && match.awayClub ? 'bg-blue-50/50' : ''}`}>
                          <div className="flex items-center gap-3">
                            <ShieldCheck size={18} className={match.awayClub ? "text-red-500" : "text-slate-300"} />
                            <span className={`text-sm font-bold truncate w-40 ${!match.awayClub ? 'text-slate-300 italic' : 'text-slate-700'}`}>
                              {match.awayClub?.name || "Đang chờ..."}
                            </span>
                          </div>
                          <span className="text-lg font-black">{match.awayClub?.score ?? '-'}</span>
                        </div>
                      </div>

                      {/* ĐƯỜNG NỐI (CONNECTORS) */}
                      {rIdx < rounds.length - 1 && (
                        <>
                          <div className="absolute top-1/2 -right-12 w-12 h-0.5 bg-slate-300"></div>
                          <div className={`absolute -right-12 w-0.5 bg-slate-300 ${mIdx % 2 === 0 ? 'top-1/2 h-full' : 'bottom-1/2 h-full'}`}></div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal
        title={<div className="flex items-center gap-2"><Trophy className="text-yellow-500"/> Cập nhật Kết Quả Trận Đấu</div>}
        open={isScoreModalVisible}
        onCancel={() => setIsScoreModalVisible(false)}
        onOk={handleUpdateScore}
        confirmLoading={updatingScore}
        okText="Lưu kết quả & Đẩy nhánh"
        cancelText="Hủy"
        destroyOnHidden
        centered
      >
        {selectedMatch && (
          <div className="py-6">
            <div className="text-center mb-6 text-slate-500 text-sm">
              Trận đấu <Tag color="blue">#{selectedMatch.id}</Tag> vòng Knockout
            </div>
            
            <Form form={scoreForm} layout="vertical" className="flex items-center justify-center gap-8">
              {/* Cột Đội Nhà */}
              <div className="flex flex-col items-center gap-3 w-1/3">
                <ShieldCheck size={32} className="text-blue-500" />
                <span className="text-center font-bold text-sm h-10">{selectedMatch.homeClub?.name}</span>
                <Form.Item name="homeScore" rules={[{ required: true, message: 'Nhập điểm' }]} className="m-0">
                  <InputNumber min={0} size="large" className="w-20 text-center font-bold text-xl" />
                </Form.Item>
              </div>

              <div className="text-xl font-black text-slate-300">VS</div>

              {/* Cột Đội Khách */}
              <div className="flex flex-col items-center gap-3 w-1/3">
                <ShieldCheck size={32} className="text-red-500" />
                <span className="text-center font-bold text-sm h-10">{selectedMatch.awayClub?.name}</span>
                <Form.Item name="awayScore" rules={[{ required: true, message: 'Nhập điểm' }]} className="m-0">
                  <InputNumber min={0} size="large" className="w-20 text-center font-bold text-xl" />
                </Form.Item>
              </div>
            </Form>
          </div>
        )}
      </Modal>

      {/* MODAL CẤU HÌNH BỐC THĂM (Giữ nguyên logic của bạn) */}
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
          <div className="flex justify-center mb-8">
            <Radio.Group value={selectionMode} onChange={(e) => setSelectionMode(e.target.value)} buttonStyle="solid" size="large">
              <Radio.Button value="auto"><span className="flex items-center gap-2 px-2"><Trophy size={16}/> Tự động (Từ BXH)</span></Radio.Button>
              <Radio.Button value="manual"><span className="flex items-center gap-2 px-2"><Swords size={16}/> Chọn thủ công</span></Radio.Button>
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

              <div className="mb-4">
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  mode="tags"
                  placeholder="✍️ Gõ tên đội bóng để tìm và chọn nhanh..."
                  value={selectedClubIds}
                  onChange={(values) => setSelectedClubIds(values)}
                  options={clubs?.map((c: any) => ({
                    value: c.id,
                    label: c.name,
                    searchString: (c.name || '').toLowerCase() 
                  }))}
                  optionFilterProp="searchString"
                  className="custom-select-seeds"
                  defaultActiveFirstOption={true}
                />
              </div>

              {clubs && clubs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {clubs.map((club: any) => {
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
                          ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'}
                        `}
                      >
                        {isSelected ? (
                          <span className="bg-white text-blue-700 rounded-full min-w-[20px] h-5 flex items-center justify-center text-[10px] font-bold px-1">{sIndex + 1}</span>
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
      <Modal
  title={<div className="flex items-center gap-2 text-red-600"><CheckCircle size={20}/> BTC Chốt kết quả trận đấu</div>}
  open={isFinalizeModalVisible}
  onOk={handleFinalizeMatch}
  onCancel={() => setIsFinalizeModalVisible(false)}
  confirmLoading={loadingSubmit}
  okText="Xác nhận & Đẩy nhánh"
  width={600}
  centered
>
  <div className="py-8 bg-slate-50 rounded-xl px-4 border border-slate-100">
    <Form form={finalizeForm} layout="vertical">
      <div className="flex justify-around items-start gap-4">
        {/* Đội Nhà */}
        <div className="flex flex-col items-center gap-4 w-5/12">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center border-2 border-blue-100">
             <ShieldCheck size={32} className="text-blue-500" />
          </div>
          <span className="font-bold text-center text-slate-700 h-12 flex items-center">{selectedMatch?.homeClub?.name}</span>
          <Form.Item name="homeScore">
            <InputNumber min={0} size="large" className="w-24 text-2xl font-black text-center" />
          </Form.Item>
        </div>

        <div className="pt-20 text-2xl font-black text-slate-300">VS</div>

        {/* Đội Khách */}
        <div className="flex flex-col items-center gap-4 w-5/12">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center border-2 border-red-100">
             <ShieldCheck size={32} className="text-red-500" />
          </div>
          <span className="font-bold text-center text-slate-700 h-12 flex items-center">{selectedMatch?.awayClub?.name}</span>
          <Form.Item name="awayScore">
            <InputNumber min={0} size="large" className="w-24 text-2xl font-black text-center" />
          </Form.Item>
        </div>
      </div>
      <div className="mt-6 p-3 bg-blue-50 rounded-lg text-blue-700 text-xs text-center italic">
        * Sau khi nhấn xác nhận, đội thắng sẽ tự động được hệ thống đưa vào vòng đấu tiếp theo dựa trên sơ đồ nhánh.
      </div>
    </Form>
  </div>
</Modal>
    </div>
  );
};

export default KnockoutTab;