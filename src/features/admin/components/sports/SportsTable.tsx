import React, { useState } from "react";
import {
    Eye,
    Edit,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    SearchX,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { type SportResponse } from "../../types/sports";
import { cn } from "@/utils/classNames";


const RULE_META: Record<string, { label: string; icon: string; format?: (v: string) => string }> = {
    WIN_POINTS: { label: "Điểm khi thắng", icon: "🏆", format: v => `${v} điểm` },
    DRAW_POINTS: { label: "Điểm khi hòa", icon: "🤝", format: v => `${v} điểm` },
    LOSE_POINTS: { label: "Điểm khi thua", icon: "❌", format: v => `${v} điểm` },
    MAX_STARTING_PLAYERS: { label: "VĐV ra sân tối đa", icon: "👥", format: v => `${v} người` },
    MIN_STARTING_PLAYERS: { label: "VĐV ra sân tối thiểu", icon: "👤", format: v => `${v} người` },
    ALLOWED_EVENTS: {
        label: "Sự kiện được ghi nhận",
        icon: "📋",
        format: v => v.split(",").map(e => {
            const map: Record<string, string> = {
                GOAL: "Ghi bàn",
                YELLOW_CARD: "Thẻ vàng",
                RED_CARD: "Thẻ đỏ",
                INJURY: "Chấn thương",
                TIMEOUT: "Hội ý",
                SUBSTITUTION: "Thay người",
                FOUL: "Phạm lỗi",
                PENALTY: "Phạt đền",
            };
            return map[e.trim()] ?? e.trim();
        }).join(", ")
    },
    CLOCK_TYPE: {
        label: "Loại tính giờ", icon: "⏱️", format: v =>
            v === "COUNTDOWN" ? "Đếm ngược" : v === "SET_BASED" ? "Tính theo Set" : "Đếm lên"
    },
    PERIODS: { label: "Số hiệp / Set", icon: "🔄", format: v => `${v} hiệp` },
    OVERTIME_ALLOWED: { label: "Cho phép hiệp phụ", icon: "⏰", format: v => v === "YES" ? "Có" : "Không" },
    WIN_BY_TWO_RULE: { label: "Phải hơn 2 điểm để thắng", icon: "2️⃣", format: v => v === "YES" ? "Có" : "Không" },
    MAX_POINTS_PER_SET: { label: "Điểm tối đa mỗi set", icon: "🎯", format: v => `${v} điểm` },
    POINTS_TO_WIN_SET: { label: "Điểm cần để thắng set", icon: "✅", format: v => `${v} điểm` },
    SETS_TO_WIN: { label: "Set cần để thắng", icon: "🥇", format: v => `${v} set` },
    SUBSTITUTIONS: { label: "Lần thay người", icon: "🔁", format: v => `${v} lần` },
    MATCH_DURATION: { label: "Thời gian trận đấu", icon: "⏳", format: v => `${v} phút` },
    MAX_PLAYERS_ON_FIELD: { label: "Cầu thủ trên sân", icon: "👥", format: v => `${v} người` },
    MAX_PLAYERS_ON_COURT: { label: "VĐV trên sân", icon: "👥", format: v => `${v} người` },
    MAX_SUBSTITUTES: { label: "VĐV dự bị tối đa", icon: "🔄", format: v => `${v} người` },
    MAX_SUBSTITUTIONS_ALLOWED: { label: "Lượt thay người tối đa", icon: "🔁", format: v => `${v} lượt` },
    MATCH_DURATION_MINUTES: { label: "Thời gian trận đấu", icon: "⏳", format: v => `${v} phút` },
    HALF_DURATION_MINUTES: { label: "Thời gian mỗi hiệp", icon: "⏱️", format: v => `${v} phút` },
    QUARTER_DURATION_MINUTES: { label: "Thời gian mỗi quý (quarter)", icon: "⏱️", format: v => `${v} phút` },
    YELLOW_CARD_TO_RED: { label: "Thẻ vàng thành thẻ đỏ", icon: "🟨", format: v => `${v} thẻ vàng` },
    PERSONAL_FOULS_LIMIT: { label: "Giới hạn lỗi cá nhân", icon: "🚫", format: v => `${v} lỗi` },
    TEAM_FOULS_BONUS: { label: "Lỗi đội trước khi bị ném phạt", icon: "⚠️", format: v => `${v} lỗi/hiệp` },
};

function formatRule(key: string, value: string) {
    const meta = RULE_META[key];
    if (meta) return {
        label: meta.label,
        icon: meta.icon,
        displayValue: meta.format ? meta.format(value) : value,
    };
    return {
        label: key.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
        icon: "⚙️",
        displayValue: value,
    };
}
interface SportsTableProps {
    sports: SportResponse[];
    isLoading: boolean;
    isFiltered?: boolean;
    onEdit: (sport: SportResponse) => void;
    onToggleStatus: (sport: SportResponse) => void;
}

export const SportsTable: React.FC<SportsTableProps> = ({
    sports,
    isLoading,
    isFiltered = false,
    onEdit,
    onToggleStatus,
}) => {
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    const toggleExpandRow = (id: number) => {
        setExpandedRowId((prev) => (prev === id ? null : id));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p>Đang tải dữ liệu môn thể thao...</p>
            </div>
        );
    }

    if (!sports.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-xl border border-gray-200">
                {isFiltered ? (
                    <>
                        <SearchX size={48} className="text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900">
                            Không tìm thấy kết quả nào
                        </p>
                        <p className="text-sm mt-1">
                            Thử thay đổi từ khóa hoặc bộ lọc trạng thái để xem
                            các kết quả khác.
                        </p>
                    </>
                ) : (
                    <>
                        <AlertCircle size={48} className="text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900">
                            Chưa có môn thể thao nào
                        </p>
                        <p className="text-sm mt-1">
                            Hãy thêm môn thể thao đầu tiên để bắt đầu thiết lập
                            giải đấu.
                        </p>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4 w-10"></th>
                            <th className="px-6 py-4">Tên môn thi đấu</th>
                            <th className="px-6 py-4">Mô tả</th>
                            <th className="px-6 py-4 text-center">Quy tắc</th>
                            <th className="px-6 py-4 text-center">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sports.map((sport) => {
                            const isExpanded = expandedRowId === sport.id;

                            return (
                                <React.Fragment key={sport.id}>
                                    {/* --- DÒNG CHÍNH --- */}
                                    <tr
                                        className={cn(
                                            "hover:bg-gray-50 transition-colors cursor-pointer",
                                            isExpanded &&
                                            "bg-blue-50/50 hover:bg-blue-50/50",
                                        )}
                                        onClick={() =>
                                            toggleExpandRow(sport.id)
                                        }
                                    >
                                        <td className="px-6 py-4 text-gray-400">
                                            {isExpanded ? (
                                                <ChevronUp size={18} />
                                            ) : (
                                                <ChevronDown size={18} />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {sport.name}
                                        </td>
                                        <td
                                            className="px-6 py-4 text-gray-500 truncate max-w-xs"
                                            title={sport.description}
                                        >
                                            {sport.description || (
                                                <span className="text-gray-400 italic">
                                                    Không có mô tả
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                {sport.rules.length} luật
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleStatus(sport);
                                                }}
                                                className="group flex items-center justify-center w-full focus:outline-none"
                                                title={
                                                    sport.status === "ACTIVE"
                                                        ? "Click để vô hiệu hóa"
                                                        : "Click để kích hoạt"
                                                }
                                            >
                                                <div
                                                    className={cn(
                                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out",
                                                        sport.status ===
                                                            "ACTIVE"
                                                            ? "bg-green-500"
                                                            : "bg-gray-300",
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out",
                                                            sport.status ===
                                                                "ACTIVE"
                                                                ? "translate-x-6"
                                                                : "translate-x-1",
                                                        )}
                                                    />
                                                </div>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div
                                                className="flex items-center justify-end gap-2"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <button
                                                    onClick={() =>
                                                        toggleExpandRow(
                                                            sport.id,
                                                        )
                                                    }
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Xem luật thi đấu"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                                    title="Chỉnh sửa"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit(sport);
                                                    }}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* --- DÒNG MỞ RỘNG (CHI TIẾT LUẬT) --- */}
                                    {isExpanded && (
                                        <tr className="bg-gray-50/50 border-b border-gray-200">
                                            <td
                                                colSpan={6}
                                                className="px-0 py-0"
                                            >
                                                <div className="px-16 py-5 border-l-4 border-blue-500 shadow-inner">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                                        Chi tiết bộ quy tắc (
                                                        {sport.name})
                                                    </h4>

                                                    {sport.rules.length ===
                                                        0 ? (
                                                        <p className="text-sm text-gray-500 italic">
                                                            Môn thể thao này
                                                            chưa được cấu hình
                                                            luật chơi nào.
                                                        </p>
                                                    ) : (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {sport.rules.map(
                                                                (rule) => (
                                                                    <div key={rule.id}
                                                                        className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-lg">{formatRule(rule.ruleKey, rule.ruleValue).icon}</span>
                                                                            <span className="text-sm font-bold text-gray-800 leading-tight">
                                                                                {formatRule(rule.ruleKey, rule.ruleValue).label}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-xl font-black text-blue-600">
                                                                            {formatRule(rule.ruleKey, rule.ruleValue).displayValue}
                                                                        </div>
                                                                        {rule.description && (
                                                                            <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-2">
                                                                                {rule.description}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
