'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusChip } from '@/components/ui/status-chip';
import { NavBar } from '@/components/nav-bar';
import Link from 'next/link';
import { format } from 'date-fns';


function VaultContent() {
    const { documents } = useAppStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Filter States
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // URL synced state
    const typeFilter = searchParams.get('type') || 'all';
    const statusFilter = searchParams.get('status') || 'all';
    const searchQuery = searchParams.get('q') || '';

    // Derived State (Filtered Docs)
    const filteredDocs = useMemo(() => {
        return documents.filter(doc => {
            const matchesType = typeFilter === 'all' || doc.type === typeFilter;
            const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
            const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesType && matchesStatus && matchesSearch;
        });
    }, [documents, typeFilter, statusFilter, searchQuery]);

    // Handlers
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(filteredDocs.map(d => d.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const allSelected = filteredDocs.length > 0 && selectedIds.length === filteredDocs.length;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavBar />

            <main className="flex-1 p-8 space-y-6 container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Evidence Vault</h1>
                        <p className="text-muted-foreground">Manage and organize your compliance documentation.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <div className="text-sm text-muted-foreground mr-4 animate-in fade-in">
                                {selectedIds.length} selected
                            </div>
                        )}
                        <Button disabled={selectedIds.length === 0}>
                            Add to Pack
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
                    <div className="flex-1 w-full">
                        <Input
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => updateFilter('q', e.target.value)}
                            className="max-w-md"
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={(val) => updateFilter('type', val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Doc Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Cert">Cert</SelectItem>
                            <SelectItem value="Audit">Audit</SelectItem>
                            <SelectItem value="Lab Report">Lab Report</SelectItem>
                            <SelectItem value="Declaration">Declaration</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={(val) => updateFilter('status', val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Valid">Valid</SelectItem>
                            <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Doc Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expiry</TableHead>
                                <TableHead>Versions</TableHead>
                                <TableHead>Last Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                        No documents found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDocs.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(doc.id)}
                                                onCheckedChange={(checked) => handleSelectOne(doc.id, checked as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Link href={`/vault/${doc.id}`} className="hover:underline">
                                                {doc.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{doc.type}</TableCell>
                                        <TableCell>
                                            <StatusChip status={doc.status} />
                                        </TableCell>
                                        <TableCell>{format(new Date(doc.expiryDate), 'MMM d, yyyy')}</TableCell>
                                        <TableCell>{doc.versions.length}</TableCell>
                                        <TableCell>{format(new Date(doc.lastUpdated), 'MMM d, yyyy')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/vault/${doc.id}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    );
}

export default function VaultPage() {
    return (
        <Suspense fallback={<div>Loading Vault...</div>}>
            <VaultContent />
        </Suspense>
    );
}

