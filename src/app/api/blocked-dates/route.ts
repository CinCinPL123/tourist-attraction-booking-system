import { NextResponse } from 'next/server';
import { initDb, BlockedDate } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDb();
    const dates = await BlockedDate.findAll({
      order: [['date', 'ASC']]
    });
    return NextResponse.json(dates.map(d => d.date));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { date, dates, action } = body;

    // Handle bulk operation
    if (dates && Array.isArray(dates) && action) {
      if (action === 'block') {
        for (const d of dates) {
          const existing = await BlockedDate.findOne({ where: { date: d } });
          if (!existing) {
            await BlockedDate.create({ date: d });
          }
        }
        return NextResponse.json({ dates, status: 'blocked' });
      } else if (action === 'unblock') {
        for (const d of dates) {
          const existing = await BlockedDate.findOne({ where: { date: d } });
          if (existing) {
            await existing.destroy();
          }
        }
        return NextResponse.json({ dates, status: 'unblocked' });
      } else {
        return NextResponse.json({ error: 'Invalid action for bulk operations' }, { status: 400 });
      }
    }

    // Handle single date toggle
    if (!date) {
      return NextResponse.json({ error: 'Missing date or dates field' }, { status: 400 });
    }

    const existing = await BlockedDate.findOne({ where: { date } });
    if (existing) {
      await existing.destroy();
      return NextResponse.json({ date, status: 'unblocked' });
    } else {
      await BlockedDate.create({ date });
      return NextResponse.json({ date, status: 'blocked' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
