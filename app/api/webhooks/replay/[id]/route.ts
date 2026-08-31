import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('Replaying webhook event with ID: ${id}');

    
    return NextResponse.json(
      { success: true, message: 'Webhook ${id} replayed successfully!'},
      { status: 200 }
    );
  } catch (error) {
    console.error('Replay error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}