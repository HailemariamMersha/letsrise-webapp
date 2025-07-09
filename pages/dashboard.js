import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const FAKE_DATA = {
  matches: [
    { name: 'Ava Johnson', expertise: 'Fintech', lookingFor: 'Co-founder (Tech)' },
    { name: 'Samuel Lee', expertise: 'Healthcare', lookingFor: 'Co-founder (Business)' },
    { name: 'Priya Patel', expertise: 'E-commerce', lookingFor: 'Co-founder (Marketing)' },
  ],
  news: [
    { title: 'SeedRaise closes $2M round for African startups', date: 'June 2024' },
    { title: 'HealthX raises $500K to expand telemedicine', date: 'May 2024' },
    { title: 'EduSpark wins national innovation award', date: 'April 2024' },
  ],
  launches: [
    { product: 'GreenCart', desc: 'A sustainable grocery delivery app launches in Kenya.' },
    { product: 'SkillBridge', desc: 'Connecting students to internships, now live!' },
    { product: 'QuickPay', desc: 'Instant payment platform launches in Nigeria.' },
  ],
  events: [
    { event: 'Startup Weekend Addis', date: 'July 12-14, 2024' },
    { event: 'Fundraising Masterclass', date: 'August 2, 2024' },
    { event: 'Women in Tech Summit', date: 'September 2024' },
  ],
};

export default function Dashboard() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Modal popup
  const handleCardClick = (type) => {
    setModalContent(type);
    setModalOpen(true);
  };
  const handleBegin = () => {
    setModalOpen(false);
    router.push('/survey');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Letsrise</span>
            </h1>
            <p className="mt-6 text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
              Unlock your entrepreneurial journey.<br />
              <span className="text-blue-700 font-semibold">Find your dream co-founder, stay inspired by real startup wins, and never miss a launch or event.</span>
            </p>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Explore curated matches, trending news, and exclusive opportunities designed to help you build, grow, and thrive.
            </p>
          </div>
        </div>
      </div>

      {/* Curiosity Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Potential Co-founding Matches */}
          <div
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center cursor-pointer"
            onClick={() => handleCardClick('matches')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Potential Co-founding Matches</h3>
            <ul className="text-gray-600 text-center space-y-1 text-base">
              {FAKE_DATA.matches.map((m, i) => (
                <li key={i}><span className="font-semibold">{m.name}</span> <span className="text-blue-700">({m.expertise})</span> <span className="text-gray-500">– Looking for</span> <span className="font-medium">{m.lookingFor}</span></li>
              ))}
            </ul>
            <p className="mt-4 text-blue-600 text-sm font-medium">See your best matches and connect instantly!</p>
          </div>

          {/* News - Successful Fund Raises/News */}
          <div
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center cursor-pointer"
            onClick={() => handleCardClick('news')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Startup News & Fundraising</h3>
            <ul className="text-gray-600 text-center space-y-1 text-base">
              {FAKE_DATA.news.map((n, i) => (
                <li key={i}><span className="font-semibold">{n.title}</span> <span className="text-xs text-gray-400">({n.date})</span></li>
              ))}
            </ul>
            <p className="mt-4 text-green-600 text-sm font-medium">Get inspired by real success stories and funding wins!</p>
          </div>

          {/* Product Launch */}
          <div
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center cursor-pointer"
            onClick={() => handleCardClick('launches')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Product Launches</h3>
            <ul className="text-gray-600 text-center space-y-1 text-base">
              {FAKE_DATA.launches.map((l, i) => (
                <li key={i}><span className="font-semibold">{l.product}</span>: {l.desc}</li>
              ))}
            </ul>
            <p className="mt-4 text-yellow-600 text-sm font-medium">Be the first to discover and celebrate new launches!</p>
          </div>

          {/* Events - Upcoming Events/Workshops */}
          <div
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center cursor-pointer"
            onClick={() => handleCardClick('events')}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Events & Workshops</h3>
            <ul className="text-gray-600 text-center space-y-1 text-base">
              {FAKE_DATA.events.map((e, i) => (
                <li key={i}><span className="font-semibold">{e.event}</span> <span className="text-xs text-gray-400">{e.date}</span></li>
              ))}
            </ul>
            <p className="mt-4 text-purple-600 text-sm font-medium">Join exclusive events and level up your skills!</p>
          </div>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="flex justify-center pb-12">
        <button
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          onClick={() => setModalOpen(true)}
        >
          Get Started
        </button>
      </div>

      {/* Modal Popup for Survey Prompt */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">Take a quick survey to continue</h2>
            <p className="mb-6 text-gray-600">To access this feature, please complete a short survey. It helps us personalize your experience!</p>
            <button
              className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors text-lg"
              onClick={handleBegin}
            >
              Begin
            </button>
          </div>
        </div>
      )}

      {/* Admin Link */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Link href="/admin/dashboard" className="text-yellow-800 hover:text-yellow-900 font-medium">
                Admin Dashboard →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}