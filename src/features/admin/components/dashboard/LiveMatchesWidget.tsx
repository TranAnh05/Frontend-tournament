import React from "react";
import { Clock, MapPin, Trophy, Shield } from "lucide-react";
import { type LiveMatchResponse } from "../../types/dashboard";

interface LiveMatchesWidgetProps {
    data: LiveMatchResponse[];
    isLoading: boolean;
}

export const LiveMatchesWidget: React.FC<LiveMatchesWidgetProps> = ({
    data,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Trận đấu nổi bật
                </h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-24 bg-gray-50 rounded-xl animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Trophy size={20} className="text-blue-600" />
                    Trận đấu nổi bật
                </h3>
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                    {data.length} trận
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {data.length > 0 ? (
                    data.map((match) => {
                        const isLive = match.status === "IN_PROGRESS";

                        return (
                            <div
                                key={match.matchId}
                                className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all group"
                            >
                                {/* Header của thẻ */}
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider line-clamp-1">
                                        {match.tournamentName}
                                    </span>
                                    {isLive ? (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md animate-pulse">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                            LIVE{" "}
                                            {match.liveMinute
                                                ? `${match.liveMinute}'`
                                                : ""}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                            <Clock size={12} />{" "}
                                            {new Date(
                                                match.startTime,
                                            ).toLocaleTimeString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    )}
                                </div>

                                {/* Main VS Body */}
                                <div className="flex items-center justify-between">
                                    {/* Đội Nhà */}
                                    <div className="flex flex-col items-center gap-1 w-1/3">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                                            {match.homeTeam.logoUrl ? (
                                                <img
                                                    src={match.homeTeam.logoUrl}
                                                    alt={match.homeTeam.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Shield
                                                    size={20}
                                                    className="text-gray-400"
                                                />
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 text-center line-clamp-1">
                                            {match.homeTeam.name}
                                        </span>
                                    </div>

                                    {/* Điểm số / VS */}
                                    <div className="flex flex-col items-center justify-center w-1/3">
                                        {isLive ||
                                        match.status === "FINISHED" ? (
                                            <div className="text-2xl font-black text-gray-900 tracking-widest">
                                                {match.homeTeam.score} -{" "}
                                                {match.awayTeam.score}
                                            </div>
                                        ) : (
                                            <div className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
                                                VS
                                            </div>
                                        )}
                                    </div>

                                    {/* Đội Khách */}
                                    <div className="flex flex-col items-center gap-1 w-1/3">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                                            {match.awayTeam.logoUrl ? (
                                                <img
                                                    src={match.awayTeam.logoUrl}
                                                    alt={match.awayTeam.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Shield
                                                    size={20}
                                                    className="text-gray-400"
                                                />
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 text-center line-clamp-1">
                                            {match.awayTeam.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer của thẻ */}
                                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        <span className="line-clamp-1">
                                            {match.venueName}
                                        </span>
                                    </div>
                                    <span>{match.sportName}</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 italic py-10">
                        <Trophy size={40} className="text-gray-200 mb-2" />
                        <p>Không có trận đấu nào đang diễn ra.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
