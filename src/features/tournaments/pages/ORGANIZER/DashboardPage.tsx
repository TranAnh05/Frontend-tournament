import { useEffect, useState } from 'react';
import { Trophy, Users, CalendarDays, UserCheck } from 'lucide-react';
import { Spin } from 'antd';
import { tournamentApi, registrationApi } from '../../api/tournamentApi';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

// ---- Types nhỏ dùng nội bộ ----
interface KpiItem {
  label: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  DRAFT:                 { label: 'Bản nháp',       color: 'bg-slate-100 text-slate-600' },
  PUBLISHED:             { label: 'Đã công bố',     color: 'bg-blue-100 text-blue-700' },
  OPENING:               { label: 'Mở đăng ký',     color: 'bg-cyan-100 text-cyan-700' },
  IN_PROGRESS:           { label: 'Đang diễn ra',   color: 'bg-green-100 text-green-700' },
  REGISTRATION_CLOSED:   { label: 'Đóng đăng ký',   color: 'bg-orange-100 text-orange-700' },
  COMPLETED:             { label: 'Hoàn thành',     color: 'bg-slate-100 text-slate-500' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS_LABEL[status] ?? { label: status, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>
      {s.label}
    </span>
  );
};

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [openingTournaments, setOpeningTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [tourRes, openRes] = await Promise.all([
          tournamentApi.getTournaments({ page: 0, size: 5, search: '' }),
          registrationApi.getOpeningTournaments(),
        ]);

        // Xử lý response từ interceptor (đã unwrap)
        setTournaments(
          (tourRes as any).content ?? (tourRes as any).result?.content ?? []
        );
        setOpeningTournaments(
          (openRes as any).result ?? (openRes as any) ?? []
        );
      } catch (err) {
        console.error('Lỗi tải dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Tính KPI từ dữ liệu thực
  const inProgress = tournaments.filter((t) => t.status === 'IN_PROGRESS').length;
  const opening    = tournaments.filter((t) => t.status === 'OPENING').length;

  const kpis: KpiItem[] = [
    {
      label: 'Tổng giải đấu',
      value: tournaments.length,
      sub: `${inProgress} đang diễn ra`,
      icon: <Trophy size={18} />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Đang mở đăng ký',
      value: opening,
      sub: 'Giải chấp nhận đội mới',
      icon: <Users size={18} />,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Giải sắp tổ chức',
      value: tournaments.filter((t) => t.status === 'REGISTRATION_CLOSED').length,
      sub: 'Đã đóng đăng ký',
      icon: <CalendarDays size={18} />,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Đã hoàn thành',
      value: tournaments.filter((t) => t.status === 'COMPLETED').length,
      sub: 'Trong danh sách hiện tại',
      icon: <UserCheck size={18} />,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lời chào */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Xin chào, {user?.fullName ?? 'Ban Tổ Chức'} 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Đây là tổng quan hoạt động giải đấu của bạn.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            <div className={`inline-flex p-2 rounded-xl mb-3 ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div className="text-3xl font-bold text-slate-800">{kpi.value}</div>
            <div className="text-sm font-semibold text-slate-700 mt-1">{kpi.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Giải đấu gần đây */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Trophy size={16} className="text-blue-500" />
            <h3 className="font-semibold text-slate-800 text-sm">Giải đấu gần đây</h3>
          </div>
          {tournaments.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">Chưa có giải đấu nào</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Tên giải</th>
                  <th className="text-left px-3 py-3">Môn</th>
                  <th className="text-left px-3 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.slice(0, 5).map((t) => (
                  <tr key={t.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-700 truncate max-w-[150px]">{t.name}</td>
                    <td className="px-3 py-3 text-slate-500">{t.sportName}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Giải đang mở đăng ký */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Users size={16} className="text-green-500" />
            <h3 className="font-semibold text-slate-800 text-sm">Đang mở đăng ký</h3>
          </div>
          {openingTournaments.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              Hiện không có giải nào đang mở đăng ký
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Tên giải</th>
                  <th className="text-left px-3 py-3">Môn</th>
                  <th className="text-left px-3 py-3">Kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {openingTournaments.slice(0, 5).map((t: any) => (
                  <tr key={t.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-700 truncate max-w-[150px]">{t.name}</td>
                    <td className="px-3 py-3 text-slate-500">{t.sportName}</td>
                    <td className="px-3 py-3 text-slate-500">{t.endDate ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;