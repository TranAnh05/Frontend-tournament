import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Pagination } from "../components/Pagination";
import { OrganizersTable } from "../components/organizers/OrganizersTable";
import { useGetOrganizers } from "../hooks/organizers/useGetOrganizers";
import { type OrganizerResponse } from "../types/organizers";
import { OrganizerDetailModal } from "../components/organizers/OrganizerDetailModal";
import { OrganizerStatusModal } from "../components/organizers/OrganizerStatusModal";

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export const OrganizersManagementPage = () => {
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 500);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [page, setPage] = useState(0);
    const constSize = 8;

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedOrganizerId, setSelectedOrganizerId] = useState<
        number | null
    >(null);

    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean;
        organizer: OrganizerResponse | null;
    }>({
        isOpen: false,
        organizer: null,
    });

    const { data, isLoading, fetchOrganizers } = useGetOrganizers();

    useEffect(() => {
        fetchOrganizers({
            search: debouncedSearch || undefined,
            status: statusFilter || undefined,
            page: page,
            size: constSize,
        });
    }, [debouncedSearch, statusFilter, page, fetchOrganizers]);

    // --- HANDLERS ---
    const handleViewDetail = (organizer: OrganizerResponse) => {
        setSelectedOrganizerId(organizer.id);
        setIsDetailOpen(true);
    };

    const handleRequestToggle = (organizer: OrganizerResponse) => {
        setStatusModal({ isOpen: true, organizer });
    };

    return (
        <div className="space-y-6">
            {/* --- 1. PAGE HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Ban tổ chức & Phân quyền
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý tài khoản, vai trò và quyền truy cập của các
                        thành viên điều hành giải đấu.
                    </p>
                </div>
            </div>

            {/* TÌM KIẾM VÀ LỌC*/}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <Input
                        placeholder="Tìm kiếm theo tên, email hoặc SĐT..."
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
                        <option value="INACTIVE">Đã khóa</option>
                    </select>
                </div>
            </div>

            <OrganizersTable
                organizers={data.content}
                isLoading={isLoading}
                onViewDetail={handleViewDetail}
                onToggleStatus={handleRequestToggle}
            />

            {!isLoading && data.totalPages > 1 && (
                <div className="flex justify-end mt-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                    <Pagination
                        currentPage={data.currentPage}
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <OrganizerDetailModal
                isOpen={isDetailOpen}
                organizerId={selectedOrganizerId}
                onClose={() => {
                    setIsDetailOpen(false);
                    setSelectedOrganizerId(null);
                }}
            />

            <OrganizerStatusModal
                isOpen={statusModal.isOpen}
                organizer={statusModal.organizer}
                onClose={() =>
                    setStatusModal({ isOpen: false, organizer: null })
                }
                onSuccess={() => {
                    fetchOrganizers({
                        search: debouncedSearch || undefined,
                        status: statusFilter || undefined,
                        page: page,
                        size: constSize,
                    });
                }}
            />
        </div>
    );
};

export default OrganizersManagementPage;
