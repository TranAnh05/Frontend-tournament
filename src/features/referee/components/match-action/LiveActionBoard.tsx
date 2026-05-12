import React, { useState } from "react";
import {
    Trophy,
    PlusCircle,
    ShieldAlert,
    AlertTriangle,
    UserMinus,
    RefreshCw,
    Clock,
    Activity,
    Video,
    Zap,
    Play,
    Flag,
    PlayCircle,
    StopCircle,
    PauseCircle,
    ArrowDownRight,
    ArrowUpRight,
} from "lucide-react";
import {
    type MatchDetailResponse,
    type MatchEventDto,
} from "../../types/matchAction";
import { cn } from "@/utils/classNames";

interface LiveActionBoardProps {
    match: MatchDetailResponse;
    timer: any;
    onActionClick: (actionCode: string) => void;
}

const EVENT_UI_MAPPING: Record<
    string,
    { label: string; icon: any; className: string; colSpan: number }
> = {
    START_MATCH: {
        label: "Khởi cuộc",
        icon: Flag,
        className: "bg-blue-100 text-blue-700 border border-blue-200",
        colSpan: 1,
    },
    START_PERIOD: {
        label: "Bắt đầu hiệp",
        icon: PlayCircle,
        className: "bg-green-100 text-green-700 border border-green-200",
        colSpan: 1,
    },
    END_PERIOD: {
        label: "Kết thúc hiệp",
        icon: StopCircle,
        className: "bg-gray-100 text-gray-700 border border-gray-200",
        colSpan: 1,
    },
    PAUSE_MATCH: {
        label: "Tạm dừng trận",
        icon: PauseCircle,
        className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
        colSpan: 1,
    },
    RESUME_MATCH: {
        label: "Tiếp tục trận",
        icon: PlayCircle,
        className: "bg-green-100 text-green-700 border border-green-200",
        colSpan: 1,
    },
    GOAL: {
        label: "+1 Điểm / Ghi bàn",
        icon: Trophy,
        className:
            "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200",
        colSpan: 2,
    },
    PT_2: {
        label: "+2 Điểm",
        icon: PlusCircle,
        className:
            "bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-100",
        colSpan: 1,
    },
    PT_3: {
        label: "+3 Điểm",
        icon: PlusCircle,
        className:
            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200",
        colSpan: 1,
    },
    OWN_GOAL: {
        label: "Phản lưới nhà",
        icon: ShieldAlert,
        className: "bg-gray-800 text-white hover:bg-gray-900 shadow-md",
        colSpan: 2,
    },
    FOUL: {
        label: "Phạm lỗi",
        icon: AlertTriangle,
        className:
            "bg-orange-50 text-orange-700 border-2 border-orange-200 hover:bg-orange-100",
        colSpan: 1,
    },
    YELLOW_CARD: {
        label: "Thẻ vàng",
        icon: AlertTriangle,
        className:
            "bg-yellow-400 text-yellow-900 border-2 border-yellow-500 hover:bg-yellow-500 shadow-sm",
        colSpan: 1,
    },
    RED_CARD: {
        label: "Thẻ đỏ",
        icon: UserMinus,
        className:
            "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200",
        colSpan: 1,
    },
    SUBSTITUTION: {
        label: "Thay người",
        icon: RefreshCw,
        className:
            "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100",
        colSpan: 1,
    },
    TIMEOUT: {
        label: "Hội ý",
        icon: Clock,
        className:
            "bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100",
        colSpan: 1,
    },
    INJURY: {
        label: "Chấn thương",
        icon: Activity,
        className:
            "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100",
        colSpan: 1,
    },
    VAR_CHALLENGE: {
        label: "Dừng trận / VAR",
        icon: Video,
        className: "bg-slate-700 text-white hover:bg-slate-800 shadow-md",
        colSpan: 2,
    },
};

const DEFAULT_EVENT_UI = {
    label: "Sự kiện khác",
    icon: Zap,
    className: "bg-gray-100 text-gray-800 border border-gray-300",
    colSpan: 1,
};

