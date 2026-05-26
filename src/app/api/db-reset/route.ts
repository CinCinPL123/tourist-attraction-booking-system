import { NextResponse } from 'next/server';
import { resetDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await resetDb();
    return NextResponse.json({ success: true, message: 'Database reset to defaults successfully.' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
