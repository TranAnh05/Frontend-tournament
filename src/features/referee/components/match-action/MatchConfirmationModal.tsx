/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/classNames";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (inputValue?: string) => void;
    title: string;
    description: string;
    confirmText: string;
    confirmVariant?: "danger" | "primary" | "success";
    isLoading?: boolean;

    showInput?: boolean;
    isInputRequired?: boolean;
    inputPlaceholder?: string;
}

export const MatchConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    confirmVariant = "primary",
    isLoading = false,
    showInput = false,
    isInputRequired = false,
    inputPlaceholder = "Nhập nội dung...",
}) => {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (isOpen) {
            setInputValue("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isConfirmDisabled =
        isLoading || (isInputRequired && inputValue.trim() === "");

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className={cn(
                        "p-6 flex flex-col items-center text-center shrink-0",
                        confirmVariant === "danger"
                            ? "bg-red-50"
                            : "bg-blue-50",
                    )}
                >
                    <div
                        className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                            confirmVariant === "danger"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600",
                        )}
                    >
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">
                        {title}
                    </h3>
                </div>

                <div className="px-6 py-6 overflow-y-auto">
                    <p className="text-gray-600 leading-relaxed text-center mb-4">
                        {description}
                    </p>

                    {showInput && (
                        <div className="mt-2 text-left w-full">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={inputPlaceholder}
                                rows={3}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none text-sm"
                            />
                            {/* Chữ đỏ chỉ hiện khi bắt buộc nhập mà người dùng để trống */}
                            {isInputRequired && inputValue.trim() === "" && (
                                <p className="text-xs text-red-500 mt-2 font-medium">
                                    * Bắt buộc nhập thông tin
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 pb-8 flex flex-col gap-3 shrink-0">
                    <Button
                        onClick={() => onConfirm(inputValue.trim())} 
                        disabled={isConfirmDisabled} 
                        isLoading={isLoading}
                        className={cn(
                            "w-full py-4 text-base font-bold rounded-2xl shadow-lg transition-transform active:scale-95",
                            confirmVariant === "danger"
                                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-200 disabled:bg-red-300"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 disabled:bg-blue-300",
                        )}
                    >
                        {confirmText}
                    </Button>

                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        variant="outline"
                        className="w-full py-4 text-base font-bold text-gray-500 border-none hover:bg-gray-50 rounded-2xl"
                    >
                        Bỏ qua
                    </Button>
                </div>
            </div>
        </div>
    );
};