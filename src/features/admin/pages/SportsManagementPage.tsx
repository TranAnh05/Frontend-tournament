import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SportsTable } from "../components/sports/SportsTable";
import { SportsDrawer } from "../components/sports/SportsDrawer";
import { useGetSports } from "../hooks/sports/useGetSports";
import { Input } from "@/components/ui/Input";
import { Pagination } from "../components/Pagination";
import type { SportResponse } from "../types/sports";

export const SportsManagementPage = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingSport, setEditingSport] = useState<SportResponse | null>(
        null,
    );
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(5);

    const { data, isLoading, fetchSports } = useGetSports();

    // Debounce cho ô tìm kiếm
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    // Theo dõi sự thay đổi của Filter và Page
    useEffect(() => {
        fetchSports({
            search: debouncedSearch,
            status: status || undefined,
            page,
            size,
        });
    }, [debouncedSearch, status, page, size, fetchSports]);

    const isFiltered = Boolean(debouncedSearch || status);

    const handleOpenCreateMode = () => {
        setEditingSport(null);
        setIsDrawerOpen(true);
    };

    const handleOpenEditMode = (sport: SportResponse) => {
        setEditingSport(sport); // Nạp dữ liệu vào state
        setIsDrawerOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* --- PAGE HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý môn thi đấu
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Thiết lập danh sách các môn thể thao và bộ quy tắc tính
                        điểm áp dụng cho hệ thống giải đấu.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={handleOpenCreateMode}
                    className="shrink-0"
                >
                    <Plus size={18} className="mr-2" />
                    Thêm môn thể thao
                </Button>
            </div>

            {/* SEARCH & FILTER  */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                        size={18}
                    />
                    <Input
                        placeholder="Tìm kiếm theo tên môn thể thao..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-3">
                    <select
                        className="bg-white border border-gray-300 text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all h-10 min-w-[160px]"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(0);
                        }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="INACTIVE">Đã khóa</option>
                    </select>
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <SportsTable
                sports={data.content}
                isLoading={isLoading}
                isFiltered={isFiltered}
                onEdit={handleOpenEditMode}
            />

            {/* PHÂN TRANG  */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 mt-4">
                <p className="text-sm text-gray-500">
                    Hiển thị{" "}
                    <span className="font-semibold text-gray-900">
                        {data.content.length}
                    </span>{" "}
                    trên tổng số{" "}
                    <span className="font-semibold text-gray-900">
                        {data.totalElements}
                    </span>{" "}
                    môn
                </p>

                <Pagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                    disabled={isLoading}
                />
            </div>

            {/* --- DRAWER --- */}
            <SportsDrawer
                isOpen={isDrawerOpen}
                sportData={editingSport}
                onClose={() => setIsDrawerOpen(false)}
                onSuccess={() => {
                    setPage(0);
                    fetchSports({
                        search: debouncedSearch,
                        status: status || undefined,
                        page: 0,
                        size,
                    });
                }}
            />
        </div>
    );
};

export default SportsManagementPage;
