import { useState, useEffect, useCallback } from "react";
import { tournamentApi } from "../api/tournamentApi";
import type { TournamentResponse, RegistrationResponse } from "../api/tournamentApi";
import { useUiStore } from "../store/uiStore";
import { Card, CardHeader, Modal, Field, Input, Btn } from "../components/common/UIComponents";

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  DRAFT:             { label: "Nháp",            cls: "bg-gray-100 text-gray-500" },
  REGISTRATION_OPEN: { label: "Mở đăng ký",      cls: "bg-blue-50 text-blue-600" },
  ONGOING:           { label: "Đang diễn ra",    cls: "bg-emerald-50 text-emerald-700" },
  FINISHED:          { label: "Kết thúc",         cls: "bg-gray-100 text-gray-400" },
  CANCELED:          { label: "Đã hủy",           cls: "bg-red-50 text-red-400" },
};

const REG_STYLE: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: "⏳ Chờ duyệt", cls: "bg-yellow-50 text-yellow-600" },
  APPROVED:  { label: "✅ Đã duyệt",  cls: "bg-emerald-50 text-emerald-700" },
  REJECTED:  { label: "❌ Từ chối",   cls: "bg-red-50 text-red-500" },
  WITHDRAWN: { label: "↩ Đã rút",    cls: "bg-gray-100 text-gray-500" },
};

const FORMAT_LABEL: Record<string, string> = {
  ROUND_ROBIN:  "Vòng tròn",
  KNOCKOUT:     "Loại trực tiếp",
  GROUP_STAGE:  "Vòng bảng",
};

export default function TournamentsPage() {
  const showToast = useUiStore(s => s.showToast);
  const [tournaments, setTournaments] = useState<TournamentResponse[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"ALL" | "MY">("ALL");

  // Modal đăng ký
  const [regModal, setRegModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<TournamentResponse | null>(null);
  const [regForm, setRegForm] = useState({ homeKitColor: "", awayKitColor: "", financialProofUrl: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, r] = await Promise.all([
        tournamentApi.getAllTournaments(),
        tournamentApi.getMyRegistrations(),
      ]);
      setTournaments(t);
      setRegistrations(r);
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

  const handleRegister = async () => {
    if (!selectedTournament) return;
    if (!regForm.homeKitColor.trim()) return alert("Vui lòng nhập màu áo chính!");
    setSubmitting(true);
    try {
      await tournamentApi.register(selectedTournament.id, regForm);
      showToast("Đăng ký giải đấu thành công!");
      setRegModal(false);
      await load();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Đăng ký thất bại!", "error");
    } finally {
      setSubmitting(false);
    }
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
            className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer border-none ${tab === key ? "bg-white text-emerald-700 shadow-sm" : "bg-transparent text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-20 text-gray-400">⏳ Đang tải...</div>}

      {/* Empty */}
      {!loading && displayList.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">📭</div>
          <div className="font-semibold">{tab === "MY" ? "Chưa đăng ký giải nào" : "Không có giải đấu nào"}</div>
        </div>
      )}

      {/* Tournament cards */}
      {!loading && displayList.map(t => {
        const st = STATUS_STYLE[t.status] ?? { label: t.status, cls: "bg-gray-100 text-gray-500" };
        const myReg = getMyReg(t.id);
        const regSt = myReg ? REG_STYLE[myReg.status] : null;
        const canRegister = t.status === "REGISTRATION_OPEN" && !myReg;
        const canWithdraw = myReg && (myReg.status === "PENDING" || myReg.status === "APPROVED");

        return (
          <Card key={t.id}>
            <div className="p-5">
              {/* Top row */}
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
                      setRegModal(true);
                    }}>📝 Đăng ký</Btn>
                  )}
                  {canWithdraw && (
                    <Btn size="sm" variant="danger" onClick={() => handleWithdraw(t.id)}>↩ Rút đơn</Btn>
                  )}
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Bắt đầu",    value: new Date(t.startDate).toLocaleDateString("vi-VN"), icon: "📅" },
                  { label: "Kết thúc",   value: new Date(t.endDate).toLocaleDateString("vi-VN"),   icon: "🏁" },
                  { label: "VĐV tối thiểu", value: `${t.minAthletes} người`, icon: "👤" },
                  { label: "VĐV tối đa",    value: `${t.maxAthletes} người`, icon: "👥" },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="text-xs text-gray-400 mb-0.5">{item.icon} {item.label}</div>
                    <div className="text-sm font-bold text-gray-800">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Điểm số */}
              <div className="flex gap-4 mt-3 text-xs text-gray-400">
                <span>🏅 Thắng: <strong className="text-gray-700">{t.winPoints} điểm</strong></span>
                <span>🤝 Hòa: <strong className="text-gray-700">{t.drawPoints} điểm</strong></span>
                <span>❌ Thua: <strong className="text-gray-700">{t.lossPoints} điểm</strong></span>
              </div>

              {/* Thông tin đăng ký nếu có */}
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

      {/* Modal đăng ký */}
      {regModal && selectedTournament && (
        <Modal title={`Đăng ký: ${selectedTournament.name}`} onClose={() => setRegModal(false)}>
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 mb-4 text-xs text-blue-600">
            📌 Yêu cầu tối thiểu <strong>{selectedTournament.minAthletes}</strong> VĐV, tối đa <strong>{selectedTournament.maxAthletes}</strong> VĐV
          </div>
          <Field label="Màu áo chính *">
            <Input value={regForm.homeKitColor} onChange={v => setRegForm({ ...regForm, homeKitColor: v })} placeholder="VD: Đỏ, Xanh dương..." />
          </Field>
          <Field label="Màu áo phụ">
            <Input value={regForm.awayKitColor} onChange={v => setRegForm({ ...regForm, awayKitColor: v })} placeholder="VD: Trắng (tùy chọn)" />
          </Field>
          <Field label="Link minh chứng tài chính">
            <Input value={regForm.financialProofUrl} onChange={v => setRegForm({ ...regForm, financialProofUrl: v })} placeholder="https://drive.google.com/..." />
          </Field>
          <div className="flex gap-2 justify-end mt-4">
            <Btn onClick={() => setRegModal(false)}>Hủy</Btn>
            <Btn variant="primary" onClick={handleRegister} disabled={submitting}>
              {submitting ? "Đang gửi..." : "📝 Xác nhận đăng ký"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}