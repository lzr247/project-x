import {
  faBars,
  faChartLine,
  faClock,
  faFolderOpen,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const navItems = [
  { path: "/", label: "Dashboard", icon: faChartLine },
  { path: "/projects", label: "Projects", icon: faFolderOpen },
  { path: "/pomodoro", label: "Pomodoro", icon: faClock },
];

export const Layout = () => {
  const logout = useAuthStore((state) => state.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile header */}
      <header
        className="fixed top-0 left-0 right-0 h-16 bg-primary flex items-center
          px-4 lg:hidden z-20"
      >
        <button onClick={() => setSidebarOpen(true)} className="text-white p-2">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <span className="text-white text-xl font-bold ml-4">project-x</span>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-primary text-white flex
          flex-col z-40 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:min-h-screen`}
      >
        {/* Logo */}
        <div
          className="p-6 text-xl font-bold border-b border-primary-700 flex
            justify-between items-center"
        >
          <span>project-x</span>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-secondary-200 hover:text-white"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors ${
                      isActive
                        ? "bg-accent text-white"
                        : "text-secondary-200 hover:bg-primary-700"
                    }`
                  }
                >
                  <FontAwesomeIcon icon={item.icon} />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full
              text-secondary-200 hover:bg-primary-700 rounded-lg
              transition-colors"
          >
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-surface p-4 pt-20 lg:p-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
};
