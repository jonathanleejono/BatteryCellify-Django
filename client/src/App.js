import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Landing, Error, Register, ProtectedRoute } from "./pages";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Profile,
  AddBatteryCell,
  EditBatteryCell,
  AllBatteryCells,
  Stats,
  SharedLayout,
  Graphs,
} from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-battery-cells" element={<AllBatteryCells />} />
          <Route path="add-battery-cell" element={<AddBatteryCell />} />
          <Route path="graphs" element={<Graphs />} />
          <Route path="edit-battery-cell" element={<EditBatteryCell />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="landing" element={<Landing />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        transition={Slide}
      />
    </BrowserRouter>
  );
}

export default App;
