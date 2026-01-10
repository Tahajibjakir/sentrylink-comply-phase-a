# Evidence Vault + Request Fulfillment UI (Phase A)

This project is a lightweight demo UI that shows what the SentryLink Comply Phase A experience could look like from a factory user’s perspective. It’s not connected to a backend—everything runs on mock data—but it’s meant to feel like the real workflow.

## What it does

The app includes three main screens that cover how factories store evidence documents and respond to buyer requests.

### Screen A — Evidence Vault (List View)

A central place to browse and manage all evidence documents.

You’ll be able to:

view documents in a table with columns for
Doc Name | Doc Type | Status | Expiry | Versions | Last Updated | Actions

filter by
type, status, expiry date, and search

bulk select rows

add documents to a “pack”

filters persist in the URL so sharing links works as expected

### Screen B — Evidence Detail & Versions

Clicking into a document opens a detail page.

Here you can see:

document metadata (status chip, type, expiry)

full version history of uploads

an option to upload a new version
(this is mocked — no actual files are stored)

### Screen C — Buyer Request To-Do

This screen shows buyer requests waiting to be fulfilled.

From here a factory user can:

review pending requests

fulfill a request by attaching existing evidence

or create new evidence if nothing matches yet

Tech stack

Next.js 14 (App Router)

Tailwind CSS + shadcn/ui for styling

React Context for state management

Mock data only — no backend services

How to run it

Install dependencies

npm install


Start the development server

npm run dev


Open your browser and go to
http://localhost:3000

Project layout

/app — all App Router routes

/components/ui — reusable interface components

/lib — mock data and simple state store