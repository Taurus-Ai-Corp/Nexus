import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Return dashboard stats (mock data for demo - connect to database in production)
  return NextResponse.json({
    clients: 12,
    activeSubscriptions: 8,
    jobsLast24h: 24,
    monthlyRevenue: 7188,
    userId
  });
}