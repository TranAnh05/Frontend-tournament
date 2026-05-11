import { useState } from 'react';
import { useClubs } from '../hooks/useClubs';
import { useApplications } from '../hooks/useApplications';
import ClubDetailModal from '../components/ClubDetailModal';

export default function ClubListPage() {
  const { clubs, loading } = useClubs();
  const { applying, applyToClub, hasActiveApplication } = useApplications();

  const [search, setSearch] = useState('');
  const [detailId, setDetailId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const filtered = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.shortName.toLowerCase().includes(search.toLowerCase())
  );

  const confirmApply = async () => {
    if (!confirmId) return;
    const ok = await applyToClub({ clubId: confirmId });
    if (ok) setConfirmId(null);
  };

  const targetClub = clubs.find(c => c.id === confirmId);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">🏟️ Danh sách câu lạc bộ</h1>
          <p className="text-[13px] text-gray-500 mt-1">Tìm kiếm và ứng tuyển vào CLB phù hợp</p>
        </div>
        {hasActiveApplication && (
          <div className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-lg font-semibold">
            ⚠️ Bạn đã có đơn đang xử lý
          </div>
        )}
      </div>

      {/* Search */}
      <input type="text" placeholder="Tìm kiếm theo tên CLB..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {loading && <div className="text-center py-16 text-gray-400">⏳ Đang tải...</div>}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(club => (
            <div key={club.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-all">
              <div>
                <div className="font-extrabold text-gray-900">{club.name}</div>
                <div className="text-xs text-gray-400">{club.shortName}</div>
              </div>
              <div className="text-[12px] text-gray-600 space-y-1">
                <div>👤 {club.managerName}</div>
                <div>👥 {club.totalMembers} thành viên</div>
                {club.headquarters && <div>📍 {club.headquarters}</div>}
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => setDetailId(club.id)}
                  className="flex-1 px-3 py-2 rounded-lg border text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer">
                  👁 Xem chi tiết
                </button>
                <button
                  onClick={() => { if (!hasActiveApplication) setConfirmId(club.id); }}
                  disabled={hasActiveApplication || club.status !== 'ACTIVE'}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                  📋 Ứng tuyển
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detailId && (
        <ClubDetailModal clubId={detailId} onClose={() => setDetailId(null)}
          onApply={id => { setDetailId(null); setConfirmId(id); }}
          applying={applying}
        />
      )}

      {/* Confirm Modal */}
      {confirmId && targetClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="text-4xl mb-3">📋</div>
            <div className="font-extrabold text-gray-900 mb-1">Xác nhận ứng tuyển</div>
            <p className="text-[13px] text-gray-500 mb-4">
              Nộp đơn vào <strong>{targetClub.name}</strong>?
            </p>
            <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mb-4">
              ⚠️ Bạn chỉ được ứng tuyển một CLB tại một thời điểm
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)}
                className="flex-1 px-4 py-2 rounded-lg border text-gray-600 text-sm cursor-pointer">
                Hủy
              </button>
              <button onClick={confirmApply} disabled={applying}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold cursor-pointer disabled:opacity-60">
                {applying ? '⏳...' : '✅ Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}