# OptiGenius - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Home Page   │  │ Results Page │  │ History Page │     │
│  │              │  │              │  │              │     │
│  │ - URL Input  │  │ - SEO Score  │  │ - Saved      │     │
│  │ - Analyze    │  │ - GEO Score  │  │   Reports    │     │
│  │              │  │ - Export     │  │ - Delete     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  Sign In     │  │  Register    │                        │
│  │              │  │              │                        │
│  │ - Email/Pass │  │ - Create     │                        │
│  │ - Google     │  │   Account    │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   API Routes                            │ │
│  │                                                         │ │
│  │  Public:                                                │ │
│  │  • GET  /api/analyze?url=...                           │ │
│  │                                                         │ │
│  │  Auth:                                                  │ │
│  │  • POST /api/auth/register                             │ │
│  │  • *    /api/auth/[...nextauth]                        │ │
│  │                                                         │ │
│  │  Protected (Requires Auth):                             │ │
│  │  • POST   /api/reports                                 │ │
│  │  • GET    /api/reports                                 │ │
│  │  • GET    /api/reports/[id]                            │ │
│  │  • DELETE /api/reports/[id]                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Services                             │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   NextAuth   │  │  Auth Store  │  │    OpenAI    │     │
│  │              │  │              │  │              │     │
│  │ - Session    │  │ - Users      │  │ - GPT-3.5    │     │
│  │ - JWT        │  │ - Reports    │  │ - Analysis   │     │
│  │ - OAuth      │  │ - In-Memory  │  │ - Insights   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Cheerio    │  │    jsPDF     │                        │
│  │              │  │              │                        │
│  │ - Web Scrape │  │ - PDF Export │                        │
│  │ - Parse HTML │  │ - Markdown   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

### Registration Flow
```
User                    Client                  API                 Auth Store
 │                        │                      │                      │
 │  Fill Registration     │                      │                      │
 │  Form                  │                      │                      │
 │───────────────────────>│                      │                      │
 │                        │                      │                      │
 │                        │  POST /api/auth/     │                      │
 │                        │  register            │                      │
 │                        │─────────────────────>│                      │
 │                        │                      │                      │
 │                        │                      │  Validate Email      │
 │                        │                      │  Hash Password       │
 │                        │                      │                      │
 │                        │                      │  createUser()        │
 │                        │                      │─────────────────────>│
 │                        │                      │                      │
 │                        │                      │  User Created        │
 │                        │                      │<─────────────────────│
 │                        │                      │                      │
 │                        │  Success Response    │                      │
 │                        │<─────────────────────│                      │
 │                        │                      │                      │
 │                        │  signIn()            │                      │
 │                        │  (auto sign-in)      │                      │
 │                        │─────────────────────>│                      │
 │                        │                      │                      │
 │  Redirect to Home      │  Session Created     │                      │
 │<───────────────────────│<─────────────────────│                      │
```

### Sign In Flow
```
User                    Client                  NextAuth              Auth Store
 │                        │                      │                      │
 │  Enter Credentials     │                      │                      │
 │───────────────────────>│                      │                      │
 │                        │                      │                      │
 │                        │  signIn()            │                      │
 │                        │─────────────────────>│                      │
 │                        │                      │                      │
 │                        │                      │  findUserByEmail()   │
 │                        │                      │─────────────────────>│
 │                        │                      │                      │
 │                        │                      │  User Data           │
 │                        │                      │<─────────────────────│
 │                        │                      │                      │
 │                        │                      │  verifyPassword()    │
 │                        │                      │─────────────────────>│
 │                        │                      │                      │
 │                        │                      │  Valid ✓             │
 │                        │                      │<─────────────────────│
 │                        │                      │                      │
 │                        │                      │  Create JWT Token    │
 │                        │                      │  Create Session      │
 │                        │                      │                      │
 │  Redirect to Home      │  Session Cookie      │                      │
 │<───────────────────────│<─────────────────────│                      │
```

### Save Report Flow
```
User                    Client                  API                 Auth Store
 │                        │                      │                      │
 │  Click "Save Report"   │                      │                      │
 │───────────────────────>│                      │                      │
 │                        │                      │                      │
 │                        │  POST /api/reports   │                      │
 │                        │  + Session Cookie    │                      │
 │                        │─────────────────────>│                      │
 │                        │                      │                      │
 │                        │                      │  getServerSession()  │
 │                        │                      │  Verify Auth ✓       │
 │                        │                      │                      │
 │                        │                      │  saveReport()        │
 │                        │                      │─────────────────────>│
 │                        │                      │                      │
 │                        │                      │  Report Saved        │
 │                        │                      │<─────────────────────│
 │                        │                      │                      │
 │  Success Message       │  Success Response    │                      │
 │<───────────────────────│<─────────────────────│                      │
```

## Data Flow for URL Analysis

