import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Trophy, Users, MapPin, LogOut } from "lucide-react";
import { cn } from "@/utils/classNames";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { toast } from "react-toastify";

const menuItems = [
    { label: "Tổng quan", path: "/admin", icon: LayoutDashboard },
    { label: "Môn thi đấu", path: "/admin/sports", icon: Trophy },
    { label: "Ban tổ chức", path: "/admin/organizers", icon: Users },
    { label: "Địa điểm & Sân", path: "/admin/venues", icon: MapPin },
];

export const AdminSidebar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);

    const handleLogout = () => {
      logout();
      toast.success("Đăng xuất thành công", { autoClose: 1000 });
      navigate("/login");
    };

    return (
        <aside className="w-64 bg-gray-900 text-white h-screen sticky top-0 flex flex-col shadow-xl">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold tracking-wider text-blue-400">
                    ADMIN HUB
                </h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-100",
                            )}
                        >
                            <item.icon
                                size={20}
                                className={cn(
                                    isActive
                                        ? "text-white"
                                        : "group-hover:text-blue-400",
                                )}
                            />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <Button
                    variant="outline"
                    size="md"
                    className="w-full flex items-center justify-center"
                    onClick={handleLogout}
                >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                </Button>
            </div>
        </aside>
    );
};
