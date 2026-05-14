import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useGetStandingContext, useGetStandings } from '../../hooks/useGetStandings';
import { StandingSelector } from '../../components/standing/StandingSelector';
import { StandingGroupTable } from '../../components/standing/StandingGroupTable';
import { StandingSkeleton } from '../../components/standing/StandingSkeleton';
import { StandingEmptyState } from '../../components/standing/StandingEmptyState';

export const StandingsPage = () => {
    // 1. QUẢN LÝ STATE: ID giải đấu đang được chọn
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // 2. LẤY DỮ LIỆU CONTEXT: Danh sách các giải đấu để chọn
    const { 
        data: contextTournaments, 
        isLoading: isContextLoading 
    } = useGetStandingContext();

    // 3. TỰ ĐỘNG CHỌN GIẢI ĐẦU TIÊN: Nếu có danh sách mà chưa chọn giải nào
    useEffect(() => {
        if (contextTournaments && contextTournaments.length > 0 && !selectedId) {
            setSelectedId(contextTournaments[0].id);
        }
    }, [contextTournaments, selectedId]);

    // 4. LẤY DỮ LIỆU CHI TIẾT: Bảng xếp hạng của giải đang chọn
    const { 
        data: standingData, 
        isLoading: isStandingLoading, 
        isFetching, 
        refetch 
    } = useGetStandings(selectedId);

    // Tìm tên giải đấu đang chọn để hiển thị tiêu đề
    const selectedTournamentName = contextTournaments?.find(t => t.id === selectedId)?.name;

    return (
        <div className="animate-in fade-in duration-700 pb-10">
            {/* --- SECTION 1: HEADER TRANG --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        Bảng xếp hạng hệ thống
                    </h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                        Theo dõi và cập nhật thứ hạng các câu lạc bộ trong thời gian thực.
                    </p>
                </div>

                {selectedId && (
                    <button
                        onClick={refetch}
                        disabled={isStandingLoading || isFetching}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={isFetching ? "animate-spin text-blue-600" : "text-gray-500"} />
                        {isFetching ? "Đang cập nhật..." : "Làm mới dữ liệu"}
                    </button>
                )}
            </div>

            {/* --- SECTION 2: BỘ CHỌN GIẢI ĐẤU (CONTEXT) --- */}
            {isContextLoading ? (
                <div className="flex gap-3 overflow-hidden mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-[220px] h-24 bg-gray-100 rounded-2xl animate-pulse shrink-0" />
                    ))}
                </div>
            ) : (
                <StandingSelector 
                    tournaments={contextTournaments} 
                    selectedId={selectedId} 
                    onSelect={setSelectedId} 
                />
            )}

            {/* --- SECTION 3: HIỂN THỊ DỮ LIỆU BẢNG XẾP HẠNG --- */}
            <div className="mt-4">
                {/* 3.1: Đang tải dữ liệu chi tiết */}
                {isStandingLoading ? (
                    <StandingSkeleton />
                ) : 
                
                /* 3.2: Trường hợp chưa chọn giải hoặc giải chưa có dữ liệu */
                (!selectedId || !standingData || standingData.groups.length === 0) ? (
                    <StandingEmptyState 
                        title={!selectedId ? "Chào mừng bạn" : "Chưa có bảng đấu"}
                        message={!selectedId 
                            ? "Vui lòng chọn một giải đấu phía trên để bắt đầu xem chi tiết thứ hạng." 
                            : `Giải đấu "${selectedTournamentName}" hiện tại chưa được chia bảng hoặc chưa có trận đấu nào diễn ra.`
                        }
                    />
                ) : (
                    /* 3.3: Hiển thị danh sách các bảng đấu (Grid layout) */
                    <div className="space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                {standingData.tournamentName}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                            {standingData.groups.map((group) => (
                                <div key={group.groupId} className="animate-in slide-in-from-bottom-4 duration-500">
                                    <StandingGroupTable groupData={group} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default StandingsPage;