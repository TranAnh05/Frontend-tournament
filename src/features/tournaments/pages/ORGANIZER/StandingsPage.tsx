import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { 
    useGetStandingContext, 
    useGetStandings, 
    useGetOverallStandings 
} from '../../hooks/useGetStandings';

// Components
import { StandingSelector } from '../../components/standing/StandingSelector';
import { StandingGroupTable } from '../../components/standing/StandingGroupTable';
import { StandingSkeleton } from '../../components/standing/StandingSkeleton';
import { StandingEmptyState } from '../../components/standing/StandingEmptyState';
import { StandingViewSwitcher, type StandingViewMode } from '../../components/standing/StandingViewSwitcher';
import { OverallStandingTable } from '../../components/standing/OverallStandingTable';

export const StandingsPage = () => {
    // --- 1. QUẢN LÝ STATE ---
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<StandingViewMode>('GROUP');

    // --- 2. LẤY DỮ LIỆU CONTEXT (Danh sách giải đấu) ---
    const { 
        data: contextTournaments, 
        isLoading: isContextLoading 
    } = useGetStandingContext();

    // --- 3. LOGIC TỰ ĐỘNG CHỌN GIẢI ---
    useEffect(() => {
        if (contextTournaments && contextTournaments.length > 0 && !selectedId) {
            setSelectedId(contextTournaments[0].id);
        }
    }, [contextTournaments, selectedId]);

    // --- 4. LẤY THÔNG TIN GIẢI ĐẤU ĐANG CHỌN (Để lấy Sport Name) ---
    const selectedTournament = useMemo(() => {
        return contextTournaments?.find(t => t.id === selectedId) || null;
    }, [contextTournaments, selectedId]);

    // --- 5. GỌI API THEO GIẢI ĐẤU ĐANG CHỌN ---
    const groupStanding = useGetStandings(selectedId);
    const overallStanding = useGetOverallStandings(selectedId);

    // Xác định các biến trạng thái dựa trên Tab đang đứng (viewMode)
    const isLoading = viewMode === 'GROUP' ? groupStanding.isLoading : overallStanding.isLoading;
    const isFetching = viewMode === 'GROUP' ? groupStanding.isFetching : overallStanding.isFetching;
    const refetch = viewMode === 'GROUP' ? groupStanding.refetch : overallStanding.refetch;

    return (
        <div className="animate-in fade-in duration-700 pb-10">
            {/* --- SECTION 1: HEADER TRANG --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        Bảng xếp hạng hệ thống
                    </h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                        Cập nhật kết quả và thứ hạng theo thời gian thực cho mọi môn thể thao.
                    </p>
                </div>

                {selectedId && (
                    <button
                        onClick={refetch}
                        disabled={isLoading || isFetching}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={isFetching ? "animate-spin text-blue-600" : "text-gray-500"} />
                        {isFetching ? "Đang đồng bộ..." : "Làm mới dữ liệu"}
                    </button>
                )}
            </div>

            {/* --- SECTION 2: BỘ CHỌN GIẢI ĐẤU (SEARCHABLE DROPDOWN) --- */}
            <div className="max-w-2xl">
                {isContextLoading ? (
                    <div className="h-16 w-full bg-gray-100 rounded-2xl animate-pulse mb-8" />
                ) : (
                    <StandingSelector 
                        tournaments={contextTournaments || []} 
                        selectedId={selectedId} 
                        onSelect={setSelectedId} 
                    />
                )}
            </div>

            {/* --- SECTION 3: CHUYỂN ĐỔI CHẾ ĐỘ XEM (TABS) --- */}
            {selectedId && !isLoading && (
                <StandingViewSwitcher 
                    viewMode={viewMode} 
                    onChange={setViewMode} 
                />
            )}

            {/* --- SECTION 4: HIỂN THỊ DỮ LIỆU --- */}
            <div className="mt-4">
                {isLoading ? (
                    <StandingSkeleton />
                ) : viewMode === 'GROUP' ? (
                    // 4.1: XẾP HẠNG THEO BẢNG
                    (!selectedId || !groupStanding.data || groupStanding.data.groups.length === 0) ? (
                        <StandingEmptyState 
                            title={!selectedId ? "Bắt đầu thôi" : "Dữ liệu chưa sẵn sàng"}
                            message={!selectedId 
                                ? "Vui lòng chọn một giải đấu để xem bảng xếp hạng chi tiết." 
                                : `Giải đấu "${selectedTournament?.name}" hiện chưa có dữ liệu bảng đấu.`
                            }
                        />
                    ) : (
                        <div className="space-y-10">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                    {groupStanding.data.tournamentName}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                                {groupStanding.data.groups.map((group) => (
                                    <div key={group.groupId} className="animate-in slide-in-from-bottom-4 duration-500">
                                        <StandingGroupTable 
                                            groupData={group} 
                                            sportName={selectedTournament?.sportName || ''} // 🌟 Truyền SportName để đổi tên cột
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ) : (
                    // 4.2: BẢNG TỔNG SẮP CHUNG CUỘC
                    (!selectedId || !overallStanding.data || overallStanding.data.rankings.length === 0) ? (
                        <StandingEmptyState 
                            title="Chưa có bảng tổng sắp"
                            message={`Giải đấu "${selectedTournament?.name}" hiện chưa có dữ liệu để tính toán bảng chung cuộc.`}
                        />
                    ) : (
                        <div className="space-y-10">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                    Bảng tổng sắp chung cuộc: {overallStanding.data.tournamentName}
                                </h2>
                            </div>

                            <OverallStandingTable 
                                data={overallStanding.data} 
                                sportName={selectedTournament?.sportName || ''} // 🌟 Truyền SportName để đổi tên cột
                            />
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default StandingsPage;