import React, { useEffect } from "react";
import { X } from "lucide-react";
import { SportsForm } from "./SportsForm";
import { useMutateSport } from "../../hooks/sports/useMutateSport";
import { type SportFormValues } from "../../schemas/sportsSchema";
import type { SportResponse } from "../../types/sports";

interface SportsDrawerProps {
    isOpen: boolean;
    sportData?: SportResponse | null;
    onClose: () => void;
    onSuccess: () => void; // refresh lại bảng dữ liệu sau khi thêm thành công
}

export const SportsDrawer: React.FC<SportsDrawerProps> = ({
    isOpen,
    sportData = null,
    onClose,
    onSuccess,
}) => {
    const { createSport, updateSport, isSubmitting } = useMutateSport();

    // Xác định chế độ hiện tại
    const isEditMode = Boolean(sportData);

    // Khóa cuộn trang nền khi Drawer đang mở
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

    // XỬ LÝ SUBMIT RẼ NHÁNH
    const handleSubmit = async (data: SportFormValues) => {
        try {
            if (isEditMode && sportData) {
                await updateSport(sportData.id, data, () => {
                    onSuccess();
                    onClose();
                });
            } else {
                await createSport(data, () => {
                    onSuccess();
                    onClose();
                });
            }
        } catch (error) {
            console.error("Submit failed:", error);
        }
    };

    return (
        <>
            {/* Nền mờ - Bấm vào nền này cũng sẽ đóng Drawer */}
            <div
                className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={onClose}
            />

            {/* Khung trượt chính */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-full max-w-3xl bg-gray-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header của Drawer */}
                <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditMode
                                ? "Cập nhật môn thể thao"
                                : "Thêm môn thể thao mới"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEditMode
                                ? "Chỉnh sửa thông tin và cấu hình lại bộ quy tắc thi đấu."
                                : "Thiết lập thông tin và bộ quy tắc thi đấu chuẩn."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title="Đóng cửa sổ"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body của Drawer: */}
                <div className="flex-1 overflow-hidden p-6">
                    <SportsForm
                        initialData={sportData}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </>
    );
};
