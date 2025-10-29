# Authentication Flow Diagrams

Visual representation of the authentication flows in OptiGenius.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        OptiGenius                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Anonymous  │         │ Authenticated │                  │
│  │    Users     │         │    Users      │                  │
│  └──────┬───────┘         └──────┬────────┘                  │
│         │                        │                           │
│         ├─ URL Analysis          ├─ URL Analysis             │
│         ├─ SEO Metrics           ├─ SEO Metrics              │
│         ├─ GEO Analysis          ├─ GEO Analysis             │
│         ├─ Export (PDF/MD)       ├─ Export (PDF/MD)          │
│         │                        ├─ AI Insights ⭐           │
│         │                        ├─ Save Reports ⭐          │
│         │                        ├─ View History ⭐          │
│         │                        └─ Manage Reports ⭐        │
│         │                                                     │
└─────────┴─────────────────────────────────────────────────────┘
```

## User Registration Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Visit /auth/signup
     ▼
┌─────────────────┐
│  Sign Up Form   │
│  - Name         │
│  - Email        │
│  - Password     │
└────┬────────────┘
     │
     │ 2. Submit form
     ▼
┌──────────────────────┐
│ POST /api/auth/      │
│      register        │
└────┬─────────────────┘
     │
     │ 3. Validate input
     ▼
┌──────────────────────┐
│  Check if user       │
│  already exists      │
└────┬─────────────────┘
     │
     ├─ Yes ──► Error: "User already exists"
     │
     │ No
     ▼
┌──────────────────────┐
│  Hash password       │
│  (bcrypt, 12 rounds) │
└────┬─────────────────┘
     │
     │ 4. Create user
     ▼
┌──────────────────────┐
│  Save to database    │
│  (Prisma)            │
└────┬─────────────────┘
     │
     │ 5. Auto sign-in
     ▼
┌──────────────────────┐
│  Create session      │
│  (NextAuth)          │
└────┬─────────────────┘
     │
     │ 6. Redirect
     ▼
┌──────────────────────┐
│  Homepage            │
│  (Authenticated)     │
└──────────────────────┘
```

## User Login Flow (Credentials)

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Visit /auth/signin
     ▼
┌─────────────────┐
│  Sign In Form   │
│  - Email        │
│  - Password     │
└────┬────────────┘
     │
     │ 2. Submit form
     ▼
┌──────────────────────────┐
│ NextAuth Credentials     │
│ Provider                 │
└────┬─────────────────────┘
     │
     │ 3. Find user by email
     ▼
┌──────────────────────────┐
│  Query database          │
│  (Prisma)                │
└────┬─────────────────────┘
     │
     ├─ Not found ──► Error: "Invalid credentials"
     │
     │ Found
     ▼
┌──────────────────────────┐
│  Compare password        │
│  (bcrypt.compare)        │
└────┬─────────────────────┘
     │
     ├─ Mismatch ──► Error: "Invalid credentials"
     │
     │ Match
     ▼
┌──────────────────────────┐
│  Create JWT session      │
│  (NextAuth)              │
└────┬─────────────────────┘
     │
     │ 4. Set cookie
     ▼
┌──────────────────────────┐
│  HTTP-only cookie        │
│  with session token      │
└────┬─────────────────────┘
     │
     │ 5. Redirect
     ▼
┌──────────────────────────┐
│  Homepage or callback    │
│  (Authenticated)         │
└──────────────────────────┘
```

## OAuth Flow (Google/GitHub)

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Click "Sign in with Google"
     ▼
┌──────────────────────────┐
│  NextAuth OAuth Handler  │
└────┬─────────────────────┘
     │
     │ 2. Redirect to provider
     ▼
┌──────────────────────────┐
│  Google/GitHub           │
│  Authorization Page      │
└────┬─────────────────────┘
     │
     │ 3. User authorizes
     ▼
┌──────────────────────────┐
│  Provider redirects      │
│  with auth code          │
└────┬─────────────────────┘
     │
     │ 4. Callback to /api/auth/callback
     ▼
┌──────────────────────────┐
│  Exchange code for       │
│  access token            │
└────┬─────────────────────┘
     │
     │ 5. Fetch user profile
     ▼
┌──────────────────────────┐
│  Get email, name, image  │
│  from provider           │
└────┬─────────────────────┘
     │
     │ 6. Check if user exists
     ▼
┌──────────────────────────┐
│  Query by email          │
│  (Prisma)                │
└────┬─────────────────────┘
     │
     ├─ Exists ──► Link account
     │
     │ New user
     ▼
┌──────────────────────────┐
│  Create user & account   │
│  (Prisma)                │
└────┬─────────────────────┘
     │
     │ 7. Create session
     ▼
┌──────────────────────────┐
│  JWT session with        │
│  user info               │
└────┬─────────────────────┘
     │
     │ 8. Redirect
     ▼
┌──────────────────────────┐
│  Homepage                │
│  (Authenticated)         │
└──────────────────────────┘
```

