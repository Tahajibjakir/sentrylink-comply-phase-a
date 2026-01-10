'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EvidenceDocument, BuyerRequest, MOCK_DOCS, MOCK_REQUESTS, DocumentVersion } from './mock-data';

interface AppContextType {
    documents: EvidenceDocument[];
    requests: BuyerRequest[];
    addDocumentVersion: (docId: string, version: DocumentVersion) => void;
    fulfillRequest: (requestId: string, docId: string) => void;
    createDocument: (doc: EvidenceDocument) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [documents, setDocuments] = useState<EvidenceDocument[]>(MOCK_DOCS);
    const [requests, setRequests] = useState<BuyerRequest[]>(MOCK_REQUESTS);

    const addDocumentVersion = (docId: string, version: DocumentVersion) => {
        setDocuments(prev => prev.map(doc => {
            if (doc.id === docId) {
                return {
                    ...doc,
                    versions: [version, ...doc.versions], 
                    lastUpdated: version.dateUploaded
                };
            }
            return doc;
        }));
    };

    const fulfillRequest = (requestId: string, docId: string) => {
        setRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                return { ...req, status: 'Fulfilled', fulfilledWithDocId: docId };
            }
            return req;
        }));
    };

    const createDocument = (newDoc: EvidenceDocument) => {
        setDocuments(prev => [newDoc, ...prev]);
    }

    return (
        <AppContext.Provider value= {{ documents, requests, addDocumentVersion, fulfillRequest, createDocument }
}>
    { children }
    </AppContext.Provider>
  );
}

export function useAppStore() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppStore must be used within an AppProvider');
    }
    return context;
}
