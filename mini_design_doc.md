## SentryLink Comply Phase A – Mini Design Doc

1. Technology Stack

• Frontend: React (Next.js App Router)
Reason: Next.js makes dashboards fast with SSR/RSC, and it integrates nicely with our backend. The React ecosystem also makes building and maintaining components easier.
• Backend: Next.js API Routes (Node.js)
Reason: Keeping the frontend and backend together simplifies development. Server Actions make type-safe updates easy, and deployment to Vercel or AWS is straightforward.
• Database (Phase A): Local JSON / In-Memory
Reason: For this initial “thin slice,” a lightweight storage works well. Later (Phase B) we can move to PostgreSQL using Prisma or Drizzle.
• Storage: Local filesystem (Phase A) → AWS S3 (Phase B)
Reason: Simple for file uploads now, scalable for real production later.

2. Data Model

Entities and Relationships
• Organization
id, name, tier
Has many Users and Documents
• User
id, email, role (Admin, Compliance Officer)
Belongs to an Organization
• EvidenceDocument
id, name, type (Cert, Audit, Lab Report), status (Valid, Expired), expiryDate
Has many DocumentVersions
Reason: We need version history for compliance tracking
• DocumentVersion
id, documentId, versionNumber (v1, v2), fileUrl, uploadedAt, uploadedBy
• BuyerRequest
id, buyerName, requestedDocType, status (Pending, Fulfilled), fulfilledWithDocId
Reason: Tracks which buyer requested which document.

3. Selective Disclosure (Phase A Rules)

Goal: Suppliers control who can see their documents.
• Default: All documents are private to the supplier.
• When a buyer can see: Only after a Supplier fulfills their request.
• Phase A: No public links. We track access via a simple RequestFulfillment table linking Buyer → Document.

4. Export Pack (Async Job)

Scenario: Buyer wants all compliance documents for a year in a single zip.

How it works:
• Buyer selects documents and clicks “Download Export Pack.”
• System creates a jobId for this request.
• Background worker gathers the files, creates a Manifest.csv, and zips them.
• UI checks job status and shows a download link when ready.
• This keeps large exports from slowing down the main app.

5. Testing Plan (Minimum)

1. Unit Tests:
   • Utility functions (date formatting, expired/valid status)
   • Validation rules (e.g., can’t fulfill a request with an expired doc)

1. Integration Tests:
   • API Routes like POST /api/documents create the correct entries
   • Fulfilling requests updates BuyerRequest status correctly

1. End-to-End (Playwright):
   • Login
   • Upload document (e.g., ISO 9001)
   • Fulfill a buyer request
   • Confirm status changes to Fulfilled

1. 8-Week Delivery Plan

Milestone----------------- Weeks--------------- Deliverables

M1: Foundation -------------1–2 ----------------Set up repo, integrate authentication, basic Evidence Vault view (read-only)
M2: Core Vault -------------3–4 ----------------Document upload, version control, document detail view
M3: Workflow ---------------5–6 ----------------Buyer request dashboard, fulfill logic, selective disclosure
M4: Polish & Export --------7–8 ----------------Bulk export (async zip), UI polish, end-to-end testing, Phase A launch