## URL Analysis Flow (Anonymous vs Authenticated)

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Enter URL
     ▼
┌──────────────────────────┐
│  Homepage Form           │
└────┬─────────────────────┘
     │
     │ 2. Submit
     ▼
┌──────────────────────────┐
│  GET /api/analyze        │
│  ?url=example.com        │
└────┬─────────────────────┘
     │
     │ 3. Check session
     ▼
┌──────────────────────────┐
│  getServerSession()      │
│  (NextAuth)              │
└────┬─────────────────────┘
     │
     ├─────────────┬─────────────┐
     │             │             │
     │ Anonymous   │ Authenticated
     ▼             ▼             │
┌─────────┐   ┌─────────┐       │
│ Fetch   │   │ Fetch   │       │
│ Page    │   │ Page    │       │
└────┬────┘   └────┬────┘       │
     │             │             │
     │ 4. Analyze  │             │
     ▼             ▼             │
┌─────────┐   ┌─────────┐       │
│ SEO     │   │ SEO     │       │
│ Metrics │   │ Metrics │       │
└────┬────┘   └────┬────┘       │
     │             │             │
     │ 5. GEO      │             │
     ▼             ▼             │
┌─────────┐   ┌─────────┐       │
│ GEO     │   │ GEO     │       │
│ Analysis│   │ Analysis│       │
└────┬────┘   └────┬────┘       │
     │             │             │
     │ 6. AI       │ 6. AI       │
     ▼             ▼             │
┌─────────┐   ┌─────────┐       │
│ Skip    │   │ Call    │       │
│ AI      │   │ OpenAI  │       │
│ (msg)   │   │ API     │       │
└────┬────┘   └────┬────┘       │
     │             │             │
     │ 7. Return   │             │
     ▼             ▼             │
┌─────────────────────────┐     │
│  Results Page            │     │
│  - SEO Score             │     │
│  - GEO Metrics           │     │
│  - AI Insights (or msg)  │     │
│  - Export buttons        │     │
│  - Save button (if auth) │     │
└──────────────────────────┘     │
```

## Save Report Flow

```
┌─────────────────┐
│ Authenticated   │
│ User on Results │
└────┬────────────┘
     │
     │ 1. Click "Save Report"
     ▼
┌──────────────────────────┐
│  POST /api/reports       │
│  {url, score, data}      │
└────┬─────────────────────┘
     │
     │ 2. Verify session
     ▼
┌──────────────────────────┐
│  getServerSession()      │
└────┬─────────────────────┘
     │
     ├─ No session ──► 401 Unauthorized
     │
     │ Has session
     ▼
┌──────────────────────────┐
│  Validate request body   │
└────┬─────────────────────┘
     │
     │ 3. Save to database
     ▼
┌──────────────────────────┐
│  prisma.report.create()  │
│  - userId (from session) │
│  - url, score, data      │
└────┬─────────────────────┘
     │
     │ 4. Return success
     ▼
┌──────────────────────────┐
│  Button shows "Saved!"   │
│  (green, 3 seconds)      │
└──────────────────────────┘
```

## Dashboard Access Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Click "Dashboard"
     ▼
┌──────────────────────────┐
│  /dashboard              │
└────┬─────────────────────┘
     │
     │ 2. Middleware check
     ▼
┌──────────────────────────┐
│  middleware.ts           │
│  (NextAuth)              │
└────┬─────────────────────┘
     │
     ├─ Not authenticated ──► Redirect to /auth/signin
     │                         ?callbackUrl=/dashboard
     │
     │ Authenticated
     ▼
┌──────────────────────────┐
│  Load dashboard page     │
└────┬─────────────────────┘
     │
     │ 3. Fetch reports
     ▼
┌──────────────────────────┐
│  GET /api/reports        │
└────┬─────────────────────┘
     │
     │ 4. Verify session
     ▼
┌──────────────────────────┐
│  getServerSession()      │
└────┬─────────────────────┘
     │
     │ 5. Query user's reports
     ▼
┌──────────────────────────┐
│  prisma.report.findMany()│
│  where: {userId}         │
│  orderBy: {createdAt}    │
└────┬─────────────────────┘
     │
     │ 6. Return reports
     ▼
┌──────────────────────────┐
│  Display in dashboard    │
│  - URL, score, date      │
│  - View/Delete buttons   │
└──────────────────────────┘
```

