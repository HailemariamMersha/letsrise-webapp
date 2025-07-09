import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { FiX } from "react-icons/fi";

const STATEMENTS = [
  "I enjoy solving complex problems.",
  "I like working in teams.",
  "I am comfortable with uncertainty.",
  "I seek feedback to improve.",
  "I am motivated by challenges.",
  "I value clear communication.",
  "I adapt quickly to change.",
  "I am persistent in reaching goals.",
  "I enjoy learning new things.",
  "I take initiative in projects.",
  "I am open to constructive criticism.",
  "I manage my time effectively.",
  "I am resourceful under pressure.",
  "I set clear goals for myself.",
  "I am comfortable making decisions.",
  "I enjoy mentoring others.",
  "I am proactive in seeking solutions.",
  "I handle setbacks with resilience.",
  "I am detail-oriented.",
  "I thrive in fast-paced environments."
];
const FEEDBACKS = [
  "Great choice! Problem solvers are key to innovation.",
  "Teamwork makes the dream work!",
  "Embracing uncertainty is a founder's superpower.",
  "Feedback fuels growth. Well done!",
  "Challenge accepted! That's the spirit.",
  "Clear communication builds strong teams.",
  "Adaptability is essential for success.",
  "Persistence pays off! Keep going.",
  "Curiosity drives progress. Love it!",
  "Initiative is the first step to leadership.",
  "Openness to feedback accelerates growth!",
  "Time management is a super skill!",
  "Resourcefulness wins in tough times.",
  "Goal setting is the path to achievement.",
  "Decisiveness drives progress!",
  "Mentoring multiplies impact. Well done!",
  "Proactivity leads to solutions!",
  "Resilience is your secret weapon.",
  "Attention to detail sets you apart.",
  "Thriving in fast-paced settings is a true asset!"
];
const SET_SIZE = 5;

// Placeholder user and assessment IDs (replace with real values from auth/context)
const USER_ID = 1;
const ASSESSMENT_ID = 1;

