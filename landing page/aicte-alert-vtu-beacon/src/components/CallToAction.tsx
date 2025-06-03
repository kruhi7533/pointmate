import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CallToAction = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  return (
    <div className="py-16 bg-vtu-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-vtu-blue mb-6">
            Ready to Simplify Your AICTE Point Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of VTU students who are already tracking their points, discovering events, 
            and securing their graduation requirements with ease.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-vtu-blue hover:bg-vtu-lightBlue text-white px-8 py-6 text-lg" onClick={() => navigate('/events')}>
              Find Nearby Events
            </Button>
            <Button variant="outline" className="border-vtu-blue text-vtu-blue hover:bg-vtu-blue/10 px-8 py-6 text-lg" onClick={() => setSidebarOpen(true)}>
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
