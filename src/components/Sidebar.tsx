import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { PersonLogo } from "../assets";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar drawer */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-2xl text-neutral-700 hover:text-orange-400 transition-colors"
        >
          ✕
        </button>

        {/* Sidebar content */}
        <div className="flex flex-col h-full pt-16 px-6 pb-6 items-start text-left">
          {/* Navigation links */}
          <nav className="flex flex-col gap-6 flex-1">
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive
                    ? "text-orange-400"
                    : "text-neutral-700 hover:text-orange-400"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              onClick={onClose}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive
                    ? "text-orange-400"
                    : "text-neutral-700 hover:text-orange-400"
                }`
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/dashboard"
              onClick={onClose}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive
                    ? "text-orange-400"
                    : "text-neutral-700 hover:text-orange-400"
                }`
              }
            >
              Dashboard
            </NavLink>

            {/* Mobile-specific items */}
            <div className="w-full border-t border-gray-200 pt-6">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-start gap-3 w-full text-left text-lg font-medium text-neutral-700 hover:text-orange-400 transition-colors"
              >
                <img src={PersonLogo} alt="Profile" className="w-6 h-6" />
                <span>Profile</span>
              </button>

              {isProfileOpen && (
                <div className="mt-3 pl-9 flex flex-col items-start gap-3">
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="text-left text-neutral-600 hover:text-orange-400 transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={onClose}
                    className="text-left text-neutral-600 hover:text-orange-400 transition-colors"
                  >
                    Settings
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Auth links at bottom */}
          <div className="w-full border-t border-gray-200 pt-6 flex flex-row gap-3">
            <Link
              to="/signin"
              onClick={onClose}
              className="w-full text-left px-4 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="w-full text-left px-4 py-2 bg-orange-400 text-white font-medium rounded-lg hover:bg-orange-500 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
