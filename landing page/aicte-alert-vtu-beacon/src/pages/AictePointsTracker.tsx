import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const domains = [
  { name: 'Technical Skills', earned: 25, total: 30, color: '#22c55e' }, // green-500
  { name: 'Soft Skills', earned: 15, total: 20, color: '#3b82f6' }, // blue-500
  { name: 'Community Service', earned: 20, total: 30, color: '#eab308' }, // yellow-500
  { name: 'Innovation & Entrepreneurship', earned: 10, total: 20, color: '#fb923c' }, // orange-500
];

const events = [
  { name: 'Hackathon', domain: 'Technical Skills', points: 10, semester: 4 },
  { name: 'Workshop', domain: 'Technical Skills', points: 15, semester: 5 },
  { name: 'Public Speaking', domain: 'Soft Skills', points: 10, semester: 6 },
  { name: 'Teamwork Seminar', domain: 'Soft Skills', points: 5, semester: 7 },
  { name: 'Blood Donation', domain: 'Community Service', points: 10, semester: 5 },
  { name: 'Tree Plantation', domain: 'Community Service', points: 10, semester: 6 },
  { name: 'Startup Bootcamp', domain: 'Innovation & Entrepreneurship', points: 10, semester: 7 },
];

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
const aicteMaxScore = 100;

