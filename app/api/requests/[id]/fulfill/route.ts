import { NextResponse } from 'next/server';
import { db } from '@/lib/server-db';
import { EvidenceDocument } from '@/lib/mock-data';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { docId, newDoc } = body;

        const existingRequest = db.requests.getById(id);
        if (!existingRequest) {
            return NextResponse.json(
                { error: 'Request not found' },
                { status: 404 }
            );
        }

        let finalDocId = docId;

        if (newDoc) {
            // If a new document is provided, create it first
            if (!newDoc.name || !newDoc.type) {
                return NextResponse.json(
                    { error: 'Invalid newDoc data' },
                    { status: 400 }
                );
            }

            
            const docToCreate: EvidenceDocument = {
                ...newDoc,
                id: newDoc.id || `doc_${Date.now()}`,
                status: newDoc.status || 'Valid',
                versions: newDoc.versions || []
            };
            db.documents.create(docToCreate);
            finalDocId = docToCreate.id;
        } else if (!docId) {
            return NextResponse.json(
                { error: 'Must provide either docId or newDoc' },
                { status: 400 }
            );
        }



        
        const doc = db.documents.getById(finalDocId);
        if (!doc) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            );
        }

        const updatedRequest = {
            ...existingRequest,
            status: 'Fulfilled' as const,
            fulfilledWithDocId: finalDocId
        };

        db.requests.update(updatedRequest);

        return NextResponse.json(updatedRequest);

    } catch (error) {
        console.error('Error fulfilling request:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
