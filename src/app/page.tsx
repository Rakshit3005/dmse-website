// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  privilege_level: string;
  exp?: number;
}

export default function Page() {
  const [isAdmin, setIsAdmin] = useState(false);

  const updateAuthState = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setIsAdmin(decoded.privilege_level === 'admin');
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    updateAuthState();

    const handleAuthChange = () => updateAuthState();
    window.addEventListener('authChange', handleAuthChange);

    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  if (isAdmin) {
    return (
      <main className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>
          <p className="text-lg mb-8">Manage booking requests from the navbar.</p>
          <Link href="/requests" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go to All Requests
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center bg-white">
      <div className="flex gap-8 flex-col sm:flex-row">
        <Link href="/book" passHref>
          <Button
            variant="outline"
            className="w-48 h-48 sm:w-64 sm:h-64 flex flex-col items-center justify-center rounded-xl shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors text-xl"
          >
            Book
          </Button>
        </Link>
        <Link href="/slot-history" passHref>
          <Button
            variant="outline"
            className="w-48 h-48 sm:w-64 sm:h-64 flex flex-col items-center justify-center rounded-xl shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors text-xl"
          >
            View Slot History
          </Button>
        </Link>
        <Link href="/apply-reimbursements" passHref>
          <Button
            variant="outline"
            className="w-48 h-48 sm:w-64 sm:h-64 flex flex-col items-center justify-center rounded-xl shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors text-xl"
          >
            Apply for Reimbursements
          </Button>
        </Link>
      </div>
    </main>
  );
}
