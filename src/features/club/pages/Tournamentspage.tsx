import { useState, useEffect, useCallback } from "react";
import { tournamentApi } from "../api/tournamentApi";
import { athleteApi } from "../api/athleteApi";
import type { TournamentResponse, RegistrationResponse } from "../api/tournamentApi";
import type { ClubMemberResponse } from "../api/athleteApi";
import { useUiStore } from "../store/uiStore";
import { Card, Modal, Field, Input, Btn } from "../components/common/UIComponents";

// ── Mapping môn thể thao → danh sách vị trí phù hợp ─────────────────────────
// Key là sportName (toLowerCase, trim) hoặc một phần tên
const SPORT_POSITIONS: Record<string, string[]> = {
  "bóng đá":   ["Thủ môn", "Trung vệ", "Hậu vệ cánh", "Tiền vệ phòng ngự",
                 "Tiền vệ trung tâm", "Tiền vệ công", "Tiền vệ cánh",
                 "Tiền đạo cánh", "Tiền đạo cắm", "Trung phong"],
  "bóng rổ": ["Hậu vệ tổ chức", "Hậu vệ công", "Tiền phong nhỏ", "Tiền phong lớn", "Trung phong"],
  "cầu lông":  ["Đơn nam", "Đơn nữ", "Đôi nam", "Đôi nữ", "Đôi hỗn hợp"],
  "bóng chuyền": ["Chủ công", "Phụ công", "Libero", "Chuyền hai", "Đối chuyền"],
  "tennis":    ["Đơn nam", "Đơn nữ", "Đôi nam", "Đôi nữ"],
  "bơi lội":   ["Tự do", "Bướm", "Ngửa", "Ếch", "Hỗn hợp"],
};

// Lấy danh sách positions hợp lệ dựa trên sportName
function getPositionsForSport(sportName: string): string[] {
  const lower = sportName.toLowerCase();
  for (const [key, positions] of Object.entries(SPORT_POSITIONS)) {
    if (lower.includes(key)) return positions;
  }
  return []; // không có filter → hiển thị tất cả
}

// Lọc VĐV phù hợp với môn thể thao
function filterAthletesBySport(members: ClubMemberResponse[], sportName: string): {
  suitable: ClubMemberResponse[];
  others: ClubMemberResponse[];
} {
  const positions = getPositionsForSport(sportName);
  if (positions.length === 0) {
    return { suitable: members, others: [] };
  }
  const suitable = members.filter(m =>
    m.preferredPosition && positions.some(p =>
      m.preferredPosition.toLowerCase().includes(p.toLowerCase()) ||
      p.toLowerCase().includes(m.preferredPosition.toLowerCase())
    )
  );
  const suitableIds = new Set(suitable.map(m => m.athleteId));
  const others = members.filter(m => !suitableIds.has(m.athleteId));
  return { suitable, others };
}

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  DRAFT:             { label: "Nháp",          cls: "bg-gray-100 text-gray-500" },
  REGISTRATION_OPEN: { label: "Mở đăng ký",    cls: "bg-blue-50 text-blue-600" },
  ONGOING:           { label: "Đang diễn ra",  cls: "bg-emerald-50 text-emerald-700" },
  FINISHED:          { label: "Kết thúc",      cls: "bg-gray-100 text-gray-400" },
  CANCELED:          { label: "Đã hủy",        cls: "bg-red-50 text-red-400" },
};

const REG_STYLE: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: "⏳ Chờ duyệt", cls: "bg-yellow-50 text-yellow-600" },
  APPROVED:  { label: "✅ Đã duyệt",  cls: "bg-emerald-50 text-emerald-700" },
  REJECTED:  { label: "❌ Từ chối",   cls: "bg-red-50 text-red-500" },
  WITHDRAWN: { label: "↩ Đã rút",    cls: "bg-gray-100 text-gray-500" },
};