## Session Management

```
┌──────────────────────────────────────────────────────┐
│                   Session Lifecycle                   │
├──────────────────────────────────────────────────────┤
│                                                        │
│  1. Login/Register                                    │
│     │                                                 │
│     ▼                                                 │
│  ┌─────────────────┐                                 │
│  │ Create JWT      │                                 │
│  │ - user.id       │                                 │
│  │ - user.email    │                                 │
│  │ - expiry        │                                 │
│  └────┬────────────┘                                 │
│       │                                               │
│       ▼                                               │
│  ┌─────────────────┐                                 │
│  │ Set HTTP-only   │                                 │
│  │ Cookie          │                                 │
│  │ - Secure        │                                 │
│  │ - SameSite      │                                 │
│  └────┬────────────┘                                 │
│       │                                               │
│       ▼                                               │
│  ┌─────────────────┐                                 │
│  │ User navigates  │◄────┐                           │
│  │ app pages       │     │                           │
│  └────┬────────────┘     │                           │
│       │                  │                           │
│       ▼                  │                           │
│  ┌─────────────────┐     │                           │
│  │ Cookie sent     │     │                           │
│  │ automatically   │     │                           │
│  └────┬────────────┘     │                           │
│       │                  │                           │
│       ▼                  │                           │
│  ┌─────────────────┐     │                           │
│  │ Verify JWT      │     │                           │
│  │ signature       │     │                           │
│  └────┬────────────┘     │                           │
│       │                  │                           │
│       ├─ Valid ──────────┘                           │
│       │                                               │
│       ├─ Expired ──► Redirect to sign-in             │
│       │                                               │
│       └─ Invalid ──► Clear cookie, redirect          │
│                                                        │
│  2. Sign Out                                          │
│     │                                                 │
│     ▼                                                 │
│  ┌─────────────────┐                                 │
│  │ Clear cookie    │                                 │
│  │ Redirect home   │                                 │
│  └─────────────────┘                                 │
│                                                        │
└──────────────────────────────────────────────────────┘
```

## Database Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    Database Schema                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────┐                                            │
│  │   User   │                                            │
│  ├──────────┤                                            │
│  │ id       │◄──────────┐                               │
│  │ email    │            │                               │
│  │ password │            │                               │
│  │ name     │            │                               │
│  │ image    │            │                               │
│  └────┬─────┘            │                               │
│       │                  │                               │
│       │ 1:N              │ N:1                           │
│       ▼                  │                               │
│  ┌──────────┐       ┌────┴─────┐                        │
│  │ Account  │       │  Report  │                        │
│  ├──────────┤       ├──────────┤                        │
│  │ id       │       │ id       │                        │
│  │ userId   │───────┤ userId   │                        │
│  │ provider │       │ url      │                        │
│  │ tokens   │       │ score    │                        │
│  └──────────┘       │ data     │                        │
│                     │ createdAt│                        │
│       │             └──────────┘                        │
│       │ 1:N                                              │
│       ▼                                                  │
│  ┌──────────┐                                            │
│  │ Session  │                                            │
│  ├──────────┤                                            │
│  │ id       │                                            │
│  │ userId   │                                            │
│  │ token    │                                            │
│  │ expires  │                                            │
│  └──────────┘                                            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌────────────────────────────────────────────────────────┐
│                   Security Stack                        │
├────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Password Security                             │
│  ┌──────────────────────────────────────┐              │
│  │ bcrypt hashing (12 rounds)           │              │
│  │ No plain text storage                │              │
│  │ Secure comparison                    │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  Layer 2: Session Security                              │
│  ┌──────────────────────────────────────┐              │
│  │ JWT tokens (signed)                  │              │
│  │ HTTP-only cookies                    │              │
│  │ Secure flag (HTTPS)                  │              │
│  │ SameSite attribute                   │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  Layer 3: API Protection                                │
│  ┌──────────────────────────────────────┐              │
│  │ Server-side session validation       │              │
│  │ User ownership checks                │              │
│  │ CSRF protection                      │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  Layer 4: Database Security                             │
│  ┌──────────────────────────────────────┐              │
│  │ Prisma prepared statements           │              │
│  │ SQL injection prevention             │              │
│  │ Cascade deletes                      │              │
│  │ Indexed queries                      │              │
│  └──────────────────────────────────────┘              │
│                                                          │
└────────────────────────────────────────────────────────┘
```

---

These diagrams illustrate the complete authentication flow and architecture of OptiGenius's hybrid authentication system.
