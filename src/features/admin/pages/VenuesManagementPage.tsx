import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "../components/Pagination";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { VenuesTable } from "../components/venues/VenuesTable";
import { useGetVenues } from "../hooks/venues/useGetVenues";
import { type VenueResponse } from "../types/venues";
import { useMutateVenue } from "../hooks/venues/useMutateVenue";
import { VenuesDrawer } from "../components/venues/VenuesDrawer";

// phụ trợ dùng chung để delay việc gọi API khi search
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export const VenuesManagementPage = () => {
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 500);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [page, setPage] = useState(0);
    const constSize = 6;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingVenue, setEditingVenue] = useState<VenueResponse | null>(
        null,
    );
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        venue: VenueResponse | null;
    }>({
        isOpen: false,
        venue: null,
    });

    const { data, isLoading, fetchVenues } = useGetVenues();
    const { toggleVenueStatus, isChangingStatus } = useMutateVenue();

    useEffect(() => {
        fetchVenues({
            search: debouncedSearch || undefined,
            status: statusFilter || undefined,
            page: page,
            size: constSize,
        });
    }, [debouncedSearch, statusFilter, page, fetchVenues]);

    // --- HANDLERS ---
    const handleOpenCreateMode = () => {
        setEditingVenue(null);
        setIsDrawerOpen(true);
    };

    const handleOpenEditMode = (venue: VenueResponse) => {
        setEditingVenue(venue);
        setIsDrawerOpen(true);
    };

    const handleRequestToggle = (venue: VenueResponse) => {
        setConfirmModal({ isOpen: true, venue });
    };

    const handleConfirmToggle = async () => {
        const { venue } = confirmModal;
        if (!venue) return;

        const newStatus = venue.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        try {
            await toggleVenueStatus(venue.id, { status: newStatus }, () => {
                setConfirmModal({ isOpen: false, venue: null });
                fetchVenues({
                    search: debouncedSearch || undefined,
                    status: statusFilter || undefined,
                    page: page,
                    size: constSize,
                });
            });
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái địa điểm:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý Địa điểm & Sân
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Thiết lập danh sách các khu vực thi đấu và cấu hình sân
                        con cho từng môn.
                    </p>
                </div>
                <Button
                    onClick={handleOpenCreateMode}
                    variant="primary"
                    className="shrink-0"
                >
                    <Plus size={18} className="mr-2" />
                    Thêm địa điểm
                </Button>
            </div>

            {/* TOOLBAR */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                        placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            setPage(0);
                        }}
                        className="pl-10 w-full"
                    />
                </div>
                <div className="sm:w-64 shrink-0 flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(0);
                        }}
                        className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Đang hoạt động</option>
                        <option value="INACTIVE">Đang bảo trì</option>
                    </select>
                </div>
            </div>

            {/* DATA TABLE */}
            <VenuesTable
                venues={data.content}
                isLoading={isLoading}
                onEdit={handleOpenEditMode}
                onToggleStatus={handleRequestToggle}
            />

            {/* PAGINATION */}
            {!isLoading && data.totalPages > 1 && (
                <div className="flex justify-end mt-4">
                    <Pagination
                        currentPage={data.currentPage}
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {/* MODALS & DRAWERS */}
            <ConfirmDialog
                isOpen={confirmModal.isOpen}
                type={
                    confirmModal.venue?.status === "ACTIVE" ? "danger" : "info"
                }
                title={
                    confirmModal.venue?.status === "ACTIVE"
                        ? "Khóa địa điểm thi đấu?"
                        : "Mở khóa địa điểm?"
                }
                message={
                    confirmModal.venue?.status === "ACTIVE"
                        ? `Bạn có chắc chắn muốn ngừng hoạt động "${confirmModal.venue?.name}"? Tất cả các sân con thuộc địa điểm này sẽ không thể sử dụng.`
                        : `Kích hoạt lại "${confirmModal.venue?.name}" để phục vụ các giải đấu sắp tới?`
                }
                confirmLabel={
                    confirmModal.venue?.status === "ACTIVE"
                        ? "Khóa địa điểm"
                        : "Mở khóa"
                }
                isLoading={isChangingStatus}
                onConfirm={handleConfirmToggle}
                onCancel={() => setConfirmModal({ isOpen: false, venue: null })}
            />

            <VenuesDrawer
                isOpen={isDrawerOpen}
                initialData={editingVenue}
                onClose={() => setIsDrawerOpen(false)}
                onSuccess={() => {
                    setPage(0);
                    fetchVenues({
                        search: debouncedSearch,
                        status: statusFilter || undefined,
                        page: 0,
                        size: constSize,
                    });
                }}
            />
        </div>
    );
};

export default VenuesManagementPage;
