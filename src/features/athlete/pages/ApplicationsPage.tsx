import { useApplications } from '../hooks/useApplications';

const STATUS: Record<string, { label: string; badge: string; icon: string }> = {
  PENDING:  { label: 'Chờ duyệt',  badge: 'bg-amber-100 text-amber-700', icon: '⏳' },
  APPROVED: { label: 'Đã duyệt',   badge: 'bg-green-100 text-green-700', icon: '✅' },
  REJECTED: { label: 'Từ chối',    badge: 'bg-red-100 text-red-600',     icon: '❌' },
  LEFT:     { label: 'Đã rời',     badge: 'bg-gray-100 text-gray-500',   icon: '🚪' },
  REMOVED:  { label: 'Bị loại',    badge: 'bg-red-100 text-red-700',     icon: '🚫' },
};

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('vi-VN') : '—';

export default function ApplicationsPage() {
  const { applications, loading } = useApplications();

  const active = applications.find(
    a => a.joinStatus === 'PENDING' || a.joinStatus === 'APPROVED'
  );
  const history = applications.filter(
    a => a.joinStatus !== 'PENDING' && a.joinStatus !== 'APPROVED'
  );

  if (loading) return <div className="text-center py-16 text-gray-400">⏳ Đang tải...</div>;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">📋 Đơn ứng tuyển của tôi</h1>
        <p className="text-[13px] text-gray-500 mt-1">Theo dõi trạng thái đơn và lịch sử CLB</p>
      </div>

      {/* Đơn đang active */}
      {active ? (
        <div className={`border-2 rounded-2xl p-5 ${
          active.joinStatus === 'PENDING'
            ? 'border-amber-300 bg-amber-50'
            : 'border-green-300 bg-green-50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-extrabold text-gray-900 text-[15px]">{active.clubName}</div>
              <div className="text-xs text-gray-500">{active.clubShortName}</div>
              {active.joinStatus === 'APPROVED' && (
                <div className="text-xs text-green-600 mt-1">
                  Vào ngày {fmt(active.joinedDate)}
                </div>
              )}
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${STATUS[active.joinStatus].badge}`}>
              {STATUS[active.joinStatus].icon} {STATUS[active.joinStatus].label}
            </span>
          </div>
          {active.joinStatus === 'PENDING' && (
            <p className="text-xs text-amber-700 mt-3 bg-amber-100 px-3 py-2 rounded-lg">
              ⏳ Đơn đang chờ quản lý CLB phê duyệt
            </p>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">🏃</div>
          <div className="font-bold text-blue-800">Bạn chưa thuộc CLB nào</div>
          <p className="text-xs text-blue-600 mt-1">Vào trang Danh sách CLB để ứng tuyển</p>
        </div>
      )}

      {/* Lịch sử */}
      <div className="font-bold text-[13px] text-gray-700">
        📜 Lịch sử ({history.length})
      </div>
      {history.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          Chưa có lịch sử
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50 text-[11px] text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-2.5 text-left">CLB</th>
                <th className="px-4 py-2.5 text-left">Trạng thái</th>
                <th className="px-4 py-2.5 text-left">Ngày nộp</th>
                <th className="px-4 py-2.5 text-left">Ngày vào / rời</th>
              </tr>
            </thead>
            <tbody>
              {history.map(app => {
                const cfg = STATUS[app.joinStatus];
                return (
                  <tr key={app.memberId} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{app.clubName}</div>
                      <div className="text-xs text-gray-400">{app.clubShortName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.badge}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{fmt(app.appliedAt)}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {fmt(app.joinedDate)}
                      {app.leftDate && <div className="text-xs text-gray-400">→ {fmt(app.leftDate)}</div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}