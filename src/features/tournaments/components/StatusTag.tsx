import { Tag } from 'antd';
import type { TournamentStatus } from '../types'; // Đảm bảo import type đúng chuẩn

const StatusTag = ({ status }: { status: TournamentStatus }) => {
  const statusMap: Record<string, { color: string; text: string }> = {
   REGISTRATION_OPEN: { color: 'green', text: 'Đang mở đăng ký' },
    FINISHED: { color: 'red', text: 'Đã kết thúc' },
    DRAFT: { color: 'gold', text: 'Bản nháp' },
    ONGOING: { color: 'blue', text: 'Đang diễn ra' },
  };

  const config = statusMap[status] || { color: 'default', text: status };
  return <Tag color={config.color} className="rounded-full px-3 py-1">{config.text}</Tag>;
};

export default StatusTag;