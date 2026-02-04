import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import Pomodoro from "./pages/Pomodoro";
import ProjectDetails from "./pages/ProjectDetails";
import Projects from "./pages/Projects";
import RegistrationPage from "./pages/Registration";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
          </Route>

          {/* Private routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: ".75rem",
          },
        }}
      />
    </>
  );
};

export default App;
