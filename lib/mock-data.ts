

export type DocType = 'Cert' | 'Audit' | 'Lab Report' | 'Declaration';
export type DocStatus = 'Valid' | 'Expiring Soon' | 'Expired';
export type RequestStatus = 'Pending' | 'Fulfilled';

export interface DocumentVersion {
    id: string;
    versionNumber: string;
    dateUploaded: string;
    uploadedBy: string;
    notes: string;
    fileSize: string;
    fileName: string;
}

export interface EvidenceDocument {
    id: string;
    name: string;
    type: DocType;
    status: DocStatus;
    expiryDate: string;
    lastUpdated: string;
    versions: DocumentVersion[];
}

export interface BuyerRequest {
    id: string;
    buyerName: string;
    requestedDocType: DocType;
    dueDate: string;
    status: RequestStatus;
    fulfilledWithDocId: string | null;
}

export const MOCK_DOCS: EvidenceDocument[] = [
    {
        id: 'd1',
        name: 'ISO 9001 Certificate',
        type: 'Cert',
        status: 'Valid',
        expiryDate: '2025-12-31',
        lastUpdated: '2024-01-15',
        versions: [
            {
                id: 'v1.0',
                versionNumber: 'v1.0',
                dateUploaded: '2024-01-15',
                uploadedBy: 'John Doe',
                notes: 'Initial upload',
                fileSize: '2.4 MB',
                fileName: 'iso_9001_2024.pdf'
            }
        ]
    },
    {
        id: 'd2',
        name: 'Ethical Audit Report 2023',
        type: 'Audit',
        status: 'Expiring Soon',
        expiryDate: '2024-02-20',
        lastUpdated: '2023-02-20',
        versions: [
            {
                id: 'v1.0',
                versionNumber: 'v1.0',
                dateUploaded: '2023-02-20',
                uploadedBy: 'Jane Smith',
                notes: 'Annual audit',
                fileSize: '5.1 MB',
                fileName: 'audit_smeta_2023.pdf'
            }
        ]
    },
    {
        id: 'd3',
        name: 'RSL Test Report - Fabric A',
        type: 'Lab Report',
        status: 'Expired',
        expiryDate: '2023-11-30',
        lastUpdated: '2023-05-30',
        versions: [
            {
                id: 'v1.0',
                versionNumber: 'v1.0',
                dateUploaded: '2023-05-30',
                uploadedBy: 'Lab Admin',
                notes: 'Batch 5543 testing',
                fileSize: '1.2 MB',
                fileName: 'rsl_report_5543.pdf'
            }
        ]
    },
    {
        id: 'd4',
        name: 'Cotton Origin Declaration',
        type: 'Declaration',
        status: 'Valid',
        expiryDate: '2025-06-01',
        lastUpdated: '2024-01-05',
        versions: [
            {
                id: 'v2',
                versionNumber: 'v2',
                dateUploaded: '2024-01-05',
                uploadedBy: 'Compliance Officer',
                notes: 'Updated for 2024 season',
                fileSize: '0.5 MB',
                fileName: 'cotton_decl_2024.pdf'
            },
            {
                id: 'v1',
                versionNumber: 'v1',
                dateUploaded: '2023-01-05',
                uploadedBy: 'Compliance Officer',
                notes: '2023 season',
                fileSize: '0.5 MB',
                fileName: 'cotton_decl_2023.pdf'
            }
        ]
    }
];


export const MOCK_REQUESTS: BuyerRequest[] = [
    {
        id: 'r1',
        buyerName: 'Acme Corp',
        requestedDocType: 'Cert',
        dueDate: '2024-02-01',
        status: 'Pending',
        fulfilledWithDocId: null
    },
    {
        id: 'r2',
        buyerName: 'Global Brands',
        requestedDocType: 'Lab Report',
        dueDate: '2024-01-25',
        status: 'Fulfilled',
        fulfilledWithDocId: 'd3'
    },
    {
        id: 'r3',
        buyerName: 'Fashion Forward',
        requestedDocType: 'Audit',
        dueDate: '2024-03-15',
        status: 'Pending',
        fulfilledWithDocId: null
    }
];
