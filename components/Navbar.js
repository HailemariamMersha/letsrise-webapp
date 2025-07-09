import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import SidePanel from "./SidePanel";
import { useState, useEffect, useRef } from "react";
import { FiSettings, FiUser } from "react-icons/fi";

export default function Navbar({ children }) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [sidePanelExpanded, setSidePanelExpanded] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const accountRef = useRef();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountDropdownOpen(false);
      }
    }
    if (accountDropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [accountDropdownOpen]);

  return (
    <div>
      <SidePanel expanded={sidePanelExpanded} toggle={() => setSidePanelExpanded((v) => !v)} />
      <nav className={`bg-white shadow sticky top-0 z-50 transition-all duration-200 ${sidePanelExpanded ? 'ml-64' : 'ml-16'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              {/* Letsrise logo as button to toggle SidePanel */}
              <button
                className="text-xl font-bold text-blue-700 focus:outline-none"
                onClick={() => setSidePanelExpanded((v) => !v)}
                aria-label="Open navigation menu"
                type="button"
              >
                Letsrise
              </button>
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="ml-4 text-gray-600 hover:text-gray-900"
                >
                  Admin
                </Link>
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* Account dropdown on the right */}
              {user && (
                <div className="relative" ref={accountRef}>
                  <button
                    className="p-2 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Account"
                    onClick={() => setAccountDropdownOpen((v) => !v)}
                  >
                    <FiUser className="w-6 h-6 text-blue-700" />
                  </button>
                  {accountDropdownOpen && (
                    <div
                      className="fixed left-auto right-4 top-16 min-w-48 max-w-xs bg-white border rounded-lg shadow-lg z-50 overflow-auto"
                      style={{ maxHeight: 'calc(100vh - 5rem)' }}
                    >
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-gray-700"
                        onClick={() => { setAccountDropdownOpen(false); router.push("/settings"); }}
                      >
                        <FiSettings className="w-5 h-5" /> Settings
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-red-600"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className={`transition-all duration-200 ${sidePanelExpanded ? 'ml-64' : 'ml-16'}`}>
        {children}
      </main>
    </div>
  );
} 