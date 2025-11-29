import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

interface User {
  id: number;
  username: string;
  userpassword: string;
  privilege_level: string;
}

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await new Promise<User | undefined>((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row: User) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.userpassword);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, privilege_level: user.privilege_level },
      process.env.JWT_SECRET || 'dev-secret-key-12345',
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      token,
      user: { id: user.id, username: user.username, privilege_level: user.privilege_level }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
