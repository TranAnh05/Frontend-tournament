import React from "react";
import {
    Activity,
    ShieldAlert,
    ShieldCheck,
    Trophy,
    Info,
    Users,
} from "lucide-react";
import { type ActivityLogResponse } from "../../types/dashboard";
import { cn } from "@/utils/classNames";

interface RecentActivitiesWidgetProps {
    data: ActivityLogResponse[];
    isLoading: boolean;
}

export const RecentActivitiesWidget: React.FC<RecentActivitiesWidgetProps> = ({
    data,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Nhật ký Hoạt động
                </h3>
                <div className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Helper map icon và màu sắc dựa trên type của Log
    const getLogStyle = (type: string) => {
        switch (type) {
            case "USER_STATUS_CHANGED":
            case "USER_LOCKED":
                return {
                    icon: ShieldAlert,
                    color: "text-red-500",
                    bg: "bg-red-50",
                    border: "border-red-100",
                };
            case "USER_UNLOCKED":
                return {
                    icon: ShieldCheck,
                    color: "text-green-500",
                    bg: "bg-green-50",
                    border: "border-green-100",
                };
            case "TOURNAMENT_CREATED":
                return {
                    icon: Trophy,
                    color: "text-orange-500",
                    bg: "bg-orange-50",
                    border: "border-orange-100",
                };
            case "CLUB_REGISTERED":
                return {
                    icon: Users,
                    color: "text-blue-500",
                    bg: "bg-blue-50",
                    border: "border-blue-100",
                };
            default:
                return {
                    icon: Info,
                    color: "text-gray-500",
                    bg: "bg-gray-50",
                    border: "border-gray-100",
                };
        }
    };

    // Helper hiển thị thời gian tương đối (VD: 2 giờ trước)
    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000,
        );

        if (diffInSeconds < 60) return "Vừa xong";
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <Activity size={20} className="text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">
                    Nhật ký Hoạt động
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {data.length > 0 ? (
                    <div className="relative border-l-2 border-gray-100 ml-4 space-y-6 pb-4">
                        {data.map((log, index) => {
                            const style = getLogStyle(log.type);
                            const Icon = style.icon;

                            return (
                                <div key={index} className="relative pl-6">
                                    {/* Dấu chấm tròn Timeline */}
                                    <div
                                        className={cn(
                                            "absolute -left-[17px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center",
                                            style.bg,
                                            style.color,
                                        )}
                                    >
                                        <Icon size={14} />
                                    </div>

                                    {/* Nội dung Log */}
                                    <div className="pt-1">
                                        <p className="text-sm text-gray-800 leading-snug">
                                            {log.message}
                                        </p>
                                        <span className="text-xs text-gray-400 mt-1 block">
                                            {getRelativeTime(log.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 italic py-10">
                        <p>Chưa có ghi nhận hoạt động nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
