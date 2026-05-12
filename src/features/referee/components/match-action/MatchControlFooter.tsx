import React, { useState } from "react";
import { Play, Square, Pause, CheckCircle, XCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MatchConfirmationModal } from "./MatchConfirmationModal";

interface MatchControlFooterProps {
    status: string;
    matchState:
        | "WAITING_START"
        | "PLAYING"
        | "HALFTIME"
        | "FULL_TIME"
        | "ENDED";
    selectedIds: number[];
    isConfirming: boolean;
    isStatusChanging: boolean;
    canStartMatch: boolean;
    onConfirmLineup: () => void;
    onChangeStatus: (targetStatus: string, note?: string) => void;
    onFinalizeMatch: (note: string) => void;
}

export const MatchControlFooter: React.FC<MatchControlFooterProps> = ({
    status,
    matchState,
    selectedIds,
    isConfirming,
    isStatusChanging,
    canStartMatch,
    onConfirmLineup,
    onChangeStatus,
    onFinalizeMatch,
}) => {
    const isPaused = status === "PAUSED";

    // LOGIC KHÓA NÚT: 
    const isWaitingStart = matchState === "WAITING_START";
    const isHalftime = matchState === "HALFTIME";
    const isFullTime = matchState === "FULL_TIME";

    // Nút Tạm Dừng sẽ bị khóa nếu trận đấu chưa bắt đầu hoặc đang nghỉ giữa giờ
    const isPauseDisabled =
        isWaitingStart || isHalftime || isFullTime || isStatusChanging;

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        targetStatus: string;
        title: string;
        description: string;
        confirmText: string;
        variant: "danger" | "primary";
        showInput: boolean;
        isInputRequired: boolean;
        inputPlaceholder: string;
    }>({
        isOpen: false,
        targetStatus: "",
        title: "",
        description: "",
        confirmText: "",
        variant: "primary",
        showInput: false,
        isInputRequired: false,
        inputPlaceholder: "",
    });

    const openModal = (type: "FINISHED" | "CANCELED" | "FINALIZE") => {
        if (type === "CANCELED") {
            setModalConfig({
                isOpen: true,
                targetStatus: "CANCELED",
                title: "Hủy trận đấu?",
                description:
                    "Hành động này không thể hoàn tác. Trận đấu sẽ bị hủy.",
                confirmText: "Xác nhận Hủy",
                variant: "danger",
                showInput: true, 
                isInputRequired: true, 
                inputPlaceholder:
                    "Ví dụ: Mưa bão lớn, Vận động viên gặp sự cố, Lỗi kỹ thuật sân bãi...",
            });
        } else if (type === "FINALIZE") {
            setModalConfig({
                isOpen: true,
                targetStatus: "FINALIZE",
                title: "Ký duyệt biên bản?",
                description:
                    "Hành động này không thể hoàn tác. Mọi dữ liệu sẽ bị khóa vĩnh viễn để tính Bảng xếp hạng!",
                confirmText: "Chốt sổ & Ký duyệt",
                variant: "danger",
                showInput: true, 
                isInputRequired: false, 
                inputPlaceholder: "Ghi chú cuối cùng của Trọng tài (không bắt buộc)...",
            });
        } else {
            setModalConfig({
                isOpen: true,
                targetStatus: "FINISHED",
                title: "Kết thúc trận?",
                description:
                    "Xác nhận kết thúc trận đấu và chốt tỷ số chung cuộc.",
                confirmText: "Kết thúc ngay",
                variant: "primary",
                showInput: false, 
                isInputRequired: false,
                inputPlaceholder: "",
            });
        }
    };

    const closeModal = () =>
        setModalConfig((prev) => ({ ...prev, isOpen: false }));

    const handleConfirmModal = (inputNote?: string) => {
        if (modalConfig.targetStatus === "FINALIZE") {
            onFinalizeMatch(inputNote || "");
            closeModal();
            return;
        }

        const finalNote =
            modalConfig.targetStatus === "CANCELED"
                ? `Lý do hủy: ${inputNote}`
                : "Kết thúc trận đấu thành công";

        onChangeStatus(modalConfig.targetStatus, finalNote);
        closeModal();
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-30 transition-transform">
                <div className="max-w-md mx-auto">
                    {/* TRẠNG THÁI 1: CHƯA BẮT ĐẦU */}
                    {status === "SCHEDULED" &&
                        (selectedIds.length > 0 ? (
                            <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-4 duration-300">
                                <div className="text-sm font-bold text-blue-600 text-center">
                                    Đã chọn:{" "}
                                    <span className="text-lg bg-blue-100 px-2 py-0.5 rounded-md">
                                        {selectedIds.length}
                                    </span>{" "}
                                    VĐV
                                </div>
                                <Button
                                    onClick={onConfirmLineup}
                                    isLoading={isConfirming}
                                    className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-2xl"
                                >
                                    {!isConfirming && (
                                        <CheckCircle
                                            size={20}
                                            className="mr-2"
                                        />
                                    )}
                                    XÁC NHẬN ĐỘI HÌNH
                                </Button>
                            </div>
                        ) : (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                {canStartMatch ? (
                                    <Button
                                        onClick={() =>
                                            onChangeStatus("IN_PROGRESS")
                                        }
                                        isLoading={isStatusChanging}
                                        className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 rounded-2xl"
                                    >
                                        <Play
                                            size={20}
                                            className="mr-2 fill-current"
                                        />
                                        BẮT ĐẦU TRẬN ĐẤU
                                    </Button>
                                ) : (
                                    <div className="w-full py-6 text-center text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 rounded-2xl">
                                        VUI LÒNG DUYỆT ĐỘI HÌNH
                                    </div>
                                )}
                            </div>
                        ))}

                    {/* TRẠNG THÁI 2: ĐANG DIỄN RA HOẶC TẠM DỪNG */}
                    {(status === "IN_PROGRESS" || status === "PAUSED") && (
                        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex gap-3">
                                <Button
                                    disabled={isPauseDisabled}
                                    onClick={() =>
                                        onChangeStatus(
                                            isPaused ? "IN_PROGRESS" : "PAUSED",
                                        )
                                    }
                                    className={`flex-1 py-4 font-bold rounded-xl shadow-sm transition-all ${
                                        isPauseDisabled
                                            ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                                            : isPaused
                                              ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300"
                                    }`}
                                >
                                    {isPaused ? (
                                        <Play size={18} className="mr-1.5" />
                                    ) : (
                                        <Pause size={18} className="mr-1.5" />
                                    )}
                                    {isPaused ? "TIẾP TỤC" : "TẠM DỪNG"}
                                </Button>

                                <Button
                                    onClick={() => openModal("CANCELED")}
                                    disabled={isStatusChanging}
                                    className="flex-1 py-4 font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-xl shadow-sm"
                                >
                                    <XCircle size={18} className="mr-1.5" />
                                    HỦY TRẬN
                                </Button>
                            </div>

                            <Button
                                onClick={() => openModal("FINISHED")}
                                disabled={isWaitingStart || isStatusChanging}
                                className={`w-full py-5 text-lg font-bold shadow-lg rounded-2xl transition-all ${
                                    isWaitingStart
                                        ? "bg-red-300 text-white cursor-not-allowed opacity-70"
                                        : "bg-red-600 hover:bg-red-700 text-white shadow-red-200"
                                }`}
                            >
                                <Square
                                    size={20}
                                    className="mr-2 fill-current"
                                />
                                KẾT THÚC TRẬN ĐẤU
                            </Button>
                        </div>
                    )}

                    {/* TRẠNG THÁI 3: CÁC LOẠI KẾT THÚC */}
                    {status === "FINISHED" && (
                        <Button
                            onClick={() => openModal("FINALIZE")}
                            disabled={isStatusChanging}
                            className="w-full py-5 text-lg font-bold text-white bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-300 rounded-2xl animate-in slide-in-from-bottom-2"
                        >
                            <Lock size={20} className="mr-2" />
                            📝 KÝ DUYỆT BIÊN BẢN
                        </Button>
                    )}

                    {status === "FINALIZED" && (
                        <Button
                            disabled
                            className="w-full py-5 text-lg font-bold bg-gray-100 text-gray-400 border border-gray-200 rounded-2xl cursor-not-allowed"
                        >
                            <Lock size={20} className="mr-2" />
                            TRẬN ĐẤU ĐÃ BỊ KHÓA
                        </Button>
                    )}

                    {status === "CANCELED" && (
                        <Button
                            disabled
                            className="w-full py-5 text-lg font-bold bg-gray-100 text-gray-400 border border-gray-200 rounded-2xl cursor-not-allowed"
                        >
                            TRẬN ĐẤU ĐÃ BỊ HỦY
                        </Button>
                    )}
                </div>
            </div>

            <MatchConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={handleConfirmModal}
                title={modalConfig.title}
                description={modalConfig.description}
                confirmText={modalConfig.confirmText}
                confirmVariant={modalConfig.variant}
                isLoading={isStatusChanging}
                showInput={modalConfig.showInput}
                isInputRequired={modalConfig.isInputRequired}
                inputPlaceholder={modalConfig.inputPlaceholder}
            />
        </>
    );
};