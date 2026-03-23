import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import AddPlan from "./pages/AddPlan";
import CalendarPage from "./pages/CalendarPage";
import { useAuth } from "./hooks/useAuth";
import { AppShell } from "./components/layout/AppShell";

function AppFrame() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (loading)
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        Loading…
      </div>
    );

  return (
    <main className="h-[90vh]">
      <Routes>
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/calendar"
          element={
            isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/plan"
          element={isAuthenticated ? <AddPlan /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <Router>
      <AppShell>
        <AppFrame />
      </AppShell>
    </Router>
  );
}

export default App;
