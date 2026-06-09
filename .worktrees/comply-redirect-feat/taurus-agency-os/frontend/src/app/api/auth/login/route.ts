import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Login route - redirect to Clerk
export async function POST(request: NextRequest) {
  // Clerk handles authentication, so we redirect to sign-in
  return NextResponse.json({ 
    message: 'Please use Clerk sign-in at /',
    auth: 'clerk'
  });
}

// Register route
export async function PUT(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Please use Clerk sign-up at /',
    auth: 'clerk'
  });
}