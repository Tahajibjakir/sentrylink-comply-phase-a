import { NextResponse } from 'next/server';
import { db } from '@/lib/server-db';
import { BuyerRequest } from '@/lib/mock-data';

export async function GET() {
    
    const requests = db.requests.getAll();
    return NextResponse.json(requests);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { buyerName, requestedDocType, dueDate } = body;

        if (!buyerName || !requestedDocType || !dueDate) {
            // Basic validation
            return NextResponse.json(
                { error: 'Missing required fields: buyerName, requestedDocType, dueDate' },
                { status: 400 }
            );
        }

        const newRequest: BuyerRequest = {
            id: `req_${Date.now()}`,
            buyerName,
            requestedDocType,
            dueDate,
            status: 'Pending',
            fulfilledWithDocId: null
        };

        const created = db.requests.create(newRequest);
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error('Error creating request:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
