
import React from 'react';
import { Calendar, MapPin, FileText } from 'lucide-react';

const Features = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-vtu-blue mb-4">How AICTE Tracker Helps You Graduate</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform makes it easy to track your progress toward the required 100 AICTE points, 
            discover relevant activities, and manage your certificates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center p-3 bg-vtu-blue/10 rounded-lg mb-6">
              <MapPin className="h-8 w-8 text-vtu-blue" />
            </div>
            <h3 className="text-xl font-bold text-vtu-blue mb-4">Nearby Events</h3>
            <p className="text-gray-600">
              Discover AICTE-approved events and activities happening near your location. 
              Get notifications when new opportunities arise within your area.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center p-3 bg-vtu-blue/10 rounded-lg mb-6">
              <Calendar className="h-8 w-8 text-vtu-blue" />
            </div>
            <h3 className="text-xl font-bold text-vtu-blue mb-4">Point Tracking</h3>
            <p className="text-gray-600">
              Easily track your AICTE points progress. Know exactly how many points you've earned 
              and how many more you need to graduate.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center p-3 bg-vtu-blue/10 rounded-lg mb-6">
              <FileText className="h-8 w-8 text-vtu-blue" />
            </div>
            <h3 className="text-xl font-bold text-vtu-blue mb-4">Certificate Storage</h3>
            <p className="text-gray-600">
              Upload and store your certificates and event photos securely. Access your records 
              anytime, anywhere for future verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
