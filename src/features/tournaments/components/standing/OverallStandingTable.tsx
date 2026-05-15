import React from 'react';
import { Medal, Shield, Info, Trophy } from 'lucide-react';
import { type OverallStandingResponse, type ClubOverallStandingDto } from '../../types/standing';
import { cn } from '@/utils/classNames';

interface OverallStandingTableProps {
    data: OverallStandingResponse;
    sportName?: string;
}

export const OverallStandingTable: React.FC<OverallStandingTableProps> = ({ 
    data, 
    sportName = '' 
}) => {
    
    // ==========================================
    // 🌟 LOGIC ĐỘNG: XỬ LÝ ĐA MÔN THỂ THAO
    // ==========================================
    const lowerSportName = sportName.toLowerCase();
    
    const isNetSport = lowerSportName.includes('cầu lông') || 
                       lowerSportName.includes('tennis') || 
                       lowerSportName.includes('quần vợt') || 
                       lowerSportName.includes('bóng bàn') || 
                       lowerSportName.includes('bóng chuyền');
    const isBasketball = lowerSportName.includes('bóng rổ');

    const hideDrawColumn = isNetSport || isBasketball;
    const winLossHeader = hideDrawColumn ? "T - B" : "T - H - B";
    const scoreHeader = hideDrawColumn ? "Điểm ghi/mất" : "Bàn thắng/thua";

    // ==========================================
    // UI HELPERS
    // ==========================================
    const renderRank = (rank: number) => {
        if (rank === 1) return <Medal size={24} className="text-yellow-500 drop-shadow-md" />;
        if (rank === 2) return <Medal size={24} className="text-slate-400 drop-shadow-md" />;
        if (rank === 3) return <Medal size={24} className="text-amber-600 drop-shadow-md" />;
        return <span className="font-black text-gray-400 text-lg">{rank}</span>;
    };

    const renderClubLogo = (club: ClubOverallStandingDto) => {
        if (club.logoUrl) {
            return <img src={club.logoUrl} alt={club.clubName} className="w-9 h-9 object-cover rounded-full border-2 border-white shadow-sm" />;
        }
        return (
            <div className="w-9 h-9 rounded-full bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center text-gray-400">
                <Shield size={16} />
            </div>
        );
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            {/* Header thông báo */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                    <Trophy size={16} />
                </div>
                <p className="text-xs font-black text-slate-700 uppercase tracking-widest">
                    Bảng tổng sắp toàn giải: <span className="text-blue-700">{data.tournamentName}</span>
                </p>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-white text-gray-400 text-[10px] uppercase tracking-widest font-black border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-center w-20">Thứ hạng</th>
                            <th className="px-4 py-4">Câu lạc bộ</th>
                            <th className="px-4 py-4 text-center">Thành tích</th>
                            <th className="px-3 py-4 text-center">Trận</th>
                            <th className="px-3 py-4 text-center">{winLossHeader}</th>
                            <th className="px-3 py-4 text-center hidden md:table-cell">{scoreHeader}</th>
                            <th className="px-3 py-4 text-center">Hiệu số</th>
                            <th className="px-6 py-4 text-center text-blue-700 bg-blue-50/20">Tổng điểm</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.rankings.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-20 text-center text-gray-400 font-medium">
                                    Chưa có dữ liệu xếp hạng chung cuộc.
                                </td>
                            </tr>
                        ) : (
                            data.rankings.map((club) => (
                                <tr 
                                    key={club.clubName} 
                                    className={cn(
                                        "transition-all duration-200 group",
                                        // ✨ UI HIGHLIGHT CHO NHÀ VÔ ĐỊCH VÀ Á QUÂN
                                        club.overallRank === 1 ? "bg-gradient-to-r from-yellow-50/50 to-transparent hover:from-yellow-100/50" :
                                        club.overallRank === 2 ? "bg-gradient-to-r from-slate-50/50 to-transparent hover:from-slate-100/50" :
                                        "hover:bg-blue-50/30"
                                    )}
                                >
                                    {/* THỨ HẠNG */}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center">
                                            {renderRank(club.overallRank)}
                                        </div>
                                    </td>

                                    {/* TÊN CLB */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            {renderClubLogo(club)}
                                            <span className={cn(
                                                "font-black transition-colors",
                                                club.overallRank === 1 ? "text-yellow-700 text-base" : "text-gray-800 group-hover:text-blue-700"
                                            )}>
                                                {club.clubName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* THÀNH TÍCH ĐẠT ĐƯỢC (Badge tùy biến theo Hạng) */}
                                    <td className="px-4 py-4 text-center">
                                        {club.overallRank === 1 ? (
                                            <span className="px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm border border-yellow-500">
                                                🏆 Vô Địch
                                            </span>
                                        ) : club.overallRank === 2 ? (
                                            <span className="px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-widest bg-slate-200 text-slate-700 shadow-sm border border-slate-300">
                                                🥈 Á Quân
                                            </span>
                                        ) : club.overallRank === 3 ? (
                                            <span className="px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-widest bg-orange-100 text-orange-800 shadow-sm border border-orange-200">
                                                🥉 Hạng 3
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-200">
                                                {club.highestStageName}
                                            </span>
                                        )}
                                    </td>

                                    {/* SỐ TRẬN */}
                                    <td className="px-3 py-4 text-center font-bold text-gray-600">
                                        {club.totalMatches}
                                    </td>

                                    {/* THẮNG - HÒA - THUA */}
                                    <td className="px-3 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                                            <span className="text-green-600" title="Thắng">{club.totalWon}</span>
                                            {!hideDrawColumn && (
                                                <>
                                                    <span className="text-gray-300">-</span>
                                                    <span className="text-gray-500" title="Hòa">{club.totalDrawn}</span>
                                                </>
                                            )}
                                            <span className="text-gray-300">-</span>
                                            <span className="text-red-500" title="Thua">{club.totalLost}</span>
                                        </div>
                                    </td>

                                    {/* ĐIỂM GHI / MẤT */}
                                    <td className="px-3 py-4 text-center hidden md:table-cell text-gray-500 font-medium">
                                        {club.totalGoalsScored} <span className="text-gray-300 mx-1">-</span> {club.totalGoalsAgainst}
                                    </td>

                                    {/* HIỆU SỐ */}
                                    <td className={cn(
                                        "px-3 py-4 text-center font-black",
                                        club.totalDifference > 0 ? "text-green-600" : club.totalDifference < 0 ? "text-red-500" : "text-gray-400"
                                    )}>
                                        {club.totalDifference > 0 ? `+${club.totalDifference}` : club.totalDifference}
                                    </td>

                                    {/* TỔNG ĐIỂM */}
                                    <td className="px-6 py-4 text-center bg-blue-50/10">
                                        <span className={cn(
                                            "text-xl font-black",
                                            club.overallRank === 1 ? "text-yellow-600" : "text-blue-700"
                                        )}>
                                            {club.totalPoints}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer ghi chú */}
            <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-start gap-2">
                <span className="text-red-500 font-black text-lg leading-none">*</span>
                <p className="text-[11px] text-gray-500 font-medium">
                    Bảng xếp hạng chung cuộc được ưu tiên sắp xếp dựa trên Danh hiệu, sau đó đến Vòng đấu lọt vào, Tổng điểm và Hiệu số của toàn bộ giải đấu.
                </p>
            </div>
        </div>
    );
};