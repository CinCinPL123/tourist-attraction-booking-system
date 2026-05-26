import { NextResponse } from 'next/server';
import { initDb, Booking } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await initDb();
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status || (status !== 'accepted' && status !== 'declined' && status !== 'pending')) {
      return NextResponse.json({ error: 'Invalid booking status' }, { status: 400 });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    await booking.update({ status });

    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
