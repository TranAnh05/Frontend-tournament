import { useClubDetail } from '../hooks/useClubDetail';

const ROLE_BADGE: Record<string, string> = {
  CAPTAIN:    'bg-yellow-100 text-yellow-800',
  HEAD_COACH: 'bg-purple-100 text-purple-800',
  MEMBER:     'bg-gray-100 text-gray-600',
};
const ROLE_LABEL: Record<string, string> = {
  CAPTAIN: '⭐ Đội trưởng', HEAD_COACH: '🎯 HLV', MEMBER: 'Thành viên',
};

interface Props {
  clubId: number;
  onClose: () => void;
  onApply: (clubId: number) => void;
  applying: boolean;
}

export default function ClubDetailModal({ clubId, onClose, onApply, applying }: Props) {
  const { club, loading } = useClubDetail(clubId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="font-extrabold text-gray-900">{club?.name ?? '...'}</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loading && <div className="text-center py-10 text-gray-400">Đang tải...</div>}

          {club && !loading && (
            <>
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Quản lý',    value: club.managerName },
                  { label: 'Thành viên', value: `${club.totalMembers} người` },
                  { label: 'Địa chỉ',   value: club.headquarters ?? '—' },
                  { label: 'Email',      value: club.contactEmail ?? '—' },
                  { label: 'SĐT',        value: club.contactPhone ?? '—' },
                  { label: 'Sân nhà',    value: club.homeVenueName ?? '—' },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl px-4 py-3">
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="text-[13px] font-semibold text-gray-900">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Members table */}
              <div className="text-[13px] font-bold text-gray-700 mb-2">
                👥 Thành viên ({club.members.length})
              </div>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-[13px]">
                  <thead className="bg-gray-50 text-[11px] text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 text-left">#</th>
                      <th className="px-4 py-2.5 text-left">Họ tên</th>
                      <th className="px-4 py-2.5 text-left">Vị trí</th>
                      <th className="px-4 py-2.5 text-left">Vai trò</th>
                      <th className="px-4 py-2.5 text-left">Thể trạng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {club.members.map(m => (
                      <tr key={m.athleteId} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-500">{m.preferredNumber ?? '—'}</td>
                        <td className="px-4 py-2.5 font-semibold">{m.fullName}</td>
                        <td className="px-4 py-2.5 text-gray-600">{m.preferredPosition ?? '—'}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ROLE_BADGE[m.clubRole]}`}>
                            {ROLE_LABEL[m.clubRole]}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            m.healthStatus === 'FIT'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {m.healthStatus === 'FIT' ? '✅ Khỏe' : '🤕 Chấn thương'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 text-sm hover:bg-gray-50 cursor-pointer">
            Đóng
          </button>
          <button onClick={() => onApply(clubId)} disabled={applying}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer disabled:opacity-60">
            {applying ? '⏳ Đang nộp...' : '📋 Ứng tuyển'}
          </button>
        </div>
      </div>
    </div>
  );
}