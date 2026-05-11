import { useState } from "react";
import { useMatches } from "../hooks/useMatches";
import { useMembers } from "../hooks/useMembers";
import { useUiStore } from "../store/uiStore";
import { Card, CardHeader, Th, Td, Modal, Field, Input, Btn } from "../components/common/UIComponents";
import type { MatchResponse } from "../api/matchApi";

type StatusFilter = "ALL" | "SCHEDULED" | "IN_PROGRESS" | "FINISHED";

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  SCHEDULED: { label: "Sắp diễn ra", color: "#1565C0", bg: "#E3F2FD" },
  IN_PROGRESS: { label: "Đang diễn ra", color: "#E65100", bg: "#FFF3E0" },
  PAUSED: { label: "Tạm dừng", color: "#6B7280", bg: "#F3F4F6" },
  FINISHED: { label: "Kết thúc", color: "#0F6E56", bg: "#ECFDF5" },
  CANCELED: { label: "Hủy", color: "#EF4444", bg: "#FFEBEE" },
};

export default function MatchesPage() {
  const { matches, loading, submitLineup } = useMatches();
  const { members } = useMembers("APPROVED");
  const showToast = useUiStore(s => s.showToast);

  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [detailModal, setDetailModal] = useState(false);
  const [lineupModal, setLineupModal] = useState(false);
  const [selected, setSelected] = useState<MatchResponse | null>(null);
  const [lineup, setLineup] = useState<Record<number, { lineupType: string; jerseyNumber: string; position: string }>>({});

  const filtered = matches.filter(m => filter === "ALL" || m.status === filter);

  const openDetail = (m: MatchResponse) => { setSelected(m); setDetailModal(true); };
  const openLineup = (m: MatchResponse) => {
    setSelected(m);
    const initial: typeof lineup = {};
    members.forEach(mb => {
      initial[mb.athleteId] = { lineupType: "SUBSTITUTE", jerseyNumber: String(mb.preferredNumber ?? ""), position: mb.preferredPosition ?? "" };
    });
    setLineup(initial);
    setLineupModal(true);
  };

  const handleSubmitLineup = async () => {
    if (!selected) return;
    const payload = members
      .filter(mb => lineup[mb.athleteId]?.lineupType !== "NONE")
      .map(mb => ({
        athleteId: mb.athleteId,
        lineupType: lineup[mb.athleteId]?.lineupType ?? "SUBSTITUTE",
        jerseyNumber: parseInt(lineup[mb.athleteId]?.jerseyNumber ?? "0") || 0,
        position: lineup[mb.athleteId]?.position ?? "",
      }));
    try {
      await submitLineup(selected.id, payload);
      showToast("Nộp đội hình thành công!");
      setLineupModal(false);
    } catch {
      showToast("Nộp đội hình thất bại!", "error");
    }
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 m-0">📅 Lịch thi đấu</h1>
          <p className="text-[13px] text-gray-500 mt-1 mb-0">Theo dõi lịch và nộp đội hình cho từng trận</p>
        </div>
        <div className="text-[13px] text-gray-500">{filtered.length} trận</div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-50 rounded-[10px] p-1 w-fit border border-gray-200">
        {(["ALL", "SCHEDULED", "IN_PROGRESS", "FINISHED"] as StatusFilter[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-lg border-none cursor-pointer text-xs font-semibold transition-all ${filter === s
                ? "bg-white text-[#0D7A4E] shadow-sm"
                : "bg-transparent text-gray-500"
              }`}
          >
            {s === "ALL" ? "Tất cả" : STATUS_LABEL[s]?.label ?? s}
          </button>
        ))}
      </div>

      {/* Match cards */}
      {loading && (
        <div className="text-center py-16 text-gray-500">⏳ Đang tải...</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">📭</div>
          <div className="font-semibold">Không có trận đấu nào</div>
        </div>
      )}

      {filtered.map(m => {
        const st = STATUS_LABEL[m.status] ?? { label: m.status, color: "#6B7280", bg: "#F9FAFB" };
        const date = new Date(m.scheduledTime);
        return (
          <Card key={m.id}>
            <div className="p-5">
              {/* Tournament + stage */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-gray-500">
                  🏆 {m.tournamentName} &nbsp;·&nbsp; {m.groupStageName}
                </div>
                <span
                  className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: st.bg, color: st.color }}
                >
                  {st.label}
                </span>
              </div>

              {/* Score row */}
              <div className="flex items-center justify-between gap-3">
                {/* Home */}
                <div className="flex-1 text-right">
                  <div className="text-[15px] font-extrabold text-gray-900">{m.homeClubName}</div>
                  <div className="text-[11px] text-gray-500">{m.homeClubShortName}</div>
                </div>

                {/* Score */}
                <div className="text-center min-w-[100px]">
                  {m.status === "SCHEDULED" ? (
                    <div className="text-xs text-gray-500 font-semibold">
                      {date.toLocaleDateString("vi-VN")}<br />
                      <span className="text-sm text-gray-900 font-extrabold">
                        {date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ) : (
                    <div className="text-3xl font-black text-gray-900 tracking-widest">
                      {m.homeScore} <span className="text-gray-400 font-normal">—</span> {m.awayScore}
                    </div>
                  )}
                </div>

                {/* Away */}
                <div className="flex-1 text-left">
                  <div className="text-[15px] font-extrabold text-gray-900">{m.awayClubName}</div>
                  <div className="text-[11px] text-gray-500">{m.awayClubShortName}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end mt-3.5 pt-3 border-t border-gray-200">
                {m.events?.length > 0 && (
                  <Btn size="sm" variant="outline" onClick={() => openDetail(m)}>📋 Chi tiết</Btn>
                )}
                {m.status === "SCHEDULED" && (
                  m.hasLineup ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                        ✅ Đã nộp đội hình
                      </span>
                      <Btn size="sm" variant="outline" onClick={() => openLineup(m)}>✏️ Nộp lại</Btn>
                    </div>
                  ) : (
                    <Btn size="sm" variant="primary" onClick={() => openLineup(m)}>📝 Nộp đội hình</Btn>
                  )
                )}
              </div>
            </div>
          </Card>
        );
      })}

      {/* Modal chi tiết sự kiện */}
      {detailModal && selected && (
        <Modal title={`Chi tiết: ${selected.homeClubShortName} vs ${selected.awayClubShortName}`} onClose={() => setDetailModal(false)}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Th>Phút</Th>
                <Th>Sự kiện</Th>
                <Th>Cầu thủ</Th>
              </tr>
            </thead>
            <tbody>
              {selected.events?.filter(e => !("is_deleted" in e)).map(ev => (
                <tr key={ev.id}>
                  <Td className="font-bold text-[#0D7A4E]">{ev.eventTime}'</Td>
                  <Td>
                    <span className="text-xs">
                      {ev.eventType === "GOAL" ? "⚽ Bàn thắng"
                        : ev.eventType === "YELLOW_CARD" ? "🟨 Thẻ vàng"
                          : ev.eventType === "RED_CARD" ? "🟥 Thẻ đỏ"
                            : ev.eventType === "SUBSTITUTION" ? "🔄 Thay người"
                              : ev.eventType}
                    </span>
                  </Td>
                  <Td className="text-xs">{ev.primaryAthleteName ?? "—"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      {/* Modal nộp đội hình */}
      {lineupModal && selected && (
        <Modal title={`Nộp đội hình: ${selected.homeClubShortName} vs ${selected.awayClubShortName}`} onClose={() => setLineupModal(false)}>
          <div className="mb-3 text-xs text-gray-500">
            Chọn vai trò cho từng VĐV. Chọn "Không tham gia" để loại khỏi danh sách.
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {members.map(mb => (
              <div
                key={mb.athleteId}
                className="grid gap-2 items-center py-2 border-b border-gray-200"
                style={{ gridTemplateColumns: "1fr 100px 100px 100px" }}
              >
                <div>
                  <div className="text-[13px] font-semibold text-gray-900">{mb.fullName}</div>
                  <div className="text-[11px] text-gray-500">#{mb.preferredNumber}</div>
                </div>
                <select
                  value={lineup[mb.athleteId]?.lineupType ?? "SUBSTITUTE"}
                  onChange={e => setLineup(prev => ({ ...prev, [mb.athleteId]: { ...prev[mb.athleteId], lineupType: e.target.value } }))}
                  className="border border-gray-200 rounded-md px-1.5 py-1 text-[11px] focus:outline-none"
                >
                  <option value="STARTING">Đá chính</option>
                  <option value="SUBSTITUTE">Dự bị</option>
                  <option value="NONE">Không tham gia</option>
                </select>
                <Input
                  value={lineup[mb.athleteId]?.jerseyNumber ?? ""}
                  onChange={v => setLineup(prev => ({ ...prev, [mb.athleteId]: { ...prev[mb.athleteId], jerseyNumber: v } }))}
                  placeholder="Số áo"
                  type="number"
                />
                <Input
                  value={lineup[mb.athleteId]?.position ?? ""}
                  onChange={v => setLineup(prev => ({ ...prev, [mb.athleteId]: { ...prev[mb.athleteId], position: v } }))}
                  placeholder="Vị trí"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Btn onClick={() => setLineupModal(false)}>Hủy</Btn>
            <Btn variant="primary" onClick={handleSubmitLineup}>📝 Xác nhận nộp</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}