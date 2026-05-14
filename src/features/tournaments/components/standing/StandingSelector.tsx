import React from 'react';
import { Trophy, Activity, CheckCircle2, CircleDashed } from 'lucide-react';
import { type TournamentLookupResponse } from '../../types/standing';

interface StandingSelectorProps {
    tournaments: TournamentLookupResponse[];
    selectedId: number | null;
    onSelect: (id: number) => void;
}

export const StandingSelector: React.FC<StandingSelectorProps> = ({ 
    tournaments, 
    selectedId, 
    onSelect 
}) => {
    if (!tournaments || tournaments.length === 0) {
        return null;
    }

    // Hàm phụ: Chọn Icon phù hợp dựa theo tên môn thể thao
    const renderSportIcon = (sportName: string) => {
        const lowerName = sportName.toLowerCase();
        if (lowerName.includes('cầu lông') || lowerName.includes('tennis')) {
            return <Activity size={16} />;
        }
        return <Trophy size={16} />; // Mặc định là Cúp (Dùng cho Bóng đá, Bóng rổ...)
    };

    return (
        <div className="mb-6 relative">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
                Chọn giải đấu
            </h3>
            
            {/* Vùng cuộn ngang ẩn scrollbar trên thiết bị di động */}
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
                {tournaments.map((tournament) => {
                    const isSelected = tournament.id === selectedId;
                    const isFinished = tournament.status === 'FINISHED' || tournament.status === 'FINALIZED';

                    return (
                        <button
                            key={tournament.id}
                            onClick={() => onSelect(tournament.id)}
                            className={`
                                snap-start shrink-0 flex flex-col gap-2 p-3 rounded-2xl border-2 transition-all duration-200 min-w-[200px] max-w-[260px] text-left
                                ${isSelected 
                                    ? 'border-blue-600 bg-blue-50 shadow-md transform -translate-y-0.5' 
                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between w-full">
                                <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                    isSelected ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {renderSportIcon(tournament.sportName)}
                                    {tournament.sportName}
                                </span>

                                {/* Trạng thái giải đấu */}
                                {isFinished ? (
                                    <CheckCircle2 size={16} className={isSelected ? 'text-blue-600' : 'text-green-500'} />
                                ) : (
                                    <CircleDashed size={16} className={isSelected ? 'text-blue-600 animate-spin-slow' : 'text-orange-400'} />
                                )}
                            </div>
                            
                            <span className={`text-sm font-bold line-clamp-2 mt-1 leading-snug ${
                                isSelected ? 'text-blue-900' : 'text-gray-800'
                            }`}>
                                {tournament.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};