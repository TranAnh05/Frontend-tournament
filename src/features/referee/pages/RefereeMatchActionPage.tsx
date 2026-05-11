/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, UserPlus, CheckSquare, Square } from "lucide-react";
import { toast } from "react-toastify";
import { useGetMatchDetail } from "../hooks/match-action/useGetMatchDetail";
import { matchActionApi } from "../api/matchActionApi";
import { type PlayerDto } from "../types/matchAction";
import { MatchScoreboard } from "../components/match-action/MatchScoreboard";
import { PlayerVerificationCard } from "../components/match-action/PlayerVerificationCard";
import { cn } from "@/utils/classNames";
import { LiveActionBoard } from "../components/match-action/LiveActionBoard";
import { MatchControlFooter } from "../components/match-action/MatchControlFooter";

export const RefereeMatchActionPage = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"HOME" | "AWAY">("HOME");
    // STATE QUẢN LÝ CÁC VĐV ĐƯỢC CHỌN
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isConfirming, setIsConfirming] = useState<boolean>(false);
    const { data, isLoading, refetch } = useGetMatchDetail(Number(matchId));
    const [isStatusChanging, setIsStatusChanging] = useState<boolean>(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">
                    Đang tải cấu hình trận đấu...
                </p>
            </div>
        );
    }

    if (!data) return null;

    const currentTeamLineup =
        activeTab === "HOME" ? data.homeTeam : data.awayTeam;

    // HÀM XỬ LÝ TICK/BỎ TICK TỪNG NGƯỜI
    const handleTogglePlayer = (lineupId: number) => {
        setSelectedIds((prev) =>
            prev.includes(lineupId)
                ? prev.filter((id) => id !== lineupId)
                : [...prev, lineupId],
        );
    };

    // TÍNH TOÁN LOGIC CHO CHỨC NĂNG "CHỌN TẤT CẢ"
    const unconfirmedPlayers = [
        ...currentTeamLineup.startingPlayers,
        ...currentTeamLineup.substitutePlayers,
    ].filter((p) => !p.isConfirmed);

    const unconfirmedIds = unconfirmedPlayers.map((p) => p.lineupId);

    // Kiểm tra xem tất cả VĐV chưa duyệt đã được tick chọn hết chưa
    const isAllSelected =
        unconfirmedIds.length > 0 &&
        unconfirmedIds.every((id) => selectedIds.includes(id));

    const confirmedHomeCount = data.homeTeam.startingPlayers.filter(p => p.isConfirmed).length;
    const confirmedAwayCount = data.awayTeam.startingPlayers.filter(p => p.isConfirmed).length;

    const canStartMatch = confirmedHomeCount > 0 && confirmedAwayCount > 0;

    // HÀM XỬ LÝ CHỌN / BỎ CHỌN TẤT CẢ
    const handleToggleAll = () => {
        if (isAllSelected) {
            // Nếu đã chọn hết -> Bỏ chọn
            setSelectedIds((prev) =>
                prev.filter((id) => !unconfirmedIds.includes(id)),
            );
        } else {
            // Nếu chưa chọn hết -> Chọn tất cả
            setSelectedIds((prev) =>
                Array.from(new Set([...prev, ...unconfirmedIds])),
            );
        }
    };

    const handleConfirmSelected = async () => {
        if (selectedIds.length === 0) return;

        setIsConfirming(true);
        try {
            const response = await matchActionApi.confirmLineups(
                Number(matchId),
                {
                    lineupIds: selectedIds,
                },
            );
            toast.success(
                response.message || "Đã xác nhận danh sách thành công!",
            );
            setSelectedIds([]);
            refetch();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Có lỗi xảy ra khi xác nhận!",
            );
        } finally {
            setIsConfirming(false);
        }
    };

    const handleChangeMatchStatus = async (
        targetStatus: string,
        note?: string,
    ) => {
        setIsStatusChanging(true);
        try {
            await matchActionApi.changeMatchStatus(Number(matchId), {
                targetStatus: targetStatus as any, // Ép kiểu an toàn cho API
                note: note,
            });

            // Hiển thị Toast mượt mà theo từng hành động
            if (targetStatus === "IN_PROGRESS")
                toast.success("Trận đấu đang diễn ra!");
            if (targetStatus === "PAUSED")
                toast.warning("Trận đấu đã tạm dừng.");
            if (targetStatus === "FINISHED")
                toast.info("Trận đấu đã kết thúc!");
            if (targetStatus === "CANCELED") toast.error("Trận đấu đã bị hủy.");

            refetch(); // Cập nhật lại UI
        } catch (error: any) {
            console.error(
                error.response?.data?.message ||
                    "Không thể cập nhật trạng thái",
            );
        } finally {
            setIsStatusChanging(false);
        }
    };

    const handleLiveActionClick = (actionId: string) => {
        console.log("Trọng tài vừa bấm nút sự kiện:", actionId);

        // Tùy thuộc vào actionId (VD: 'GOAL', 'YELLOW_CARD', 'PT_3')
        // Chúng ta sẽ mở một Modal/BottomSheet lên để chọn đội và chọn cầu thủ
        // Thiết kế Modal này sẽ là bước tiếp theo của chúng ta!
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            {/* NAVIGATION BAR */}
            <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <span className="text-sm font-bold text-gray-800 truncate">
                    Phòng điều khiển trận đấu
                </span>
            </div>

            <MatchScoreboard match={data} />

            <div className="max-w-5xl mx-auto p-4 mt-6">
                {data.status === "SCHEDULED" ? (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                            <div className="bg-white p-1 rounded-xl flex w-full md:w-[400px] border border-gray-200 shadow-sm shrink-0">
                                <button
                                    onClick={() => setActiveTab("HOME")}
                                    className={cn(
                                        "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                                        activeTab === "HOME"
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-500",
                                    )}
                                >
                                    {data.homeTeam.clubName}
                                </button>
                                <button
                                    onClick={() => setActiveTab("AWAY")}
                                    className={cn(
                                        "flex-1 py-2 text-sm font-semibold rounded-lg transition-all",
                                        activeTab === "AWAY"
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-500",
                                    )}
                                >
                                    {data.awayTeam.clubName}
                                </button>
                            </div>

                            {unconfirmedIds.length > 0 && (
                                <button
                                    onClick={handleToggleAll}
                                    className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all w-full md:w-auto justify-center"
                                >
                                    {isAllSelected ? (
                                        <>
                                            <CheckSquare
                                                size={18}
                                                className="text-blue-600"
                                            />{" "}
                                            Bỏ chọn tất cả
                                        </>
                                    ) : (
                                        <>
                                            <Square
                                                size={18}
                                                className="text-gray-400"
                                            />{" "}
                                            Duyệt tất cả
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section>
                                <div className="flex items-center gap-2 mb-4 px-1 border-b border-gray-200 pb-2">
                                    <Users
                                        size={18}
                                        className="text-blue-600"
                                    />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        Đội hình chính thức
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {currentTeamLineup.startingPlayers.map(
                                        (player: PlayerDto) => (
                                            <PlayerVerificationCard
                                                key={player.lineupId}
                                                player={player}
                                                isSelected={selectedIds.includes(
                                                    player.lineupId,
                                                )}
                                                onToggle={handleTogglePlayer}
                                            />
                                        ),
                                    )}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-2 mb-4 px-1 border-b border-gray-200 pb-2">
                                    <UserPlus
                                        size={18}
                                        className="text-orange-500"
                                    />
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        Danh sách dự bị
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {currentTeamLineup.substitutePlayers.map(
                                        (player: PlayerDto) => (
                                            <PlayerVerificationCard
                                                key={player.lineupId}
                                                player={player}
                                                isSelected={selectedIds.includes(
                                                    player.lineupId,
                                                )}
                                                onToggle={handleTogglePlayer}
                                            />
                                        ),
                                    )}
                                </div>
                            </section>
                        </div>
                    </>
                ) : (
                    <div className="max-w-xl mx-auto h-full">
                        <LiveActionBoard
                            match={data}
                            onActionClick={handleLiveActionClick}
                        />
                    </div>
                )}
            </div>

            <MatchControlFooter
                status={data.status}
                selectedIds={selectedIds}
                isConfirming={isConfirming}
                isStatusChanging={isStatusChanging}
                canStartMatch={canStartMatch}
                onConfirmLineup={handleConfirmSelected}
                onChangeStatus={handleChangeMatchStatus}
            />
        </div>
    );
};

export default RefereeMatchActionPage;
