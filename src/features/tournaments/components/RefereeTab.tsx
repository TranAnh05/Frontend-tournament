import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, message, Modal, Select, Spin, Avatar,Radio } from 'antd';
import { Users, ShieldCheck, Clock, CalendarDays } from 'lucide-react';
import { tournamentApi } from '../api/tournamentApi'; // Sửa đường dẫn nếu cần

interface RefereeTabProps {
  tournamentId: number | string;
}

const RefereeTab: React.FC<RefereeTabProps> = ({ tournamentId }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // States cho Modal phân công
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [availableReferees, setAvailableReferees] = useState<any[]>([]);
  const [fetchingReferees, setFetchingReferees] = useState(false);
  const [selectedRefereeId, setSelectedRefereeId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);

  // 1. Lấy toàn bộ danh sách trận đấu của giải
  const fetchMatches = async () => {
    if (!tournamentId) return;
    setLoading(true);
    try {
      const res = await tournamentApi.getMatchesByTournament(tournamentId);
      const responseData = res.data ? res.data : res;
      setMatches(responseData.result || []);
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải danh sách trận đấu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [tournamentId]);

  // 2. Mở Modal và lấy danh sách Trọng tài RẢNH cho trận đó
  const handleOpenAssignModal = async (match: any) => {
    setSelectedMatch(match);
    setSelectedRefereeId(match.referee?.id || null);
    setIsModalVisible(true);
    setFetchingReferees(true);
    
    try {
      const res = await tournamentApi.getAvailableRefereesForMatch(match.id);
      const responseData = res.data ? res.data : res;
      setAvailableReferees(responseData.result || []);
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy danh sách trọng tài trống lịch!");
    } finally {
      setFetchingReferees(false);
    }
  };

  // 3. Xử lý bấm nút Lưu phân công
  const handleAssignReferee = async () => {
    if (!selectedRefereeId) {
      message.warning("Vui lòng chọn một trọng tài!");
      return;
    }
    setAssigning(true);
    try {
      await tournamentApi.assignRefereeToMatch(selectedMatch.id, {
        refereeId: selectedRefereeId,
        role: "MAIN" 
      });
      message.success("Phân công trọng tài thành công!");
      setIsModalVisible(false);
      fetchMatches(); // Gọi lại để update bảng dữ liệu
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi phân công!");
    } finally {
      setAssigning(false);
    }
  };
   const [filterMode, setFilterMode] = useState<'ALL' | 'UNASSIGNED'>('UNASSIGNED');
  const displayedMatches = matches.filter(match => {
    if (filterMode === 'UNASSIGNED') {
      return !match.referee; // Chỉ trả về những trận referee bị null/undefined
    }
    return true; // Trả về toàn bộ
  });

  // --- CẤU HÌNH CỘT CHO BẢNG ---
  const columns = [
    {
      title: 'Bảng đấu',
      dataIndex: 'groupStageName',
      key: 'groupStageName',
      render: (text: string) => <Tag color="blue" className="font-bold border-0">{text || 'N/A'}</Tag>,
      width: '10%',
    },
    {
      title: 'Trận đấu (Đội Nhà vs Đội Khách)',
      key: 'match',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3 font-medium text-slate-700">
          <span className="w-1/3 text-right truncate">{record.homeClub?.name || 'Đội nhà'}</span>
          <Tag color="red" className="m-0 rounded-full font-bold">VS</Tag>
          <span className="w-1/3 text-left truncate">{record.awayClub?.name || 'Đội khách'}</span>
        </div>
      ),
      width: '35%',
    },
    {
      title: 'Thời gian dự kiến',
      dataIndex: 'scheduledTime',
      key: 'scheduledTime',
      render: (time: string) => (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Clock size={14} /> 
          {time ? new Date(time).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Chưa xếp lịch'}
        </div>
      ),
    },
    {
      title: 'Trọng tài chính',
      key: 'referee',
      render: (_: any, record: any) => (
        record.referee ? (
          <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full w-fit border border-green-100">
            <ShieldCheck size={16} /> {record.referee.fullName}
          </div>
        ) : (
          <span className="text-slate-400 italic">Chưa phân công</span>
        )
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type={record.referee ? "default" : "primary"}
          size="small"
          onClick={() => handleOpenAssignModal(record)}
          className={!record.referee ? "bg-blue-600" : ""}
        >
          {record.referee ? "Đổi TT" : "Phân công"}
        </Button>
      ),
      align: 'center' as const,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-blue-600" /> Quản lý phân công Trọng tài
        </h2>
        <Radio.Group 
          value={filterMode} 
          onChange={(e) => setFilterMode(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="UNASSIGNED">
            Chưa phân công ({matches.filter(m => !m.referee).length})
          </Radio.Button>
          <Radio.Button value="ALL">
            Tất cả trận đấu ({matches.length})
          </Radio.Button>
        </Radio.Group>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={matches} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          className="custom-table"
          scroll={{ x: 'max-content' }}
        />
      </div>

      {/* MODAL CHỌN TRỌNG TÀI */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg text-slate-800 border-b pb-3">
            <ShieldCheck className="text-blue-600" /> Phân công Trọng tài
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAssignReferee}
        confirmLoading={assigning}
        okText="Lưu phân công"
        cancelText="Hủy"
        destroyOnClose
        centered
        okButtonProps={{ className: "bg-blue-600" }}
      >
        {selectedMatch && (
          <div className="py-4 space-y-6">
            {/* Tóm tắt trận đấu */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
              <div className="flex justify-between text-sm font-bold text-slate-700">
                <span>{selectedMatch.homeClub?.name}</span>
                <span className="text-slate-400">vs</span>
                <span>{selectedMatch.awayClub?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 justify-center pt-2 border-t border-slate-200 mt-2">
                <CalendarDays size={14} /> 
                {selectedMatch.scheduledTime ? new Date(selectedMatch.scheduledTime).toLocaleString('vi-VN') : 'Chưa rõ thời gian'}
              </div>
            </div>

            {/* Dropdown chọn trọng tài */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                Chọn trọng tài chính <span className="text-red-500">*</span>
              </label>
              
              {fetchingReferees ? (
                <div className="flex items-center gap-2 text-blue-500 py-2">
                  <Spin size="small" /> Đang quét lịch trống của các trọng tài...
                </div>
              ) : (
                <Select
                  showSearch
                  placeholder="Chọn một trọng tài đang rảnh..."
                  className="w-full"
                  size="large"
                  value={selectedRefereeId}
                  onChange={(val) => setSelectedRefereeId(val)}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={availableReferees.map(ref => ({
                    value: ref.id,
                    label: ref.fullName,
                  }))}
                  notFoundContent="Không có trọng tài nào trống lịch lúc này!"
                />
              )}
            </div>
            <p className="text-xs text-slate-500 italic">
              * Danh sách này chỉ hiển thị những trọng tài KHÔNG bị trùng lịch trong khoảng +/- 2.5 tiếng so với thời gian diễn ra trận đấu.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RefereeTab;