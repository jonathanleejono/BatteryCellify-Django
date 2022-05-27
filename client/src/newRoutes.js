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

const routes = [
  {
    layout: LogoOnlyLayout,
    public: true,
    routes: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/register',
        component: Register,
      },
      {
        path: '/landing',
        component: Landing,
      },
      {
        path: '/404',
        component: NotFound,
      },
      {
        path: '*',
        component: NotFound,
      },
    ],
  },
  {
    layout: DashboardLayout,
    routes: [
      {
        path: '/',
        exact: true,
        component: DashboardApp,
      },
      {
        path: '/all-battery-cells',
        component: AllBatteryCells,
      },
      {
        path: '/add-battery-cell',
        component: AddBatteryCell,
      },
      {
        path: '/edit-battery-cell',
        component: EditBatteryCell,
      },
      {
        path: '/graphs',
        component: Graphs,
      },
      {
        path: '/manage-csv',
        component: ManageCsv,
      },
      {
        path: '/profile',
        component: Profile,
      },
    ],
  },
];
export default routes;
