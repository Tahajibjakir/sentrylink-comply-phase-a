'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EvidenceDocument, BuyerRequest, DocumentVersion } from './mock-data';

interface AppContextType {
    documents: EvidenceDocument[];
    requests: BuyerRequest[];
    isLoading: boolean;
    error: string | null;
    addDocumentVersion: (docId: string, version: DocumentVersion) => Promise<void>;
    fulfillRequest: (requestId: string, docId: string) => Promise<void>;
    createDocument: (doc: EvidenceDocument) => Promise<EvidenceDocument>;
    refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider Component
 * 
 * This component wraps the application and provides global state for Documents and Requests.
 * It handles logic for fetching data from our API and exposing actions like 'fulfillRequest'.
 */
export function AppProvider({ children }: { children: ReactNode }) {
    const [documents, setDocuments] = useState<EvidenceDocument[]>([]);
    const [requests, setRequests] = useState<BuyerRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial data fetch on mount
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [reqRes, docRes] = await Promise.all([
                fetch('/api/requests'),
                fetch('/api/documents')
            ]);

            if (!reqRes.ok || !docRes.ok) throw new Error('Failed to fetch data');

            const reqData = await reqRes.json();
            const docData = await docRes.json();

            setRequests(reqData);
            setDocuments(docData);
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addDocumentVersion = async (docId: string, version: DocumentVersion) => {
        // TODO: Implement API endpoint for versions if needed.
        // For now, this is client-side only based on the "Request Workflow" thin slice requirements.
        console.warn('addDocumentVersion API not implemented yet');
        // NOTE: In a real app, this would POST to /api/documents/:id/versions
    };

    const fulfillRequest = async (requestId: string, docId: string) => {
        try {
            const res = await fetch(`/api/requests/${requestId}/fulfill`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ docId })
            });

            if (!res.ok) throw new Error('Failed to fulfill request');

            await fetchData(); 
        } catch (err) {
            console.error('Error fulfilling request:', err);
            throw err;
        }
    };

    const createDocument = async (newDoc: EvidenceDocument): Promise<EvidenceDocument> => {
        try {
            const res = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDoc)
            });

            if (!res.ok) throw new Error('Failed to create document');

            const created = await res.json();
            await fetchData(); 
            return created;
        } catch (err) {
            console.error('Error creating document:', err);
            throw err;
        }
    }

    return (
        <AppContext.Provider value={{
            documents,
            requests,
            isLoading,
            error,
            addDocumentVersion,
            fulfillRequest,
            createDocument,
            refreshData: fetchData
        }}>
            {children}
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
