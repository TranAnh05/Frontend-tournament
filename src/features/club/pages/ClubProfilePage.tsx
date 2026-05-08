import { useState, useEffect } from "react";
import { useClub } from "../hooks/useClub";
import { ClubCard } from "../components/club/ClubCard";
import { StatCard, Card, CardHeader, Th, Td, Modal, Field, Input, Btn } from "../components/common/UIComponents";
import { athleteApi } from "../api/athleteApi";
import { matchApi } from "../api/matchApi";
import { tournamentApi } from "../api/tournamentApi";
import { statsApi } from "../api/statsApi";
import type { ClubMemberResponse } from "../api/athleteApi";
import type { CreateClubRequest, UpdateClubRequest } from "../api/clubApi";

export default function ClubProfilePage() {
  const { club, loading, notFound, createClub, updateClub } = useClub();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<UpdateClubRequest>({
    name: "", shortName: "", headquarters: "", contactEmail: "", contactPhone: "",
  });
  const [members, setMembers] = useState<ClubMemberResponse[]>([]);
  const [createForm, setCreateForm] = useState<CreateClubRequest>({
    name: "", shortName: "", headquarters: "", contactEmail: "", contactPhone: "",
  });

  // Stats
  const [matchCount, setMatchCount] = useState<number>(0);
  const [tournamentCount, setTournamentCount] = useState<number>(0);
  const [disciplineCount, setDisciplineCount] = useState<number>(0);

  useEffect(() => {
    if (!club) return;

    athleteApi.getMembers("APPROVED").then(setMembers).catch(() => setMembers([]));

    matchApi.getMyMatches()
      .then((matches) => {
        const played = matches.filter(m => m.status === "FINISHED" || m.status === "IN_PROGRESS").length;
        setMatchCount(played);
      })
      .catch(() => setMatchCount(0));

    tournamentApi.getMyRegistrations()
      .then((regs) => {
        const active = regs.filter(r => r.status === "APPROVED").length;
        setTournamentCount(active);
      })
      .catch(() => setTournamentCount(0));

    statsApi.getDisciplines()
      .then((disc) => setDisciplineCount(disc.length))
      .catch(() => setDisciplineCount(0));

  }, [club]);

  if (loading) return (
    <div className="flex items-center justify-center h-[300px] text-gray-500">
      ⏳ Đang tải...
    </div>
  );

  //Chưa có CLB
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
                  <Input
                    value={createForm.name ?? ""}
                    onChange={(v) => setCreateForm({ ...createForm, name: v })}
                    placeholder="VD: CLB Bóng Đá Thành Phố"
                  />
                </Field>
              </div>
              <Field label="Tên viết tắt *">
                <Input
                  value={createForm.shortName ?? ""}
                  onChange={(v) => setCreateForm({ ...createForm, shortName: v })}
                  placeholder="VD: BĐTP"
                />
              </Field>
              <Field label="Email liên hệ">
                <Input
                  value={createForm.contactEmail ?? ""}
                  onChange={(v) => setCreateForm({ ...createForm, contactEmail: v })}
                  placeholder="clb@email.com"
                  type="email"
                />
              </Field>
              <div className="col-span-2">
                <Field label="Địa chỉ trụ sở">
                  <Input
                    value={createForm.headquarters ?? ""}
                    onChange={(v) => setCreateForm({ ...createForm, headquarters: v })}
                    placeholder="123 Nguyễn Huệ, Q.1, TP.HCM"
                  />
                </Field>
              </div>
              <Field label="Số điện thoại">
                <Input
                  value={createForm.contactPhone ?? ""}
                  onChange={(v) => setCreateForm({ ...createForm, contactPhone: v })}
                  placeholder="028 xxxx xxxx"
                />
              </Field>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2.5 mt-1 mb-4 text-xs text-emerald-700">
              💡 Sau khi tạo, CLB sẽ chờ ban tổ chức xét duyệt trước khi đăng ký giải đấu.
            </div>

            <div className="flex justify-end">
              <Btn
                variant="primary"
                size="lg"
                onClick={async () => {
                  if (!createForm.name || !createForm.shortName)
                    return alert("Vui lòng điền tên CLB và tên viết tắt!");
                  try {
                    await createClub(createForm);
                  } catch (err: unknown) {
                    const msg = (err as { response?: { data?: { message?: string } } })
                      ?.response?.data?.message;
                    alert(msg || "Tạo CLB thất bại");
                  }
                }}
              >
                🏟 Tạo hồ sơ CLB
              </Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!club) return null;

  // Đã có CLB 
  return (
    <div className="flex flex-col gap-4">
      <ClubCard
        club={club}
        venue={club.homeVenueName ? { name: club.homeVenueName } : null}
        onEdit={() => {
          setForm({
            name: club.name,
            shortName: club.shortName,
            headquarters: club.headquarters,
            contactEmail: club.contactEmail,
            contactPhone: club.contactPhone,
          });
          setModal(true);
        }}
      />

      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Thành viên" value={members.length} icon="👥" />
        <StatCard label="Giải đang tham gia" value={tournamentCount} icon="🏆" />
        <StatCard label="Trận đã đấu" value={matchCount} icon="⚽" />
        <StatCard label="Kỷ luật" value={disciplineCount} icon="🟥" />
      </div>

      <Card>
        <CardHeader title="Danh sách thành viên" icon="👥" />
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th>Họ tên</Th>
              <Th>CCCD</Th>
              <Th>Ngày sinh</Th>
              <Th>Số áo</Th>
              <Th>Vị trí</Th>
              <Th>Vai trò</Th>
              <Th>Thể trạng</Th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Chưa có thành viên
                </td>
              </tr>
            )}
            {members.map((m) => (
              <tr key={m.memberId}>
                <Td>
                  <span className="font-semibold">{m.fullName}</span>
                </Td>
                <Td className="font-mono text-gray-500">{m.identityNumber}</Td>
                <Td>
                  {m.dateOfBirth
                    ? new Date(m.dateOfBirth).toLocaleDateString("vi-VN")
                    : "—"}
                </Td>
                <Td>
                  <span className="font-extrabold" style={{ color: "#0D7A4E" }}>
                    #{m.preferredNumber}
                  </span>
                </Td>
                <Td>{m.preferredPosition}</Td>
                <Td>
                  <span className="bg-gray-100 text-gray-500 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    {m.clubRole}
                  </span>
                </Td>
                <Td>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      m.healthStatus === "FIT"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {m.healthStatus === "FIT" ? "Khỏe mạnh" : "Chấn thương"}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Modal cập nhật */}
      {modal && (
        <Modal title="Cập nhật hồ sơ CLB" onClose={() => setModal(false)}>
          <Field label="Tên CLB *">
            <Input value={form.name ?? ""} onChange={(v) => setForm({ ...form, name: v })} />
          </Field>
          <Field label="Tên viết tắt *">
            <Input value={form.shortName ?? ""} onChange={(v) => setForm({ ...form, shortName: v })} />
          </Field>
          <Field label="Địa chỉ trụ sở">
            <Input value={form.headquarters ?? ""} onChange={(v) => setForm({ ...form, headquarters: v })} />
          </Field>
          <Field label="Email liên hệ">
            <Input value={form.contactEmail ?? ""} onChange={(v) => setForm({ ...form, contactEmail: v })} type="email" />
          </Field>
          <Field label="Số điện thoại">
            <Input value={form.contactPhone ?? ""} onChange={(v) => setForm({ ...form, contactPhone: v })} />
          </Field>
          <div className="flex gap-2 justify-end mt-2">
            <Btn onClick={() => setModal(false)} variant="outline">Hủy</Btn>
            <Btn
              variant="primary"
              onClick={async () => {
                try {
                  await updateClub(form);
                  setModal(false);
                } catch (err: unknown) {
                  const msg = (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message;
                  alert(msg || "Cập nhật thất bại");
                }
              }}
            >
              💾 Lưu thay đổi
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}