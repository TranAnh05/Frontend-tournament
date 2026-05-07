import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/classNames";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
    className,
}) => {
    if (totalPages <= 1) return null;

    // Thuật toán tính toán mảng các trang sẽ hiển thị (có kèm dấu ba chấm)
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5; // Số lượng nút số tối đa hiển thị cạnh nhau

        // Nếu tổng số trang ít, hiển thị tất cả
        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Luôn hiển thị trang đầu tiên
        pages.push(0);

        // Tính toán cửa sổ trượt xung quanh trang hiện tại
        let start = Math.max(1, currentPage - 1);
        let end = Math.min(totalPages - 2, currentPage + 1);

        // Điều chỉnh cửa sổ nếu đang ở sát lề trái hoặc phải
        if (currentPage <= 2) {
            end = 3;
        } else if (currentPage >= totalPages - 3) {
            start = totalPages - 4;
        }

        // Thêm dấu ba chấm bên trái nếu cần
        if (start > 1) {
            pages.push("ellipsis-start");
        }

        // Thêm các trang ở giữa
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Thêm dấu ba chấm bên phải nếu cần
        if (end < totalPages - 2) {
            pages.push("ellipsis-end");
        }

        // Luôn hiển thị trang cuối cùng
        pages.push(totalPages - 1);

        return pages;
    };

    return (
        <nav
            className={cn("flex items-center gap-1", className)}
            aria-label="Pagination"
        >
            {/* Nút Trước */}
            <button
                type="button"
                disabled={currentPage === 0 || disabled}
                onClick={() => onPageChange(currentPage - 1)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Trang trước"
            >
                <ChevronLeft size={18} />
            </button>

            {/* Render danh sách các số trang */}
            {getPageNumbers().map((page) => {
                // Dấu ba chấm
                if (typeof page === "string") {
                    return (
                        <span
                            key={page}
                            className="px-2 py-2 text-gray-400 flex items-center justify-center"
                        >
                            <MoreHorizontal size={16} />
                        </span>
                    );
                }

                //  nút số trang
                const isCurrentPage = page === currentPage;
                return (
                    <button
                        key={page}
                        type="button"
                        disabled={disabled}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "min-w-[36px] h-9 px-3 flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                            isCurrentPage
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed",
                        )}
                        aria-current={isCurrentPage ? "page" : undefined}
                    >
                        {page + 1}
                    </button>
                );
            })}

            {/* Nút Sau */}
            <button
                type="button"
                disabled={currentPage === totalPages - 1 || disabled}
                onClick={() => onPageChange(currentPage + 1)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Trang sau"
            >
                <ChevronRight size={18} />
            </button>
        </nav>
    );
};
