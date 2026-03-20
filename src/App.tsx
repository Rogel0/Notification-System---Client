import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function AppFrame() {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  return (
    <>
      {isAuthRoute ? null : (
        <header className="sticky top-0 z-10 bg-white shadow">
          <nav className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8">
            <div className="text-xl font-bold tracking-tight text-blue-700">
              SalesPilot
            </div>
            <div className="space-x-2 md:space-x-6">
              <Link
                to="/register"
                className="rounded px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-50"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="rounded px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-50"
              >
                Login
              </Link>
              <Link
                to="/profile"
                className="rounded px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-50"
              >
                Profile
              </Link>
            </div>
          </nav>
        </header>
      )}

      <main className={isAuthRoute ? "" : "min-h-screen bg-gray-50"}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppFrame />
    </Router>
  );
}

export default App;
