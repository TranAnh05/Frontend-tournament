/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import TournamentListPage from "@/features/tournaments/pages/ORGANIZER/TournamentListPage";
import AdminLayout from "@/features/admin/layouts/AdminLayout";
import TournamentDetailPage from "@/features/tournaments/pages/ORGANIZER/TournamentDetailPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import SportsManagementPage from "@/features/admin/pages/SportsManagementPage";
import VenuesManagementPage from "@/features/admin/pages/VenuesManagementPage";
import ClubProfilePage from "@/features/club/pages/ClubProfilePage";
import DashboardLayout from "@/features/club/DashboardLayout";
import MembersPage from "@/features/club/pages/Memberspage";
import MatchesPage from "@/features/club/pages/Matchespage ";
import TournamentsPage from "@/features/club/pages/Tournamentspage";
import OrganizersManagementPage from "@/features/admin/pages/OrganizersManagementPage";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import RosterPage from "@/features/club/pages/RosterPage";
import RefereeAssignedMatchesPage from "@/features/referee/pages/RefereeAssignedMatchesPage";
import RefereeMatchActionPage from "@/features/referee/pages/RefereeMatchActionPage";
import MainLayout from '../features/tournaments/pages/ORGANIZER/MainLayout';
import DashboardPage from '../features/tournaments/pages/ORGANIZER/DashboardPage';
import Regis from '../features/tournaments/pages/ORGANIZER/RegistrationPage';

const AthleteDashboard = () => (
    <div className="p-10">
        <h1>Dashboard Vận Động Viên</h1>
    </div>
);
const Unauthorized = () => (
    <div className="p-10 text-red-500">
        <h1>403 - Không có quyền truy cập</h1>
    </div>
);
const NotFound = () => (
    <div className="p-10">
        <h1>404 - Không tìm thấy trang</h1>
    </div>
);

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/unauthorized",
        element: <Unauthorized />,
    },

    // PROTECTED ROUTES
    // Dành riêng cho ADMIN
    {
        element: <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />,
        children: [
            {
                path: "/admin",
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <AdminDashboardPage />,
                    },
                    {
                        path: "sports",
                        element: <SportsManagementPage />,
                    },
                    {
                        path: "organizers",
                        element: <OrganizersManagementPage />,
                    },
                    {
                        path: "venues",
                        element: <VenuesManagementPage />,
                    },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={["ROLE_REFEREE"]} />,
        children: [
            { path: "/referee", element: <RefereeAssignedMatchesPage /> },
            {path: "/referee/:matchId", element: <RefereeMatchActionPage />}
        ],
    },

    {
        element: <ProtectedRoute allowedRoles={["ROLE_ORGANIZER"]} />,
        children: [
            { path: "/organizer", element: <MainLayout />,
            children: [
                {
                  
                    index: true, 
                    element: <DashboardPage /> 
                },
            
            {
                path: "tournaments",
                element: <TournamentListPage /> ,
                children: [ 
                   ],
            },
            {
                path: "/organizer/tournaments/:id",
                element: <TournamentDetailPage />,
            },
            {
                path: "/organizer/registrations",
                element: <Regis/>,
            }
             ],
                 },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={["ROLE_CLUB_MANAGER"]} />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    { path: "/club", element: <ClubProfilePage /> },
                    { path: "/club/members", element: <MembersPage /> },
                    { path: "/club/matches", element: <MatchesPage /> },
                    { path: "/club/tournaments", element: <TournamentsPage /> },
                    { path: "/club/roster", element: <RosterPage /> },
                ],
            },
        ],
    },
    // Dành riêng cho Vận động viên (Athlete)
    {
        element: <ProtectedRoute allowedRoles={["ROLE_ATHLETE"]} />,
        children: [{ path: "/athlete", element: <AthleteDashboard /> }],
    },

    // --- ĐIỀU HƯỚNG MẶC ĐỊNH ---
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);
