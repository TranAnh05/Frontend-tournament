import { useState, useEffect } from "react";
import { useClub } from "../hooks/useClub";
import { ClubCard } from "../components/club/ClubCard";
import { StatCard, Card, CardHeader, Th, Td, Modal, Field, Input, Btn } from "../components/common/UIComponents";

import { matchApi } from "../api/matchApi";
import { statsApi } from "../api/statsApi";

import type { MatchResponse } from "../api/matchApi";
import type { DisciplineResponse } from "../api/statsApi";
import type { CreateClubRequest, UpdateClubRequest } from "../api/clubApi";


type DetailModal = "matches" | "tournaments" | "disciplines" | "clubDetail" | null;

const MATCH_STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  SCHEDULED: { label: "Sắp diễn ra", color: "#1565C0", bg: "#E3F2FD" },
  IN_PROGRESS: { label: "Đang diễn ra", color: "#E65100", bg: "#FFF3E0" },
  FINISHED: { label: "Kết thúc", color: "#0F6E56", bg: "#ECFDF5" },
  CANCELED: { label: "Hủy", color: "#EF4444", bg: "#FFEBEE" },
};

const REG_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  APPROVED: { label: "Đã duyệt", color: "#0F6E56", bg: "#ECFDF5" },
  PENDING: { label: "Chờ duyệt", color: "#854F0B", bg: "#FFF8E1" },
  REJECTED: { label: "Từ chối", color: "#EF4444", bg: "#FFEBEE" },
  WITHDRAWN: { label: "Đã rút", color: "#6B7280", bg: "#F3F4F6" },
};

const DISC_TYPE: Record<string, { label: string; color: string; bg: string }> = {
  WARNING: { label: "⚠️ Cảnh cáo", color: "#854F0B", bg: "#FFF8E1" },
  SUSPENSION: { label: "🚫 Treo giò", color: "#EF4444", bg: "#FFEBEE" },
  FINE: { label: "💰 Phạt tiền", color: "#7C3AED", bg: "#F5F3FF" },
  POINT_DEDUCTION: { label: "📉 Trừ điểm", color: "#DC2626", bg: "#FEF2F2" },
  BANNED: { label: "🔴 Cấm thi đấu", color: "#991B1B", bg: "#FEF2F2" },
};

