import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get('clientId');

    if (clientId) {
      const interactions = database.getClientInteractions(clientId);
      return NextResponse.json({
        success: true,
        interactions: interactions.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        ),
      });
    }

    const allInteractions = database.getAllInteractions();
    return NextResponse.json({
      success: true,
      interactions: allInteractions.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      ),
    });
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
}
