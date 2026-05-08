import { useState } from "react";
import { useMembers } from "../hooks/useMembers";
import { Card, CardHeader, Th, Td, Modal, Field, Input, Btn } from "../components/common/UIComponents";
import type { UpdateAthleteRequest } from "../api/athleteApi";

type Tab = "APPROVED" | "PENDING";

const ROLE_OPTIONS = ["MEMBER", "CAPTAIN", "HEAD_COACH"] as const;
const HEALTH_OPTIONS = ["FIT", "INJURED"] as const;

export default function MembersPage() {
  const [tab, setTab] = useState<Tab>("APPROVED");
  const { members, loading, approve, reject, updateAthlete, remove, assignRole } = useMembers(tab);

  const [editModal, setEditModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [editForm, setEditForm] = useState<UpdateAthleteRequest>({});

  const openEdit = (memberId: number, current: UpdateAthleteRequest) => {
    setSelected(memberId);
    setEditForm(current);
    setEditModal(true);
  };

  const openReject = (memberId: number) => {
    setSelected(memberId);
    setRejectReason("");
    setRejectModal(true);
  };

  const colSpan = tab === "APPROVED" ? 8 : 4;

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 m-0">👥 Quản lý thành viên</h1>
          <p className="text-[13px] text-gray-500 mt-1 mb-0">Duyệt đơn, phân quyền và quản lý VĐV trong CLB</p>
        </div>
        <div className="text-[13px] text-gray-500">{members.length} thành viên</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-50 rounded-[10px] p-1 w-fit border border-gray-200">
        {(["APPROVED", "PENDING"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-semibold transition-all ${
              tab === t ? "bg-white shadow-sm" : "bg-transparent text-gray-500"
            }`}
            style={tab === t ? { color: "#0D7A4E" } : undefined}
          >
            {t === "APPROVED" ? "✅ Thành viên" : "⏳ Chờ duyệt"}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader
          title={tab === "APPROVED" ? "Danh sách thành viên" : "Đơn chờ duyệt"}
          icon={tab === "APPROVED" ? "👥" : "📋"}
        />
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <Th>Họ tên</Th>
              <Th>CCCD</Th>
              <Th>Ngày sinh</Th>
              {tab === "APPROVED" && <Th>Số áo</Th>}
              {tab === "APPROVED" && <Th>Vị trí</Th>}
              {tab === "APPROVED" && <Th>Vai trò</Th>}
              {tab === "APPROVED" && <Th>Thể trạng</Th>}
              <Th>Thao tác</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={colSpan} className="py-10 text-center text-gray-500">⏳ Đang tải...</td>
              </tr>
            )}
            {!loading && members.length === 0 && (
              <tr>
                <td colSpan={colSpan} className="py-10 text-center text-gray-500">
                  {tab === "PENDING" ? "Không có đơn chờ duyệt" : "Chưa có thành viên"}
                </td>
              </tr>
            )}
            {members.map((m) => (
              <tr key={m.memberId} className="transition-colors hover:bg-gray-50">
                <Td>
                  <div className="font-semibold text-gray-900">{m.fullName}</div>
                  <div className="text-[11px] text-gray-500">{m.email}</div>
                </Td>
                <Td className="font-mono text-xs text-gray-500">{m.identityNumber}</Td>
                <Td className="text-xs">
                  {m.dateOfBirth ? new Date(m.dateOfBirth).toLocaleDateString("vi-VN") : "—"}
                </Td>

                {tab === "APPROVED" && (
                  <Td>
                    <span className="font-extrabold text-[15px]" style={{ color: "#0D7A4E" }}>
                      #{m.preferredNumber ?? "—"}
                    </span>
                  </Td>
                )}
                {tab === "APPROVED" && (
                  <Td className="text-xs">{m.preferredPosition || "—"}</Td>
                )}
                {tab === "APPROVED" && (
                  <Td>
                    <select
                      value={m.clubRole}
                     onChange={async (e) => await assignRole(m.memberId, e.target.value as "MEMBER" | "CAPTAIN" | "HEAD_COACH")}
                      className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-900 cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </Td>
                )}
                {tab === "APPROVED" && (
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
                )}

                <Td>
                  <div className="flex gap-1.5">
                    {tab === "PENDING" ? (
                      <>
                        <Btn size="sm" variant="primary" onClick={async () => await approve(m.memberId)}>
                          ✅ Duyệt
                        </Btn>
                        <Btn size="sm" variant="danger" onClick={() => openReject(m.memberId)}>
                          ❌ Từ chối
                        </Btn>
                      </>
                    ) : (
                      <>
                        <Btn
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openEdit(m.memberId, {
                              preferredNumber: m.preferredNumber,
                              preferredPosition: m.preferredPosition,
                              healthStatus: m.healthStatus,
                            })
                          }
                        >
                          ✏️ Sửa
                        </Btn>
                        <Btn
                          size="sm"
                          variant="danger"
                          onClick={async () => {
                            if (confirm(`Xóa ${m.fullName} khỏi CLB?`)) await remove(m.memberId);
                          }}
                        >
                          🗑
                        </Btn>
                      </>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Modal từ chối */}
      {rejectModal && selected !== null && (
        <Modal title="Từ chối đơn gia nhập" onClose={() => setRejectModal(false)}>
          <Field label="Lý do từ chối *">
            <Input
              value={rejectReason}
              onChange={setRejectReason}
              placeholder="Nhập lý do từ chối..."
            />
          </Field>
          <div className="flex gap-2 justify-end mt-2">
            <Btn onClick={() => setRejectModal(false)}>Hủy</Btn>
            <Btn
              variant="danger"
              onClick={async () => {
                if (!rejectReason.trim()) return alert("Vui lòng nhập lý do!");
                await reject(selected, rejectReason);
                setRejectModal(false);
              }}
            >
              ❌ Xác nhận từ chối
            </Btn>
          </div>
        </Modal>
      )}

      {/* Modal chỉnh sửa VĐV */}
      {editModal && selected !== null && (
        <Modal title="Chỉnh sửa thông tin VĐV" onClose={() => setEditModal(false)}>
          <Field label="Số áo">
            <Input
              value={String(editForm.preferredNumber ?? "")}
              onChange={(v) =>
                setEditForm({ ...editForm, preferredNumber: v ? parseInt(v) : undefined })
              }
              placeholder="VD: 10"
              type="number"
            />
          </Field>
          <Field label="Vị trí thi đấu">
            <Input
              value={editForm.preferredPosition ?? ""}
              onChange={(v) => setEditForm({ ...editForm, preferredPosition: v })}
              placeholder="VD: Tiền đạo"
            />
          </Field>
          <Field label="Thể trạng">
            <select
              value={editForm.healthStatus ?? "FIT"}
              onChange={(e) =>
                setEditForm({ ...editForm, healthStatus: e.target.value as "FIT" | "INJURED" })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {HEALTH_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h === "FIT" ? "Khỏe mạnh" : "Chấn thương"}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex gap-2 justify-end mt-2">
            <Btn onClick={() => setEditModal(false)}>Hủy</Btn>
            <Btn
              variant="primary"
              onClick={async () => {
                await updateAthlete(selected, editForm);
                setEditModal(false);
              }}
            >
              💾 Lưu
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}