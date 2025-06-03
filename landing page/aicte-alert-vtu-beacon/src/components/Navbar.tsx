import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut,
  UserRound, 
  LayoutDashboard,
  User,
  FileText,
  Activity,
  Clock,
  HelpCircle,
  X,
  Bell
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import LogoutModal from "@/components/LogoutModal";

const menu = [
  { label: 'Profile', icon: <User className="h-5 w-5" /> },
  { label: 'AICTE Points Tracker', icon: <Activity className="h-5 w-5" /> },
  { label: 'Certificates', icon: <FileText className="h-5 w-5" /> },
  { label: 'Activity Log', icon: <Clock className="h-5 w-5" /> },
  { label: 'Help', icon: <HelpCircle className="h-5 w-5" /> },
];

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  
  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Mock student data - in a real app this would come from your authentication context/state
  const studentData = {
    name: "John Doe",
    vtuId: "1VT20CS001",
    college: "VTU Engineering College"
  };

  const handleProfileClick = () => {
    navigate('/dashboard');
  };

  // Helper to scroll with offset for fixed navbar
  const scrollToSection = (sectionId: string, offset = 80) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const [isFading, setIsFading] = React.useState(false);

  const handleHelpNavigation = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
    navigate('/help');
  };

  const upcomingEventsCount = 3; // Example: replace with real data if available

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {/* Dashboard Icon as Sidebar Trigger */}
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded hover:bg-blue-100 transition">
                <LayoutDashboard className="h-7 w-7 text-[#2563eb]" />
              </button>
              <button className="ml-2 px-2 py-1 rounded bg-transparent font-bold text-2xl flex items-end select-none focus:outline-none">
                <span className="text-black">Point</span>
                <span className="text-[#2563eb]">Mate</span>
              </button>
            </div>
            <div className="hidden md:block">
              <div className="flex justify-center items-center space-x-8 w-full">
                <button 
                  onClick={() => scrollToSection('hero', 80)}
                  className="text-gray-700 hover:text-vtu-blue px-3 py-2 font-medium focus:outline-none"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('how-aicte-helps', 80)}
                  className="text-gray-700 hover:text-vtu-blue px-3 py-2 font-medium focus:outline-none"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('faq', 80)}
                  className="text-gray-700 hover:text-vtu-blue px-3 py-2 font-medium focus:outline-none"
                >
                  FAQ
                </button>
                <button
                  onClick={handleHelpNavigation}
                  className="text-gray-700 hover:text-vtu-blue px-3 py-2 font-medium focus:outline-none transition-colors duration-200"
                >
                  Help
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="relative text-gray-700 hover:text-vtu-blue px-3 py-2 focus:outline-none">
                      <Bell className="h-5 w-5" />
                      {upcomingEventsCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-vtu-green text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-pulse">
                          {upcomingEventsCount}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-64">
                    <div className="font-semibold text-vtu-blue mb-2">Notifications</div>
                    <div className="text-gray-700 text-sm">
                      {upcomingEventsCount > 0
                        ? `There ${upcomingEventsCount === 1 ? 'is' : 'are'} ${upcomingEventsCount} upcoming event${upcomingEventsCount === 1 ? '' : 's'} you can attend!`
                        : 'No upcoming events at the moment.'}
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="flex items-center ml-4 space-x-3">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Avatar className="h-8 w-8 border-2 border-gray-200 cursor-pointer hover:border-vtu-blue transition-colors">
                              <AvatarFallback>
                                {userData?.name ? userData.name.charAt(0).toUpperCase() : <UserRound className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                              Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLogoutModalOpen(true)}>
                              <LogOut className="h-5 w-5 mr-2 text-vtu-blue" />
                              Log Out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 p-4">
                      <div className="flex flex-col space-y-1">
                        <h4 className="text-sm font-semibold">{userData?.name || 'Guest User'}</h4>
                        <p className="text-sm text-gray-500">{userData?.email || 'No email available'}</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Avatar className="h-7 w-7 border border-gray-200 cursor-pointer" onClick={handleProfileClick}>
                    <AvatarFallback>
                      <UserRound className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 p-4">
                  <div className="flex flex-col space-y-1">
                    <h4 className="text-sm font-semibold">{studentData.name}</h4>
                    <p className="text-sm text-gray-500">VTU ID: {studentData.vtuId}</p>
                    <p className="text-sm text-gray-500">{studentData.college}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    aria-label="Logout"
                    className="text-vtu-blue p-2 rounded-full transition-all duration-200 focus:outline-none hover:bg-vtu-blue/10 hover:shadow-md"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  Logout
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </nav>
      {/* Sidebar Overlay and Content */}
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#101624] text-white shadow-2xl border-r border-blue-900/40 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ willChange: 'transform' }}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-6 border-b border-blue-900/40">
              <Avatar className="h-10 w-10 border-2 border-gray-200 bg-white">
                <AvatarFallback>
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : <UserRound className="h-5 w-5 text-vtu-blue" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-lg">{userData?.name || 'Guest User'}</div>
                <div className="text-xs text-blue-200">{userData?.email || 'No email available'}</div>
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
                      className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-blue-100 hover:bg-blue-900/40 hover:text-white transition-all duration-200 group shadow-sm"
                      onClick={() => {
                        if (item.label === 'Profile') {
                          setSidebarOpen(false);
                          setIsFading(true);
                          setTimeout(() => {
                            navigate('/profile');
                            setIsFading(false);
                          }, 200);
                        }
                        if (item.label === 'AICTE Points Tracker') {
                          setSidebarOpen(false);
                          setIsFading(true);
                          setTimeout(() => {
                            navigate('/aicte-points-tracker');
                            setIsFading(false);
                          }, 200);
                        }
                        if (item.label === 'Certificates') {
                          setSidebarOpen(false);
                          setIsFading(true);
                          setTimeout(() => {
                            navigate('/certificates');
                            setIsFading(false);
                          }, 200);
                        }
                        if (item.label === 'Activity Log') {
                          setSidebarOpen(false);
                          setIsFading(true);
                          setTimeout(() => {
                            navigate('/activity-log');
                            setIsFading(false);
                          }, 200);
                        }
                        if (item.label === 'Help') {
                          handleHelpNavigation();
                        }
                      }}
                    >
                      <span className="text-blue-400 group-hover:text-blue-200 drop-shadow-glow">{item.icon}</span>
                      <span className="font-medium text-base group-hover:text-white">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto px-4 pb-6">
              <button
                className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-blue-100 hover:bg-red-700/40 hover:text-white transition group shadow-sm"
                onClick={() => setLogoutModalOpen(true)}
              >
                <span className="text-red-400 group-hover:text-red-200 drop-shadow-glow"><LogOut className="h-5 w-5" /></span>
                <span className="font-medium text-base group-hover:text-white">Logout</span>
              </button>
            </div>
          </div>
        </aside>
      </>
      <LogoutModal
        open={logoutModalOpen}
        onConfirm={async () => {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          if (user && user.email) {
            try {
              await fetch("http://localhost:3000/api/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
              });
            } catch (e) {
              // Optionally handle error (e.g., show a toast)
            }
          }
          localStorage.removeItem("user");
          window.location.href = "http://localhost:3001/login/index.html";
        }}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
