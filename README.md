
# Newly added features

This branch extends the initial Phase-A UI by implementing a complete end-to-end “request fulfillment” thin slice. In addition to the existing Evidence Vault and request visibility, the project now includes working API routes for creating and retrieving buyer requests, in-memory/persistent storage to track request state, and a fulfillment workflow that allows a Factory user to upload evidence and mark a request as fulfilled. The UI is fully wired to backend logic, enabling real status transitions from Pending to Fulfilled, and ensuring that buyers can verify fulfillment via the API. This version demonstrates how frontend, backend, and data flow integrate together to support a realistic compliance request lifecycle.

# Screenshot
## Bayer's request through postman
<img width="1358" height="684" alt="Image" src="https://github.com/user-attachments/assets/5dacb4a7-48ae-43f0-ac49-6e523db7f7b3" />

## Visible request on the UI
<img width="1366" height="606" alt="Image" src="https://github.com/user-attachments/assets/aa111adc-2727-4a14-b43f-0f620f39925b" />

## Request fulfillment
<img width="1361" height="605" alt="Image" src="https://github.com/user-attachments/assets/246457d9-eeba-401b-ae21-d1ac4ab475d7" />

## Request fulfillment status
<img width="1366" height="608" alt="Image" src="https://github.com/user-attachments/assets/4bd02e86-a71c-4335-9808-b7942e4a5b83" />

## Bayer's check status
<img width="1365" height="680" alt="Image" src="https://github.com/user-attachments/assets/4b5317b3-bca9-4d09-9cd3-e3a72e044538" />

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

Add documents to a “pack.”

Filters persist in the URL, so sharing links works as expected

### Screen B — Evidence Detail & Versions

Clicking into a document opens a detail page.

Here you can see:

document metadata (status chip, type, expiry)

full version history of uploads

an option to upload a new version
(this is mocked — no actual files are stored)

### Screen C — Buyer Request To-Do

This screen shows buyer requests waiting to be fulfilled.

From here, a factory user can:

review pending requests

fulfill a request by attaching existing evidence

or create new evidence if nothing matches yet

## Tech stack

Next.js 14 (App Router)

Tailwind CSS + shadcn/ui for styling

React Context for state management

Mock data only — no backend services

## How to run it

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
