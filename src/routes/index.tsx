/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ClubProfilePage from '@/features/club/pages/ClubProfilePage';
import DashboardLayout from '@/features/club/DashboardLayout';
import MembersPage from '@/features/club/pages/Memberspage';
import MatchesPage from '@/features/club/pages/Matchespage ';
import TournamentsPage from '@/features/club/pages/Tournamentspage';


const AdminDashboard = () => <div className="p-10"><h1>Dashboard Admin</h1></div>;
const OrganizerDashboard = () => <div className="p-10"><h1>Dashboard Ban Tổ Chức</h1></div>;
const ClubDashboard = () => <div className="p-10"><h1>Dashboard Câu Lạc Bộ</h1></div>;
const RefereeDashboard = () => <div className="p-10"><h1>Dashboard Trọng Tài</h1></div>;
const AthleteDashboard = () => <div className="p-10"><h1>Dashboard Vận Động Viên</h1></div>;
const Unauthorized = () => <div className="p-10 text-red-500"><h1>403 - Không có quyền truy cập</h1></div>;
const NotFound = () => <div className="p-10"><h1>404 - Không tìm thấy trang</h1></div>;

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },

  // PROTECTED ROUTES   
  // Dành riêng cho ADMIN
  {
    element: <ProtectedRoute allowedRoles={['ROLE_ADMIN']} />,
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      // Thêm các trang con của Admin ở đây: /admin/users, /admin/settings...
    ],
  },

  // Dành riêng cho Ban Tổ Chức (Organizer)
  {
    element: <ProtectedRoute allowedRoles={['ROLE_ORGANIZER']} />,
    children: [
      { path: '/organizer', element: <OrganizerDashboard /> },
    ],
  },

  // Dành riêng cho Câu lạc bộ (Club)
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
    element: <ProtectedRoute allowedRoles={['ROLE_ATHLETE']} />,
    children: [
      { path: '/athlete', element: <AthleteDashboard /> },
    ],
  },

  // --- ĐIỀU HƯỚNG MẶC ĐỊNH ---
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);