```
User Input (URL)
      │
      ▼
┌─────────────────┐
│  /api/analyze   │
└─────────────────┘
      │
      ├──> Fetch URL (node-fetch)
      │         │
      │         ▼
      │    Parse HTML (Cheerio)
      │         │
      │         ├──> Extract Title
      │         ├──> Extract Meta Description
      │         ├──> Extract Headings (H1, H2, H3)
      │         ├──> Extract Links
      │         └──> Extract Body Text
      │
      ├──> Calculate SEO Score
      │         │
      │         └──> Score = Title(35) + Meta(35) + H1(20) + H2/H3(10)
      │
      ├──> AI Insights (OpenAI)
      │         │
      │         ├──> Content Summary
      │         └──> SEO Suggestions
      │
      └──> GEO Analysis (OpenAI)
                │
                ├──> AI-Readiness Score
                ├──> Named Entities
                ├──> AI Ranking Prediction
                └──> Readiness Factors
                      │
                      ▼
                Return JSON Response
                      │
                      ▼
                Display Results
                      │
                      ├──> SEO Score Card
                      ├──> GEO Analysis Card
                      ├──> AI Insights Card
                      └──> Export Options
```

## Component Hierarchy

```
RootLayout
├── NextAuthProvider (Session Context)
│   ├── Navigation
│   │   ├── Logo
│   │   ├── Auth Status
│   │   │   ├── [Anonymous] Sign In / Register
│   │   │   └── [Logged In] User Menu / History / Sign Out
│   │
│   └── Page Content
│       ├── HomePage
│       │   └── URL Input Form
│       │
│       ├── ResultsPage
│       │   ├── Export Buttons (PDF, Markdown)
│       │   ├── Save Report Button (if authenticated)
│       │   ├── SEO Score Card
│       │   ├── GEO Analysis Card
│       │   ├── AI Insights Card
│       │   └── Tabs (Overview, Headings, Links)
│       │
│       ├── HistoryPage (Protected)
│       │   └── Saved Reports List
│       │       └── Report Cards
│       │
│       ├── SignInPage
│       │   ├── Email/Password Form
│       │   ├── Google OAuth Button
│       │   └── Links (Register, Guest)
│       │
│       └── RegisterPage
│           ├── Registration Form
│           ├── Google OAuth Button
│           └── Links (Sign In, Guest)
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Measures                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Password Security                                        │
│     • bcrypt hashing (10 rounds)                            │
│     • Minimum 6 characters                                   │
│     • Never stored in plain text                            │
│                                                              │
│  2. Session Security                                         │
│     • JWT tokens                                             │
│     • HTTP-only cookies                                      │
│     • Secure flag in production                             │
│     • CSRF protection (NextAuth built-in)                   │
│                                                              │
│  3. API Security                                             │
│     • Session validation on protected routes                │
│     • User ownership checks                                  │
│     • Input validation                                       │
│     • Error message sanitization                            │
│                                                              │
│  4. Client Security                                          │
│     • No sensitive data in localStorage                     │
│     • Session-based auth only                               │
│     • Redirect to sign-in for protected pages              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Storage Architecture (Current MVP)

```
┌─────────────────────────────────────────────────────────────┐
│                   In-Memory Storage                          │
│                  (lib/auth-store.ts)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Users Map                                                   │
│  ┌────────────────────────────────────────────────┐         │
│  │ Key: userId                                     │         │
│  │ Value: {                                        │         │
│  │   id: string                                    │         │
│  │   email: string                                 │         │
│  │   name: string                                  │         │
│  │   passwordHash: string                          │         │
│  │   createdAt: Date                               │         │
│  │ }                                               │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Reports Map                                                 │
│  ┌────────────────────────────────────────────────┐         │
│  │ Key: reportId                                   │         │
│  │ Value: {                                        │         │
│  │   id: string                                    │         │
│  │   userId: string                                │         │
│  │   url: string                                   │         │
│  │   title: string                                 │         │
│  │   score: number                                 │         │
│  │   data: AnalyzeResponse                         │         │
│  │   createdAt: Date                               │         │
│  │ }                                               │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  ⚠️  Note: Data resets on server restart                    │
│  ✅  For production: Replace with database                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Future Database Schema (Recommended)

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reports Table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title VARCHAR(500),
  score INTEGER,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Sessions Table (for NextAuth)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 | React framework with App Router |
| **Authentication** | NextAuth.js v4 | Session management & OAuth |
| **UI Framework** | Tailwind CSS | Utility-first styling |
| **UI Components** | shadcn/ui | Pre-built React components |
| **Icons** | Lucide React | Icon library |
| **PDF Generation** | jsPDF | Client-side PDF creation |
| **Web Scraping** | Cheerio | HTML parsing |
| **AI** | OpenAI GPT-3.5 | Content analysis |
| **Password Hashing** | bcryptjs | Secure password storage |
| **HTTP Client** | node-fetch | Server-side requests |
| **Language** | TypeScript | Type-safe JavaScript |

## Performance Considerations

- **Client-side PDF generation**: No server load for exports
- **JWT sessions**: Stateless, scalable authentication
- **In-memory storage**: Fast read/write (MVP only)
- **Lazy loading**: Components loaded on demand
- **API route caching**: Can be added for repeated URLs
- **OpenAI rate limiting**: Consider implementing request queuing

## Deployment Checklist

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Add rate limiting
- [ ] Configure CORS
- [ ] Set up monitoring
- [ ] Add error tracking (Sentry)
- [ ] Configure CDN for static assets
- [ ] Set up backup strategy
