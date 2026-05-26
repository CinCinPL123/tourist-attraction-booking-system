import { NextResponse } from 'next/server';
import { initDb, User } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ where: { email, password } });
    console.log('Login API request - email:', email, 'Found user:', user ? user.toJSON() : 'null');
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const plainUser = user.get({ plain: true });
    const responseData = {
      id: plainUser.id,
      name: plainUser.name,
      email: plainUser.email,
      role: plainUser.role,
      phoneNumber: plainUser.phoneNumber || null,
      companyName: plainUser.companyName || null,
      description: plainUser.description || null,
      taxNumber: plainUser.taxNumber || null,
      roleLevel: plainUser.roleLevel || null,
    };
    console.log('Returning response data:', responseData);
    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
