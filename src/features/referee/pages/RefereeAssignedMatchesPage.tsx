import { useGetAssignedMatches } from "../hooks/matches/useGetAssignedMatches";
import { TimeframeFilter } from "../components/matches/TimeframeFilter";
import { AssignedMatchCard } from "../components/matches/AssignedMatchCard";
import { Hourglass, Inbox, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const RefereeAssignedMatchesPage = () => {
    const { data, isLoading, timeframe, setTimeframe } =
        useGetAssignedMatches();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        toast.success("Đăng xuất thành công", { autoClose: 1000 });
        navigate("/login");
    };

    const getDisplayRole = (roles?: string[]) => {
        if (roles?.includes("ROLE_REFEREE")) return "Trọng tài";
        return "Thành viên";
    };

    const getLastNameInitial = (fullName?: string | null): string => {
        if (!fullName || fullName.trim() === "") {
            return "";
        }

        const words = fullName.trim().split(" ");
        const lastName = words[words.length - 1];
        return lastName.charAt(0).toUpperCase();
    };

    const emptyStateContent =
        timeframe === "UPCOMING"
            ? {
                  icon: Hourglass,
                  title: "Chưa có lịch trình sắp tới",
                  description:
                      "Bạn chưa được phân công nhiệm vụ nào trong thời gian tới.",
              }
            : {
                  icon: Inbox,
                  title: "Chưa có lịch sử làm nhiệm vụ",
                  description:
                      "Bạn chưa tham gia điều hành trận đấu nào, hoặc các trận đấu bạn phụ trách vẫn chưa kết thúc.",
              };

    const EmptyIcon = emptyStateContent.icon;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* HEADER: */}
            <div className="bg-blue-600 pt-6 pb-6 sticky top-0 z-10 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-5 sm:gap-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 bg-blue-700/40 py-1.5 pr-4 pl-1.5 rounded-full border border-blue-500/30 shadow-sm">
                                <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                                    {user?.fullName ? (
                                        getLastNameInitial(user.fullName)
                                    ) : (
                                        <User size={18} />
                                    )}
                                </div>

                                {/* Info (Tên & Vai trò) */}
                                <div className="flex flex-col justify-center">
                                    <span className="text-sm font-bold text-white leading-tight line-clamp-1 max-w-[140px] sm:max-w-[200px]">
                                        {user?.fullName || "Người dùng"}
                                    </span>
                                    <span className="text-[10px] text-blue-200 uppercase tracking-wider font-bold line-clamp-1">
                                        {getDisplayRole(user?.roles)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white transition-all border border-blue-500 rounded-xl sm:rounded-full px-3 py-2 sm:px-4 shadow-sm group"
                                title="Đăng xuất"
                            >
                                <LogOut
                                    size={18}
                                    className="group-hover:-translate-x-0.5 transition-transform"
                                />

                                <span className="hidden sm:block text-sm font-semibold">
                                    Đăng xuất
                                </span>
                            </button>
                        </div>

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
                                Nhiệm vụ của tôi
                            </h1>
                            <p className="text-blue-100 text-sm">
                                Quản lý lịch bắt chính và điều khiển trận đấu
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex justify-center md:justify-start mb-6">
                    <div className="w-full sm:w-[400px]">
                        <TimeframeFilter
                            activeTab={timeframe}
                            onChange={setTimeframe}
                        />
                    </div>
                </div>
                <div
                    className={
                        isLoading || data.length === 0
                            ? ""
                            : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
                    }
                >
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100"
                                ></div>
                            ))}
                        </div>
                    ) : data.length > 0 ? (
                        data.map((match) => (
                            <AssignedMatchCard
                                key={match.matchId}
                                match={match}
                            />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed max-w-2xl mx-auto w-full">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <EmptyIcon
                                    size={32}
                                    className="text-gray-400 stroke-[1.5]"
                                />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">
                                {emptyStateContent.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {emptyStateContent.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RefereeAssignedMatchesPage;
