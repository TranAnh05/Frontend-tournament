import React, { useState } from "react";
import {
    Eye,
    Edit,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    SearchX,
} from "lucide-react";
import { type SportResponse } from "../../types/sports";
import { cn } from "@/utils/classNames";

interface SportsTableProps {
    sports: SportResponse[];
    isLoading: boolean;
    isFiltered?: boolean;
    onEdit: (sport: SportResponse) => void; 
}

export const SportsTable: React.FC<SportsTableProps> = ({
    sports,
    isLoading,
    isFiltered = false,
    onEdit
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
                                            <span
                                                className={cn(
                                                    "inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium",
                                                    sport.status === "ACTIVE"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700",
                                                )}
                                            >
                                                {sport.status === "ACTIVE"
                                                    ? "Đang hoạt động"
                                                    : "Đã khóa"}
                                            </span>
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
                                                        e.stopPropagation()
                                                        onEdit(sport)
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
                                                                    <div
                                                                        key={
                                                                            rule.id
                                                                        }
                                                                        className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-1"
                                                                    >
                                                                        <div className="flex justify-between items-start">
                                                                            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                                                                {
                                                                                    rule.ruleKey
                                                                                }
                                                                            </span>
                                                                            <span className="font-bold text-gray-900 bg-gray-100 px-2 rounded-sm">
                                                                                {
                                                                                    rule.ruleValue
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                                            {rule.description ||
                                                                                "Không có giải thích chi tiết."}
                                                                        </span>
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
