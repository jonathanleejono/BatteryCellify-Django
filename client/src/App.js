// routes
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
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
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import routes from './testRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <BaseOptionChartStyle />
      {/* <Router /> */}

      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* <Route path="/"> */}
          <Route element={<LogoOnlyLayout />}>
            <Route index path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
          <Route
            // path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardApp />} />
            <Route path="/all-battery-cells" element={<AllBatteryCells />} />
            <Route path="/add-battery-cell" element={<AddBatteryCell />} />
            <Route path="/edit-battery-cell" element={<EditBatteryCell />} />
            <Route path="/graphs" element={<Graphs />} />
            <Route path="/manage-csv" element={<ManageCsv />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
