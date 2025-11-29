import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  const getDatabase = await import('@/lib/db').then(m => m.default);
  const db = await getDatabase();
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }
  try {
    const { username, password, privilege_level } = await request.json();

    if (!username || !password || !privilege_level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`INSERT INTO users (username, userpassword, privilege_level) VALUES (?, ?, ?)`);
    stmt.run([username, hashedPassword, privilege_level]);
    stmt.free();

    return NextResponse.json({ message: 'User registered' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    if ((error as any).message?.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
