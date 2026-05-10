import React from "react";
import { Calendar, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { type DashboardFilterParams } from "../../types/dashboard";

interface DashboardFilterBarProps {
    filters: DashboardFilterParams;
    onFilterChange: (newFilters: DashboardFilterParams) => void;
}

export const DashboardFilterBar: React.FC<DashboardFilterBarProps> = ({
    filters,
    onFilterChange,
}) => {
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        onFilterChange({
            ...filters,
            [name]: value === "" ? undefined : value,
        });
    };

    const handleReset = () => {
        onFilterChange({
            startDate: undefined,
            endDate: undefined,
            sportId: undefined,
        });
    };

    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Lọc theo ngày bắt đầu */}
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate || ""}
                        onChange={handleChange}
                        className="bg-transparent border-none text-sm focus:ring-0 outline-none text-gray-700"
                    />
                </div>
                <span className="text-gray-400">-</span>
                {/* Lọc theo ngày kết thúc */}
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate || ""}
                        onChange={handleChange}
                        className="bg-transparent border-none text-sm focus:ring-0 outline-none text-gray-700"
                    />
                </div>

                {/* Lọc theo môn thể thao */}
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <Filter size={16} className="text-gray-400" />
                    <select
                        name="sportId"
                        value={filters.sportId || ""}
                        onChange={handleChange}
                        className="bg-transparent border-none text-sm focus:ring-0 outline-none text-gray-700 w-36"
                    >
                        <option value="">Tất cả các môn</option>
                        {/* Tạm thời Hardcode để test UI, sau này có thể gọi hook useGetSports */}
                        <option value="1">Bóng đá 11 người</option>
                        <option value="2">Bóng rổ 5x5</option>
                        <option value="3">Cầu lông</option>
                    </select>
                </div>
            </div>

            <Button
                variant="secondary"
                onClick={handleReset}
                className="w-full sm:w-auto shrink-0"
            >
                <RotateCcw size={16} className="mr-2" />
                Làm mới
            </Button>
        </div>
    );
};
