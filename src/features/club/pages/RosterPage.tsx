import { useState, useEffect, useCallback } from "react";
import { useClub } from "../hooks/useClub";
import { rosterApi } from "../api/rosterApi";
import type { RosterPlayerRequest } from "../api/rosterApi";
import { useUiStore } from "../store/uiStore";
import { Card, CardHeader, Btn, Modal } from "../components/common/UIComponents";

const HEALTH_STYLE: Record<string, { label: string; cls: string }> = {
  FIT:     { label: "Khỏe mạnh",   cls: "bg-emerald-50 text-emerald-700" },
  INJURED: { label: "Chấn thương", cls: "bg-red-50 text-red-500" },
};

const ROLE_LABEL: Record<string, string> = {
  CAPTAIN:    "Đội trưởng",
  MEMBER:     "Thành viên",
  HEAD_COACH: "HLV trưởng",
};

export default function RosterPage() {
  const { club } = useClub();
  const showToast = useUiStore(s => s.showToast);

  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [existingCount, setExistingCount] = useState<number>(0);
  const [confirmModal, setConfirmModal] = useState(false);

  const approvedTournaments = (club?.tournamentHistory ?? [])
    .filter(t => t.registrationStatus === "APPROVED");

  const members = (club?.members ?? []);

  const selectedTournament = approvedTournaments.find(t => t.tournamentId === selectedTournamentId);

  const loadRoster = useCallback(async (tournamentId: number) => {
    try {
      const roster = await rosterApi.getMyRoster(tournamentId);
      const ids = new Set(roster.players.map(p => p.athleteId));
      setSelectedIds(ids);
      setExistingCount(roster.players.length);
    } catch {
      setSelectedIds(new Set());
      setExistingCount(0);
    }
  }, []);

  useEffect(() => {
    if (selectedTournamentId) loadRoster(selectedTournamentId);
  }, [selectedTournamentId, loadRoster]);

  const toggleSelect = (athleteId: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(athleteId)) next.delete(athleteId);
      else next.add(athleteId);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedTournamentId) return;
    setSubmitting(true);
    try {
      const players: RosterPlayerRequest[] = Array.from(selectedIds).map(athleteId => {
        const member = members.find(m => m.athleteId === athleteId);
        return {
          athleteId,
          jerseyNumber: member?.preferredNumber,
          position: member?.preferredPosition,
          role: member?.clubRole === "CAPTAIN" ? "CAPTAIN" : "PLAYER",
        };
      });
      await rosterApi.submitRoster(selectedTournamentId, players);
      showToast("✅ Chốt danh sách thi đấu thành công!", "success");
      setConfirmModal(false);
      loadRoster(selectedTournamentId);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || "Nộp danh sách thất bại";
      showToast("❌ " + msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!club) return (
    <div className="flex items-center justify-center h-[300px] text-gray-500">⏳ Đang tải...</div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div
        className="rounded-2xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #0D7A4E 0%, #0a6641 100%)" }}
      >
        <div className="text-lg font-extrabold mb-0.5">📋 Chốt danh sách thi đấu</div>
        <div className="text-sm opacity-75">Chọn giải đấu và VĐV tham gia thi đấu</div>
      </div>

      {/* Chọn giải */}
      <Card>
        <CardHeader title="Chọn giải đấu" icon="🏆" />
        {approvedTournaments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">CLB chưa được duyệt vào giải đấu nào</div>
        ) : (
          <div className="flex flex-col gap-2 p-1">
            {approvedTournaments.map(t => (
              <button
                key={t.tournamentId}
                onClick={() => setSelectedTournamentId(t.tournamentId)}
                className={`text-left rounded-xl px-4 py-3 border transition-all ${
                  selectedTournamentId === t.tournamentId
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div className="font-semibold text-gray-900">{t.tournamentName}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  ✅ Đã được duyệt
                  {selectedTournamentId === t.tournamentId && existingCount > 0 && (
                    <span className="ml-2 text-emerald-600 font-semibold">
                      · Đã chốt {existingCount} VĐV
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Danh sách VĐV */}
      {selectedTournamentId && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardHeader title={`Chọn VĐV tham gia (${selectedIds.size} đã chọn)`} icon="👥" />
            <div className="flex gap-2">
              <Btn variant="outline" size="sm"
                onClick={() => setSelectedIds(new Set(members.map(m => m.athleteId)))}>
                Chọn tất cả
              </Btn>
              <Btn variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
                Bỏ chọn
              </Btn>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-xs text-gray-500 font-semibold border-b border-gray-100">
                <th className="pb-2 pr-3 w-8"></th>
                <th className="pb-2 pr-4">Họ tên</th>
                <th className="pb-2 pr-4">Số áo</th>
                <th className="pb-2 pr-4">Vị trí</th>
                <th className="pb-2 pr-4">Vai trò</th>
                <th className="pb-2">Thể trạng</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => {
                const checked = selectedIds.has(m.athleteId);
                const hs = HEALTH_STYLE[m.healthStatus] ?? HEALTH_STYLE.FIT;
                return (
                  <tr
                    key={m.athleteId}
                    onClick={() => toggleSelect(m.athleteId)}
                    className={`cursor-pointer border-b border-gray-50 transition-colors ${
                      checked ? "bg-emerald-50/60" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-3 pr-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        checked ? "bg-emerald-600 border-emerald-600" : "border-gray-300"
                      }`}>
                        {checked && <span className="text-white text-[11px] font-bold">✓</span>}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-[13px] text-gray-900">{m.fullName}</td>
                    <td className="py-3 pr-4">
                      <span className="font-extrabold text-emerald-700">#{m.preferredNumber}</span>
                    </td>
                    <td className="py-3 pr-4 text-[13px] text-gray-600">{m.preferredPosition}</td>
                    <td className="py-3 pr-4">
                      <span className="bg-gray-100 text-gray-500 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                        {ROLE_LABEL[m.clubRole] ?? m.clubRole}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${hs.cls}`}>
                        {hs.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Đã chọn <b className="text-gray-900">{selectedIds.size}</b> VĐV
            </div>
            <Btn variant="primary" onClick={() => setConfirmModal(true)} disabled={selectedIds.size === 0}>
              📋 Nộp danh sách
            </Btn>
          </div>
        </Card>
      )}

      {/* Modal xác nhận */}
      {confirmModal && selectedTournament && (
        <Modal title="Xác nhận chốt danh sách" onClose={() => setConfirmModal(false)}>
          <div className="text-sm text-gray-600 mb-4">
            Bạn sắp nộp danh sách <b>{selectedIds.size} VĐV</b> cho giải{" "}
            <b className="text-emerald-700">{selectedTournament.tournamentName}</b>.
            <br />
            <span className="text-orange-500 mt-1 block">
              ⚠️ Danh sách cũ (nếu có) sẽ bị thay thế hoàn toàn.
            </span>
          </div>
          <div className="flex gap-2 justify-end">
            <Btn variant="outline" onClick={() => setConfirmModal(false)}>Hủy</Btn>
            <Btn variant="primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Đang nộp..." : "✅ Xác nhận nộp"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}