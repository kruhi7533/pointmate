import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

const Profile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    college: '',
    studentId: '',
    year: '',
    branch: '',
    semester: '',
    graduationYear: '',
    address: '',
    phone: '',
    aictePoints: 0
  });
  const [loginEmail, setLoginEmail] = useState('');

  useEffect(() => {
    console.log('Profile page loaded');
    const storedUser = localStorage.getItem('user');
    console.log('Raw stored user data:', storedUser);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed user data:', parsedUser);
      
      // Set the login email from localStorage
      const loginEmail = parsedUser.email;
      setLoginEmail(loginEmail);
      
      // First set basic user data
      setUserData(prev => ({
        ...prev,
        name: parsedUser.name || '',
        email: parsedUser.email || ''
      }));

      // Always try to fetch profile data for the logged-in user
      console.log('Fetching profile for login email:', loginEmail);
      fetch(`http://localhost:3000/api/pointmate/profile/get?email_login=${loginEmail}`)
        .then(res => {
          console.log('Profile fetch response status:', res.status);
          return res.ok ? res.json() : null;
        })
        .then(profile => {
          console.log('Received profile data:', profile);
          if (profile) {
            // If profile exists, update all fields
            setUserData(prev => ({
              ...prev,
              ...profile,
              // Ensure we keep the login email as email_login
              email_login: loginEmail
            }));
            console.log('Updated userData state with profile:', userData);
          } else {
            console.log('No profile found for user, using basic data only');
          }
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });
    } else {
      console.log('No user data found in localStorage');
    }
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    // Get the login email from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert("Please log in to save your profile");
      return;
    }

    const { email: loginEmail } = JSON.parse(storedUser);
    console.log('Using login email for email_login:', loginEmail);

    const profileData = {
      email_login: loginEmail,
      name: userData.name,
      email: userData.email,
      college: userData.college,
      studentId: userData.studentId,
      year: userData.year,
      branch: userData.branch,
      semester: userData.semester,
      graduationYear: userData.graduationYear,
      address: userData.address,
      phone: userData.phone,
      aictePoints: userData.aictePoints
    };

    console.log('Saving profile data:', profileData);

    try {
      const response = await fetch("http://localhost:3000/api/pointmate/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      console.log('Save response status:', response.status);
      const data = await response.json();
      console.log('Save response data:', data);
      
      if (response.ok) {
        const updatedUserData = {
          ...JSON.parse(localStorage.getItem('user') || '{}'),
          ...userData
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert("An error occurred while updating profile.");
    }
  };

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-white">
        <button
          className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white/80 hover:bg-white text-vtu-blue px-3 py-2 rounded-full shadow transition"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-vtu-primary mb-8">Profile Settings</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Full Name</label>
                    <Input 
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input 
                      name="email"
                      type="email" 
                      value={userData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">College Name</label>
                    <Input 
                      name="college"
                      value={userData.college}
                      onChange={handleInputChange}
                      placeholder="Enter your college name" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Student ID</label>
                    <Input 
                      name="studentId"
                      value={userData.studentId}
                      onChange={handleInputChange}
                      placeholder="Enter your student ID" 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Year</label>
                    <Input 
                      name="year"
                      value={userData.year}
                      onChange={handleInputChange}
                      placeholder="Enter your current year" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Branch</label>
                    <Input 
                      name="branch"
                      value={userData.branch}
                      onChange={handleInputChange}
                      placeholder="Enter your branch" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Semester</label>
                    <Input 
                      name="semester"
                      value={userData.semester}
                      onChange={handleInputChange}
                      placeholder="Enter your current semester" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Graduation Year</label>
                    <Input 
                      name="graduationYear"
                      value={userData.graduationYear}
                      onChange={handleInputChange}
                      placeholder="Enter your expected graduation year" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Profile Picture */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-100">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserRound className="w-24 h-24 text-gray-400" />
                        </div>
                      )}
                      <label
                        htmlFor="profile-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-white" />
                      </label>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Click to upload a new profile picture
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Address</label>
                    <Input 
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone Number</label>
                    <Input 
                      name="phone"
                      type="tel" 
                      value={userData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button 
              className="bg-vtu-blue hover:bg-vtu-blue/90"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Profile; 