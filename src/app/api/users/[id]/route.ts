import { NextResponse } from 'next/server';
import { initDb, User, Attraction } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await initDb();
    const { id } = await context.params;
    const body = await request.json();
    const { name, phoneNumber, companyName, taxNumber, description } = body;

    const user = await User.findByPk(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const oldCompanyName = user.companyName;

    await user.update({
      name: name || user.name,
      phoneNumber: phoneNumber || null,
      companyName: user.role === 'provider' ? (companyName || null) : null,
      taxNumber: user.role === 'provider' ? (taxNumber || null) : null,
      description: user.role === 'provider' ? (description || null) : null
    });

    // If provider company name changed, update all their attractions' providerName field
    if (user.role === 'provider' && oldCompanyName && companyName && oldCompanyName !== companyName) {
      await Attraction.update(
        { providerName: companyName },
        { where: { providerName: oldCompanyName } }
      );
    }

    const plainUser = user.get({ plain: true });
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

    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
