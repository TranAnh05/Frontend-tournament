import React from "react";
import { type MatchDetailResponse } from "../../types/matchAction";
import { Clock, Shield } from "lucide-react";

interface MatchScoreboardProps {
    match: MatchDetailResponse;
}

export const MatchScoreboard: React.FC<MatchScoreboardProps> = ({ match }) => {
    const isLive = match.status === "IN_PROGRESS";
    const renderStatusBadge = () => {
        switch (match.status) {
            case "IN_PROGRESS":
                return (
                    <span className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-100 shadow-sm"> 
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        ĐANG DIỄN RA
                    </span>
                );
            case "PAUSED":
                return (
                    <span className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap text-yellow-700 bg-yellow-50 px-3 py-2 rounded-md border border-yellow-100 shadow-sm"> 
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        TẠM DỪNG
                    </span>
                );
            case "FINISHED":
                return (
                    <span className="text-xs font-bold text-white bg-slate-600 px-3 py-2 rounded-md whitespace-nowrap shadow-sm">
                        ĐÃ KẾT THÚC
                    </span>
                );
            case "CANCELED":
                return (
                    <span className="text-xs font-bold text-gray-600 bg-gray-200 px-3 py-2 rounded-md whitespace-nowrap shadow-sm">
                        ĐÃ HỦY
                    </span>
                );
            case "SCHEDULED":
            default:
                return (
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-2 rounded-md whitespace-nowrap">
                        CHƯA BẮT ĐẦU
                    </span>
                );
        }
    };

    return (
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
            <div className="max-w-3xl mx-auto px-4 py-3">
                {/* Header nhỏ: Tên giải và Trạng thái */}
                <div className="flex justify-between items-center mb-3 gap-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider line-clamp-3">
                        {match.tournamentName}
                    </span>
                    
                    {renderStatusBadge()}
                </div>

                {/* Khối tỷ số trung tâm */}
                <div className="flex items-center justify-between">
                    {/* Đội Nhà */} 
                    <div className="flex flex-col items-center w-1/3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden mb-1">
                            {match.homeTeam.logoUrl ? (
                                <img
                                    src={match.homeTeam.logoUrl}
                                    alt={match.homeTeam.clubName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Shield size={20} className="text-gray-300" />
                            )}
                        </div>
                        <span className="text-sm font-bold text-gray-900 text-center line-clamp-3">
                            {match.homeTeam.clubName}
                        </span>
                    </div>

                    {/* Tỷ số */}
                    <div className="flex flex-col items-center justify-center w-1/3">
                        <div className="text-3xl font-black text-gray-900 tracking-widest bg-gray-50 px-4 py-1 rounded-xl">
                            {match.homeTeam.currentScore} -{" "}
                            {match.awayTeam.currentScore}
                        </div>
                        {!isLive && (
                            <span className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(
                                    match.scheduledTime,
                                ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        )}
                    </div>

                    {/* Đội Khách */}
                    <div className="flex flex-col items-center w-1/3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden mb-1">
                            {match.awayTeam.logoUrl ? (
                                <img
                                    src={match.awayTeam.logoUrl}
                                    alt={match.awayTeam.clubName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Shield size={20} className="text-gray-300" />
                            )}
                        </div>
                        <span className="text-sm font-bold text-gray-900 text-center line-clamp-3">
                            {match.awayTeam.clubName}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
