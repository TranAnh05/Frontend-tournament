import React from "react";
import {
    Trophy,
    Users,
    Shield,
    PlayCircle,
    TrendingUp,
    TrendingDown,
    Minus,
} from "lucide-react";
import { type DashboardKpiResponse } from "../../types/dashboard";
import { cn } from "@/utils/classNames";

interface KpiCardsWidgetProps {
    data: DashboardKpiResponse | null;
    isLoading: boolean;
}

export const KpiCardsWidget: React.FC<KpiCardsWidgetProps> = ({
    data,
    isLoading,
}) => {
    if (isLoading || !data) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse flex items-center gap-4"
                    >
                        <div className="h-12 w-12 bg-gray-200 rounded-xl shrink-0"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Helper render chỉ số tăng trưởng
    const renderTrend = (trend: number) => {
        if (trend > 0) {
            return (
                <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    <TrendingUp size={14} className="mr-1" />+{trend}%
                </div>
            );
        }
        if (trend < 0) {
            return (
                <div className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                    <TrendingDown size={14} className="mr-1" />
                    {trend}%
                </div>
            );
        }
        return (
            <div className="flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                <Minus size={14} className="mr-1" />
                0%
            </div>
        );
    };

    const cards = [
        {
            title: "Tổng số Giải đấu",
            value: data.totalTournaments.value,
            trend: data.totalTournaments.trend,
            icon: Trophy,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Tài khoản người dùng",
            value: data.totalUsers.value,
            trend: data.totalUsers.trend,
            icon: Shield,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Câu lạc bộ",
            value: data.totalClubs.value,
            trend: data.totalClubs.trend,
            icon: Users,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
        },
        {
            title: "Trận đấu đã diễn ra",
            value: data.totalMatchesPlayed.value,
            trend: data.totalMatchesPlayed.trend,
            icon: PlayCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    "h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                    card.bgColor,
                                    card.color,
                                )}
                            >
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    {card.title}
                                </p>
                                <h4 className="text-2xl font-bold text-gray-900 leading-none">
                                    {new Intl.NumberFormat("vi-VN").format(
                                        card.value,
                                    )}
                                </h4>
                            </div>
                        </div>
                        <div className="self-start">
                            {renderTrend(card.trend)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
