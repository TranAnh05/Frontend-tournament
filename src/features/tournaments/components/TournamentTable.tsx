import { Table, Space, Button } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import  type { Tournament , TournamentStatus } from '../types';
import StatusTag from './StatusTag'; // Component con xử lý màu sắc status
import { Edit3 } from 'lucide-react';
import { useState } from 'react';
import { tournamentApi } from '../api/tournamentApi';

import UpdateTournamentModal from './UpdateTournamentModal';


interface Props {
  data: Tournament[];
  loading: boolean;
  pagination: any;
  onChange: (pagination: any) => void;
  onEdit: (id: number) => void;
}
const TournamentTable = ({ data, loading, pagination, onChange, onEdit }: Props) => {
  const navigate = useNavigate();
  // Khai báo state để đóng/mở Modal cập nhật
const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

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
          <Button type="text" icon={<DeleteOutlined className="text-red-500" />} />
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