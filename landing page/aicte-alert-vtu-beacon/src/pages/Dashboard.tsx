import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { User, FileText, Activity, Clock, HelpCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Help from './Help';

const menu = [
  { label: 'Profile', icon: <User className="h-5 w-5" />, path: 'profile' },
  { label: 'AICTE Points Tracker', icon: <Activity className="h-5 w-5" />, path: 'points' },
  { label: 'Certificates', icon: <FileText className="h-5 w-5" />, path: 'certificates' },
  { label: 'Activity Log', icon: <Clock className="h-5 w-5" />, path: 'activity' },
  { label: 'Help', icon: <HelpCircle className="h-5 w-5" />, path: 'help' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
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

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        {/* Sidebar */}
        <Sidebar
          variant="sidebar"
          collapsible="offcanvas"
          className="fixed z-40 left-0 top-0 h-full w-64 bg-[#101624] text-white shadow-2xl border-r border-blue-900/40 transition-all duration-300"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-6 border-b border-blue-900/40">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold text-white">
                  {userData?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-semibold text-lg">{userData?.name || 'Welcome'}</div>
                  <div className="text-xs text-blue-200">
                    {userData?.aictePoints !== undefined ? `${userData.aictePoints} AICTE Points` : 'Student'}
                  </div>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-blue-200 hover:text-white p-1 rounded-full hover:bg-blue-900/30 transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-8">
              <div className="uppercase text-xs text-blue-300 mb-4 tracking-widest">Navigation</div>
              <ul className="space-y-2">
                {menu.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        if (item.label === 'Help') {
                          navigate('/help');
                        } else {
                          if (item.path.startsWith('/')) {
                            navigate(item.path);
                          } else {
                            navigate(`/dashboard/${item.path}`);
                          }
                        }
                      }}
                      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-blue-100 hover:bg-blue-900/40 hover:text-white transition group shadow-sm`}
                    >
                      <span className="text-blue-400 group-hover:text-blue-200 drop-shadow-glow">{item.icon}</span>
                      <span className="font-medium text-base group-hover:text-white">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="text-center text-xs text-blue-400 pb-4 pt-8 opacity-70">
              VTU AICTE Tracker v1.0
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "http://localhost:3001/login/index.html";
              }}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded mt-4 transition"
            >
              Logout
            </button>
          </div>
        </Sidebar>
        {/* Overlay for mobile/close */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <SidebarTrigger />
          <div className="p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="text-blue-200">Select a menu item from the sidebar.</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard; 