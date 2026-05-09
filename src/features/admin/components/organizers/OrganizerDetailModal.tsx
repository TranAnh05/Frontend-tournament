import React, { useEffect } from "react";
import {
    X,
    User,
    Mail,
    Phone,
    Calendar,
    Award,
    Trophy,
    Users,
    Briefcase,
    Info,
    Clock,
} from "lucide-react";
import { useGetOrganizerDetail } from "../../hooks/organizers/useGetOrganizerDetail";
import { cn } from "@/utils/classNames";

interface OrganizerDetailModalProps {
    isOpen: boolean;
    organizerId: number | null;
    onClose: () => void;
}

export const OrganizerDetailModal: React.FC<OrganizerDetailModalProps> = ({
    isOpen,
    organizerId,
    onClose,
}) => {
    const {
        data: detail,
        isLoading,
        fetchDetail,
        resetDetail,
    } = useGetOrganizerDetail();

    useEffect(() => {
        if (isOpen && organizerId) {
            fetchDetail(organizerId);
        }
        if (!isOpen) {
            resetDetail();
        }
    }, [isOpen, organizerId, fetchDetail, resetDetail]);

    if (!isOpen) return null;

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "---";
        return new Date(dateStr).toLocaleDateString("vi-VN");
    };

    const getTournamentStatusBadge = (status: string) => {
        switch (status) {
            case "DRAFT":
                return {
                    label: "Chưa mở đăng ký",
                    className: "bg-gray-100 text-gray-600 border-gray-200",
                };
            case "REGISTRATION_OPEN":
                return {
                    label: "Đang mở đăng ký",
                    className: "bg-blue-50 text-blue-700 border-blue-200",
                };
            case "ONGOING":
                return {
                    label: "Đang diễn ra",
                    className: "bg-green-50 text-green-700 border-green-200",
                };
            case "FINISHED":
                return {
                    label: "Đã kết thúc",
                    className: "bg-purple-50 text-purple-700 border-purple-200",
                };
            case "CANCELED":
                return {
                    label: "Đã hủy",
                    className: "bg-red-50 text-red-700 border-red-200",
                };
            default:
                return {
                    label: status,
                    className: "bg-gray-50 text-gray-600 border-gray-200",
                };
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Briefcase size={20} />
                        <h2 className="text-lg font-bold text-gray-900">
                            Chi tiết hồ sơ Ban tổ chức
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="text-gray-500 animate-pulse">
                                Đang tải dữ liệu hồ sơ...
                            </p>
                        </div>
                    ) : detail ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* CỘT TRÁI: SIDEBAR HỒ SƠ */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                                    <div className="relative h-24 w-24 mx-auto mb-4 rounded-full border-4 border-blue-50 bg-gray-100 overflow-hidden flex items-center justify-center">
                                        {detail.avatarUrl ? (
                                            <img
                                                src={detail.avatarUrl}
                                                alt={detail.fullName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User
                                                size={40}
                                                className="text-gray-300"
                                            />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {detail.fullName}
                                    </h3>
                                    <span
                                        className={cn(
                                            "inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2",
                                            detail.status === "ACTIVE"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600",
                                        )}
                                    >
                                        {detail.status === "ACTIVE"
                                            ? "Đang hoạt động"
                                            : "Đã khóa"}
                                    </span>

                                    <div className="mt-6 space-y-3 text-left">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Mail
                                                size={16}
                                                className="text-blue-500"
                                            />
                                            <span className="truncate">
                                                {detail.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Phone
                                                size={16}
                                                className="text-blue-500"
                                            />
                                            <span>
                                                {detail.phoneNumber ||
                                                    "Chưa cập nhật"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Clock
                                                size={16}
                                                className="text-blue-500"
                                            />
                                            <span>
                                                Tham gia:{" "}
                                                {formatDate(detail.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Calendar
                                                size={16}
                                                className="text-blue-500"
                                            />
                                            <span>
                                                Bổ nhiệm:{" "}
                                                {formatDate(detail.assignedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Info
                                            size={16}
                                            className="text-blue-500"
                                        />{" "}
                                        Tiểu sử
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed italic">
                                        {detail.bio ||
                                            "Thành viên này chưa cập nhật thông tin giới thiệu bản thân."}
                                    </p>
                                </div>
                            </div>

                            {/* CỘT PHẢI: DASHBOARD & TIMELINE (8/12) */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* KPI  */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                                        <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                            <Trophy size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Giải đấu đã tạo
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {detail.totalTournaments}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                                        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                CLB từng tham gia
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {detail.totalParticipatingClubs}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ACHIEVEMENTS */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
                                        <Award
                                            size={18}
                                            className="text-orange-500"
                                        />{" "}
                                        Thành tựu & Chứng chỉ
                                    </h4>
                                    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                        {detail.achievements.length > 0 ? (
                                            detail.achievements.map(
                                                (item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative pl-8"
                                                    >
                                                        <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-white border-2 border-orange-500 z-10 flex items-center justify-center">
                                                            <div className="h-2 w-2 bg-orange-500 rounded-full" />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                                                Năm {item.year}
                                                            </span>
                                                            <h5 className="font-bold text-gray-900 mt-1">
                                                                {item.title}
                                                            </h5>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {
                                                                    item.organization
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">
                                                Chưa có dữ liệu thành tựu.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* 3. RECENT TOURNAMENTS */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                                            <Trophy
                                                size={18}
                                                className="text-blue-500"
                                            />{" "}
                                            Các giải đấu gần nhất
                                        </h4>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                                <tr>
                                                    <th className="px-6 py-3">
                                                        Tên giải đấu
                                                    </th>
                                                    <th className="px-6 py-3">
                                                        Ngày bắt đầu
                                                    </th>
                                                    <th className="px-6 py-3">
                                                        Trạng thái
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {detail.recentTournaments
                                                    .length > 0 ? (
                                                    detail.recentTournaments.map(
                                                        (t) => {
                                                            const statusBadge =
                                                                getTournamentStatusBadge(
                                                                    t.status,
                                                                );
                                                            return (
                                                                <tr
                                                                    key={t.id}
                                                                    className="hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <td className="px-6 py-4 font-bold text-gray-900">
                                                                        {t.name}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-gray-600">
                                                                        {new Date(
                                                                            t.startDate,
                                                                        ).toLocaleDateString(
                                                                            "vi-VN",
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 font-medium">
                                                                            {
                                                                                statusBadge.label
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        },
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={3}
                                                            className="px-6 py-8 text-center text-gray-400 italic"
                                                        >
                                                            Chưa tổ chức giải
                                                            đấu nào.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                    >
                        Đóng hồ sơ
                    </button>
                </div>
            </div>
        </div>
    );
};
