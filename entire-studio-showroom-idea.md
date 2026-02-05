This document serves as the final Project Definition and Blueprint for Relvanta. It consolidates the "Venture Studio Showroom" philosophy with the "Curator" workflow and technical architecture.
Relvanta: Project Blueprint 🚀
Relvanta is a "Venture Studio Showroom"—a sophisticated editorial layer that sits on top of a private, high-velocity development ecosystem. It transforms raw project data into a curated, public-facing portfolio and experimental lab.
1. Core Philosophy
 * The Factory vs. The Showroom: The "Factory" (your internal management system) handles the chaos of creation. Relvanta is the "Showroom" that presents the results.
 * Infrastructure First: One platform to host multiple identities. It provides shared authentication, database, and UI logic so individual products don't have to.
 * Editorial Control: No automated "blind" publishing. A human-in-the-loop "Curator" step ensures marketing quality and protects internal strategic data.
2. Architecture & Data Flow
Relvanta functions as a Stateful Projection of your internal JSON data.
 * Source (Internal): A JSON-based system (Firebase-connected) containing facts, strategy, and AI-generated content (READMEs, SEO, Marketing ideas).
 * Ingestion (Backend): A FastAPI service that fetches/imports these JSON objects.
 * Curator Dashboard (Admin UI): A private Relvanta interface where you review "Shippable" candidates and polish them for the public.
 * Storage (Relvanta DB): A MongoDB instance that stores the published version of projects, decoupled from the internal source.
3. The "Curator" Workflow
To maintain speed without sacrificing quality, the workflow follows a Fetch → Edit → Lock pattern:
 * The Scan: Relvanta identifies projects in your JSON marked status: "Shipped" that are not yet in the Showroom.
 * The Editorial Step: You use the Curator UI to:
   * Map aiGenerated.readme to the public content_markdown.
   * Prune technical tags for a marketing audience.
   * Exclude sensitive data (revenue potential, competitor analysis).
 * The Asset Freeze: Upon publishing, Relvanta downloads remote images to local storage to ensure the portfolio remains evergreen even if the source repo changes.
 * Field Locking: Any field edited in Relvanta is "locked." Future syncs from the Internal JSON will update technical metadata but will not overwrite your polished marketing copy.
4. Information Architecture
Public Routes
 * / - Dynamic catalogue with Tag Clouds and Category Filters.
 * /p/[slug] - Deep-dive product pages (the "Showcase").
 * /labs - Access to experimental tools and functional prototypes.
 * /about & /contact - Personal branding and general inquiries.
Authenticated/Private Routes
 * /dashboard/admin/curator - The "Inbox" for importing and editing new projects.
 * /dashboard/client - Gated access for specific clients to see projects assigned to them.
 * /labs/[experimental-tool] - Live prototypes requiring beta-tester login.
5. Technical Data Schema (Relvanta-Side)
This schema represents the "Published" state in MongoDB.
interface RelvantaProduct {
  // Connection to Source
  upstream_id: string;          // Original ID from Internal JSON
  last_synced_at: Date;
  locked_fields: string[];      // e.g., ["description", "title"]

  // Public Marketing Content
  slug: string;                 // URL-friendly name
  title: string;
  short_summary: string;        // For grid cards
  content_markdown: string;     // Polished long-form content
  category: string;
  tags: string[];

  // Asset Management
  assets: {
    cover_image_url: string;    // Local path to the "frozen" image
    gallery: string[];
  };

  // Deployment & Engagement
  deployment: {
    status: 'concept' | 'beta' | 'live' | 'graduated';
    live_url?: string;          // External link if "Graduated"
    repo_url?: string;
    cta_type: 'waitlist' | 'feedback' | 'buy' | 'demo';
  };

  // Access Control
  visibility: 'public' | 'client-only' | 'private';
  allowed_user_emails?: string[]; // For selective showcasing
}

6. Development Roadmap
Phase 1: The Bridge (MVP)
 * Build the FastAPI Ingestor to read the internal JSON.
 * Create the Curator UI list view showing "Pending" vs "Published" projects.
 * Implement the "Import" form to map JSON data to the Relvanta Schema.
Phase 2: The Showroom
 * Develop the Next.js Homepage with Category filtering and Tag clouds.
 * Build the Product Detail Template to render Markdown and Gallery images.
 * Setup Firebase Auth for Admin and Client-specific views.
Phase 3: The Labs & Assets
 * Implement the Asset Freeze (local image downloading).
 * Standardize the /labs layout to allow quick deployment of React-based micro-tools.
 * Add the Feedback Loop (context-aware contact forms).
7. Strategic Principles
 * Don't Over-Automate: Your taste is the filter. Use the machine to fetch data, but use your eyes to approve it.
 * Immutability: Once a project is in the Showroom, it should be self-sustaining.
 * Optionality: Keep the path open for a product to "graduate" to its own domain while always leaving a footprint on Relvanta.
