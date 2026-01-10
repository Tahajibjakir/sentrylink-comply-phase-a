'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusChip } from '@/components/ui/status-chip';
import { NavBar } from '@/components/nav-bar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';


interface PageProps {
    params: Promise<{ id: string }>;
}

export default function DocumentDetailPage({ params }: PageProps) {

    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const { documents, addDocumentVersion } = useAppStore();
    const router = useRouter();

    const doc = documents.find(d => d.id === id);

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadNotes, setUploadNotes] = useState('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    if (!doc) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <NavBar />
                <div className="flex-1 p-8 container mx-auto text-center">
                    <h1 className="text-2xl font-bold">Document Not Found</h1>
                    <Button asChild className="mt-4">
                        <Link href="/vault">Back to Vault</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile || !uploadNotes) return;

        // Mock upload
        const newVersion = {
            id: `v${doc.versions.length + 1}`,
            versionNumber: `v${doc.versions.length + 1}.0`,
            dateUploaded: new Date().toISOString(),
            uploadedBy: 'CurrentUser', // Mocked
            notes: uploadNotes,
            fileSize: `${(uploadFile.size / 1024 / 1024).toFixed(2)} MB`,
            fileName: uploadFile.name
        };

        addDocumentVersion(doc.id, newVersion);
        setIsUploadOpen(false);
        setUploadNotes('');
        setUploadFile(null);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavBar />

            <main className="flex-1 p-8 space-y-6 container mx-auto max-w-5xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-2">
                        <Link href="/vault" className="text-sm text-muted-foreground flex items-center gap-1 hover:underline">
                            <ArrowLeft className="w-4 h-4" /> Back to Vault
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{doc.name}</h1>
                            <StatusChip status={doc.status} />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2">Type: <Badge variant="outline">{doc.type}</Badge></div>
                    </div>
                    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload New Version
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Upload New Version</DialogTitle>
                                <DialogDescription>
                                    Add a newer version of this document. The previous versions will remain in history.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Notes (Required)</label>
                                    <Input
                                        placeholder="E.g., Renewed for 2025"
                                        value={uploadNotes}
                                        onChange={(e) => setUploadNotes(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">File</label>
                                    <Input
                                        type="file"
                                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                        required
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={!uploadFile || !uploadNotes}>Upload</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Metadata Card */}
                    <Card className="md:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle className="text-lg">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <div className="text-muted-foreground">Expiry Date</div>
                                <div className="font-medium">{format(new Date(doc.expiryDate), 'MMMM d, yyyy')}</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Last Updated</div>
                                <div className="font-medium">{format(new Date(doc.lastUpdated), 'MMMM d, yyyy')}</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Total Versions</div>
                                <div className="font-medium">{doc.versions.length}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Version History */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Version History</CardTitle>
                            <CardDescription>All uploaded files for this document.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Version</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Uploaded By</TableHead>
                                        <TableHead>Notes</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {doc.versions.map((v) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-medium">{v.versionNumber}</TableCell>
                                            <TableCell>{format(new Date(v.dateUploaded), 'MMM d, yyyy')}</TableCell>
                                            <TableCell>{v.uploadedBy}</TableCell>
                                            <TableCell className="max-w-[150px] truncate" title={v.notes}>{v.notes}</TableCell>
                                            <TableCell>{v.fileSize}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" title="Download (Mock)">
                                                    <FileText className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
