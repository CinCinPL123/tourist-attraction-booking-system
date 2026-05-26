import { NextResponse } from 'next/server';
import { initDb, Booking, Attraction, BlockedDate } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDb();
    const bookings = await Booking.findAll({
      include: [{ model: Attraction, as: 'attraction' }],
      order: [['id', 'DESC']]
    });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { attractionId, date, ticketsCount, totalPrice, userId } = body;

    if (!attractionId || !date || !ticketsCount || !totalPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isBlocked = await BlockedDate.findOne({ where: { date } });
    if (isBlocked) {
      return NextResponse.json({ error: 'Selected date is blocked and unavailable' }, { status: 400 });
    }

    const attraction = await Attraction.findByPk(attractionId);
    if (!attraction) {
      return NextResponse.json({ error: 'Attraction not found' }, { status: 404 });
    }

    const newBooking = await Booking.create({
      attractionId: parseInt(attractionId),
      userId: userId ? parseInt(userId) : null,
      date,
      ticketsCount: parseInt(ticketsCount),
      totalPrice: parseInt(totalPrice)
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