export const LiveActionBoard: React.FC<LiveActionBoardProps> = ({
    match,
    timer,
    onActionClick,
}) => {
    const { periodName, currentPeriod, matchState } = timer;

    // STATE CHO MODAL XÁC NHẬN KẾT THÚC HIỆP
    const [isEndPeriodModalOpen, setIsEndPeriodModalOpen] = useState(false);

    const allowedEventsStr = match.sportRules?.ALLOWED_EVENTS || "";
    const activeEventCodes = allowedEventsStr.split(",").filter(Boolean);

    const handleFireEvent = (actionCode: string) => {
        onActionClick(actionCode);
    };

    return (
        <div className="animate-in fade-in duration-500 flex flex-col h-full relative">
            {(matchState === "WAITING_START" ||
                matchState === "HALFTIME" ||
                matchState === "FULL_TIME") && (
                <div className="mb-6 p-8 bg-blue-50 rounded-3xl border-2 border-blue-200 flex flex-col items-center justify-center gap-4 shadow-sm">
                    {matchState === "FULL_TIME" ? (
                        <div className="text-center animate-in zoom-in-95 duration-300">
                            <h2 className="text-xl font-black text-blue-900 mb-2">
                                Đã hoàn thành {match.sportRules?.PERIODS || 2}{" "}
                                {periodName.toLowerCase()} thi đấu
                            </h2>
                            <p className="text-sm font-medium text-blue-700 mb-6 bg-white py-2 px-4 rounded-xl shadow-sm border border-blue-100 inline-block">
                                Vui lòng bấm{" "}
                                <strong className="text-red-600">
                                    KẾT THÚC TRẬN ĐẤU
                                </strong>{" "}
                                ở thanh công cụ bên dưới.
                            </p>

                            {/* Nếu luật có cho phép đá bù giờ, hiện thêm nút tùy chọn */}
                            {match.sportRules?.OVERTIME_ALLOWED === "YES" && (
                                <button
                                    onClick={() =>
                                        handleFireEvent("START_PERIOD")
                                    }
                                    className="px-6 py-3 bg-white hover:bg-gray-50 text-blue-700 border-2 border-blue-200 font-bold rounded-2xl shadow-sm transition-transform active:scale-95 flex items-center gap-2 mx-auto"
                                >
                                    <PlayCircle size={20} />
                                    BẮT ĐẦU HIỆP PHỤ (HIỆP {currentPeriod})
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-blue-900 text-center">
                                {matchState === "WAITING_START"
                                    ? `Trận đấu đã sẵn sàng`
                                    : `Nghỉ giữa ${periodName.toLowerCase()}`}
                            </h2>
                            <button
                                onClick={() => handleFireEvent("START_PERIOD")}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-2xl shadow-lg shadow-blue-200 transition-transform active:scale-95 flex items-center gap-2"
                            >
                                <Play size={24} className="fill-current" />
                                BẮT ĐẦU {periodName.toUpperCase()}{" "}
                                {currentPeriod}
                            </button>
                        </>
                    )}
                </div>
            )}

            {matchState === "PLAYING" && (
                <div className="flex flex-col gap-4 mb-6">
                    {/* NÚT KẾT THÚC HIỆP */}
                    <div className="pb-2 border-b border-gray-100 border-dashed animate-in slide-in-from-top-2">
                        <button
                            onClick={() => setIsEndPeriodModalOpen(true)}
                            className={cn(
                                "w-full py-4 text-white font-black text-lg rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2",
                                timer.displayTime === "00:00"
                                    ? "bg-red-600 hover:bg-red-700 shadow-red-200 animate-pulse"
                                    : "bg-gray-800 hover:bg-gray-900 shadow-gray-200",
                            )}
                        >
                            <StopCircle
                                size={24}
                                className="fill-current opacity-80"
                            />
                            KẾT THÚC {periodName.toUpperCase()} {currentPeriod}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {activeEventCodes.length > 0 ? (
                            activeEventCodes.map((code) => {
                                const style = EVENT_UI_MAPPING[code] || {
                                    ...DEFAULT_EVENT_UI,
                                    label: code,
                                };
                                const Icon = style.icon;

                                return (
                                    <button
                                        key={code}
                                        onClick={() => handleFireEvent(code)}
                                        className={cn(
                                            "p-4 md:p-5 rounded-3xl flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-all",
                                            style.className,
                                            style.colSpan === 2
                                                ? "col-span-2 md:col-span-2"
                                                : "col-span-1 md:col-span-1",
                                        )}
                                    >
                                        <Icon
                                            size={style.colSpan === 2 ? 28 : 24}
                                            className="shrink-0"
                                        />
                                        <span
                                            className={cn(
                                                "font-black uppercase tracking-wider text-center leading-tight",
                                                style.colSpan === 2
                                                    ? "text-base md:text-lg"
                                                    : "text-[11px] md:text-sm",
                                            )}
                                        >
                                            {style.label}
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="col-span-2 md:col-span-4 p-8 text-center text-gray-500 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
                                Môn thể thao này chưa được cấu hình nút sự kiện.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* NHẬT KÝ SỰ KIỆN */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2 shrink-0">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Zap size={16} className="text-blue-500" />
                        Nhật ký sự kiện
                    </h3>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {match.timeline?.length || 0} sự kiện
                    </span>
                </div>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                    {match.timeline && match.timeline.length > 0 ? (
                        [...match.timeline]
                            .reverse()
                            .map((event: MatchEventDto) => {
                                const eventUI =
                                    EVENT_UI_MAPPING[event.eventType] ||
                                    DEFAULT_EVENT_UI;
                                const LogIcon = eventUI.icon;

                                let borderClass = "border-gray-100";
                                if (event.clubId) {
                                    if (event.clubId === match.homeTeam.clubId)
                                        borderClass =
                                            "border-l-4 border-l-blue-500 border-y-gray-100 border-r-gray-100";
                                    else if (
                                        event.clubId === match.awayTeam.clubId
                                    )
                                        borderClass =
                                            "border-l-4 border-l-red-500 border-y-gray-100 border-r-gray-100";
                                }

                                const timeStr =
                                    event.eventTime === "0" || !event.eventTime
                                        ? "--:--"
                                        : event.eventTime.replace(" - ", "\n");

                                return (
                                    <div
                                        key={event.id}
                                        className={cn(
                                            "bg-gray-50 p-3 rounded-xl flex items-center gap-3 border shadow-sm",
                                            borderClass,
                                        )}
                                    >
                                        <div className="font-mono text-[11px] font-bold text-gray-500 w-[60px] md:w-[72px] shrink-0 text-right leading-tight pr-2 whitespace-pre-line">
                                            {timeStr}
                                        </div>

                                        <div
                                            className={cn(
                                                "w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                                eventUI.className,
                                            )}
                                        >
                                            <LogIcon
                                                size={16}
                                                className={
                                                    eventUI.className.includes(
                                                        "text-white",
                                                    )
                                                        ? ""
                                                        : "fill-current opacity-80"
                                                }
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            {event.eventType ===
                                            "SUBSTITUTION" ? (
                                                <div className="flex flex-col gap-1 mt-0.5">
                                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 truncate">
                                                        <ArrowDownRight
                                                            size={14}
                                                            className="text-red-500 shrink-0"
                                                        />
                                                        <span className="truncate opacity-70 line-through">
                                                            {
                                                                event.primaryAthleteName
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 truncate">
                                                        <ArrowUpRight
                                                            size={14}
                                                            className="text-green-600 shrink-0"
                                                        />
                                                        <span className="truncate">
                                                            {
                                                                event.secondaryAthleteName
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : event.primaryAthleteName ? (
                                                <>
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {
                                                            event.primaryAthleteName
                                                        }
                                                    </p>
                                                    {event.secondaryAthleteName ? (
                                                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                                            (Hỗ trợ: #
                                                            {
                                                                event.secondaryAthleteNumber
                                                            }{" "}
                                                            {
                                                                event.secondaryAthleteName
                                                            }
                                                            )
                                                        </p>
                                                    ) : (
                                                        <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">
                                                            {eventUI.label}{" "}
                                                            {event.description
                                                                ? `- ${event.description}`
                                                                : ""}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {event.description}
                                                    </p>
                                                    <p className="text-[11px] font-medium text-gray-500 truncate mt-0.5">
                                                        {eventUI.label}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400 h-full">
                            <Activity size={32} className="mb-2 opacity-30" />
                            <p className="text-sm font-medium">
                                Trận đấu chưa có sự kiện nào
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL XÁC NHẬN KẾT THÚC HIỆP */}
            {isEndPeriodModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl overflow-hidden flex flex-col scale-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                                <StopCircle
                                    size={32}
                                    className="text-red-600"
                                />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">
                                Kết thúc {periodName} {currentPeriod}?
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                                Bạn có chắc chắn muốn thổi còi kết thúc{" "}
                                {periodName.toLowerCase()} này không?
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 flex gap-3 border-t border-gray-100">
                            <button
                                onClick={() => setIsEndPeriodModalOpen(false)}
                                className="flex-1 py-3 font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    setIsEndPeriodModalOpen(false);
                                    handleFireEvent("END_PERIOD");
                                }}
                                className="flex-1 py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-md shadow-red-200 transition-colors"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
