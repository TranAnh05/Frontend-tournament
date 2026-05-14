import React from 'react';
import { Medal, Shield, Info } from 'lucide-react';
import { type OverallStandingResponse, type ClubOverallStandingDto } from '../../types/standing';
import { cn } from '@/utils/classNames';

interface OverallStandingTableProps {
    data: OverallStandingResponse;
    sportName?: string; // 🌟 THÊM MỚI: Nhận tên môn thể thao
}

export const OverallStandingTable: React.FC<OverallStandingTableProps> = ({ 
    data, 
    sportName = '' 
}) => {
    
    // ==========================================
    // 🌟 LOGIC ĐỘNG: XỬ LÝ ĐA MÔN THỂ THAO
    // ==========================================
    const lowerSportName = sportName.toLowerCase();
    
    // Nhóm các môn tính điểm / không có tỷ số hòa
    const isNetSport = lowerSportName.includes('cầu lông') || 
                       lowerSportName.includes('tennis') || 
                       lowerSportName.includes('quần vợt') || 
                       lowerSportName.includes('bóng bàn') || 
                       lowerSportName.includes('bóng chuyền');
    const isBasketball = lowerSportName.includes('bóng rổ');

    // Cài đặt hiển thị tiêu đề cột
    const hideDrawColumn = isNetSport || isBasketball;
    const winLossHeader = hideDrawColumn ? "T - B" : "T - H - B";
    const scoreHeader = hideDrawColumn ? "Điểm ghi/mất" : "Bàn thắng/thua";

    // ==========================================
    // UI HELPERS
    // ==========================================
    const renderRank = (rank: number) => {
        if (rank === 1) return <Medal size={22} className="text-yellow-500 drop-shadow-sm" />;
        if (rank === 2) return <Medal size={22} className="text-slate-400 drop-shadow-sm" />;
        if (rank === 3) return <Medal size={22} className="text-amber-600 drop-shadow-sm" />;
        return <span className="font-bold text-gray-400">{rank}</span>;
    };

    const renderClubLogo = (club: ClubOverallStandingDto) => {
        if (club.logoUrl) {
            return <img src={club.logoUrl} alt={club.clubName} className="w-8 h-8 object-cover rounded-full border border-gray-100 shadow-sm" />;
        }
        return (
            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-300">
                <Shield size={16} />
            </div>
        );
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            {/* Header thông báo */}
            <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex items-center gap-2">
                <Info size={16} className="text-blue-600" />
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Bảng tổng sắp toàn giải đấu: {data.tournamentName}
                </p>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-white text-gray-500 text-[11px] uppercase tracking-widest font-black border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-5 text-center w-20">Thứ hạng</th>
                            <th className="px-4 py-5">Câu lạc bộ</th>
                            <th className="px-4 py-5 text-center">Vòng đạt tới</th>
                            <th className="px-3 py-5 text-center">Trận</th>
                            <th className="px-3 py-5 text-center">{winLossHeader}</th>
                            <th className="px-3 py-5 text-center hidden md:table-cell">{scoreHeader}</th>
                            <th className="px-3 py-5 text-center">Hiệu số</th>
                            <th className="px-6 py-5 text-center text-blue-700 bg-blue-50/30">Tổng điểm</th>
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
                                    className="hover:bg-blue-50/40 transition-colors group"
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
                                            <span className="font-black text-gray-900 group-hover:text-blue-700 transition-colors">
                                                {club.clubName}
                                            </span>
                                        </div>
                                    </td>

                                    {/* VÒNG ĐẤU CAO NHẤT */}
                                    <td className="px-4 py-4 text-center">
                                        <span className={cn(
                                            "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                                            club.overallRank === 1 
                                                ? "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-sm" 
                                                : "bg-gray-50 text-gray-600 border-gray-200"
                                        )}>
                                            {club.highestStageName}
                                        </span>
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
                                    <td className="px-6 py-4 text-center bg-blue-50/20">
                                        <span className="text-lg font-black text-blue-700">
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
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-start gap-2">
                <span className="text-red-500 font-black text-lg leading-none">*</span>
                <p className="text-[11px] text-gray-500 font-medium">
                    Bảng xếp hạng chung cuộc được hệ thống tự động tổng hợp dựa trên thành tích (Tổng điểm và Hiệu số) của tất cả các trận đấu từ vòng bảng đến vòng loại trực tiếp.
                </p>
            </div>
        </div>
    );
};