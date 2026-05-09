import React from "react";
import type { ClubResponse } from "@/features/club/api/clubApi";

interface ClubCardProps {
  club: ClubResponse;
  venue: { name: string } | null;
  onEdit?: () => void;
  onViewDetail?: () => void;  // ← Mới: click vào header để xem chi tiết
}

export function ClubCard({ club, venue, onEdit, onViewDetail }: ClubCardProps) {
  const statusColor =
    club.status === "ACTIVE" ? "#10B981" :
    club.status === "PENDING" ? "#F59E0B" : "#EF4444";
  const statusLabel =
    club.status === "ACTIVE" ? "Đang hoạt động" :
    club.status === "PENDING" ? "Chờ duyệt" : club.status;

  return (
    <div
      className="rounded-2xl p-6 text-white flex items-center justify-between gap-5 flex-wrap"
      style={{ background: "linear-gradient(135deg, #0D7A4E 0%, #0a6641 100%)" }}
    >
      {/* Left: logo + info — clickable để xem chi tiết */}
      <div
        className={`flex items-center gap-4 ${onViewDetail ? "cursor-pointer group" : ""}`}
        onClick={onViewDetail}
        title={onViewDetail ? "Xem chi tiết câu lạc bộ" : undefined}
      >
        <div className="w-16 h-16 rounded-[14px] bg-white/15 flex items-center justify-center text-3xl flex-shrink-0 transition-transform group-hover:scale-105">
          {club.logoUrl
            ? <img src={club.logoUrl} alt="logo" className="w-[54px] h-[54px] rounded-[10px] object-cover" />
            : "🏟"}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-extrabold mb-0.5 group-hover:underline underline-offset-2">
              {club.name}
            </div>
            {onViewDetail && (
              <span className="text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                ↗
              </span>
            )}
          </div>
          <div className="text-[13px] opacity-80 mb-1.5">
            {club.shortName}
            {club.managerName && <span className="ml-2 opacity-70">• HLV: {club.managerName}</span>}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span
              className="text-white border rounded-full px-2.5 py-0.5 text-[11px] font-bold"
              style={{ background: statusColor + "33", borderColor: statusColor + "88" }}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Right: edit button */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="bg-white/15 border border-white/30 text-white rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer flex-shrink-0 hover:bg-white/25 transition-colors"
        >
          ✏️ Chỉnh sửa
        </button>
      )}
    </div>
  );
}