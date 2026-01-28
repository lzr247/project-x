import {
  faBars,
  faChartLine,
  faChevronLeft,
  faClock,
  faFolderOpen,
  faRightFromBracket,
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
  const user = useAuthStore((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-sidebar flex items-center justify-between px-4 lg:hidden z-20 shadow-soft">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-sidebar-text hover:text-white p-2 transition-colors"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <span className="text-white text-lg font-semibold">Project X</span>
        <div className="w-8" />
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-sidebar flex flex-col z-40
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-64
        `}
      >
        {/* Logo section */}
        <div
          className={`h-16 flex items-center border-b border-sidebar-border ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}
        >
          {!collapsed && (
            <span className="text-white text-xl font-bold tracking-tight">
              Project X
            </span>
          )}
          {collapsed && <span className="text-white text-xl font-bold">X</span>}

          {/* Collapse button - desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg
              text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-all"
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>

          {/* Close button - mobile only */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-sidebar-text hover:text-white p-2"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                    ${collapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-accent text-white shadow-soft"
                        : "text-sidebar-text hover:text-white hover:bg-sidebar-hover"
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={collapsed ? "text-lg" : ""}
                  />
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-3">
          {/* User info */}
          {!collapsed && user && (
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium text-white truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-sidebar-text truncate">{user.email}</p>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-3 w-full rounded-xl
              text-sidebar-text hover:text-white hover:bg-sidebar-hover
              transition-all duration-200
              ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Logout" : undefined}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top spacing for mobile header */}
        <div className="h-16 lg:hidden" />

        {/* Content area */}
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
