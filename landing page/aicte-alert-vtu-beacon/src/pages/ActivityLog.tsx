import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const activities = [
  { name: 'Hackathon', domain: 'Technical Skills', points: 10, date: '2023-04-15', status: 'Approved' },
  { name: 'Workshop', domain: 'Technical Skills', points: 15, date: '2023-06-10', status: 'Pending' },
  { name: 'Public Speaking', domain: 'Soft Skills', points: 10, date: '2023-08-05', status: 'Approved' },
  { name: 'Blood Donation', domain: 'Community Service', points: 10, date: '2023-09-12', status: 'Rejected' },
];

const statusIcon = (status: string) => {
  if (status === 'Approved') return <CheckCircle className="h-4 w-4 text-green-500 inline" />;
  if (status === 'Pending') return <Clock className="h-4 w-4 text-yellow-500 inline" />;
  if (status === 'Rejected') return <XCircle className="h-4 w-4 text-red-500 inline" />;
  return null;
};

const ActivityLog = () => {
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
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 text-left font-semibold">Event</th>
                  <th className="px-4 py-2 text-left font-semibold">Domain</th>
                  <th className="px-4 py-2 text-left font-semibold">Points</th>
                  <th className="px-4 py-2 text-left font-semibold">Date</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((act, idx) => (
                  <tr key={idx} className="border-b hover:bg-blue-50">
                    <td className="px-4 py-2 font-medium">{act.name}</td>
                    <td className="px-4 py-2">{act.domain}</td>
                    <td className="px-4 py-2">{act.points}</td>
                    <td className="px-4 py-2">{act.date}</td>
                    <td className="px-4 py-2">
                      {statusIcon(act.status)} <span className="ml-1">{act.status}</span>
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

export default ActivityLog; 