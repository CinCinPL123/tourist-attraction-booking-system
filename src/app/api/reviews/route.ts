import { NextResponse } from 'next/server';
import { initDb, Review, Attraction } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const attractionId = searchParams.get('attractionId');
    const isFlagged = searchParams.get('isFlagged');

    const whereClause: any = {};
    if (attractionId) {
      whereClause.attractionId = parseInt(attractionId);
    }
    if (isFlagged !== null) {
      whereClause.isFlagged = isFlagged === 'true';
    }

    const reviews = await Review.findAll({
      where: whereClause,
      include: isFlagged === 'true' ? [{ model: Attraction, as: 'attraction' }] : [],
      order: [['id', 'DESC']]
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { attractionId, author, rating, comment } = body;

    if (!attractionId || !author || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const attraction = await Attraction.findByPk(attractionId);
    if (!attraction) {
      return NextResponse.json({ error: 'Attraction not found' }, { status: 404 });
    }

    const newReview = await Review.create({
      attractionId: parseInt(attractionId),
      author,
      rating: parseInt(rating),
      comment,
      reply: '',
      isFlagged: false
    });

    const reviews = await Review.findAll({
      where: { attractionId: parseInt(attractionId) }
    });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await attraction.update({ rating: parseFloat(avgRating.toFixed(1)) });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
