import { Table, Space, Button,Modal } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined,ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import  type { Tournament , TournamentStatus } from '../types';
import StatusTag from './StatusTag'; // Component con xử lý màu sắc status
import { Edit3 } from 'lucide-react';
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
      title: 'TRẠNG THÁI', 
      dataIndex: 'status', 
      render: (status: TournamentStatus) => <StatusTag status={status} /> 
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
      {(record.status === 'DRAFT' || record.status === 'COMPLETED'|| record.status === 'FINISHED') && (
        <button
        onClick={() => showDeleteConfirm(record.id, record.name)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Xóa giải đấu"
              >
                {<DeleteOutlined className="text-red-500" />}
              </button>
            )}
          
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