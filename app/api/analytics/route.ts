import { NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET() {
  try {
    const analytics = database.getAnalytics();
    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
