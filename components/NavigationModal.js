import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiSettings, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/assessment", label: "Assessment", icon: "📝" },
  { href: "/survey", label: "Survey", icon: "📋" },
  { href: "/resources", label: "Resources", icon: "📚" },
];

export default function NavigationModal({ open, onClose }) {
  const { user, signout } = useAuth();
  const router = useRouter();

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity"
        onClick={onClose}
      />
      {/* Modal panel (left) */}
      <div
        className="fixed top-0 left-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 flex flex-col animate-slideInLeft"
        style={{ willChange: "transform" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close navigation modal"
        >
          <FiX className="w-6 h-6" />
        </button>
        {/* User info */}
        <div className="flex items-center gap-3 px-6 py-8 border-b mt-8">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
            {user?.displayName?.[0] || user?.email?.[0] || "U"}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{user?.displayName || user?.email}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} legacyBehavior>
              <a
                className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors ${router.pathname === link.href ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-blue-50"}`}
                onClick={onClose}
              >
                <span className="text-xl">{link.icon}</span> {link.label}
              </a>
            </Link>
          ))}
        </nav>
        {/* Settings & Sign Out */}
        <div className="px-6 py-4 border-t bg-blue-50 flex flex-col gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-blue-700 hover:bg-blue-100"
            onClick={() => { onClose(); router.push("/settings"); }}
          >
            <FiSettings className="w-5 h-5" /> Settings
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-red-600 hover:bg-red-100"
            onClick={signout}
          >
            Sign Out
          </button>
        </div>
      </div>
      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.25s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
} 