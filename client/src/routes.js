import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import AllBatteryCells from './pages/AllBatteryCells';
import Profile from './pages/Profile';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Landing from './pages/Landing';
import DashboardApp from './pages/DashboardApp';
import Graphs from './pages/Graphs';
import ManageCsv from './pages/ManageCsv';
import ProtectedRoute from './pages/ProtectedRoute';
import AddBatteryCell from './pages/AddBatteryCell';
import EditBatteryCell from './pages/EditBatteryCell';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/app',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: 'dashboard', element: <DashboardApp /> },
        { path: 'all-battery-cells', element: <AllBatteryCells /> },
        { path: 'add-battery-cell', element: <AddBatteryCell /> },
        { path: 'edit-battery-cell', element: <EditBatteryCell /> },
        { path: 'graphs', element: <Graphs /> },
        { path: 'manage-csv', element: <ManageCsv /> },
        { path: 'profile', element: <Profile /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/landing" /> },
        { path: 'login/', element: <Login /> },
        { path: 'register/', element: <Register /> },
        { path: 'landing/', element: <Landing /> },
        { path: '404/', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    // { path: '/login', element: <Login /> },
    // { path: '/register', element: <Register /> },
    // { path: '/landing', element: <Landing /> },
    // { path: '/404', element: <NotFound /> },
    // { path: '/', element: <Navigate to="/app/dashboard" replace /> },
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
