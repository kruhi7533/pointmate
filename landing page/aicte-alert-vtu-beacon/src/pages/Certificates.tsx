import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const certificates = [
  { name: 'Hackathon Winner', domain: 'Technical Skills', points: 10, date: '2023-04-15', file: '#' },
  { name: 'Workshop Participation', domain: 'Technical Skills', points: 15, date: '2023-06-10', file: '#' },
  { name: 'Public Speaking', domain: 'Soft Skills', points: 10, date: '2023-08-05', file: '#' },
  { name: 'Blood Donation', domain: 'Community Service', points: 10, date: '2023-09-12', file: '#' },
];

const Certificates = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-vtu-green/10 flex items-center justify-center py-12 px-4 relative">
      <Button
        variant="ghost"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-vtu-blue hover:bg-vtu-blue/10"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </Button>
      <Card className="w-full max-w-3xl shadow-2xl border-0 bg-white/90">
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button className="bg-vtu-blue text-white hover:bg-vtu-lightBlue flex items-center gap-2">
              <Upload className="h-4 w-4" /> Upload Certificate
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 text-left font-semibold">Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Domain</th>
                  <th className="px-4 py-2 text-left font-semibold">Points</th>
                  <th className="px-4 py-2 text-left font-semibold">Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, idx) => (
                  <tr key={idx} className="border-b hover:bg-blue-50">
                    <td className="px-4 py-2 font-medium">{cert.name}</td>
                    <td className="px-4 py-2">{cert.domain}</td>
                    <td className="px-4 py-2">{cert.points}</td>
                    <td className="px-4 py-2">{cert.date}</td>
                    <td className="px-4 py-2">
                      <Button variant="outline" size="icon" className="hover:bg-vtu-blue/10">
                        <Download className="h-4 w-4 text-vtu-blue" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificates; 