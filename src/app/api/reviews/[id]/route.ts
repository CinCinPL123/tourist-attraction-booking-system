import { NextResponse } from 'next/server';
import { initDb, Review, Attraction } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await initDb();
    const { id } = await context.params;
    const body = await request.json();

    const review = await Review.findByPk(id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await review.update(body);

    return NextResponse.json(review);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await initDb();
    const { id } = await context.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const attractionId = review.attractionId;
    await review.destroy();

    const attraction = await Attraction.findByPk(attractionId);
    if (attraction) {
      const remainingReviews = await Review.findAll({
        where: { attractionId }
      });
      let avgRating = 5.0;
      if (remainingReviews.length > 0) {
        avgRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length;
      }
      await attraction.update({ rating: parseFloat(avgRating.toFixed(1)) });
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
