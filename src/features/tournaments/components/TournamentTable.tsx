import { Table, Space, Button,Modal,Tag} from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined,ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import  type { Tournament , TournamentStatus } from '../types';
import StatusTag from './StatusTag'; // Component con xử lý màu sắc status
import { Trash2, Edit3, Eye, Lock, Unlock ,Play, Square } from 'lucide-react';
import { useState } from 'react';
import { tournamentApi } from '../api/tournamentApi';
import { toast } from 'react-toastify';

import UpdateTournamentModal from './UpdateTournamentModal';


interface Props {
  data: Tournament[];
  loading: boolean;
  pagination: any;
  onChange: (pagination: any) => void;
  onEdit: (id: number) => void;
  onRefresh: () => void;
}
const TournamentTable = ({ data, loading, pagination, onChange, onEdit,onRefresh }: Props) => {
  const navigate = useNavigate();
  // Khai báo state để đóng/mở Modal cập nhật
const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);


  // 2. Hàm hiển thị popup xác nhận xóa
  const showDeleteConfirm = (id: number, name: string) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa giải đấu này?',
      icon: <ExclamationCircleFilled className="text-red-500" />,
      content: `Giải đấu "${name}" sẽ bị ẩn khỏi hệ thống.`,
      okText: 'Xóa giải đấu',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await tournamentApi.deleteTournament(id);
          toast.success("Xóa giải đấu thành công!");
          onRefresh(); // Tải lại bảng dữ liệu lập tức
        } catch (error: any) {
          const errMsg = error.response?.data?.message || "Xóa thất bại!";
          toast.error(errMsg);
        }
      },
    });
  };
  const showToggleRegistrationConfirm = (id: number, name: string, currentStatus: string) => {
   const isOpening = currentStatus === 'DRAFT' || currentStatus === 'REGISTRATION_CLOSE';
    
   
    let actionText = '';
    if (currentStatus === 'DRAFT') actionText = 'MỞ cổng đăng ký';
    else if (currentStatus === 'REGISTRATION_CLOSED') actionText = 'MỞ LẠI cổng đăng ký';
    else actionText = 'ĐÓNG cổng đăng ký';

    const actionColor = isOpening ? 'text-green-500' : 'text-orange-500';
   Modal.confirm({
      title: `Xác nhận ${actionText}?`,
      icon: <ExclamationCircleFilled className={actionColor} />,
      content: isOpening 
        ? `Giải đấu "${name}" sẽ ${currentStatus === 'REGISTRATION_CLOSE' ? 'tiếp tục' : 'bắt đầu'} nhận đăng ký từ các đội. Bạn có chắc chắn?`
        : `Giải đấu "${name}" sẽ dừng nhận đăng ký. Các đội chưa đăng ký sẽ không thể tham gia nữa.`,
      okText: 'Đồng ý',
      okType: isOpening ? 'primary' : 'danger', 
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res: any = await tournamentApi.toggleRegistration(id);
          toast.success(res.message || `${actionText} thành công!`);
          onRefresh(); 
        } catch (error: any) {
          const errMsg = error.response?.data?.message || "Thao tác thất bại!";
          toast.error(errMsg);
        }
      },
    });
  };

  // 1. Hàm xác nhận Bắt đầu giải đấu
  const handleStart = (id: number, name: string) => {
    Modal.confirm({
      title: 'Xác nhận bắt đầu giải đấu?',
      content: `Giải đấu "${name}" sẽ chuyển sang trạng thái ONGOING. Bạn sẽ không thể thay đổi danh sách đội đăng ký nữa.`,
      okText: 'Bắt đầu ngay',
      okType: 'primary',
      onOk: async () => {
        try {
          await tournamentApi.startTournament(id);
          toast.success("Giải đấu đã chính thức bắt đầu!");
          onRefresh();
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Lỗi khi bắt đầu giải");
        }
      }
    });
  };

  // 2. Hàm xác nhận Kết thúc giải đấu
  const handleFinish = (id: number, name: string) => {
    Modal.confirm({
      title: 'Kết thúc giải đấu?',
      content: `Bạn có chắc chắn muốn đóng giải đấu "${name}"? Thao tác này không thể hoàn tác.`,
      okText: 'Kết thúc',
      okType: 'danger',
      onOk: async () => {
        try {
          await tournamentApi.finishTournament(id);
          toast.success("Giải đấu đã kết thúc!");
          onRefresh();
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Lỗi khi kết thúc giải");
        }
      }
    });
  };

