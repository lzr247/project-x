import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import Pomodoro from "./pages/Pomodoro";
import Projects from "./pages/Projects";
import RegistrationPage from "./pages/Registration";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />

        {/* Private routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
