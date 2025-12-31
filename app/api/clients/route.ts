import { NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET() {
  try {
    const clients = database.getAllClients();
    return NextResponse.json({
      success: true,
      clients: clients.sort(
        (a, b) => b.lastInteraction.getTime() - a.lastInteraction.getTime()
      ),
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}
