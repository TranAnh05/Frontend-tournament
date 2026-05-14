import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Trophy, Activity, CheckCircle2, CircleDashed, ChevronDown,} from 'lucide-react';
import { type TournamentLookupResponse } from '../../types/standing';
import { cn } from '@/utils/classNames';

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
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Xử lý sự kiện click ra ngoài để đóng Dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Lọc danh sách giải đấu dựa theo từ khóa tìm kiếm
    const filteredTournaments = useMemo(() => {
        if (!searchQuery.trim()) return tournaments;
        return tournaments.filter(t => 
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.sportName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tournaments, searchQuery]);

    // Tìm giải đấu đang được chọn để hiển thị trên nút bấm
    const selectedTournament = useMemo(() => {
        return tournaments.find(t => t.id === selectedId) || null;
    }, [tournaments, selectedId]);

    // Hàm phụ: Chọn Icon môn thể thao
    const renderSportIcon = (sportName: string, size = 16) => {
        const lowerName = sportName.toLowerCase();
        if (lowerName.includes('cầu lông') || lowerName.includes('tennis') || lowerName.includes('bóng bàn')) {
            return <Activity size={size} />;
        }
        return <Trophy size={size} />; 
    };

    if (!tournaments || tournaments.length === 0) {
        return null;
    }

    return (
        <div className="mb-8 relative max-w-lg" ref={dropdownRef}>
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                Chọn giải đấu
            </label>
            
            {/* 🌟 NÚT BẤM KÍCH HOẠT DROPDOWN */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full bg-white border-2 flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20",
                    isOpen ? "border-blue-500" : "border-gray-200 hover:border-blue-300"
                )}
            >
                {selectedTournament ? (
                    <div className="flex items-center gap-3 text-left overflow-hidden">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            {renderSportIcon(selectedTournament.sportName, 20)}
                        </div>
                        <div className="truncate">
                            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">
                                {selectedTournament.sportName}
                            </p>
                            <p className="text-base font-black text-gray-900 truncate">
                                {selectedTournament.name}
                            </p>
                        </div>
                    </div>
                ) : (
                    <span className="text-gray-400 font-medium ml-2">Vui lòng tìm và chọn giải đấu...</span>
                )}
                <ChevronDown size={20} className={cn("text-gray-400 transition-transform duration-300 shrink-0", isOpen && "rotate-180 text-blue-600")} />
            </button>

            {/* 🌟 DANH SÁCH DROPDOWN BỊ ẨN/HIỆN */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Lưới danh sách giải đấu */}
                    <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2">
                        {filteredTournaments.length === 0 ? (
                            <div className="py-8 text-center text-gray-500 text-sm font-medium">
                                Không tìm thấy giải đấu nào phù hợp.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                {filteredTournaments.map((tournament) => {
                                    const isSelected = tournament.id === selectedId;
                                    const isFinished = tournament.status === 'FINISHED' || tournament.status === 'FINALIZED';

                                    return (
                                        <button
                                            key={tournament.id}
                                            onClick={() => {
                                                onSelect(tournament.id);
                                                setIsOpen(false);
                                                setSearchQuery(''); // Reset ô tìm kiếm sau khi chọn
                                            }}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-xl text-left transition-all",
                                                isSelected ? "bg-blue-50/80" : "hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden pr-4">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                                    isSelected ? "bg-blue-100 border-blue-200 text-blue-700" : "bg-gray-100 border-gray-200 text-gray-500"
                                                )}>
                                                    {renderSportIcon(tournament.sportName)}
                                                </div>
                                                <div className="truncate">
                                                    <h4 className={cn(
                                                        "text-sm font-bold truncate",
                                                        isSelected ? "text-blue-900" : "text-gray-800"
                                                    )}>
                                                        {tournament.name}
                                                    </h4>
                                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
                                                        {tournament.sportName}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Trạng thái */}
                                            <div className="shrink-0 flex items-center">
                                                {isFinished ? (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                                        <CheckCircle2 size={12} /> Đã xong
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                                                        <CircleDashed size={12} className={isSelected ? "animate-spin-slow" : ""} /> Đang đá
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};