import { NextResponse } from 'next/server';
import { initDb, User } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { name, email, password, role, phoneNumber, companyName, taxNumber, description } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role !== 'tourist' && role !== 'provider') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phoneNumber: phoneNumber || null,
      companyName: role === 'provider' ? (companyName || null) : null,
      taxNumber: role === 'provider' ? (taxNumber || null) : null,
      description: role === 'provider' ? (description || null) : null,
      roleLevel: 0
    });

    const plainUser = newUser.get({ plain: true });
    const responseData = {
      id: plainUser.id,
      name: plainUser.name,
      email: plainUser.email,
      role: plainUser.role,
      phoneNumber: plainUser.phoneNumber || null,
      companyName: plainUser.companyName || null,
      description: plainUser.description || null,
      taxNumber: plainUser.taxNumber || null,
      roleLevel: plainUser.roleLevel || null
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
