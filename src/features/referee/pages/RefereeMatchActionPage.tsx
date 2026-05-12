/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, UserPlus, CheckSquare, Square } from "lucide-react";
import { toast } from "react-toastify";
import { useGetMatchDetail } from "../hooks/match-action/useGetMatchDetail";
import { matchActionApi } from "../api/matchActionApi";
import { useMatchTimer } from '../hooks/match-action/useMatchTimer';
import { type CreateMatchEventRequest, type PlayerDto } from "../types/matchAction";
import { MatchScoreboard } from "../components/match-action/MatchScoreboard";
import { PlayerVerificationCard } from "../components/match-action/PlayerVerificationCard";
import { LiveActionBoard } from "../components/match-action/LiveActionBoard";
import { MatchControlFooter } from "../components/match-action/MatchControlFooter";
import { MatchEventModal } from "../components/match-action/MatchEventModal";
import { cn } from "@/utils/classNames";

export const RefereeMatchActionPage = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"HOME" | "AWAY">("HOME");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);
    const [isStatusChanging, setIsStatusChanging] = useState<boolean>(false);
    
    const [eventModal, setEventModal] = useState<{
        isOpen: boolean;
        eventType: string;
        eventTime: string;
    }>({ isOpen: false, eventType: '', eventTime: '' });
    const [isEventSubmitting, setIsEventSubmitting] = useState<boolean>(false);
    
    // Đổi tên để bóc tách trạng thái đang tải ngầm (isFetching)
    const { data, isLoading, isFetching, refetch } = useGetMatchDetail(Number(matchId));
    const matchTimer = useMatchTimer(data as any);

    // QUẢN LÝ DUYỆT ĐỘI HÌNH
    const currentTeamLineup = activeTab === "HOME" ? data?.homeTeam : data?.awayTeam;
    
    const unconfirmedPlayers = currentTeamLineup 
        ? [...currentTeamLineup.startingPlayers, ...currentTeamLineup.substitutePlayers].filter((p) => !p.isConfirmed)
        : [];
    const unconfirmedIds = unconfirmedPlayers.map((p) => p.lineupId);
    const isAllSelected = unconfirmedIds.length > 0 && unconfirmedIds.every((id) => selectedIds.includes(id));

    const confirmedHomeCount = data?.homeTeam.startingPlayers.filter(p => p.isConfirmed).length || 0;
    const confirmedAwayCount = data?.awayTeam.startingPlayers.filter(p => p.isConfirmed).length || 0;
    const canStartMatch = confirmedHomeCount > 0 && confirmedAwayCount > 0;

    const handleTogglePlayer = (lineupId: number) => {
        setSelectedIds((prev) => prev.includes(lineupId) ? prev.filter((id) => id !== lineupId) : [...prev, lineupId]);
    };

    const handleToggleAll = () => {
        if (isAllSelected) {
            setSelectedIds((prev) => prev.filter((id) => !unconfirmedIds.includes(id)));
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...unconfirmedIds])));
        }
    };

    const handleConfirmSelected = async () => {
        if (selectedIds.length === 0) return;
        setIsConfirming(true);
        try {
            const response = await matchActionApi.confirmLineups(Number(matchId), { lineupIds: selectedIds });
            toast.success(response.message || "Đã xác nhận danh sách thành công!");
            setSelectedIds([]);
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xác nhận!");
        } finally {
            setIsConfirming(false);
        }
    };

    // ĐIỀU HƯỚNG TRẠNG THÁI TRẬN ĐẤU & TẠM DỪNG 
    const handleChangeMatchStatus = async (targetStatus: string, note?: string) => {
        setIsStatusChanging(true);
        try {
            // Lấy thời gian hiện tại 
            const currentTime = matchTimer.currentFormattedTime;

            if (targetStatus === 'PAUSED' || (targetStatus === 'IN_PROGRESS' && data?.status === 'PAUSED')) {
                const isPausing = targetStatus === 'PAUSED';
                const eventType = isPausing ? 'PAUSE_MATCH' : 'RESUME_MATCH';
                const desc = isPausing ? 'Trọng tài cho tạm dừng trận đấu' : 'Trận đấu được tiếp tục trở lại';
                
                await matchActionApi.createEvent(Number(matchId), {
                    eventType,
                    eventTime: currentTime,
                    description: desc
                });
                
                toast.success(desc);
                refetch();
                return;
            }

            await matchActionApi.changeMatchStatus(Number(matchId), { 
                targetStatus: targetStatus as any,
                note: note,
                eventTime: currentTime 
            });
            
            if (targetStatus === 'IN_PROGRESS' && data?.status === 'SCHEDULED') {
                try {
                    await matchActionApi.createEvent(Number(matchId), {
                        eventType: 'START_PERIOD',
                        eventTime: currentTime, 
                        description: `Trọng tài thổi còi bắt đầu ${matchTimer.periodName} 1`
                    });
                    toast.success(`Trận đấu và ${matchTimer.periodName} 1 đã bắt đầu!`);
                } catch (err) {
                    toast.warning(`Đã bắt đầu trận đấu, nhưng lỗi ghi log hiệp 1`); 
                }
            } 
            else if (targetStatus === 'FINISHED') toast.info("Trận đấu đã kết thúc!");
            else if (targetStatus === 'CANCELED') toast.error("Trận đấu đã bị hủy.");
            
            refetch(); 
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái");
        } finally {
            setIsStatusChanging(false);
        }
    };

    const handleFinalizeMatch = async (note: string) => {
        setIsStatusChanging(true);
        try {
            await matchActionApi.finalizeMatch(Number(matchId), { note });
            toast.success("Đã ký duyệt thành công. Bảng xếp hạng đang được cập nhật!");
            // Refetch để cập nhật UI sang chế độ View-Only
            refetch();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể ký duyệt trận đấu");
        } finally {
            setIsStatusChanging(false);
        }
    };

    // GHI NHẬN SỰ KIỆN TRONG TRẬN 
    const handleFireEvent = async (eventType: string, currentFormattedTime: string) => {
        if (eventType === 'START_PERIOD' || eventType === 'END_PERIOD') {
            setIsEventSubmitting(true);
            try {
                await matchActionApi.createEvent(Number(matchId), {
                    eventType,
                    eventTime: currentFormattedTime,
                    description: eventType === 'START_PERIOD' ? `Bắt đầu Hiệp đấu` : `Kết thúc Hiệp đấu`
                });
                toast.success("Cập nhật thời gian thành công!");
                refetch();
            } catch (error) {
                toast.error("Lỗi cập nhật thời gian");
            } finally {
                setIsEventSubmitting(false);
            }
            return;
        }

        // Sự kiện cần chọn VĐV -> Mở Modal (Đóng băng thời gian)
        setEventModal({
            isOpen: true,
            eventType: eventType,
            eventTime: currentFormattedTime 
        });
    };

    const handleSubmitEventModal = async (payload: CreateMatchEventRequest) => {
        setIsEventSubmitting(true);
        try {
            await matchActionApi.createEvent(Number(matchId), payload);
            toast.success("Đã ghi nhận sự kiện!");
            setEventModal(prev => ({ ...prev, isOpen: false }));
            refetch(); 
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi ghi nhận sự kiện");
        } finally {
            setIsEventSubmitting(false);
        }
    };

    if (isLoading && !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Đang tải dữ liệu trận đấu...</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            {/* Header Navigation */}
            <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <span className="text-sm font-bold text-gray-800 truncate">Phòng điều khiển trận đấu</span>
                
                {isFetching && (
                    <div className="ml-auto w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
            </div>

            <MatchScoreboard match={data} timer={matchTimer} />

            <div className="max-w-5xl mx-auto p-4 mt-6">
                {data.status === "SCHEDULED" ? (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                            <div className="bg-white p-1 rounded-xl flex w-full md:w-[400px] border border-gray-200 shadow-sm shrink-0">
                                <button onClick={() => setActiveTab("HOME")} className={cn("flex-1 py-2 text-sm font-semibold rounded-lg transition-all", activeTab === "HOME" ? "bg-blue-600 text-white shadow-md" : "text-gray-500")}>
                                    {data.homeTeam.clubName}
                                </button>
                                <button onClick={() => setActiveTab("AWAY")} className={cn("flex-1 py-2 text-sm font-semibold rounded-lg transition-all", activeTab === "AWAY" ? "bg-blue-600 text-white shadow-md" : "text-gray-500")}>
                                    {data.awayTeam.clubName}
                                </button>
                            </div>

                            {unconfirmedIds.length > 0 && (
                                <button onClick={handleToggleAll} className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all w-full md:w-auto justify-center">
                                    {isAllSelected ? <><CheckSquare size={18} className="text-blue-600" /> Bỏ chọn tất cả</> : <><Square size={18} className="text-gray-400" /> Duyệt tất cả</>}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section>
                                <div className="flex items-center gap-2 mb-4 px-1 border-b border-gray-200 pb-2">
                                    <Users size={18} className="text-blue-600" />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Đội hình chính thức</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {currentTeamLineup?.startingPlayers.map((player: PlayerDto) => (
                                        <PlayerVerificationCard key={player.lineupId} player={player} isSelected={selectedIds.includes(player.lineupId)} onToggle={handleTogglePlayer} />
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-4 px-1 border-b border-gray-200 pb-2">
                                    <UserPlus size={18} className="text-orange-500" />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Danh sách dự bị</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {currentTeamLineup?.substitutePlayers.map((player: PlayerDto) => (
                                        <PlayerVerificationCard key={player.lineupId} player={player} isSelected={selectedIds.includes(player.lineupId)} onToggle={handleTogglePlayer} />
                                    ))}
                                </div>
                            </section>
                        </div>
                    </>
                ) : (
                    <div className="max-w-xl mx-auto h-full">
                        <LiveActionBoard
                            match={data}
                            timer={matchTimer}
                            onActionClick={(actionCode) => handleFireEvent(actionCode, matchTimer.currentFormattedTime)}
                        />
                    </div>
                )}
            </div>

            {/* Modal Ghi Nhận Sự Kiện */}
            <MatchEventModal
                isOpen={eventModal.isOpen}
                onClose={() => setEventModal(prev => ({ ...prev, isOpen: false }))}
                onSubmit={handleSubmitEventModal}
                match={data}
                eventType={eventModal.eventType}
                eventTime={eventModal.eventTime} 
                isLoading={isEventSubmitting}
            />

            {/* Footer Control */}
            <MatchControlFooter
                status={data.status}
                matchState={matchTimer.matchState}
                selectedIds={selectedIds}
                isConfirming={isConfirming}
                isStatusChanging={isStatusChanging}
                canStartMatch={canStartMatch}
                onConfirmLineup={handleConfirmSelected}
                onChangeStatus={handleChangeMatchStatus}
                onFinalizeMatch={handleFinalizeMatch} 
            />
        </div>
    );
};

export default RefereeMatchActionPage;