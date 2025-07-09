import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Home() {
  const [roleChoice, setRoleChoice] = useState(null);
  const router = useRouter();

  // Simulate: show this screen immediately after login
  // In production, use a flag in user profile or session to show only once
  if (!roleChoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-8 text-center">Welcome to Letsrise</h1>
          <p className="mb-8 text-lg text-gray-700 text-center max-w-xl">Please select your role to continue. Letsrise is a venture intelligence platform helping accelerators, entrepreneurs, and investors connect and succeed.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-2xl">
            <button
              className="p-8 bg-white rounded-xl shadow hover:shadow-lg border border-blue-100 hover:border-blue-400 flex flex-col items-center transition"
              onClick={() => setRoleChoice('entrepreneur')}
            >
              <span className="text-4xl mb-4">🚀</span>
              <span className="text-xl font-semibold mb-2">Entrepreneur</span>
              <span className="text-gray-500 text-center">Take assessments, join courses, and match with cofounders or teams.</span>
            </button>
            <button
              className="p-8 bg-white rounded-xl shadow hover:shadow-lg border border-green-100 hover:border-green-400 flex flex-col items-center transition"
              onClick={() => setRoleChoice('accelerator')}
            >
              <span className="text-4xl mb-4">🏢</span>
              <span className="text-xl font-semibold mb-2">Accelerator</span>
              <span className="text-gray-500 text-center">Post openings, filter applicants, and find the best startups for your program.</span>
            </button>
            <button
              className="p-8 bg-white rounded-xl shadow hover:shadow-lg border border-yellow-100 hover:border-yellow-400 flex flex-col items-center transition"
              onClick={() => setRoleChoice('investor')}
            >
              <span className="text-4xl mb-4">💼</span>
              <span className="text-xl font-semibold mb-2">Investor</span>
              <span className="text-gray-500 text-center">Discover promising startups and track accelerator cohorts.</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Entrepreneur: route to dashboard (or assessment, etc.)
  if (roleChoice === 'entrepreneur') {
    if (typeof window !== 'undefined') {
      router.replace('/dashboard');
    }
    return null;
  }

  // Accelerator or Investor: show placeholder
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6 text-center">Coming Soon</h1>
        <p className="text-lg text-gray-700 text-center max-w-xl">
          The {roleChoice.charAt(0).toUpperCase() + roleChoice.slice(1)} experience is under construction.<br />
          Please check back soon!
        </p>
        <button
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          onClick={() => setRoleChoice(null)}
        >Back to Role Selection</button>
      </div>
    </div>
  );
}
