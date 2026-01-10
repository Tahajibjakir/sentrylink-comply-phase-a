import { Metadata } from 'next';
import { MOCK_DOCS } from '@/lib/mock-data';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const doc = MOCK_DOCS.find((d) => d.id === id);

    const docName = doc ? doc.name : 'Document';

    return {
        title: docName,
    };
}

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
