import React from "react";
import {
    Trophy,
    RefreshCw,
    AlertTriangle,
    Clock,
    Activity,
    Zap,
} from "lucide-react";
import { type MatchDetailResponse } from "../../types/matchAction";
import { cn } from "@/utils/classNames";

export interface MatchEventConfigDto {
    actionCode: string;
    actionName: string;
    category: "SCORE" | "PENALTY" | "SUBSTITUTION" | "NEUTRAL";
}

interface LiveActionBoardProps {
    match: MatchDetailResponse;
    onActionClick: (actionCode: string) => void;
    allowedActions?: MatchEventConfigDto[];
}

export const LiveActionBoard: React.FC<LiveActionBoardProps> = ({
    match,
    onActionClick,
    allowedActions = [],
}) => {
    const getStyleByCategory = (category: string) => {
        switch (category) {
            case "SCORE":
                return {
                    icon: Trophy,
                    className:
                        "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200",
                    colSpan: 2,
                };
            case "PENALTY":
                return {
                    icon: AlertTriangle,
                    className:
                        "bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-100",
                    colSpan: 1,
                };
            case "SUBSTITUTION":
                return {
                    icon: RefreshCw,
                    className:
                        "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100",
                    colSpan: 1,
                };
            case "NEUTRAL":
            default:
                return {
                    icon: Clock,
                    className:
                        "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100",
                    colSpan: 1,
                };
        }
    };

    const displayActions: MatchEventConfigDto[] =
        allowedActions.length > 0
            ? allowedActions
            : [
                  {
                      actionCode: "SCORE",
                      actionName: "Ghi điểm",
                      category: "SCORE",
                  },
                  {
                      actionCode: "FOUL",
                      actionName: "Lỗi / Cảnh cáo",
                      category: "PENALTY",
                  },
                  {
                      actionCode: "SUB",
                      actionName: "Thay người",
                      category: "SUBSTITUTION",
                  },
                  {
                      actionCode: "TIME",
                      actionName: "Hội ý",
                      category: "NEUTRAL",
                  },
              ];

    return (
        <div className="animate-in fade-in duration-500 flex flex-col h-full">
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                {displayActions.map((action) => {
                    const style = getStyleByCategory(action.category);
                    const Icon = style.icon;

                    return (
                        <button
                            key={action.actionCode}
                            onClick={() => onActionClick(action.actionCode)}
                            className={cn(
                                "p-5 md:p-6 rounded-3xl flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-all",
                                style.className,
                                style.colSpan === 2
                                    ? "col-span-2 flex-row md:flex-col gap-4"
                                    : "col-span-1",
                            )}
                        >
                            <Icon
                                size={style.colSpan === 2 ? 32 : 28}
                                className="shrink-0"
                            />
                            <span
                                className={cn(
                                    "font-black uppercase tracking-wider",
                                    style.colSpan === 2
                                        ? "text-lg md:text-xl"
                                        : "text-sm md:text-base text-center leading-tight",
                                )}
                            >
                                {action.actionName}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Zap size={16} className="text-blue-500" />
                        Nhật ký sự kiện
                    </h3>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        Mới nhất
                    </span>
                </div>

                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Activity size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">Trận đấu vừa bắt đầu</p>
                    <p className="text-xs">Các sự kiện sẽ hiển thị tại đây</p>
                </div>
            </div>
        </div>
    );
};
