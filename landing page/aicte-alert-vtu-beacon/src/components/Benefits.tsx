import React from 'react';
import { Button } from '@/components/ui/button';

const Benefits = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-vtu-blue/5 to-vtu-green/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-1">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                <div className="h-full flex flex-col p-8">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="font-bold text-2xl text-vtu-blue mb-4">Activity Timeline</div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <div className="flex-1 bg-green-50 p-3 rounded-lg">
                            <div className="font-medium">IEEE Technical Talk</div>
                            <div className="text-sm text-gray-500">15 points • Completed</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <div className="flex-1 bg-green-50 p-3 rounded-lg">
                            <div className="font-medium">Community Service</div>
                            <div className="text-sm text-gray-500">20 points • Completed</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                          <div className="flex-1 bg-yellow-50 p-3 rounded-lg">
                            <div className="font-medium">Hackathon</div>
                            <div className="text-sm text-gray-500">30 points • Upcoming</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-3xl font-bold text-vtu-blue mb-6">
                Why VTU Students Love This App
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-vtu-blue/10 rounded-full flex items-center justify-center text-vtu-blue font-bold text-2xl">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-vtu-blue mb-2">No More Last-Minute Rush</h3>
                    <p className="text-gray-600">
                      Avoid the end-of-program panic by tracking your points consistently throughout your academic journey.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-vtu-blue/10 rounded-full flex items-center justify-center text-vtu-blue font-bold text-2xl">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-vtu-blue mb-2">Discover Relevant Activities</h3>
                    <p className="text-gray-600">
                      Find events that match your interests and career goals, all while earning the points you need.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-vtu-blue/10 rounded-full flex items-center justify-center text-vtu-blue font-bold text-2xl">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-vtu-blue mb-2">Never Lose a Certificate Again</h3>
                    <p className="text-gray-600">
                      Securely store all your certificates digitally, making verification and submission hassle-free.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-center md:justify-center">
              <Button className="bg-vtu-blue hover:bg-vtu-lightBlue text-white px-8 py-4 text-lg rounded-full shadow-lg transition-transform duration-200 hover:scale-105 mx-auto">
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