// Khai báo state để lưu ID của giải đấu đang được chọn để sửa
const [selectedId, setSelectedId] = useState<number | null>(null);
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (id: number) => `#${id}` },
    { title: 'TÊN GIẢI ĐẤU', dataIndex: 'name', key: 'name', className: 'font-semibold' },
    { title: 'MÔN THỂ THAO', dataIndex: 'sportName', key: 'sportName' },
    { 
      title: 'THỜI GIAN', 
      key: 'date', 
      render: (record: Tournament) => `${record.startDate} - ${record.endDate}` 
    },
    { title: 'ĐỊA ĐIỂM', dataIndex: 'venueName', key: 'venueName' },
   {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        // Render màu sắc cho trạng thái đẹp mắt hơn
        let color = 'default';
        if (status === 'DRAFT') color = 'default';
        if (status === 'REGISTRATION_OPEN') color = 'success';
        if (status === 'REGISTRATION_CLOSE') color = 'warning';
        if (status === 'COMPLETED') color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button 
  type="text" 
  icon={<EyeOutlined className="text-blue-500" />} 
  onClick={() => navigate(`/organizer/tournaments/${record.id}`)}
     />
     
          {'DRAFT' === record.status &&'DRAFT' && (
       <button 
        onClick={() => onEdit(record.id)} // ✨ Gọi hàm onEdit và truyền ID giải đấu
        className="text-blue-600 hover:text-blue-800"
      >
         <Edit3 size={18} />
      </button>
        
      )}
  {(record.status === 'DRAFT' || record.status === 'REGISTRATION_OPEN' || record.status === 'REGISTRATION_CLOSE') && (
  <button 
    onClick={() => showToggleRegistrationConfirm(record.id, record.name, record.status)}
    className={`p-2 rounded-lg transition-all ${
      record.status === 'REGISTRATION_OPEN'
        ? 'text-orange-600 hover:bg-orange-50' // Đang Mở -> Hiện màu Cam (để cảnh báo Đóng)
        : 'text-green-600 hover:bg-green-50'    // Đang Đóng/Nháp -> Hiện màu Xanh (để mời Mở)
    }`}
    title={record.status === 'REGISTRATION_OPEN' ? "Đóng đăng ký" : "Mở đăng ký"}
  >
    {/* ✨ Logic mới: Trạng thái Mở thì hiện Unlock, Trạng thái Đóng/Nháp thì hiện Lock */}
    {record.status === 'REGISTRATION_OPEN' ? <Unlock size={18} /> : <Lock size={18} />}
  </button>
)}
      {(record.status === 'DRAFT' || record.status === 'COMPLETED'|| record.status === 'FINISHED') && (
        <button
        onClick={() => showDeleteConfirm(record.id, record.name)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Xóa giải đấu"
              >
                {<DeleteOutlined className="text-red-500" />}
              </button>
            )}

            {/* NHÓM BUTTON QUAN TRỌNG: Bắt đầu / Kết thúc */}
            <div className="flex items-center">
              {/* Nút Bắt đầu: Chỉ hiện khi Đã đóng đăng ký */}
              {record.status?.includes('CLOSE') && (
                <Button 
                  type="primary" 
                  size="small"
                  icon={<Play size={14} fill="currentColor" />}
                  className="bg-green-600 hover:bg-green-700 border-none flex items-center"
                  onClick={() => handleStart(record.id, record.name)}
                >
                  Bắt đầu
                </Button>
              )}

              {/* Nút Kết thúc: Chỉ hiện khi đang ONGOING */}
              {record.status === 'ONGOING' && (
                <Button 
                  danger
                  type="primary"
                  size="small"
                  icon={<Square size={14} fill="currentColor" />}
                  className="flex items-center"
                  onClick={() => handleFinish(record.id, record.name)}
                >
                  Kết thúc
                </Button>
              )}
              {/* Nhãn hiển thị nếu đã kết thúc */}
              {record.status === 'FINISHED' && (
                <span className="text-xs font-medium text-slate-400 italic">Giải đấu đã khép lại</span>
              )}
            </div>
          
        

            
          
        </Space>
      ),
    },
  ];

return (
    <Table 
      columns={columns} 
      dataSource={data} 
      loading={loading} 
      pagination={pagination}
      onChange={onChange}
      rowKey="id"
    />
  );
};

export default TournamentTable;