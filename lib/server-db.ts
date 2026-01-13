import fs from 'fs';
import path from 'path';
import { BuyerRequest, EvidenceDocument, MOCK_REQUESTS, MOCK_DOCS } from './mock-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const DOCUMENTS_FILE = path.join(DATA_DIR, 'documents.json');



// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
    if (!fs.existsSync(filePath)) {
        
        writeJsonFile(filePath, defaultValue);
        return defaultValue;
    }
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent) as T;
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return defaultValue;
    }
}

function writeJsonFile<T>(filePath: string, data: T): void {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
    }
}

export const db = {
    requests: {
        getAll: () => readJsonFile<BuyerRequest[]>(REQUESTS_FILE, MOCK_REQUESTS),
        getById: (id: string) => {
            const requests = readJsonFile<BuyerRequest[]>(REQUESTS_FILE, MOCK_REQUESTS);
            return requests.find(r => r.id === id) || null;
        },
        create: (request: BuyerRequest) => {
            const requests = readJsonFile<BuyerRequest[]>(REQUESTS_FILE, MOCK_REQUESTS);
            requests.push(request);
            writeJsonFile(REQUESTS_FILE, requests);
            return request;
        },
        update: (request: BuyerRequest) => {
            const requests = readJsonFile<BuyerRequest[]>(REQUESTS_FILE, MOCK_REQUESTS);
            const index = requests.findIndex(r => r.id === request.id);
            if (index !== -1) {
                requests[index] = request;
                writeJsonFile(REQUESTS_FILE, requests);
                return request;
            }
            return null;
        }
    },
    documents: {
        getAll: () => readJsonFile<EvidenceDocument[]>(DOCUMENTS_FILE, MOCK_DOCS),
        getById: (id: string) => {
            const docs = readJsonFile<EvidenceDocument[]>(DOCUMENTS_FILE, MOCK_DOCS);
            return docs.find(d => d.id === id) || null;
        },
        create: (doc: EvidenceDocument) => {
            const docs = readJsonFile<EvidenceDocument[]>(DOCUMENTS_FILE, MOCK_DOCS);
            docs.push(doc);
            writeJsonFile(DOCUMENTS_FILE, docs);
            return doc;
        }
    }
};
