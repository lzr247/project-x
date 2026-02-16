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
import { ThemeToggle } from "./ThemeToggle";

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
      <header className="fixed left-0 right-0 top-0 z-20 flex h-16 items-center justify-between bg-sidebar px-4 shadow-soft lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-sidebar-text transition-colors hover:text-white"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <span className="text-lg font-semibold text-white">Project X</span>
        <div className="w-8" />
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar transition-all duration-300 ease-in-out lg:sticky ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${collapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        {/* Logo section */}
        <div
          className={`flex h-16 items-center border-b border-sidebar-border ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}
        >
          {!collapsed && <span className="text-xl font-bold tracking-tight text-white">Project X</span>}
          {collapsed && <span className="text-xl font-bold text-white">X</span>}

          {/* Collapse button - desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-sidebar-text transition-all hover:bg-sidebar-hover hover:text-white lg:flex"
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>

          {/* Close button - mobile only */}
          <button onClick={closeSidebar} className="p-2 text-sidebar-text hover:text-white lg:hidden">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${collapsed ? "justify-center" : ""} ${
                      isActive
                        ? "bg-accent text-white shadow-soft"
                        : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <FontAwesomeIcon icon={item.icon} className={collapsed ? "text-lg" : ""} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-3">
          {/* User info */}
          {!collapsed && user && (
            <div className="mb-2 px-3 py-2">
              <p className="truncate text-sm font-medium text-white">{user.name || user.email}</p>
              <p className="truncate text-xs text-sidebar-text">{user.email}</p>
            </div>
          )}

          {/* Theme toggle */}
          <div className={`mb-2 ${collapsed ? "" : "px-1"}`}>
            <ThemeToggle collapsed={collapsed} />
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sidebar-text transition-all duration-200 hover:bg-sidebar-hover hover:text-white ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Logout" : undefined}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen flex-1">
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
