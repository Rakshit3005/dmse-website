// src/components/Navbar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  privilege_level: string;
  exp?: number;
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const updateAuthState = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setIsAdmin(decoded.privilege_level === 'admin');
      } catch (error) {
        console.error('Error decoding token:', error);
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

  return (
    <div className="fixed w-screen h-20 z-50 bg-blue-700 text-white flex items-center justify-between px-8 py-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="w-12 h-12"
          />
        </div>
      </div>
      <nav className="flex text-sm space-x-4 sm:text-base sm:space-x-8">
        <Link href="/" className="hover:underline">Home</Link>
        {isAdmin && <Link href="/requests" className="hover:underline">All Requests</Link>}
        {isLoggedIn ? (
          <Link href="/logout" className="hover:underline">Log Out</Link>
        ) : (
          <Link href="/login" className="hover:underline">Login</Link>
        )}
      </nav>
    </div>
  );
}
