// src/features/tournaments/pages/ORGANIZER/TournamentDetailPage.tsx
import { Card, Descriptions, Tag, Spin, Divider, List, Typography, Button, Space } from 'antd';
import { useTournamentDetail } from '../../hooks/useTournamentDetail';
import { CalendarOutlined, EnvironmentOutlined, TrophyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate ,useParams} from 'react-router-dom';

const { Title } = Typography;

// ... (các import giữ nguyên)

const TournamentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
 const { detail: tournament, loading } = useTournamentDetail(id);

  if (loading) return <div className="flex justify-center p-10"><Spin size="large" /></div>;
  if (!tournament) return <div className="p-10 text-center">Không tìm thấy dữ liệu.</div>;

  return (
    <div className="p-6">
      <Space className="mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>
        <Title level={2} style={{ margin: 0 }}>{tournament.name}</Title>
      </Space>
      
      {/* Container chính dùng Grid để chia cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* CỘT 1 & 2: Bảng chi tiết (Chiếm 2/3 chiều rộng trên màn hình lớn) */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm" title="Thông tin chi tiết giải đấu">
            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item label="Môn thể thao">
                <Tag color="blue">{tournament.sportName}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color="cyan">{tournament.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thể thức">
                {tournament.format}
              </Descriptions.Item>
              <Descriptions.Item label="VĐV tối thiểu">
                {tournament.minAthletes} người
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">{tournament.startDate}</Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">{tournament.endDate}</Descriptions.Item>
              
              <Descriptions.Item label="Quy tắc điểm" span={2}>
                <Space size="large">
                  <span>Thắng: <Tag color="green">+{tournament.winPoints}</Tag></span>
                  <span>Hòa: <Tag color="orange">+{tournament.drawPoints}</Tag></span>
                  <span>Thua: <Tag color="red">{tournament.lostPonits}</Tag></span>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        {/* CỘT 3: Thông tin địa điểm (Chiếm 1/3 chiều rộng) */}
        <div className="lg:col-span-1">
          <Card 
            className="shadow-sm" 
            title={<span><EnvironmentOutlined /> Địa điểm & Sân</span>}
          >
            <Title level={4} style={{ marginTop: 0 }}>{tournament.venue?.name}</Title>
            <p className="text-gray-500 mb-4">{tournament.venue?.address}</p>
           
            <Divider orientation={"left" as any} plain>
                Danh sách sân
            </Divider>
            
            {tournament.venue?.courts && tournament.venue.courts.length > 0 ? (
              <List
                size="small"
                dataSource={tournament.venue.courts}
                renderItem={(court: any) => (
                  <List.Item>
                    <Space>
                      <TrophyOutlined className="text-yellow-500" />
                      {court.name}
                    </Space>
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-4 text-gray-400 italic">
                Chưa có thông tin sân
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};
export default TournamentDetailPage;