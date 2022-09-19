import { BaseOptionChartStyle } from 'components/chart/BaseOptionChartStyle';
import ScrollToTop from 'components/ScrollToTop';
import {
  addBatteryCellRoute,
  allBatteryCellsRoute,
  batteryCellGraphsRoute,
  dashboardRoute,
  editBatteryCellRoute,
  landingRoute,
  loginRoute,
  manageCsvRoute,
  notFound404Route,
  profileRoute,
  registerRoute,
} from 'constants/routes';
import DashboardLayout from 'layouts/dashboard';
import LogoOnlyLayout from 'layouts/LogoOnlyLayout';
import AddBatteryCell from 'pages/AddBatteryCell';
import AllBatteryCells from 'pages/AllBatteryCells';
import Graphs from 'pages/BatteryCellGraphs';
import DashboardApp from 'pages/DashboardApp';
import EditBatteryCell from 'pages/EditBatteryCell';
import Landing from 'pages/Landing';
import Login from 'pages/Login';
import ManageCsv from 'pages/ManageCsv';
import NotFound from 'pages/Page404';
import Profile from 'pages/Profile';
import ProtectedRoute from 'pages/ProtectedRoute';
import Register from 'pages/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ThemeProvider from 'theme';

export default function App() {
  return (
    <ThemeProvider>
      <BaseOptionChartStyle />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<LogoOnlyLayout />}>
            <Route index path={landingRoute} element={<Landing />} />
            <Route path={loginRoute} element={<Login />} />
            <Route path={registerRoute} element={<Register />} />
            <Route path={notFound404Route} element={<NotFound />} />
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path={dashboardRoute} element={<DashboardApp />} />
            <Route path={allBatteryCellsRoute} element={<AllBatteryCells />} />
            <Route path={addBatteryCellRoute} element={<AddBatteryCell />} />
            <Route path={editBatteryCellRoute} element={<EditBatteryCell />} />
            <Route path={batteryCellGraphsRoute} element={<Graphs />} />
            <Route path={manageCsvRoute} element={<ManageCsv />} />
            <Route path={profileRoute} element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
