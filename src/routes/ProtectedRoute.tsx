import { Navigate, Outlet } from "react-router-dom";
import { type Role } from "@/features/auth/types";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

interface ProtectedRouteProps {
    allowedRoles: Role[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    const hasRequiredRole = user.roles.some((userRole) =>
        allowedRoles.includes(userRole as Role),
    );

    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
