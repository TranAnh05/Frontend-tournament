/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import TournamentListPage from '@/features/tournaments/pages/ORGANIZER/TournamentListPage';
import AdminLayout from '@/features/admin/layouts/AdminLayout';
import TournamentDetailPage from '@/features/tournaments/pages/ORGANIZER/TournamentDetailPage';
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import SportsManagementPage from "@/features/admin/pages/SportsManagementPage";
import VenuesManagementPage from "@/features/admin/pages/VenuesManagementPage";
import ClubProfilePage from '@/features/club/pages/ClubProfilePage';
import DashboardLayout from '@/features/club/DashboardLayout';
import MembersPage from '@/features/club/pages/Memberspage';
import MatchesPage from '@/features/club/pages/Matchespage ';
import TournamentsPage from '@/features/club/pages/Tournamentspage';

const AdminDashboard = () => (
    <div className="p-10">
        <h1>Dashboard Admin</h1>
    </div>
);
const BanToChuc = () => (
    <div className="p-10">
        <h1>Ban To Chuc</h1>
    </div>
);
const KiLuat = () => (
    <div className="p-10">
        <h1>Ky Luat</h1>
    </div>
);
const CauHinh = () => (
    <div className="p-10">
        <h1>Cau Hinh</h1>
    </div>
);
const OrganizerDashboard = () => (
    <div className="p-10">
        <h1>Dashboard Ban Tổ Chức</h1>
    </div>
);
const ClubDashboard = () => (
    <div className="p-10">
        <h1>Dashboard Câu Lạc Bộ</h1>
    </div>
);
const RefereeDashboard = () => (
    <div className="p-10">
        <h1>Dashboard Trọng Tài</h1>
    </div>
);
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
                        element: <AdminDashboard />,
                    },
                    {
                        path: "sports",
                        element: <SportsManagementPage />,
                    },
                    {
                        path: "organizers",
                        element: <BanToChuc />,
                    },
                    {
                        path: "venues",
                        element: <VenuesManagementPage />,
                    },
                    {
                        path: "disciplines",
                        element: <KiLuat />,
                    },
                    {
                        path: "settings",
                        element: <CauHinh />,
                    },
                ],
            },
        ],
    },

    // Dành riêng cho Ban Tổ Chức (Organizer)
    {
        element: <ProtectedRoute allowedRoles={["ROLE_ORGANIZER"]} />,
        children: [{ path: "/organizer", element: <OrganizerDashboard /> }],
    },

    // Dành riêng cho Câu lạc bộ (Club)
    {
        element: <ProtectedRoute allowedRoles={["ROLE_CLUB_MANAGER"]} />,
        children: [{ path: "/club", element: <ClubDashboard /> }],
    },

    // Dành riêng cho Trọng tài (Referee)
    {
        element: <ProtectedRoute allowedRoles={["ROLE_REFEREE"]} />,
        children: [{ path: "/referee", element: <RefereeDashboard /> }],
    },
        
         {
    element: <ProtectedRoute allowedRoles={['ROLE_ORGANIZER']} />,
    children: [
      { path: '/organizer', element: <TournamentListPage /> },
      { path: "/organizer/tournaments/:id",element:<TournamentDetailPage /> }
    ],
  },
 {
    element: <ProtectedRoute allowedRoles={['ROLE_CLUB_MANAGER']} />,
    children: [{
      element: <DashboardLayout />,
      children: [
        { path: '/club', element: <ClubProfilePage /> },
        { path: '/club/members', element: <MembersPage /> },
        { path: '/club/matches', element: <MatchesPage /> },
         { path: '/club/tournaments', element: <TournamentsPage /> },
      ],
    }],
  },
  // Dành riêng cho Trọng tài (Referee)
  {
    element: <ProtectedRoute allowedRoles={['ROLE_REFEREE']} />,
    children: [
      { path: '/referee', element: <RefereeDashboard /> },
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