export default function ClubProfilePage() {
  const { club, loading, notFound, createClub, updateClub } = useClub();
  const [editModal, setEditModal] = useState(false);
  const [detailModal, setDetailModal] = useState<DetailModal>(null);
  const [form, setForm] = useState<UpdateClubRequest>({
    name: "", shortName: "", headquarters: "", contactEmail: "", contactPhone: "",
  });
  const [createForm, setCreateForm] = useState<CreateClubRequest>({
    name: "", shortName: "", headquarters: "", contactEmail: "", contactPhone: "",
  });

  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineResponse[]>([]);

  useEffect(() => {
    if (!club) return;
    matchApi.getMyMatches().then(setMatches).catch(() => setMatches([]));
    statsApi.getDisciplines().then(setDisciplines).catch(() => setDisciplines([]));
  }, [club]);

  const members = club?.members ?? [];
  const tournamentHistory = club?.tournamentHistory ?? [];
  const playedMatches = matches.filter(m => m.status === "FINISHED" || m.status === "IN_PROGRESS");
  const approvedRegs = tournamentHistory.filter(r => r.registrationStatus === "APPROVED");

  if (loading) return (
    <div className="flex items-center justify-center h-[300px] text-gray-500">⏳ Đang tải...</div>
  );

  // ── Chưa có CLB ──────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="flex justify-center pt-10">
        <div className="w-full max-w-[540px]">
          <div
            className="rounded-2xl p-7 text-white mb-5 text-center"
            style={{ background: "linear-gradient(135deg, #0D7A4E 0%, #0a6641 100%)" }}
          >
            <div className="text-5xl mb-2.5">🏟</div>
            <div className="text-xl font-extrabold mb-1.5">Tạo hồ sơ câu lạc bộ</div>
            <div className="text-sm opacity-75">Đăng ký thông tin CLB để tham gia hệ thống giải đấu</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-7">
            <div className="grid grid-cols-2 gap-x-4">
              <div className="col-span-2">
                <Field label="Tên câu lạc bộ *">
                  <Input value={createForm.name ?? ""} onChange={(v) => setCreateForm({ ...createForm, name: v })} placeholder="VD: CLB Bóng Đá Thành Phố" />
                </Field>
              </div>
              <Field label="Tên viết tắt *">
                <Input value={createForm.shortName ?? ""} onChange={(v) => setCreateForm({ ...createForm, shortName: v })} placeholder="VD: BĐTP" />
              </Field>
              <Field label="Email liên hệ">
                <Input value={createForm.contactEmail ?? ""} onChange={(v) => setCreateForm({ ...createForm, contactEmail: v })} placeholder="clb@email.com" type="email" />
              </Field>
              <div className="col-span-2">
                <Field label="Địa chỉ trụ sở">
                  <Input value={createForm.headquarters ?? ""} onChange={(v) => setCreateForm({ ...createForm, headquarters: v })} placeholder="123 Nguyễn Huệ, Q.1, TP.HCM" />
                </Field>
              </div>
              <Field label="Số điện thoại">
                <Input value={createForm.contactPhone ?? ""} onChange={(v) => setCreateForm({ ...createForm, contactPhone: v })} placeholder="028 xxxx xxxx" />
              </Field>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2.5 mt-1 mb-4 text-xs text-emerald-700">
              💡 Sau khi tạo, CLB sẽ chờ ban tổ chức xét duyệt trước khi đăng ký giải đấu.
            </div>
            <div className="flex justify-end">
              <Btn variant="primary" size="lg" onClick={async () => {
                if (!createForm.name || !createForm.shortName) return alert("Vui lòng điền tên CLB và tên viết tắt!");
                try { await createClub(createForm); }
                catch (err: unknown) { alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Tạo CLB thất bại"); }
              }}>🏟 Tạo hồ sơ CLB</Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!club) return null;

  return (
    <div className="flex flex-col gap-4">
      <ClubCard
        club={club}
        venue={club.homeVenueName ? { name: club.homeVenueName } : null}
        onViewDetail={() => setDetailModal("clubDetail")}
        onEdit={() => {
          setForm({ name: club.name, shortName: club.shortName, headquarters: club.headquarters, contactEmail: club.contactEmail, contactPhone: club.contactPhone });
          setEditModal(true);
        }}
      />

      {/* ── Stat Cards (clickable) ─────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Thành viên" value={members.length} icon="👥" />

        {/* Giải đang tham gia */}
        <button className="text-left" onClick={() => setDetailModal("tournaments")}>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-xl flex-shrink-0">🏆</div>
            <div>
              <div className="text-xl font-extrabold text-gray-900">{approvedRegs.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Giải đang tham gia</div>
            </div>
          </div>
        </button>

        {/* Trận đã đấu */}
        <button className="text-left" onClick={() => setDetailModal("matches")}>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-xl flex-shrink-0">⚽</div>
            <div>
              <div className="text-xl font-extrabold text-gray-900">{playedMatches.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Trận đã đấu</div>
            </div>
          </div>
        </button>

        {/* Kỷ luật */}
        <button className="text-left" onClick={() => setDetailModal("disciplines")}>
          <div className={`bg-white border rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-all cursor-pointer ${disciplines.length > 0 ? "border-red-300 hover:border-red-400" : "border-gray-200 hover:border-emerald-400"}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${disciplines.length > 0 ? "bg-red-50" : "bg-emerald-50"}`}>🟥</div>
            <div>
              <div className={`text-xl font-extrabold ${disciplines.length > 0 ? "text-red-500" : "text-gray-900"}`}>{disciplines.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Kỷ luật</div>
            </div>
          </div>
        </button>
      </div>

      {/* ── Bảng thành viên ───────────────────────────────── */}
      <Card>
        <CardHeader title="Danh sách thành viên" icon="👥" />
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th>Họ tên</Th><Th>CCCD</Th><Th>Ngày sinh</Th>
              <Th>Số áo</Th><Th>Vị trí</Th><Th>Vai trò</Th><Th>Thể trạng</Th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">Chưa có thành viên</td></tr>
            )}
            {members.map((m) => (
              <tr key={m.memberId}>
                <Td><span className="font-semibold">{m.fullName}</span></Td>
                <Td className="font-mono text-gray-500">{m.identityNumber}</Td>
                <Td>{m.dateOfBirth ? new Date(m.dateOfBirth).toLocaleDateString("vi-VN") : "—"}</Td>
                <Td><span className="font-extrabold" style={{ color: "#0D7A4E" }}>#{m.preferredNumber}</span></Td>
                <Td>{m.preferredPosition}</Td>
                <Td><span className="bg-gray-100 text-gray-500 text-[11px] font-semibold px-2 py-0.5 rounded-md">{m.clubRole}</span></Td>
                <Td>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${m.healthStatus === "FIT" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"}`}>
                    {m.healthStatus === "FIT" ? "Khỏe mạnh" : "Chấn thương"}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* ── Modal chi tiết CLB ───────────────────────────── */}
      {detailModal === "clubDetail" && (
        <Modal title="🏟 Thông tin câu lạc bộ" onClose={() => setDetailModal(null)}>
          {/* Banner nhỏ */}
          <div
            className="rounded-xl p-4 text-white flex items-center gap-4 mb-5"
            style={{ background: "linear-gradient(135deg, #0D7A4E 0%, #0a6641 100%)" }}
          >
            <div className="w-14 h-14 rounded-[12px] bg-white/15 flex items-center justify-center text-3xl flex-shrink-0">
              {club.logoUrl
                ? <img src={club.logoUrl} alt="logo" className="w-[48px] h-[48px] rounded-[8px] object-cover" />
                : "🏟"}
            </div>
            <div>
              <div className="text-lg font-extrabold">{club.name}</div>
              <div className="text-sm opacity-80">{club.shortName}</div>
              <span
                className="mt-1 inline-block text-white border rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={{
                  background: (club.status === "ACTIVE" ? "#10B981" : club.status === "PENDING" ? "#F59E0B" : "#EF4444") + "33",
                  borderColor: (club.status === "ACTIVE" ? "#10B981" : club.status === "PENDING" ? "#F59E0B" : "#EF4444") + "88",
                }}
              >
                {club.status === "ACTIVE" ? "Đang hoạt động" : club.status === "PENDING" ? "Chờ duyệt" : club.status}
              </span>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="flex flex-col gap-3">
            {[
              { icon: "👤", label: "Quản lý / HLV", value: club.managerName || "—" },
              { icon: "🏠", label: "Trụ sở", value: club.headquarters || "—" },
              { icon: "📍", label: "Sân nhà", value: club.homeVenueName || "—" },
              { icon: "✉️", label: "Email liên hệ", value: club.contactEmail || "—" },
              { icon: "📞", label: "Số điện thoại", value: club.contactPhone || "—" },
            ].map((row, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
                <span className="text-base w-6 flex-shrink-0">{row.icon}</span>
                <span className="text-xs text-gray-400 w-[110px] flex-shrink-0 pt-0.5">{row.label}</span>
                <span className="text-[13px] font-semibold text-gray-800 flex-1">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Thống kê nhanh */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
            {[
              { icon: "👥", label: "Thành viên", value: members.length },
              { icon: "🏆", label: "Giải tham gia", value: approvedRegs.length },
              { icon: "⚽", label: "Trận đã đấu", value: playedMatches.length },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xl mb-0.5">{s.icon}</div>
                <div className="text-lg font-extrabold text-gray-900">{s.value}</div>
                <div className="text-[10px] text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {editModal && (
        <Modal title="Cập nhật hồ sơ CLB" onClose={() => setEditModal(false)}>
          <Field label="Tên CLB *"><Input value={form.name ?? ""} onChange={(v) => setForm({ ...form, name: v })} /></Field>
          <Field label="Tên viết tắt *"><Input value={form.shortName ?? ""} onChange={(v) => setForm({ ...form, shortName: v })} /></Field>
          <Field label="Địa chỉ trụ sở"><Input value={form.headquarters ?? ""} onChange={(v) => setForm({ ...form, headquarters: v })} /></Field>
          <Field label="Email liên hệ"><Input value={form.contactEmail ?? ""} onChange={(v) => setForm({ ...form, contactEmail: v })} type="email" /></Field>
          <Field label="Số điện thoại"><Input value={form.contactPhone ?? ""} onChange={(v) => setForm({ ...form, contactPhone: v })} /></Field>
          <div className="flex gap-2 justify-end mt-2">
            <Btn onClick={() => setEditModal(false)} variant="outline">Hủy</Btn>
            <Btn variant="primary" onClick={async () => {
              try { await updateClub(form); setEditModal(false); }
              catch (err: unknown) { alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Cập nhật thất bại"); }
            }}>💾 Lưu thay đổi</Btn>
          </div>
        </Modal>
      )}

      {/* ── Modal trận đã đấu ────────────────────────────── */}
      {detailModal === "matches" && (
        <Modal title={`⚽ Trận đã đấu (${playedMatches.length})`} onClose={() => setDetailModal(null)}>
          {playedMatches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Chưa có trận nào</div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto">
              {playedMatches.map((m) => {
                const st = MATCH_STATUS_LABEL[m.status] ?? { label: m.status, color: "#6B7280", bg: "#F3F4F6" };
                return (
                  <div key={m.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">🏆 {m.tournamentName}</span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[13px] text-gray-900 flex-1 text-right">{m.homeClubName}</span>
                      <span className="text-xl font-black text-gray-900 px-3">
                        {m.homeScore} <span className="text-gray-400 font-normal text-base">—</span> {m.awayScore}
                      </span>
                      <span className="font-bold text-[13px] text-gray-900 flex-1">{m.awayClubName}</span>
                    </div>
                    <div className="text-xs text-gray-400 text-center mt-1">
                      {new Date(m.scheduledTime).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      &nbsp;·&nbsp;{m.groupStageName}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Modal>
      )}{/* ── Modal giải đang tham gia ─────────────────────── */}
{detailModal === "tournaments" && (
  <Modal title={`🏆 Lịch sử giải đấu (${tournamentHistory.length})`} onClose={() => setDetailModal(null)}>
    {tournamentHistory.length === 0 ? (
      <div className="text-center py-8 text-gray-500">Chưa đăng ký giải nào</div>
    ) : (
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto">
        {tournamentHistory.map((r) => {
          const st = REG_STATUS[r.registrationStatus] ?? { label: r.registrationStatus, color: "#6B7280", bg: "#F3F4F6" };
          return (
            <div key={r.tournamentId} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[14px] text-gray-900">{r.tournamentName}</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
              </div>
              {/* Thêm thống kê kết quả */}
              {r.matchesPlayed > 0 && (
                <div className="flex gap-3 text-xs mt-2 text-gray-600">
                  <span>🎮 <b>{r.matchesPlayed}</b> trận</span>
                  <span>✅ <b className="text-emerald-600">{r.matchesWon}</b> thắng</span>
                  <span>🤝 <b>{r.matchesDrawn}</b> hòa</span>
                  <span>❌ <b className="text-red-500">{r.matchesLost}</b> thua</span>
                  <span>🏅 <b>{r.totalPoints}</b> điểm</span>
                  {r.ranking && <span>📊 Hạng <b className="text-emerald-600">#{r.ranking}</b></span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </Modal>
)}

      {/* ── Modal kỷ luật ────────────────────────────────── */}
      {detailModal === "disciplines" && (
        <Modal title={`🟥 Kỷ luật (${disciplines.length})`} onClose={() => setDetailModal(null)}>
          {disciplines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">✅ Không có kỷ luật nào</div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto">
              {disciplines.map((d) => {
                const dt = DISC_TYPE[d.disciplineType] ?? { label: d.disciplineType, color: "#6B7280", bg: "#F3F4F6" };
                return (
                  <div key={d.id} className="border border-red-100 bg-red-50/40 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: dt.bg, color: dt.color }}>{dt.label}</span>
                      <span className="text-xs text-gray-400">{d.createdAt ? new Date(d.createdAt).toLocaleDateString("vi-VN") : "—"}</span>
                    </div>
                    {d.athleteName && (
                      <div className="text-[13px] font-semibold text-gray-900 mt-1">👤 {d.athleteName}</div>
                    )}
                    <div className="text-xs text-gray-600 mt-0.5">{d.reason}</div>
                    <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                      {d.suspensionDuration && <span>🚫 Treo giò: <b className="text-red-500">{d.suspensionDuration} trận</b></span>}
                      {d.fineAmount && Number(d.fineAmount) > 0 && <span>💰 Phạt: <b className="text-red-500">{Number(d.fineAmount).toLocaleString("vi-VN")}đ</b></span>}
                      <span className="ml-auto">📋 {d.tournamentName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}