import { NextResponse } from 'next/server';
import { initDb, Attraction } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await initDb();
    const { id } = await context.params;
    const body = await request.json();

    const attraction = await Attraction.findByPk(id);
    if (!attraction) {
      return NextResponse.json({ error: 'Attraction not found' }, { status: 404 });
    }

    await attraction.update(body);

    return NextResponse.json(attraction);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await initDb();
    const { id } = await context.params;

    const attraction = await Attraction.findByPk(id);
    if (!attraction) {
      return NextResponse.json({ error: 'Attraction not found' }, { status: 404 });
    }

    await attraction.destroy();
    return NextResponse.json({ message: 'Attraction deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
