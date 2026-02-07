Relvanta Platform Backend

FastAPI backend for the Relvanta platform, providing secure REST endpoints for content, authentication, client access, and experimental labs.

⸻

Table of Contents
	•	Features￼
	•	Tech Stack￼
	•	Setup & Installation￼
	•	Environment Variables￼
	•	Database Seeding￼
	•	Authentication Flow￼
	•	API Endpoints with Examples￼
	•	Models & Data Structures￼
	•	Docker & Deployment￼
	•	Health Check￼

⸻

Features
	•	Firebase-based authentication + session management
	•	Role-based access control: admin, collaborator, client
	•	Content endpoints: Products, Services, Labs, Pages
	•	Lab experiments require authentication
	•	Redirect management for frontend routes
	•	MongoDB database using Motor (async)
	•	Database seeding script for demo content

⸻

Tech Stack
	•	Python 3.12
	•	FastAPI + Starlette
	•	MongoDB (async via Motor)
	•	Firebase Admin SDK for authentication
	•	Docker for containerization
	•	Fly.io for deployment

⸻

Setup & Installation

git clone https://github.com/benneberg/relvanta.git
cd relvanta/backend

python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

pip install -r requirements.txt


⸻

Environment Variables

Variable	Description
PYTHON_ENV	"production" or "development"
MONGO_URL	MongoDB connection string
DB_NAME	MongoDB database name
FIREBASE_CREDENTIALS_JSON	Base64-encoded Firebase service account JSON
FIREBASE_CREDENTIALS_PATH	Path to Firebase service account JSON (local dev)
COOKIE_DOMAIN	Domain for session cookies (.relvanta.com)
COOKIE_SECURE	true or false for HTTPS cookies
COOKIE_SAMESITE	lax, strict, or none
CORS_ORIGINS	Comma-separated list of allowed origins


⸻

Database Seeding

python seed_content.py

Seeds:
	•	Products
	•	Services
	•	Labs
	•	Pages
	•	Redirects

⸻

Authentication Flow
	1.	Frontend authenticates user via Firebase client SDK
	2.	Sends Firebase ID token to /api/auth/session
	3.	Backend verifies token using firebase_admin
	4.	Creates a session token stored in HTTP-only cookie
	5.	Session token used for all authenticated requests

Diagram:

Frontend           Backend             Firebase
   |                  |                   |
   | ID Token -------->|                   |
   |                  | verify_token()    |
   |                  |----------------->|
   |                  |<-----------------|
   |                  | create session    |
   |<-----------------| set cookie        |
   | subsequent calls |                   |


⸻

API Endpoints with Examples

Authentication

Create Session

POST /api/auth/session
Authorization: Bearer <firebase_id_token>

Response

{
  "user_id": "user_abc123",
  "email": "test@relvanta.com",
  "name": "Test User",
  "role": "client",
  "picture": null,
  "organization_slug": null,
  "created_at": "2026-02-07T12:00:00Z"
}

Get Current User

GET /api/auth/me
Cookie: session_token=<token>


⸻

Content Endpoints

List Products

GET /api/content/products?visibility=public&limit=10

Single Product

GET /api/content/products/chatflow

List Labs (Requires Auth)

GET /api/content/labs
Cookie: session_token=<token>


⸻

Client Access

GET /api/access/<user_id>
Cookie: session_token=<token>


⸻

Health Check

GET /health

Response

{
  "status": "healthy",
  "service": "relvanta-api"
}


⸻

Models & Data Structures
	•	User: user_id, email, name, role, organization_slug
	•	Product: name, slug, category, status, theme, features
	•	Service: name, slug, scope, engagement_type, deliverables
	•	Lab: name, slug, hypothesis, status, metrics
	•	Page: title, slug, content, seo
	•	ClientAccess: access scope per user (products, services, labs)

⸻

Docker & Deployment
	•	Docker multi-stage build with venv
	•	Port 8000 exposed
	•	Fly.io fly.toml sets internal port, memory, CPU, and region

docker build -t relvanta-api .
docker run -p 8000:8000 relvanta-api

License

MIT License © 2026 Relvanta
