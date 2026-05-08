import { Table, Space, Button } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import  type { Tournament , TournamentStatus } from '../types';
import StatusTag from './StatusTag'; // Component con xử lý màu sắc status

interface Props {
  data: Tournament[];
  loading: boolean;
  pagination: any;
  onChange: (pagination: any) => void;
}
const TournamentTable = ({ data, loading, pagination, onChange}: Props) => {
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
      render: () => (
        <Space>
          <Button type="text" icon={<EyeOutlined className="text-blue-500" />} />
          <Button type="text" icon={<EditOutlined className="text-green-500" />} />
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