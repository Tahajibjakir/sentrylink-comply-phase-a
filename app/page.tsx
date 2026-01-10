import { NavBar } from '@/components/nav-bar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />

      <main className="flex-1 container mx-auto max-w-5xl py-12 px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Compliance Simplified
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Manage your evidence, fulfill buyer requests, and ensure your supply chain stays compliant with SentryLink.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Module 1: Evidence Vault */}
          <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl">Evidence Vault</CardTitle>
              <CardDescription>
                Centralized storage for your certificates, audit reports, and declarations.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2">
                <li>Track document expiry dates</li>
                <li>Manage version history</li>
                <li>Organize by document type</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full group" asChild>
                <Link href="/vault">
                  Go to Vault
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Module 2: Buyer Requests */}
          <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 text-green-600 dark:bg-green-900/40 dark:text-green-400">
                <FileText className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl">Buyer Requests</CardTitle>
              <CardDescription>
                View and fulfill pending documentation requests from your buyers.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2">
                <li>See due dates and priorities</li>
                <li>Upload directly from your Vault</li>
                <li>Track fulfillment status</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full group" variant="secondary" asChild>
                <Link href="/requests">
                  View Requests
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
