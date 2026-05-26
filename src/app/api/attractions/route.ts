import { NextResponse } from 'next/server';
import { initDb, Attraction, Review } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const includeReviews = searchParams.get('reviews') === 'true';
    const showAll = searchParams.get('all') === 'true';

    const whereClause: any = {};
    if (!showAll) {
      whereClause.isApproved = true;
    }

    const options: any = {
      where: whereClause,
      order: [['id', 'DESC']]
    };

    if (includeReviews) {
      options.include = [{ model: Review, as: 'reviews' }];
    }

    const attractions = await Attraction.findAll(options);
    return NextResponse.json(attractions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { title, category, price, kidFriendly, desc, providerName, imageBase64, lat, lng } = body;

    if (!title || !category || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imagePath = "/uploads/placeholder.png";

    if (imageBase64 && imageBase64.startsWith('data:image/')) {
      const mimeType = imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';'));
      const ext = mimeType.split('/')[1] || 'jpg';
      const base64Data = imageBase64.substring(imageBase64.indexOf(',') + 1);
      
      const fileName = `upload_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
      
      imagePath = `/uploads/${fileName}`;
    }

    const latitude = lat !== undefined ? parseFloat(lat) : 52.1 + (Math.random() - 0.5) * 2;
    const longitude = lng !== undefined ? parseFloat(lng) : 19.4 + (Math.random() - 0.5) * 2;

    const newAttraction = await Attraction.create({
      title,
      category,
      price: parseInt(price),
      kidFriendly: !!kidFriendly,
      rating: 5.0,
      lat: latitude,
      lng: longitude,
      image: imagePath,
      desc: desc || '',
      isApproved: false,
      providerName: providerName || 'Organizator Biznesowy'
    });

    return NextResponse.json(newAttraction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
