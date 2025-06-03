import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserData {
  name: string;
  email: string;
}

const Navbar = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData({
        name: user.name,
        email: user.email
      });
    }
  }, []);

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-indigo-600">
          PointMate
        </Link>
        
        {userData && (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${userData.name}&background=random`} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-gray-700">{userData.name}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 