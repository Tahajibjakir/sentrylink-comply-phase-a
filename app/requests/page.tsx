'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusChip } from '@/components/ui/status-chip';
import { NavBar } from '@/components/nav-bar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Check, Plus } from 'lucide-react';
import { EvidenceDocument } from '@/lib/mock-data';

export default function RequestsPage() {
    const { requests, documents, fulfillRequest, createDocument } = useAppStore();
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [isFulfillOpen, setIsFulfillOpen] = useState(false);


    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

    // Upload New State for fulfilling with a fresh document
    const [newDocName, setNewDocName] = useState('');
    const [newDocFile, setNewDocFile] = useState<File | null>(null);

    const activeRequest = requests.find(r => r.id === selectedRequestId);


    // Filter docs that match the requested type so we don't show irrelevant files
    const eligibleDocs = documents.filter(d =>
        activeRequest && d.type === activeRequest.requestedDocType && d.status !== 'Expired'
    );

    const openFulfillModal = (reqId: string) => {
        setSelectedRequestId(reqId);
        setSelectedDocId(null);
        setNewDocName('');
        setNewDocFile(null);
        setIsFulfillOpen(true);
    };

    const handleFulfillExisting = async () => {
        if (selectedRequestId && selectedDocId) {
            await fulfillRequest(selectedRequestId, selectedDocId);
            setIsFulfillOpen(false);
        }
    };

    const handleFulfillNew = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRequestId && newDocName && newDocFile && activeRequest) {
            const newDoc: EvidenceDocument = {
                id: `new_${Date.now()}`,
                name: newDocName,
                type: activeRequest.requestedDocType,
                status: 'Valid',
                expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // 1 year from now
                lastUpdated: new Date().toISOString(),
                versions: [{
                    id: `v1.0`,
                    versionNumber: `v1.0`,
                    dateUploaded: new Date().toISOString(),
                    uploadedBy: 'CurrentUser',
                    notes: 'Fulfilled request',
                    fileSize: '1.2 MB',
                    fileName: newDocFile.name
                }]
            };

            
            const created = await createDocument(newDoc);
            
            await fulfillRequest(selectedRequestId, created.id);
            setIsFulfillOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavBar />

            <main className="flex-1 p-8 space-y-6 container mx-auto max-w-5xl">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Buyer Requests</h1>
                    <p className="text-muted-foreground">Manage and fulfill document requests from your buyers.</p>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Buyer</TableHead>
                                <TableHead>Requested Document</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-medium">{req.buyerName}</TableCell>
                                    <TableCell>{req.requestedDocType}</TableCell>
                                    <TableCell>{format(new Date(req.dueDate), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>
                                        <StatusChip status={req.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {req.status === 'Pending' ? (
                                            <Button size="sm" onClick={() => openFulfillModal(req.id)}>
                                                Fulfill Request
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" disabled className="text-green-600 border-green-200 bg-green-50">
                                                <Check className="w-4 h-4 mr-2" /> Fulfilled
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Dialog open={isFulfillOpen} onOpenChange={setIsFulfillOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Fulfill Request from {activeRequest?.buyerName}</DialogTitle>
                            <DialogDescription>
                                Provide a <strong>{activeRequest?.requestedDocType}</strong> to complete this request.
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="existing" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="existing">Select from Vault</TabsTrigger>
                                <TabsTrigger value="new">Upload New</TabsTrigger>
                            </TabsList>

                            <TabsContent value="existing" className="space-y-4 py-4">
                                <div className="space-y-4">
                                    {eligibleDocs.length > 0 ? (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[50px]"></TableHead>
                                                        <TableHead>Document Name</TableHead>
                                                        <TableHead>Expiry</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {eligibleDocs.map(doc => (
                                                        <TableRow key={doc.id}
                                                            className="cursor-pointer hover:bg-muted/50"
                                                            onClick={() => setSelectedDocId(doc.id)}
                                                        >
                                                            <TableCell>
                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedDocId === doc.id ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                                                                    {selectedDocId === doc.id && <Check className="w-3 h-3" />}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{doc.name}</TableCell>
                                                            <TableCell>{format(new Date(doc.expiryDate), 'MMM d, yyyy')}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground border rounded-md border-dashed">
                                            No valid <strong>{activeRequest?.requestedDocType}</strong> documents found in vault.
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsFulfillOpen(false)}>Cancel</Button>
                                    <Button onClick={handleFulfillExisting} disabled={!selectedDocId}>Confirm Selection</Button>
                                </DialogFooter>
                            </TabsContent>

                            <TabsContent value="new" className="space-y-4 py-4">
                                <form onSubmit={handleFulfillNew} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Document Name</Label>
                                        <Input
                                            placeholder={`e.g. ${activeRequest?.requestedDocType} 2024`}
                                            value={newDocName}
                                            onChange={(e) => setNewDocName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>File</Label>
                                        <Input
                                            type="file"
                                            onChange={(e) => setNewDocFile(e.target.files?.[0] || null)}
                                            required
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsFulfillOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={!newDocName || !newDocFile}>Upload & Fulfill</Button>
                                    </DialogFooter>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
