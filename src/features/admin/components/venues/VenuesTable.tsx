import React, { useState } from "react";
import {
    Edit,
    ChevronDown,
    ChevronUp,
    MapPin,
    SearchX,
    Layers,
} from "lucide-react";
import { type VenueResponse } from "../../types/venues";
import { cn } from "@/utils/classNames";

interface VenuesTableProps {
    venues: VenueResponse[];
    isLoading: boolean;
    onEdit: (venue: VenueResponse) => void;
    onToggleStatus: (venue: VenueResponse) => void;
}

export const VenuesTable: React.FC<VenuesTableProps> = ({
    venues,
    isLoading,
    onEdit,
    onToggleStatus,
}) => {
    // State lưu trữ danh sách các ID địa điểm đang được mở rộng
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleExpandRow = (id: number) => {
        setExpandedRows((prev) =>
            prev.includes(id)
                ? prev.filter((rowId) => rowId !== id)
                : [...prev, id],
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (venues.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 text-gray-500">
                <SearchX size={48} className="mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-900">
                    Không tìm thấy địa điểm nào
                </p>
                <p className="text-sm">
                    Thử thay đổi bộ lọc hoặc thêm địa điểm mới.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="w-12 px-6 py-4"></th>
                            <th className="px-6 py-4 font-semibold">
                                Tên địa điểm
                            </th>
                            <th className="px-6 py-4 font-semibold">Địa chỉ</th>
                            <th className="px-6 py-4 font-semibold text-center">
                                Số lượng sân
                            </th>
                            <th className="px-6 py-4 font-semibold text-center">
                                Trạng thái
                            </th>
                            <th className="px-6 py-4 font-semibold text-right">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {venues.map((venue) => {
                            const isExpanded = expandedRows.includes(venue.id);

                            return (
                                <React.Fragment key={`venue-${venue.id}`}>
                                    {/* THÔNG TIN ĐỊA ĐIỂM */}
                                    <tr
                                        className={cn(
                                            "hover:bg-blue-50/50 transition-colors cursor-pointer group",
                                            isExpanded ? "bg-blue-50/30" : "",
                                        )}
                                        onClick={() =>
                                            toggleExpandRow(venue.id)
                                        }
                                    >
                                        <td className="px-6 py-4">
                                            <button className="text-gray-400 group-hover:text-blue-600 transition-colors">
                                                {isExpanded ? (
                                                    <ChevronUp size={20} />
                                                ) : (
                                                    <ChevronDown size={20} />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">
                                                {venue.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <MapPin
                                                    size={16}
                                                    className="shrink-0"
                                                />
                                                <span
                                                    className="truncate max-w-[250px]"
                                                    title={venue.address}
                                                >
                                                    {venue.address}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                                <Layers size={14} />
                                                {venue.courts.length} sân
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {/* Component Toggle Switch */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleStatus(venue);
                                                }}
                                                className="group flex items-center justify-center w-full focus:outline-none"
                                                title={
                                                    venue.status === "ACTIVE"
                                                        ? "Khóa địa điểm"
                                                        : "Mở khóa"
                                                }
                                            >
                                                <div
                                                    className={cn(
                                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                                                        venue.status ===
                                                            "ACTIVE"
                                                            ? "bg-green-500"
                                                            : "bg-gray-300",
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "inline-block h-4 w-4 transform rounded-full bg-white transition duration-200",
                                                            venue.status ===
                                                                "ACTIVE"
                                                                ? "translate-x-6"
                                                                : "translate-x-1",
                                                        )}
                                                    />
                                                </div>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(venue);
                                                }}
                                                className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                title="Chỉnh sửa địa điểm"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        </td>
                                    </tr>

                                    {/* HIỂN THỊ DANH SÁCH SÂN CON  */}
                                    {isExpanded && (
                                        <tr className="bg-gray-50/80 border-b border-gray-200">
                                            <td
                                                colSpan={6}
                                                className="px-14 py-6"
                                            >
                                                <div className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <Layers
                                                        size={16}
                                                        className="text-blue-500"
                                                    />
                                                    Danh sách sân thi đấu thuộc{" "}
                                                    {venue.name}
                                                </div>

                                                {venue.courts.length > 0 ? (
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                                        {venue.courts.map(
                                                            (court) => (
                                                                // COURT CARD
                                                                <div
                                                                    key={`court-${court.id}`}
                                                                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                                                >
                                                                    <div className="flex justify-between items-start mb-3 gap-2">
                                                                        <h4 className="font-bold text-gray-900 line-clamp-2">
                                                                            {
                                                                                court.courtName
                                                                            }
                                                                        </h4>
                                                                        <span
                                                                            className={cn(
                                                                                "px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 whitespace-nowrap",
                                                                                court.status ===
                                                                                    "ACTIVE"
                                                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                                                    : "bg-amber-50 text-amber-700 border-amber-200",
                                                                            )}
                                                                        >
                                                                            {court.status ===
                                                                            "ACTIVE"
                                                                                ? "Sẵn sàng"
                                                                                : "Bảo trì"}
                                                                        </span>
                                                                    </div>

                                                                    <div className="space-y-1.5">
                                                                        <p className="text-xs font-medium text-gray-500">
                                                                            Môn
                                                                            thể
                                                                            thao
                                                                            hỗ
                                                                            trợ:
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {court
                                                                                .supportedSports
                                                                                .length >
                                                                            0 ? (
                                                                                court.supportedSports.map(
                                                                                    (
                                                                                        sport,
                                                                                    ) => (
                                                                                        <span
                                                                                            key={`css-${court.id}-${sport.id}`}
                                                                                            className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-[11px] rounded-md font-medium border border-blue-100"
                                                                                        >
                                                                                            {
                                                                                                sport.name
                                                                                            }
                                                                                        </span>
                                                                                    ),
                                                                                )
                                                                            ) : (
                                                                                <span className="text-xs text-gray-400 italic">
                                                                                    Chưa
                                                                                    cấu
                                                                                    hình
                                                                                    môn
                                                                                    thi
                                                                                    đấu
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    // EMPTY STATE CHO SÂN CON
                                                    <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                                                        <p className="text-gray-500 text-sm">
                                                            Địa điểm này chưa có
                                                            sân thi đấu nào được
                                                            thiết lập.
                                                        </p>
                                                    </div>
                                                )}
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