const AictePointsTracker = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = React.useState<number | null>(null);
  const graphContainerRef = React.useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    // Function to update user data
    const updateUserData = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUserData(JSON.parse(stored));
      }
    };

    // Listen for storage events
    window.addEventListener('storage', updateUserData);
    // Listen for custom storage event
    window.addEventListener('storage', updateUserData);

    // Initial check
    updateUserData();

    return () => {
      window.removeEventListener('storage', updateUserData);
    };
  }, []);

  const aicteScore = userData?.aictePoints || 0;
  const pointsBySemester = semesters.map((sem, idx) =>
    idx === semesters.length - 1
      ? aicteScore
      : events.filter((e) => e.semester <= sem).reduce((sum, e) => sum + e.points, 0)
  );
  const targetBySemester = semesters.map((sem) => (100 / 8) * sem);

  // Tooltip position calculation (relative to graph container)
  let tooltip = null;
  if (hovered !== null && graphContainerRef.current) {
    const x = 40 + hovered * 48;
    const y = 220 - (pointsBySemester[hovered] * 2);
    const tooltipWidth = 140;
    const tooltipHeight = 56;
    let left = x - tooltipWidth / 2;
    let top = y - tooltipHeight - 18; // a bit higher for the arrow
    // Clamp to container
    left = Math.max(0, Math.min(left, 440 - tooltipWidth));
    top = Math.max(0, top);
    // Arrow position relative to tooltip
    const arrowLeft = tooltipWidth / 2 - 8; // 8px is half arrow width
    tooltip = (
      <div
        style={{
          position: 'absolute',
          left,
          top,
          zIndex: 1000,
          pointerEvents: 'none',
        }}
        className="bg-gray-800 text-white text-xs rounded-lg px-4 py-2 shadow-lg font-normal leading-normal"
      >
        <div className="font-bold mb-1">Sem {semesters[hovered]}</div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-vtu-blue inline-block border border-white" />
          <span>AICTE Points: <span className="font-semibold">{pointsBySemester[hovered]}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-gray-300 inline-block border border-white" />
          <span>Target: <span className="font-semibold">{targetBySemester[hovered].toFixed(1)}</span></span>
        </div>
        {/* Arrow pointing to dot */}
        <span
          style={{
            position: 'absolute',
            left: `${arrowLeft}px`,
            top: '100%',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '10px solid #1f2937', // gray-800
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-vtu-green/10 flex items-center justify-center py-12 px-4 relative">
      {/* Back button fixed to top-left */}
      <Button
        variant="ghost"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-vtu-blue hover:bg-vtu-blue/10"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </Button>
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">AICTE Points Summary</h2>
            <span className="bg-vtu-green text-white font-bold px-4 py-1 rounded-full text-sm transition-transform duration-200 hover:scale-110 shadow-lg cursor-pointer" style={{boxShadow: '0 2px 8px 0 #22c55e55'}}>{aicteScore} Points</span>
          </div>
          {/* Domain Progress Bars - each bar under its domain */}
          <div className="space-y-4 mb-8">
            {domains.map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between text-sm font-medium mb-1">
                  <span className="text-gray-700">{d.name} ({d.earned}/{d.total})</span>
                  <span className="text-gray-500">{Math.round((d.earned / d.total) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200">
                  <div style={{ width: `${(d.earned / d.total) * 100}%`, backgroundColor: d.color }} className={`h-2 rounded-full`}></div>
                </div>
              </div>
            ))}
          </div>
          {/* Legend above graph */}
          <div className="flex items-center gap-6 mb-2 justify-center">
            <span className="inline-flex items-center gap-2 text-vtu-blue font-semibold text-base">
              <span className="w-5 h-5 rounded-full bg-vtu-blue inline-block border-2 border-white shadow" /> AICTE Points
            </span>
            <span className="inline-flex items-center gap-2 text-gray-500 font-semibold text-base">
              <span className="w-5 h-5 rounded-full bg-gray-300 inline-block border-2 border-white shadow" /> Target
            </span>
          </div>
          {/* Semester Graph */}
          <div ref={graphContainerRef} className="bg-white rounded-lg p-4 shadow border border-gray-100 relative h-64 w-full">
            <svg width="100%" height="100%" viewBox="0 0 440 240" className="absolute left-0 top-0">
              {/* Axes */}
              <line x1="40" y1="20" x2="40" y2="220" stroke="#222" strokeWidth="2" /> {/* Y axis */}
              <line x1="40" y1="220" x2="420" y2="220" stroke="#222" strokeWidth="2" /> {/* X axis */}
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1={40}
                  x2={420}
                  y1={220 - y * 2}
                  y2={220 - y * 2}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
              ))}
              {/* Y-axis labels */}
              {[0, 25, 50, 75, 100].map((y) => (
                <text
                  key={y}
                  x={30}
                  y={225 - y * 2}
                  fontSize="12"
                  fill="#888"
                  textAnchor="end"
                  alignmentBaseline="middle"
                >
                  {y}
                </text>
              ))}
              {/* Target dashed line */}
              <polyline
                fill="none"
                stroke="#d1d5db"
                strokeWidth="2"
                strokeDasharray="6 4"
                points={semesters.map((s, i) => `${40 + i * 48},${220 - (targetBySemester[i] * 2)}`).join(' ')}
              />
              {/* Area fill */}
              <polygon
                fill="rgba(59,130,246,0.12)"
                points={semesters.map((s, i) => `${40 + i * 48},${220 - (pointsBySemester[i] * 2)}`).join(' ') + ` 388,220 40,220`}
              />
              {/* Points line */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                points={semesters.map((s, i) => `${40 + i * 48},${220 - (pointsBySemester[i] * 2)}`).join(' ')}
              />
              {/* Dots and interactivity */}
              {semesters.map((s, i) => (
                <g key={s}>
                  <circle
                    cx={40 + i * 48}
                    cy={220 - (pointsBySemester[i] * 2)}
                    r={5}
                    fill="#6366f1"
                    stroke="#fff"
                    strokeWidth={1.5}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setHovered(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </g>
              ))}
            </svg>
            {tooltip}
          </div>
          {/* Event Classification */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Attended Events by Domain</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domains.map((d) => (
                <div
                  key={d.name}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 transition-transform duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                  <div className="font-bold text-vtu-blue mb-2">{d.name}</div>
                  <ul className="text-sm text-gray-700 list-disc ml-5">
                    {events.filter(e => e.domain === d.name).map(e => (
                      <li key={e.name + e.semester}>{e.name} <span className="text-gray-400">({e.points} pts, Sem {e.semester})</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AictePointsTracker; 