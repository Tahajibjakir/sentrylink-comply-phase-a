import { NextResponse } from 'next/server';
import { db } from '@/lib/server-db';
import { EvidenceDocument } from '@/lib/mock-data';

export async function GET() {
    
    const docs = db.documents.getAll();
    return NextResponse.json(docs);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, type, status, expiryDate, versions } = body;

        if (!name || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: name, type' },
                { status: 400 }
            );
        }

        const newDoc: EvidenceDocument = {
            id: body.id || `doc_${Date.now()}`,
            name,
            type,
            status: status || 'Valid',
            expiryDate: expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            lastUpdated: new Date().toISOString(),
            versions: versions || []
        };

        const created = db.documents.create(newDoc);
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error('Error creating document:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