const FORMAT_LABEL: Record<string, string> = {
  ROUND_ROBIN: "Vòng tròn",
  KNOCKOUT:    "Loại trực tiếp",
  GROUP_STAGE: "Vòng bảng",
};

interface RosterEntry {
  athleteId: number;
  jerseyNumber: string;
  position: string;
  role: string;
}

export default function TournamentsPage() {
  const showToast = useUiStore(s => s.showToast);
  const [tournaments, setTournaments] = useState<TournamentResponse[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"ALL" | "MY">("ALL");

  const [regModal, setRegModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<TournamentResponse | null>(null);
  const [regForm, setRegForm] = useState({ homeKitColor: "", awayKitColor: "", financialProofUrl: "" });
  const [submitting, setSubmitting] = useState(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [members, setMembers] = useState<ClubMemberResponse[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedAthletes, setSelectedAthletes] = useState<Set<number>>(new Set());
  const [rosterEntries, setRosterEntries] = useState<Record<number, RosterEntry>>({});
  const [showOthers, setShowOthers] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, r] = await Promise.all([
        tournamentApi.getAllTournaments(),
        tournamentApi.getMyRegistrations(),
      ]);
      setTournaments(t);
      setRegistrations(r.filter((x: any) => x != null));
    } catch {
      setTournaments([]);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const getMyReg = (tournamentId: number) =>
    registrations.find(r => r.tournamentId === tournamentId);

  const handleGoToStep2 = async () => {
    if (!regForm.homeKitColor.trim()) return alert("Vui lòng nhập màu áo chính!");
    setLoadingMembers(true);
    setStep(2);
    setShowOthers(false);
    try {
      const memberList = await athleteApi.getMembers("APPROVED");
      setMembers(memberList);
      const defaultEntries: Record<number, RosterEntry> = {};
      memberList.forEach(m => {
        defaultEntries[m.athleteId] = {
          athleteId: m.athleteId,
          jerseyNumber: m.preferredNumber?.toString() ?? "",
          position: m.preferredPosition ?? "",
          role: "PLAYER",
        };
      });
      setRosterEntries(defaultEntries);
    } catch {
      showToast("Không tải được danh sách thành viên!", "error");
      setStep(1);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleSubmitAll = async () => {
    if (!selectedTournament) return;
    if (selectedAthletes.size === 0) return alert("Vui lòng chọn ít nhất 1 VĐV!");
    if (selectedTournament.minAthletes && selectedAthletes.size < selectedTournament.minAthletes)
      return alert(`Cần ít nhất ${selectedTournament.minAthletes} VĐV!`);
    if (selectedTournament.maxAthletes && selectedAthletes.size > selectedTournament.maxAthletes)
      return alert(`Tối đa ${selectedTournament.maxAthletes} VĐV!`);

    setSubmitting(true);
    try {
      await tournamentApi.register(selectedTournament.id, regForm);
      const rosters = Array.from(selectedAthletes).map(id => ({
        athleteId: id,
        jerseyNumber: Number(rosterEntries[id]?.jerseyNumber) || 0,
        position: rosterEntries[id]?.position || "",
        role: rosterEntries[id]?.role || "PLAYER",
      }));
      await tournamentApi.submitRoster(selectedTournament.id, { rosters });
      showToast("🎉 Đăng ký giải và nộp danh sách VĐV thành công!");
      await load();
      closeModal();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Đăng ký thất bại!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAthlete = (athleteId: number) => {
    setSelectedAthletes(prev => {
      const next = new Set(prev);
      if (next.has(athleteId)) next.delete(athleteId);
      else next.add(athleteId);
      return next;
    });
  };

  const updateRosterEntry = (athleteId: number, field: keyof RosterEntry, value: string) => {
    setRosterEntries(prev => ({ ...prev, [athleteId]: { ...prev[athleteId], [field]: value } }));
  };

  const closeModal = () => {
    setRegModal(false);
    setStep(1);
    setSelectedAthletes(new Set());
    setRosterEntries({});
    setMembers([]);
    setShowOthers(false);
  };

  const handleWithdraw = async (tournamentId: number) => {
    if (!confirm("Bạn có chắc muốn rút khỏi giải đấu này?")) return;
    try {
      await tournamentApi.withdraw(tournamentId);
      showToast("Đã rút khỏi giải đấu.");
      await load();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Rút đơn thất bại!", "error");
    }
  };

  const displayList = tab === "MY"
    ? tournaments.filter(t => registrations.some(r => r.tournamentId === t.id))
    : tournaments;

  // Tính danh sách VĐV phù hợp và không phù hợp
  const { suitable, others } = selectedTournament
    ? filterAthletesBySport(members, selectedTournament.sportName)
    : { suitable: members, others: [] };

  const positions = selectedTournament
    ? getPositionsForSport(selectedTournament.sportName)
    : [];

  const renderAthleteCard = (m: ClubMemberResponse, isSuitable: boolean) => {
    const selected = selectedAthletes.has(m.athleteId);
    const entry = rosterEntries[m.athleteId];
    const isInjured = m.healthStatus === "INJURED";

    return (
      <div key={m.athleteId}
        className={`border rounded-xl p-3 transition-all
          ${selected ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"}
          ${isInjured ? "opacity-60" : ""}
          ${!isSuitable ? "opacity-70" : ""}`}>
        <div className="flex items-center gap-3">
          <input type="checkbox" checked={selected}
            onChange={() => !isInjured && toggleAthlete(m.athleteId)}
            disabled={isInjured}
            className="w-4 h-4 accent-blue-600 cursor-pointer" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">
              {m.fullName}
              {isInjured && <span className="ml-2 text-xs text-red-500 font-normal">🤕 Chấn thương</span>}
              {!isSuitable && <span className="ml-2 text-xs text-orange-500 font-normal">⚠️ Không chuyên môn</span>}
            </div>
            <div className="text-xs text-gray-400">
              {m.preferredPosition ?? "Chưa có vị trí"} · #{m.preferredNumber ?? "—"}
            </div>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0
            ${m.clubRole === "CAPTAIN" ? "bg-yellow-100 text-yellow-700" :
              m.clubRole === "HEAD_COACH" ? "bg-purple-100 text-purple-700" :
              "bg-gray-100 text-gray-500"}`}>
            {m.clubRole === "CAPTAIN" ? "⭐ Đội trưởng" :
             m.clubRole === "HEAD_COACH" ? "👨‍💼 HLV" : "Thành viên"}
          </span>
        </div>

        {selected && (
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-blue-100">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Số áo</label>
              <input type="number" min={1} max={99}
                value={entry?.jerseyNumber ?? ""}
                onChange={e => updateRosterEntry(m.athleteId, "jerseyNumber", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="VD: 10" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Vị trí</label>
              <select value={entry?.position ?? ""}
                onChange={e => updateRosterEntry(m.athleteId, "position", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400">
                <option value="">-- Chọn --</option>
                {/* Hiện vị trí phù hợp với môn trước */}
                {positions.length > 0 && (
                  <optgroup label={`✅ ${selectedTournament?.sportName}`}>
                    {positions.map(p => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                )}
                {positions.length > 0 && (
                  <optgroup label="Khác">
                    {Object.values(SPORT_POSITIONS).flat()
                      .filter(p => !positions.includes(p))
                      .filter((p, i, arr) => arr.indexOf(p) === i)
                      .map(p => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                )}
                {positions.length === 0 && (
                  Object.values(SPORT_POSITIONS).flat()
                    .filter((p, i, arr) => arr.indexOf(p) === i)
                    .map(p => <option key={p} value={p}>{p}</option>)
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Vai trò</label>
              <select value={entry?.role ?? "PLAYER"}
                onChange={e => updateRosterEntry(m.athleteId, "role", e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400">
                <option value="PLAYER">Cầu thủ</option>
                <option value="CAPTAIN">Đội trưởng</option>
                <option value="GOALKEEPER">Thủ môn</option>
                <option value="SUBSTITUTE">Dự bị</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900 m-0">🏆 Giải đấu</h1>
          <p className="text-sm text-gray-500 mt-1 mb-0">Xem và đăng ký tham gia các giải đấu</p>
        </div>
        <div className="text-sm text-gray-400">{displayList.length} giải</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit border border-gray-200">
        {([["ALL", "🏆 Tất cả giải"], ["MY", "📋 Giải của tôi"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer border-none
              ${tab === key ? "bg-white text-emerald-700 shadow-sm" : "bg-transparent text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-20 text-gray-400">⏳ Đang tải...</div>}

      {!loading && displayList.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">📭</div>
          <div className="font-semibold">{tab === "MY" ? "Chưa đăng ký giải nào" : "Không có giải đấu nào"}</div>
        </div>
      )}

      {!loading && displayList.map(t => {
        const st = STATUS_STYLE[t.status] ?? { label: t.status, cls: "bg-gray-100 text-gray-500" };
        const myReg = getMyReg(t.id);
        const regSt = myReg ? REG_STYLE[myReg.status] : null;
        const canRegister = t.status === "REGISTRATION_OPEN" && !myReg;
        const canWithdraw = myReg && (myReg.status === "PENDING" || myReg.status === "APPROVED");

        return (
          <Card key={t.id}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-base font-black text-gray-900">{t.name}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                    {regSt && <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${regSt.cls}`}>{regSt.label}</span>}
                  </div>
                  <div className="text-xs text-gray-400">
                    🏟 {t.venueName} &nbsp;·&nbsp; ⚽ {t.sportName} &nbsp;·&nbsp; 📋 {FORMAT_LABEL[t.format] ?? t.format}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {canRegister && (
                    <Btn size="sm" variant="primary" onClick={() => {
                      setSelectedTournament(t);
                      setRegForm({ homeKitColor: "", awayKitColor: "", financialProofUrl: "" });
                      setStep(1);
                      setRegModal(true);
                    }}>📝 Đăng ký</Btn>
                  )}
                  {canWithdraw && (
                    <Btn size="sm" variant="danger" onClick={() => handleWithdraw(t.id)}>↩ Rút đơn</Btn>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Bắt đầu",       value: new Date(t.startDate).toLocaleDateString("vi-VN"), icon: "📅" },
                  { label: "Kết thúc",      value: new Date(t.endDate).toLocaleDateString("vi-VN"),   icon: "🏁" },
                  { label: "VĐV tối thiểu", value: `${t.minAthletes} người`, icon: "👤" },
                  { label: "VĐV tối đa",    value: `${t.maxAthletes} người`, icon: "👥" },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="text-xs text-gray-400 mb-0.5">{item.icon} {item.label}</div>
                    <div className="text-sm font-bold text-gray-800">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-3 text-xs text-gray-400">
                <span>🏅 Thắng: <strong className="text-gray-700">{t.winPoints} điểm</strong></span>
                <span>🤝 Hòa: <strong className="text-gray-700">{t.drawPoints} điểm</strong></span>
                <span>❌ Thua: <strong className="text-gray-700">{t.lossPoints} điểm</strong></span>
              </div>

              {myReg && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
                  <span>🎽 Áo chính: <strong className="text-gray-700">{myReg.homeKitColor}</strong></span>
                  {myReg.awayKitColor && <span>👕 Áo phụ: <strong className="text-gray-700">{myReg.awayKitColor}</strong></span>}
                  <span>📅 Đăng ký: <strong className="text-gray-700">{myReg.appliedAt ? new Date(myReg.appliedAt).toLocaleDateString("vi-VN") : "—"}</strong></span>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {/* ===== MODAL ĐĂNG KÝ ===== */}
      {regModal && selectedTournament && (
        <Modal title={`Đăng ký: ${selectedTournament.name}`} onClose={closeModal}>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-5">
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full
              ${step === 1 ? "bg-blue-600 text-white" : "bg-green-100 text-green-700"}`}>
              {step === 1 ? "1" : "✓"} Thông tin đội
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full
              ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
              2 Danh sách VĐV
            </div>
          </div>

          {/* BƯỚC 1 */}
          {step === 1 && (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 mb-4 text-xs text-blue-600">
                📌 Yêu cầu tối thiểu <strong>{selectedTournament.minAthletes}</strong> VĐV,
                tối đa <strong>{selectedTournament.maxAthletes}</strong> VĐV &nbsp;·&nbsp;
                ⚽ Môn: <strong>{selectedTournament.sportName}</strong>
              </div>
              <Field label="Màu áo chính *">
                <Input value={regForm.homeKitColor}
                  onChange={v => setRegForm({ ...regForm, homeKitColor: v })}
                  placeholder="VD: Đỏ, Xanh dương..." />
              </Field>
              <Field label="Màu áo phụ">
                <Input value={regForm.awayKitColor}
                  onChange={v => setRegForm({ ...regForm, awayKitColor: v })}
                  placeholder="VD: Trắng (tùy chọn)" />
              </Field>
              <Field label="Link minh chứng tài chính">
                <Input value={regForm.financialProofUrl}
                  onChange={v => setRegForm({ ...regForm, financialProofUrl: v })}
                  placeholder="https://drive.google.com/..." />
              </Field>
              <div className="flex gap-2 justify-end mt-4">
                <Btn onClick={closeModal}>Hủy</Btn>
                <Btn variant="primary" onClick={handleGoToStep2}>Tiếp theo →</Btn>
              </div>
            </>
          )}

          {/* BƯỚC 2 */}
          {step === 2 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-700">
                  👥 Chọn VĐV tham dự ({selectedAthletes.size}/{selectedTournament.maxAthletes})
                </p>
                <span className="text-xs text-gray-400">
                  Tối thiểu {selectedTournament.minAthletes} người
                </span>
              </div>

              {loadingMembers && (
                <div className="text-center py-8 text-gray-400">⏳ Đang tải danh sách thành viên...</div>
              )}

              {!loadingMembers && members.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📭</div>
                  CLB chưa có thành viên nào được duyệt
                </div>
              )}

              {!loadingMembers && members.length > 0 && (
                <div className="max-h-[420px] overflow-y-auto pr-1 space-y-3">

                  {/* VĐV phù hợp với môn */}
                  {suitable.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          ✅ Phù hợp với {selectedTournament.sportName} ({suitable.length} người)
                        </span>
                      </div>
                      <div className="space-y-2">
                        {suitable.map(m => renderAthleteCard(m, true))}
                      </div>
                    </div>
                  )}

                  {/* VĐV không chuyên môn */}
                  {others.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowOthers(v => !v)}
                        className="w-full flex items-center justify-between text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-2 rounded-full cursor-pointer border-none hover:bg-orange-100 transition-colors">
                        <span>⚠️ Không chuyên môn ({others.length} người)</span>
                        <span>{showOthers ? "▲ Ẩn" : "▼ Hiện"}</span>
                      </button>
                      {showOthers && (
                        <div className="space-y-2 mt-2">
                          {others.map(m => renderAthleteCard(m, false))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Không có VĐV phù hợp */}
                  {suitable.length === 0 && (
                    <div className="text-center py-4 text-orange-500 bg-orange-50 rounded-xl">
                      ⚠️ Không có VĐV nào có chuyên môn phù hợp với <strong>{selectedTournament.sportName}</strong>.
                      Bạn vẫn có thể chọn VĐV bên dưới.
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-gray-100">
                <Btn onClick={() => setStep(1)}>← Quay lại</Btn>
                <Btn variant="primary" onClick={handleSubmitAll}
                  disabled={submitting || selectedAthletes.size === 0}>
                  {submitting ? "Đang đăng ký..." : `✅ Đăng ký (${selectedAthletes.size} VĐV)`}
                </Btn>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}