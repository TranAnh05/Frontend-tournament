import React from 'react';
import { Shield } from 'lucide-react';
import { type GroupStandingDto, type ClubStandingDto } from '../../types/standing';

interface StandingGroupTableProps {
    groupData: GroupStandingDto;
}

export const StandingGroupTable: React.FC<StandingGroupTableProps> = ({ groupData }) => {
    
    // Hàm phụ: Hiển thị Logo CLB hoặc Icon mặc định nếu thiếu
    const renderClubLogo = (club: ClubStandingDto) => {
        if (club.logoUrl) {
            return <img src={club.logoUrl} alt={club.shortName} className="w-6 h-6 object-cover rounded-full border border-gray-200 bg-white" />;
        }
        return (
            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                <Shield size={12} className="text-gray-400" />
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            {/* Header của Bảng đấu */}
            <div className="px-5 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <h3 className="font-black text-gray-900 uppercase tracking-wide">
                    {groupData.groupName}
                </h3>
            </div>

            {/* Vùng Bảng dữ liệu có thanh cuộn ngang */}
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold">
                        <tr>
                            <th className="px-4 py-3 text-center w-12">#</th>
                            <th className="px-4 py-3">Câu lạc bộ</th>
                            <th className="px-3 py-3 text-center" title="Trận đã đấu">Tr</th>
                            <th className="px-3 py-3 text-center text-green-600" title="Thắng">T</th>
                            <th className="px-3 py-3 text-center text-gray-500" title="Hòa">H</th>
                            <th className="px-3 py-3 text-center text-red-500" title="Thua">B</th>
                            <th className="px-3 py-3 text-center hidden sm:table-cell" title="Bàn thắng">BT</th>
                            <th className="px-3 py-3 text-center hidden sm:table-cell" title="Bàn thua">SBT</th>
                            <th className="px-3 py-3 text-center" title="Hiệu số">HS</th>
                            <th className="px-4 py-3 text-center text-blue-700">Điểm</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {groupData.standings.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-4 py-8 text-center text-gray-400 text-sm">
                                    Bảng đấu chưa có dữ liệu xếp hạng
                                </td>
                            </tr>
                        ) : (
                            groupData.standings.map((club) => {
                                // Logic bôi màu nền cho Top 2 đội dẫn đầu (Vị trí đi tiếp)
                                const isTopRank = club.rank <= 2;
                                
                                return (
                                    <tr 
                                        key={club.clubId} 
                                        className={`transition-colors hover:bg-gray-50 ${isTopRank ? 'bg-green-50/30' : 'bg-white'}`}
                                    >
                                        <td className="px-4 py-3 text-center">
                                            <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-xs font-bold ${
                                                club.rank === 1 ? 'bg-blue-600 text-white shadow-sm' :
                                                club.rank === 2 ? 'bg-blue-400 text-white shadow-sm' :
                                                'text-gray-500'
                                            }`}>
                                                {club.rank}
                                            </span>
                                        </td>
                                        
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5 max-w-[200px]">
                                                {renderClubLogo(club)}
                                                <span className="font-bold text-gray-900 truncate hidden md:inline" title={club.clubName}>
                                                    {club.clubName}
                                                </span>
                                                <span className="font-bold text-gray-900 truncate md:hidden" title={club.clubName}>
                                                    {club.shortName || club.clubName}
                                                </span>
                                            </div>
                                        </td>
                                        
                                        <td className="px-3 py-3 text-center font-medium text-gray-600">{club.matchesPlayed}</td>
                                        <td className="px-3 py-3 text-center font-medium text-green-600">{club.won}</td>
                                        <td className="px-3 py-3 text-center font-medium text-gray-400">{club.drawn}</td>
                                        <td className="px-3 py-3 text-center font-medium text-red-500">{club.lost}</td>
                                        
                                        <td className="px-3 py-3 text-center text-gray-500 hidden sm:table-cell">{club.scoresFor}</td>
                                        <td className="px-3 py-3 text-center text-gray-500 hidden sm:table-cell">{club.scoresAgainst}</td>
                                        
                                        <td className="px-3 py-3 text-center font-medium">
                                            <span className={club.scoreDifference > 0 ? 'text-green-600' : club.scoreDifference < 0 ? 'text-red-500' : 'text-gray-500'}>
                                                {club.scoreDifference > 0 ? `+${club.scoreDifference}` : club.scoreDifference}
                                            </span>
                                        </td>
                                        
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-base font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                                                {club.totalPoints}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};