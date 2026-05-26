import { NextResponse } from 'next/server';
import { initDb, Category } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDb();
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Missing category name' }, { status: 400 });
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return NextResponse.json({ error: 'Category name cannot be empty' }, { status: 400 });
    }

    const existing = await Category.findOne({ where: { name: trimmedName } });
    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    const newCategory = await Category.create({ name: trimmedName });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing category id' }, { status: 400 });
    }

    const category = await Category.findByPk(parseInt(id));
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await category.destroy();
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
