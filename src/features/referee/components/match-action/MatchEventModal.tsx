import React, { useState, useEffect, useMemo } from "react";
import { X, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { type MatchDetailResponse } from "../../types/matchAction";

interface MatchEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: any) => void;
    match: MatchDetailResponse;
    eventType: string;
    eventTime: string;
    isLoading: boolean;
}

export const MatchEventModal: React.FC<MatchEventModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    match,
    eventType,
    eventTime,
    isLoading,
}) => {
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [primaryAthleteId, setPrimaryAthleteId] = useState<number | null>(null);
    const [secondaryAthleteId, setSecondaryAthleteId] = useState<number | null>(null);
    const [description, setDescription] = useState("");
    
    const [isAddingPlayerOnly, setIsAddingPlayerOnly] = useState(false);

    // Reset form mỗi khi mở modal
    useEffect(() => {
        if (isOpen) {
            setSelectedTeamId(null);
            setPrimaryAthleteId(null);
            setSecondaryAthleteId(null);
            setDescription("");
            setIsAddingPlayerOnly(false); // Reset cờ bổ sung người
        }
    }, [isOpen]);

    const isGoalGroup = ["GOAL", "PT_2", "PT_3"].includes(eventType);
    const isOwnGoal = eventType === "OWN_GOAL";
    const isSubstitution = eventType === "SUBSTITUTION";
    const isCardOrFoul = ["YELLOW_CARD", "RED_CARD", "FOUL"].includes(eventType);
    const isTeamEventOnly = ["TIMEOUT", "VAR_CHALLENGE", "INJURY"].includes(eventType);

    // Lấy danh sách cầu thủ của đội đang được chọn
    const activeTeamData = useMemo(() => {
        if (!selectedTeamId) return null;
        return match.homeTeam.clubId === selectedTeamId
            ? match.homeTeam
            : match.awayTeam;
    }, [selectedTeamId, match]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit({
            eventType,
            eventTime,
            clubId: selectedTeamId,
            // Nếu đánh dấu Bổ sung người -> primary (người ra sân) gửi null
            primaryAthleteId: (isSubstitution && isAddingPlayerOnly) ? null : primaryAthleteId,
            secondaryAthleteId,
            description,
        });
    };

    // Validate bật/tắt nút Lưu
    const isSubmitDisabled =
        !selectedTeamId ||
        ((isGoalGroup || isOwnGoal || isCardOrFoul) && !primaryAthleteId) ||
        // LOGIC VALIDATE MỚI CHO THAY NGƯỜI
        (isSubstitution && (!secondaryAthleteId || (!isAddingPlayerOnly && !primaryAthleteId)));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* HEADER */}
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="font-black text-gray-900 text-lg uppercase">
                            {eventType}
                        </h3>
                        <p className="text-sm font-bold text-blue-600">
                            Thời gian: {eventTime}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* BODY FORM */}
                <div className="p-5 overflow-y-auto flex-1 space-y-6">
                    {/* CHỌN ĐỘI BÓNG */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            {isOwnGoal
                                ? "Đội thực hiện phản lưới:"
                                : "Chọn đội bóng:"}{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {[match.homeTeam, match.awayTeam].map((team) => (
                                <button
                                    key={team.clubId}
                                    onClick={() => {
                                        setSelectedTeamId(team.clubId);
                                        setPrimaryAthleteId(null);
                                        setSecondaryAthleteId(null);
                                        setIsAddingPlayerOnly(false);
                                    }}
                                    className={`p-3 rounded-xl border-2 font-bold text-sm flex flex-col items-center justify-center gap-2 transition-all ${
                                        selectedTeamId === team.clubId
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                                    }`}
                                >
                                    <span className="text-center line-clamp-2">
                                        {team.clubName}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CÁC TRƯỜNG CHỌN CẦU THỦ */}
                    {activeTeamData && !isTeamEventOnly && (
                        <div className="space-y-4 animate-in slide-in-from-top-2">
                            {/* NẾU LÀ THAY NGƯỜI */}
                            {isSubstitution ? (
                                <>
                                    {/* CHỨC NĂNG BỔ SUNG NGƯỜI */}
                                    <div className="flex items-center gap-2 mb-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                                        <input
                                            type="checkbox"
                                            id="bypass-primary"
                                            checked={isAddingPlayerOnly}
                                            onChange={(e) => {
                                                setIsAddingPlayerOnly(e.target.checked);
                                                setPrimaryAthleteId(null); // Clear lựa chọn người ra
                                            }}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label htmlFor="bypass-primary" className="text-sm font-bold text-blue-800 cursor-pointer select-none">
                                            Bổ sung người (Futsal: Sau thẻ đỏ 2 phút)
                                        </label>
                                    </div>

                                    {!isAddingPlayerOnly && (
                                        <div>
                                            <label className="block text-sm font-bold text-red-600 mb-2">
                                                Người RỜI SÂN (Từ đội hình chính) *
                                            </label>
                                            <select
                                                className="w-full p-3 rounded-xl border border-gray-300 bg-white"
                                                value={primaryAthleteId || ""}
                                                onChange={(e) =>
                                                    setPrimaryAthleteId(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            >
                                                <option value="" disabled>
                                                    -- Chọn VĐV --
                                                </option>
                                                {activeTeamData.startingPlayers.map(
                                                    (p) => (
                                                        <option
                                                            key={p.athleteId}
                                                            value={p.athleteId}
                                                        >
                                                            #{p.jerseyNumber} -{" "}
                                                            {p.fullName}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold text-green-600 mb-2">
                                            Người VÀO SÂN (Từ ghế dự bị) *
                                        </label>
                                        <select
                                            className="w-full p-3 rounded-xl border border-gray-300 bg-white"
                                            value={secondaryAthleteId || ""}
                                            onChange={(e) =>
                                                setSecondaryAthleteId(
                                                    Number(e.target.value),
                                                )
                                            }
                                        >
                                            <option value="" disabled>
                                                -- Chọn VĐV --
                                            </option>
                                            {activeTeamData.substitutePlayers.map(
                                                (p) => (
                                                    <option
                                                        key={p.athleteId}
                                                        value={p.athleteId}
                                                    >
                                                        #{p.jerseyNumber} -{" "}
                                                        {p.fullName}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                /* CÁC SỰ KIỆN GHI BÀN / THẺ PHẠT BÌNH THƯỜNG */
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            {isGoalGroup || isOwnGoal
                                                ? "Người ghi bàn:"
                                                : "Người vi phạm/nhận thẻ:"}{" "}
                                            *
                                        </label>
                                        <select
                                            className="w-full p-3 rounded-xl border border-gray-300 bg-white"
                                            value={primaryAthleteId || ""}
                                            onChange={(e) =>
                                                setPrimaryAthleteId(
                                                    Number(e.target.value),
                                                )
                                            }
                                        >
                                            <option value="" disabled>
                                                -- Chọn VĐV trên sân --
                                            </option>
                                            {activeTeamData.startingPlayers.map(
                                                (p) => (
                                                    <option
                                                        key={p.athleteId}
                                                        value={p.athleteId}
                                                    >
                                                        #{p.jerseyNumber} -{" "}
                                                        {p.fullName}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>

                                    {isGoalGroup && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Người kiến tạo (Nếu có):
                                            </label>
                                            <select
                                                className="w-full p-3 rounded-xl border border-gray-300 bg-white"
                                                value={secondaryAthleteId || ""}
                                                onChange={(e) =>
                                                    setSecondaryAthleteId(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    -- Không có kiến tạo --
                                                </option>
                                                {activeTeamData.startingPlayers
                                                    .filter(
                                                        (p) =>
                                                            p.athleteId !==
                                                            primaryAthleteId,
                                                    )
                                                    .map((p) => (
                                                        <option
                                                            key={p.athleteId}
                                                            value={p.athleteId}
                                                        >
                                                            #{p.jerseyNumber} -{" "}
                                                            {p.fullName}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* HIỂN THỊ DANH SÁCH CẦU THỦ BỊ ĐUỔI KHỎI SÂN */}
                    {activeTeamData && activeTeamData.sentOffPlayers && activeTeamData.sentOffPlayers.length > 0 && (
                        <div className="p-4 bg-red-50 rounded-xl border border-red-100 animate-in fade-in">
                            <h4 className="text-xs font-black text-red-700 uppercase mb-3 flex items-center gap-1.5">
                                <UserMinus size={14} />
                                Đang bị truất quyền thi đấu
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {activeTeamData.sentOffPlayers.map(p => (
                                    <span key={p.athleteId} className="px-2.5 py-1.5 bg-red-100 text-red-500 line-through text-xs font-bold rounded-lg opacity-75 select-none flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                        #{p.jerseyNumber} - {p.fullName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Ghi chú thêm (Tùy chọn)
                        </label>
                        <textarea
                            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            rows={2}
                            placeholder="Nhập ghi chú..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-5 border-t border-gray-100 flex gap-3 shrink-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 py-4 font-bold rounded-2xl border-none bg-gray-100"
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        isLoading={isLoading}
                        className="flex-[2] py-4 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-200"
                    >
                        XÁC NHẬN SỰ KIỆN
                    </Button>
                </div>
            </div>
        </div>
    );
};