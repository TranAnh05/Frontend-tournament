/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { X, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { type OrganizerResponse } from "../../types/organizers";
import { useMutateOrganizer } from "../../hooks/organizers/useMutateOrganizer";
import { cn } from "@/utils/classNames";

interface OrganizerStatusModalProps {
    isOpen: boolean;
    organizer: OrganizerResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const OrganizerStatusModal: React.FC<OrganizerStatusModalProps> = ({
    isOpen,
    organizer,
    onClose,
    onSuccess,
}) => {
    const [reason, setReason] = useState("");
    const { toggleOrganizerStatus, isChangingStatus } = useMutateOrganizer();

    useEffect(() => {
        if (isOpen) {
            setReason("");
        }
    }, [isOpen]);

    if (!isOpen || !organizer) return null;

    const isLocking = organizer.status === "ACTIVE";
    const newStatus = isLocking ? "INACTIVE" : "ACTIVE";

    const isReasonRequired = isLocking;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isReasonRequired && !reason.trim()) return;

        try {
            await toggleOrganizerStatus(
                organizer.id,
                { status: newStatus, reason: reason.trim() },
                () => {
                    onSuccess();
                    onClose();
                },
            );
        } catch (error) {
            console.error("Lỗi khi submit form trạng thái:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={!isChangingStatus ? onClose : undefined}
            />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                {/* HEADER */}
                <div
                    className={cn(
                        "px-6 py-4 border-b flex items-center justify-between",
                        isLocking
                            ? "bg-red-50 border-red-100"
                            : "bg-blue-50 border-blue-100",
                    )}
                >
                    <div className="flex items-center gap-2">
                        {isLocking ? (
                            <ShieldAlert size={20} className="text-red-600" />
                        ) : (
                            <ShieldCheck size={20} className="text-blue-600" />
                        )}
                        <h2
                            className={cn(
                                "text-lg font-bold",
                                isLocking ? "text-red-900" : "text-blue-900",
                            )}
                        >
                            {isLocking
                                ? "Khóa tài khoản BTC"
                                : "Mở khóa tài khoản BTC"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isChangingStatus}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* BODY - FORM */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Bạn đang thực hiện {isLocking ? "khóa" : "mở khóa"}{" "}
                            tài khoản của thành viên{" "}
                            <span className="font-bold text-gray-900">
                                {organizer.fullName}
                            </span>{" "}
                            ({organizer.email}).
                            {isLocking
                                ? " Thành viên này sẽ bị ngưng quyền truy cập hệ thống ngay lập tức."
                                : " Thành viên này sẽ có thể đăng nhập lại vào hệ thống."}
                        </p>

                        <div>
                            <label
                                htmlFor="reason"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Lý do thay đổi trạng thái
                                {isReasonRequired ? (
                                    <span className="text-red-500 ml-1">*</span>
                                ) : (
                                    <span className="text-gray-400 font-normal ml-1 text-xs italic">
                                        (Không bắt buộc)
                                    </span>
                                )}
                            </label>
                            <textarea
                                id="reason"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-shadow"
                                placeholder={
                                    isLocking
                                        ? "VD: Vi phạm quy chế giải đấu, Nghỉ việc..."
                                        : "VD: Đã hoàn thành khóa đào tạo bổ sung..."
                                }
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                disabled={isChangingStatus}
                                required={isReasonRequired}
                            />
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isChangingStatus}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            variant={isLocking ? "danger" : "primary"}
                            isLoading={isChangingStatus}
                            disabled={
                                isReasonRequired && reason.trim().length === 0
                            }
                        >
                            {isLocking ? "Xác nhận Khóa" : "Xác nhận Mở khóa"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