export default function AssessmentQuiz() {
  const [currentSet, setCurrentSet] = useState(0);
  const [selected, setSelected] = useState({});
  const [flipped, setFlipped] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const boardRef = useRef();
  const containerRef = useRef();

  const setStart = currentSet * SET_SIZE;
  const setEnd = setStart + SET_SIZE;
  const statements = STATEMENTS.slice(setStart, setEnd);
  const totalSets = Math.ceil(STATEMENTS.length / SET_SIZE);

  useEffect(() => {
    setProgress(selected[currentSet] !== undefined ? 1 : 0);
  }, [selected, currentSet]);

  // Save answers to the database after the last answer is selected
  useEffect(() => {
    if (submitted) {
      setSaving(true);
      setSaveError(null);
      // Prepare all answers as an array
      const answers = Object.entries(selected).map(([setIdx, statementIdx]) => {
        const question_number = parseInt(setIdx) * SET_SIZE + 1;
        return {
          user_id: USER_ID,
          assessment_id: ASSESSMENT_ID,
          question_number,
          selected_option: statementIdx,
        };
      });
      // Send all answers (one request per answer)
      Promise.all(
        answers.map((ans, i) =>
          fetch('/api/assessment-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ans, question_number: ans.question_number }),
          })
        )
      )
        .then(() => setSaving(false))
        .catch((err) => {
          setSaveError('There was an error saving your answers.');
          setSaving(false);
        });
    }
  }, [submitted]);

  const handleSelect = (idx) => {
    if (selected[currentSet] !== undefined) return;
    setSelected((prev) => ({ ...prev, [currentSet]: idx }));
    setFeedback(FEEDBACKS[setStart + idx]);
    setFlipped(true);
    setTimeout(() => {
      setFlipped(false);
      setFeedback("");
      if (setEnd < STATEMENTS.length) {
        setScrolling(true);
        setTimeout(() => {
          setCurrentSet((s) => s + 1);
          setScrolling(false);
        }, 500);
      } else {
        // If this was the last answer, show the completion message and trigger save
        setTimeout(() => setSubmitted(true), 500);
      }
    }, 1800);
  };

  const handleClose = () => {
    window.location.href = "/dashboard";
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
          <p className="text-lg text-gray-700 mb-4">You have completed the assessment.</p>
          <p className="text-lg text-green-700 mb-6">Your answers are saved in our database.</p>
          {saving && <div className="text-blue-600">Saving your answers...</div>}
          {saveError && <div className="text-red-600">{saveError}</div>}

          {/* Beautiful Personalized Report */}
          <div className="mt-10 p-8 bg-gradient-to-br from-purple-100 via-blue-50 to-white rounded-2xl shadow-xl max-w-2xl mx-auto border border-blue-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left: Identity and Qualities */}
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold text-purple-700 mb-2 tracking-tight">Your Identity: <span className="text-blue-700">The Visionary</span></h2>
                <p className="mb-4 text-gray-700 text-lg">You are a big-picture thinker who inspires others with your ideas and optimism. You thrive in environments where you can innovate and lead teams toward ambitious goals.</p>
                <div>
                  <h3 className="font-semibold mb-2 text-lg text-gray-800">Top Qualities</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-6 h-6 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center">🌟</span>
                      Creativity
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-6 h-6 bg-green-200 text-green-700 rounded-full flex items-center justify-center">🤝</span>
                      Leadership
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-6 h-6 bg-yellow-200 text-yellow-700 rounded-full flex items-center justify-center">💡</span>
                      Optimism
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="inline-block w-6 h-6 bg-pink-200 text-pink-700 rounded-full flex items-center justify-center">🚀</span>
                      Ambition
                    </li>
                  </ul>
                </div>
              </div>
              {/* Right: Radar Chart */}
              <div className="flex-1 flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-700 mb-2">Your Qualities Radar</span>
                {/* SVG Radar Chart Placeholder */}
                <svg width="180" height="180" viewBox="0 0 180 180" className="mb-2">
                  <polygon points="90,30 150,60 130,140 50,140 30,60" fill="#a5b4fc" fillOpacity="0.4"/>
                  <polygon points="90,60 130,80 120,130 60,130 50,80" fill="#6366f1" fillOpacity="0.7"/>
                  <circle cx="90" cy="90" r="80" fill="none" stroke="#6366f1" strokeWidth="2"/>
                </svg>
                <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-500">
                  <span>Creativity</span>
                  <span>Leadership</span>
                  <span>Optimism</span>
                  <span>Ambition</span>
                  <span>Resilience</span>
                </div>
              </div>
            </div>
            {/* Growth Opportunities */}
            <div className="mt-8">
              <h3 className="font-semibold mb-2 text-lg text-gray-800">Growth Opportunities</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Balance vision with practical steps for execution.</li>
                <li>Seek feedback from diverse perspectives to refine your ideas.</li>
                <li>Mentor others to multiply your impact.</li>
                <li>Develop resilience by embracing challenges.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* X button */}
        <button
          className="absolute top-8 right-8 z-10 p-2 rounded-full hover:bg-gray-200 text-gray-500"
          onClick={handleClose}
          aria-label="Save for later"
        >
          <FiX className="w-7 h-7" />
        </button>
        {/* Progress bar */}
        <div className="w-full max-w-2xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{currentSet + 1} / {totalSets}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSet + (progress ? 1 : 0)) / totalSets) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* Assessment board container for scroll animation */}
        <div
          ref={containerRef}
          className={`relative w-full max-w-2xl h-[520px] flex flex-col items-center overflow-hidden`}
          style={{ perspective: 1000 }}
        >
          <div
            ref={boardRef}
            className={`absolute w-full h-full transition-transform duration-500 ${flipped ? 'flip-180' : ''} ${scrolling ? 'scroll-up' : ''}`}
            style={{ minHeight: 420 }}
          >
            {!flipped ? (
              <div className="flex flex-col items-center h-full w-full backface-visible">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose the statement that best describes you</h2>
                <div className="w-full flex flex-col gap-4">
                  {statements.map((statement, idx) => (
                    <button
                      key={idx}
                      className={`w-full py-5 px-6 rounded-lg border text-lg font-medium transition-colors duration-200 focus:outline-none ${selected[currentSet] === idx ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-gray-300 hover:bg-blue-50'}`}
                      onClick={() => handleSelect(idx)}
                      disabled={selected[currentSet] !== undefined}
                    >
                      {statement}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full backface-visible rotate-y-180">
                <div className="text-2xl font-bold text-green-600 mb-4">{feedback}</div>
                <div className="text-gray-500">Loading next...</div>
              </div>
            )}
          </div>
        </div>
        {/* Flip and scroll animations */}
        <style jsx global>{`
          .flip-180 {
            transform: rotateY(180deg);
            transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
          }
          .backface-visible {
            backface-visibility: visible;
          }
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          .scroll-up {
            animation: scrollUp 0.5s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes scrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-120%); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
} 