import Link from "next/link";
import { useRouter } from "next/router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/assessment", label: "Assessment", icon: "📝" },
  { href: "/survey", label: "Survey", icon: "📋" },
  { href: "/resources", label: "Resources", icon: "📚" },
];

export default function SidePanel({ expanded, toggle }) {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-50 flex flex-col items-center transition-all duration-200 ease-in-out ${expanded ? "w-64" : "w-16"}`}
      style={{ transitionProperty: "width" }}
    >
      <div className="flex flex-col justify-center h-full w-full">
        {/* Toggle button, always visible and centered vertically */}
        <button
          className="mx-auto p-2 rounded-full hover:bg-blue-100 text-blue-700 mt-4"
          onClick={toggle}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? <FiChevronLeft className="w-6 h-6" /> : <FiChevronRight className="w-6 h-6" />}
        </button>
        {/* User info only when expanded */}
        {expanded && user && (
          <div className="flex flex-col items-center gap-1 px-4 py-4 border-b">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700">
              {user.displayName?.[0] || user.email?.[0] || "U"}
            </div>
            <div className="font-semibold text-gray-900 text-sm text-center break-all">{user.displayName || user.email}</div>
            <div className="text-xs text-gray-500 text-center break-all">{user.email}</div>
          </div>
        )}
        {/* Navigation only when expanded */}
        {expanded && (
          <nav className="flex-1 flex flex-col gap-1 mt-8">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} legacyBehavior>
                <a
                  className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors ${router.pathname === link.href ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50"}`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </aside>
  );
} 