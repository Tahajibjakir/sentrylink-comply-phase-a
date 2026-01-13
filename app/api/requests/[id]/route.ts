import { NextResponse } from 'next/server';
import { db } from '@/lib/server-db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Fetch specific request by ID
        const req = db.requests.getById(id);

        if (!req) {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(req);
    } catch (error) {
        console.error('Error fetching request:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
