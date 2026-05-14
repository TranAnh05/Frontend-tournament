import React from "react";
import { type MatchDetailResponse } from "../../types/matchAction";
import { Clock, Shield, Lock } from "lucide-react";

interface MatchScoreboardProps {
    match: MatchDetailResponse;
    timer: any;
}

export const MatchScoreboard: React.FC<MatchScoreboardProps> = ({
    match,
    timer,
}) => {
    const { displayTime, periodName, currentPeriod, matchState } = timer;
    const isLive = match.status === "IN_PROGRESS";
    
    // 🌟 PHÂN NHÁNH LOGIC: Xác định loại đồng hồ/thể thức của môn
    const isSetBased = match.sportRules?.CLOCK_TYPE === "SET_BASED";

    const renderStatusBadge = () => {
        if (match.status === "IN_PROGRESS") {
            if (matchState === "WAITING_START") {
                return (
                    <span className="text-xs font-bold whitespace-nowrap text-orange-600 bg-orange-50 px-3 py-2 rounded-md border border-orange-100 shadow-sm">
                        CHỜ BẮT ĐẦU {periodName.toUpperCase()} {currentPeriod}
                    </span>
                );
            }
            if (matchState === "HALFTIME") {
                return (
                    <span className="text-xs font-bold whitespace-nowrap text-blue-600 bg-blue-50 px-3 py-2 rounded-md border border-blue-100 shadow-sm">
                        NGHỈ GIỮA {periodName.toUpperCase()}
                    </span>
                );
            }

            return (
                <span className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-100 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    ĐANG DIỄN RA
                </span>
            );
        }

        switch (match.status) {
            case "FINALIZED":
                return (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 px-3 py-2 rounded-md whitespace-nowrap shadow-md">
                        <Lock size={12} />
                        ĐÃ CHỐT SỔ
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
                        CHỜ KÝ DUYỆT
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                    {/* Đội Nhà */}
                    <div className="flex flex-col items-center w-full sm:w-1/3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden mb-1 shadow-sm">
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

                    {/* KHU VỰC TỶ SỐ (CENTER SCORE AREA) */}
                    <div className="flex flex-col items-center justify-center w-full sm:w-1/3">
                        
                        {/* 1. Tỷ số Tổng (Match Score) */}
                        <div className="text-3xl font-black text-gray-900 tracking-widest bg-gray-50 px-4 py-1.5 rounded-xl border border-gray-100 shadow-sm relative">
                            {match.homeTeam.matchScore || 0} - {match.awayTeam.matchScore || 0}
                            
                            {/* Chú thích nhỏ trên đầu nếu là dạng Set */}
                            {isSetBased && (
                                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap">
                                    Tỷ số Set
                                </span>
                            )}
                        </div>

                        {/* 2. Hiển thị UI đặc thù cho các môn đánh theo Set (Cầu lông, Bóng bàn) */}
                        {isSetBased && (
                            <div className="mt-2.5 flex flex-col items-center w-full">
                                {/* Tỷ số Set hiện tại đang đánh */}
                                {isLive && matchState !== "WAITING_START" && matchState !== "HALFTIME" && (
                                    <div className="text-2xl font-bold text-blue-600 tracking-wider leading-none mb-2">
                                        {match.homeTeam.currentPeriodScore || 0} <span className="text-gray-300 mx-1">:</span> {match.awayTeam.currentPeriodScore || 0}
                                    </div>
                                )}

                                {/* Lịch sử các Set đã/đang đánh (Period Scores) */}
                                {match.periodScores && match.periodScores.length > 0 && (
                                    <div className="flex flex-wrap justify-center gap-1.5 mb-1.5">
                                        {match.periodScores.map((ps, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`flex flex-col items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    ps.isFinished 
                                                        ? "bg-gray-100 text-gray-500 border border-gray-200" // Set cũ
                                                        : "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" // Set hiện tại
                                                }`}
                                                title={ps.periodName}
                                            >
                                                <span>{ps.homeScore}-{ps.awayScore}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. Vùng hiển thị Giờ / Thông tin Hiệp đấu */}
                        <div className="bg-gray-900 text-white px-4 py-1.5 rounded-lg flex flex-col items-center shadow-inner mt-2 w-max">
                            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest leading-none mb-1">
                                {periodName} {currentPeriod}
                            </span>
                            <span className="font-mono text-lg font-black leading-none tracking-wider">
                                {displayTime}
                            </span>
                        </div>

                        {/* Chỉ hiện giờ dự kiến khi trận đấu chưa bắt đầu */}
                        {!isLive && match.status === "SCHEDULED" && (
                            <span className="text-xs font-medium text-gray-500 mt-2 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                <Clock size={12} className="text-gray-400" />
                                Dự kiến: {new Date(match.scheduledTime).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        )}
                    </div>

                    {/* Đội Khách */}
                    <div className="flex flex-col items-center w-full sm:w-1/3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden mb-1 shadow-sm">
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