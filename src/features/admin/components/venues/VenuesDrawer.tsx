import React, { useEffect } from "react";
import { X } from "lucide-react";
import { VenuesForm } from "./VenuesForm";
import { useMutateVenue } from "../../hooks/venues/useMutateVenue";
import { type VenueFormValues } from "../../schemas/venuesSchema";
import { type VenueResponse } from "../../types/venues";

interface VenuesDrawerProps {
    isOpen: boolean;
    initialData?: VenueResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const VenuesDrawer: React.FC<VenuesDrawerProps> = ({
    isOpen,
    initialData = null,
    onClose,
    onSuccess,
}) => {
    const { createVenue, updateVenue, isSubmitting } = useMutateVenue();

    const isEditMode = Boolean(initialData);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // HÀM XỬ LÝ SUBMIT CHÍNH
    const handleSubmit = async (data: VenueFormValues) => {
        try {
            if (isEditMode && initialData) {
                await updateVenue(initialData.id, data, () => {
                    onSuccess();
                    onClose();
                });
            } else {
                await createVenue(data, () => {
                    onSuccess();
                    onClose();
                });
            }
        } catch (error) {
            console.error("Lỗi khi submit form địa điểm:", error);
        }
    };

    return (
        <>
            {/* Lớp nền mờ */}
            <div
                className={`fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={!isSubmitting ? onClose : undefined}
            />

            {/* Khung Drawer chính */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-gray-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200 shadow-sm shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditMode
                                ? "Cập nhật địa điểm"
                                : "Thêm địa điểm mới"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEditMode
                                ? "Chỉnh sửa thông tin khu vực và cập nhật danh sách sân con."
                                : "Thiết lập khu vực thi đấu và tạo danh sách các sân con bên trong."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none disabled:opacity-50"
                        title="Đóng cửa sổ"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-hidden p-6">
                    <VenuesForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </>
    );
};
