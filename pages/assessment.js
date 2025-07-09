import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";

const unlockedFeatures = [
  { icon: "🚀", title: "Startup Toolkit", desc: "Access essential founder resources." },
  { icon: "🤝", title: "Co-founder Match", desc: "Get matched with potential co-founders." },
  { icon: "📈", title: "Growth Insights", desc: "Personalized tips to grow your project." },
  { icon: "🎟️", title: "Events & Launches", desc: "Never miss a startup event or launch." },
];
const announcements = [
  { title: "Pitch Night: July 15th", desc: "Register now for our next virtual pitch event!" },
  { title: "New: Founder Stories", desc: "Read how others overcame early challenges." },
  { title: "Resource Drop", desc: "Check out our new legal templates for startups." },
];

export default function Assessment() {
  const { user } = useAuth();
  const router = useRouter();
  const firstName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Founder";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {firstName}!</h1>
        <p className="text-lg text-gray-700 mb-6">Your personalized dashboard is ready. Explore your unlocked features and next steps below.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {unlockedFeatures.map((f, i) => (
            <div key={i} className="flex items-center bg-white rounded-lg shadow p-6 gap-4">
              <span className="text-4xl">{f.icon}</span>
              <div>
                <div className="font-semibold text-lg text-gray-900">{f.title}</div>
                <div className="text-gray-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-2">Ready for your next step?</h2>
            <button
              className="mt-2 px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors text-lg"
              onClick={() => router.push("/assessment/quiz")}
            >
              Take Assessment
            </button>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Announcements & Resources</h2>
            <ul className="space-y-3">
              {announcements.map((a, i) => (
                <li key={i} className="border-b pb-2 last:border-b-0">
                  <div className="font-medium text-gray-800">{a.title}</div>
                  <div className="text-gray-500 text-sm">{a.desc}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 