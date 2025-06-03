import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  // State for organization profile data (initialized with placeholder data)
  const [organizationProfile, setOrganizationProfile] = useState({
    fullName: "Example Organization",
    designation: "Admin",
    contactNumber: "+1234567890",
    organizationEmail: "info@exampleorg.com",
    institutionName: "Example Institute of Technology",
    aicteApprovalNumber: "AICTE/INST/12345",
    authorizedPersonName: "Dr. Jane Doe",
    // Add other fields as needed, e.g., logoUrl
  });

  // Handler for input changes (placeholder)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrganizationProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Placeholder save handler
  const handleSaveChanges = () => {
    // TODO: Implement logic to save changes to the backend
    console.log("Saving changes:", organizationProfile);
    alert("Profile changes saved (placeholder)");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button
        className="flex items-center text-gray-700 hover:text-blue-600 mb-8 focus:outline-none text-sm transition duration-150 ease-in-out"
        onClick={() => navigate('/')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800">Organization Profile Settings</h1>

      {/* Refined Grid Layout (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column */}
        <div className="space-y-6">

          {/* Personal Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="fullName">Full Name (Organization)</label>
                <input
                  className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  id="fullName"
                  type="text"
                  placeholder="Enter organization full name"
                  name="fullName"
                  value={organizationProfile.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="designation">Designation</label>
                <input
                  className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  id="designation"
                  type="text"
                  placeholder="Enter designation"
                  name="designation"
                  value={organizationProfile.designation}
                  onChange={handleInputChange}
                />
              </div>
               <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="authorizedPersonName">Authorized Person Name</label>
                <input
                  className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  id="authorizedPersonName"
                  type="text"
                  placeholder="Enter authorized person name"
                  name="authorizedPersonName"
                  value={organizationProfile.authorizedPersonName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

           {/* Institution Details Card */}
           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Institution Details</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="institutionName">Institution Name</label>
                  <input
                    className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    id="institutionName"
                    type="text"
                    placeholder="Enter institution name"
                    name="institutionName"
                    value={organizationProfile.institutionName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="aicteApprovalNumber">AICTE Approval Number</label>
                  <input
                    className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    id="aicteApprovalNumber"
                    type="text"
                    placeholder="Enter AICTE approval number"
                    name="aicteApprovalNumber"
                    value={organizationProfile.aicteApprovalNumber}
                    onChange={handleInputChange}
                  />
                </div>
               </div>
           </div>
        </div>

        {/* Right Column - Logo and Contact */}
        <div className="space-y-6">

          {/* Organization Logo Card (Matches Profile Picture layout) */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center border border-gray-200">
             <h2 className="text-xl font-semibold mb-4 text-gray-800">Organization Logo</h2>
             <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3 overflow-hidden">
                {/* Placeholder for actual logo image or initial/icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>
             {/* Trigger file input when text is clicked */}
             <label htmlFor="logoUpload" className="text-sm text-blue-600 cursor-pointer hover:underline">Click to upload a new logo</label>
              {/* Hidden file input */}
              <input id="logoUpload" type="file" className="hidden" accept="image/*" />
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h2>
             <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="organizationEmail">Organization Email</label>
                <input
                  className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  id="organizationEmail"
                  type="email"
                  placeholder="Enter organization email"
                  name="organizationEmail"
                  value={organizationProfile.organizationEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="contactNumber">Contact Number</label>
                <input
                  className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  id="contactNumber"
                  type="text"
                  placeholder="Enter phone number"
                  name="contactNumber"
                  value={organizationProfile.contactNumber}
                  onChange={handleInputChange}
                />
              </div>
             </div>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="mt-8 text-right">
        <button
           className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
           onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile; 