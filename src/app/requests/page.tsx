'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getBookings, approveBooking, rejectBooking } from '../../api';

interface DecodedToken {
  id: number;
  privilege_level: string;
  exp?: number;
}

type Request = {
  bookingId: number;
  appNo: string;
  appliedOn: string;
  instrument: string;
  bookingDate: string;
  status: string;
};

export default function Page() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        router.push('/login');
        return;
      }
      if (decoded.privilege_level !== 'admin') {
        setError('Access denied. Admin privileges required.');
        return;
      }
      setIsAdmin(true);
      fetchBookings();
    } catch (err) {
      console.error('Error decoding token:', err);
      router.push('/login');
    }
  }, [router]);

  const fetchBookings = async () => {
    try {
      const res = await getBookings();
      const data = res.data;
      // Map backend data to Request type
      const formattedRequests: Request[] = data.map((booking: any) => {
        const slotDate = new Date(booking.slot);
        const appliedOn = slotDate.toLocaleDateString();
        const bookingDate = slotDate.toLocaleString();
        return {
          bookingId: booking.id,
          appNo: booking.id.toString(),
          appliedOn,
          instrument: booking.instrument_name,
          bookingDate,
          status: booking.status,
        };
      });
      setRequests(formattedRequests);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings.');
    }
  };

  const handleApprove = async (bookingId: number) => {
    try {
      await approveBooking(bookingId);
      alert('Booking approved.');
      fetchBookings(); // Refresh list
    } catch {
      alert('Failed to approve booking.');
    }
  };

  const handleReject = async (bookingId: number) => {
    try {
      await rejectBooking(bookingId);
      alert('Booking rejected.');
      fetchBookings(); // Refresh list
    } catch {
      alert('Failed to reject booking.');
    }
  };

  if (error) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">{error}</p></div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
  }

  return (
    <main className="max-w-6xl mx-auto w-full px-4 py-8">
      <h2 className="text-2xl font-semibold mb-8">All Requests</h2>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="px-4 py-2 text-left font-semibold">S. No.</th>
              <th className="px-4 py-2 text-left font-semibold">App. No.</th>
              <th className="px-4 py-2 text-left font-semibold">Applied on</th>
              <th className="px-4 py-2 text-left font-semibold">Instrument</th>
              <th className="px-4 py-2 text-left font-semibold">Booking Date</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, idx) => (
              <tr key={req.bookingId} className="border-b border-gray-300">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{req.appNo}</td>
                <td className="px-4 py-2">{req.appliedOn}</td>
                <td className="px-4 py-2">{req.instrument}</td>
                <td className="px-4 py-2">{req.bookingDate}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      req.status === 'approved'
                        ? 'text-green-700 font-medium'
                        : req.status === 'pending'
                        ? 'text-orange-500 font-medium'
                        : req.status === 'rejected'
                        ? 'text-red-700 font-medium'
                        : 'text-gray-700'
                    }
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {req.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleApprove(req.bookingId)}
                        className="mr-2 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(req.bookingId)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
