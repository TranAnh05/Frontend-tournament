import React, { useState } from "react";
import { Play, Square, Pause, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MatchConfirmationModal } from "./MatchConfirmationModal";

interface MatchControlFooterProps {
    status: string;
    selectedIds: number[];
    isConfirming: boolean;
    isStatusChanging: boolean;
    canStartMatch: boolean;
    onConfirmLineup: () => void;
    onChangeStatus: (targetStatus: string, note?: string) => void;
}

export const MatchControlFooter: React.FC<MatchControlFooterProps> = ({
    status,
    selectedIds,
    isConfirming,
    isStatusChanging,
    canStartMatch,
    onConfirmLineup,
    onChangeStatus,
}) => {
    const isPaused = status === "PAUSED";

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        targetStatus: string;
        title: string;
        description: string;
        confirmText: string;
        variant: "danger" | "primary";
        requireInput: boolean;
        inputPlaceholder: string;
    }>({
        isOpen: false,
        targetStatus: "",
        title: "",
        description: "",
        confirmText: "",
        variant: "primary",
        requireInput: false,
        inputPlaceholder: "",
    });

    const openModal = (type: "FINISHED" | "CANCELED") => {
        if (type === "CANCELED") {
            setModalConfig({
                isOpen: true,
                targetStatus: "CANCELED",
                title: "Hủy trận đấu?",
                description:
                    "Hành động này không thể hoàn tác. Trận đấu sẽ bị hủy.",
                confirmText: "Xác nhận Hủy",
                variant: "danger",
                requireInput: true, // YÊU CẦU TRỌNG TÀI NHẬP LÝ DO
                inputPlaceholder:
                    "Ví dụ: Mưa bão lớn, Vận động viên gặp sự cố, Lỗi kỹ thuật sân bãi...",
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
                requireInput: false, // KẾT THÚC THÌ KHÔNG CẦN NHẬP LÝ DO
                inputPlaceholder: "",
            });
        }
    };

    const closeModal = () =>
        setModalConfig((prev) => ({ ...prev, isOpen: false }));

    const handleConfirmModal = (inputNote?: string) => {
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
                                    onClick={() =>
                                        onChangeStatus(
                                            isPaused ? "IN_PROGRESS" : "PAUSED",
                                        )
                                    }
                                    isLoading={isStatusChanging}
                                    className={`flex-1 py-4 font-bold rounded-xl shadow-sm ${
                                        isPaused
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
                                disabled={isStatusChanging}
                                className="w-full py-5 text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 rounded-2xl"
                            >
                                <Square
                                    size={20}
                                    className="mr-2 fill-current"
                                />
                                KẾT THÚC TRẬN ĐẤU
                            </Button>
                        </div>
                    )}

                    {/* TRẠNG THÁI 3: ĐÃ KẾT THÚC HOẶC HỦY */}
                    {(status === "FINISHED" || status === "CANCELED") && (
                        <Button
                            disabled
                            className="w-full py-5 text-lg font-bold bg-gray-100 text-gray-400 border border-gray-200 rounded-2xl cursor-not-allowed"
                        >
                            {status === "FINISHED"
                                ? "TRẬN ĐẤU ĐÃ KẾT THÚC"
                                : "TRẬN ĐẤU ĐÃ BỊ HỦY"}
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
                requireInput={modalConfig.requireInput}
                inputPlaceholder={modalConfig.inputPlaceholder}
            />
        </>
    );
};
