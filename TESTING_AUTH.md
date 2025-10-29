# Authentication Testing Guide

Complete testing checklist for the hybrid authentication system.

## Test Environment Setup

1. Ensure PostgreSQL is running
2. Database is migrated: `npm run db:migrate`
3. `.env` file is configured
4. Dev server is running: `npm run dev`

## Test Cases

### 1. Anonymous User Access ✅

**Test: URL Analysis Without Login**

1. Open http://localhost:3000
2. Verify "Sign In" and "Sign Up" buttons visible in header
3. Enter URL: `https://example.com`
4. Click "Analyze"
5. Wait for results page

**Expected Results:**
- ✅ Analysis completes successfully
- ✅ SEO score displayed
- ✅ GEO metrics visible
- ✅ AI insights show "Sign in to access AI-powered insights"
- ✅ No "Save Report" button visible
- ✅ Export buttons (PDF/Markdown) work

---

### 2. User Registration ✅

**Test: Email/Password Registration**

1. Click "Sign Up" in header
2. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Sign Up"

**Expected Results:**
- ✅ Redirected to homepage
- ✅ Header shows "Dashboard" and "Sign Out" buttons
- ✅ Welcome message shows user name/email
- ✅ User record created in database

**Test: Validation**

1. Try registering with existing email
   - ✅ Error: "User already exists"

2. Try passwords that don't match
   - ✅ Error: "Passwords do not match"

3. Try password < 6 characters
   - ✅ Error: "Password must be at least 6 characters"

---

### 3. User Login ✅

**Test: Credentials Login**

1. Sign out if logged in
2. Click "Sign In"
3. Enter credentials:
   - Email: "test@example.com"
   - Password: "password123"
4. Click "Sign In"

**Expected Results:**
- ✅ Redirected to homepage
- ✅ Authenticated state visible
- ✅ Session persists on page refresh

**Test: Invalid Credentials**

1. Try wrong password
   - ✅ Error: "Invalid email or password"

2. Try non-existent email
   - ✅ Error: "Invalid email or password"

---

### 4. OAuth Authentication ✅

**Test: Google OAuth** (if configured)

1. Click "Sign In"
2. Click "Google" button
3. Complete Google OAuth flow

**Expected Results:**
- ✅ Redirected to Google
- ✅ After authorization, redirected back
- ✅ Logged in successfully
- ✅ User profile synced (name, email, image)

**Test: GitHub OAuth** (if configured)

1. Click "Sign In"
2. Click "GitHub" button
3. Complete GitHub OAuth flow

**Expected Results:**
- ✅ Redirected to GitHub
- ✅ After authorization, redirected back
- ✅ Logged in successfully
- ✅ User profile synced

---

### 5. Authenticated User Features ✅

**Test: AI Insights Access**

1. Sign in
2. Analyze a URL
3. View results page

**Expected Results:**
- ✅ AI insights section shows actual suggestions (if OPENAI_API_KEY set)
- ✅ No "Sign in to access" message
- ✅ Summary and suggestions displayed

**Test: Save Report**

1. On results page, click "Save Report"
2. Wait for confirmation

**Expected Results:**
- ✅ Button changes to "Saved!"
- ✅ Button turns green
- ✅ Report saved to database
- ✅ Button resets after 3 seconds

**Test: View Dashboard**

1. Click "Dashboard" in header
2. View saved reports

**Expected Results:**
- ✅ All saved reports listed
- ✅ Shows URL, score, date
- ✅ "View Report" button works
- ✅ Reports sorted by date (newest first)

**Test: Delete Report**

1. In dashboard, click trash icon
2. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Report removed from list
- ✅ Report deleted from database

---

### 6. Protected Routes ✅

**Test: Dashboard Access Control**

1. Sign out
2. Try to access http://localhost:3000/dashboard

**Expected Results:**
- ✅ Redirected to sign-in page
- ✅ URL includes `callbackUrl=/dashboard`
- ✅ After sign-in, redirected back to dashboard

---

### 7. API Route Protection ✅

**Test: Reports API Without Auth**

1. Sign out
2. Open browser console
3. Try to fetch reports:
   ```javascript
   fetch('/api/reports').then(r => r.json()).then(console.log)
   ```

**Expected Results:**
- ✅ Status: 401 Unauthorized
- ✅ Error: "Unauthorized"

**Test: Save Report Without Auth**

1. Try to save report while signed out:
   ```javascript
   fetch('/api/reports', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify({url: 'test', score: 50, data: {}})
   }).then(r => r.json()).then(console.log)
   ```

**Expected Results:**
- ✅ Status: 401 Unauthorized
- ✅ Error: "Unauthorized"

---

### 8. Session Management ✅

**Test: Session Persistence**

1. Sign in
2. Refresh page
3. Navigate to different pages

**Expected Results:**
- ✅ Remains logged in after refresh
- ✅ Session persists across pages
- ✅ User info consistent

**Test: Sign Out**

1. Click "Sign Out"
2. Verify signed out state

**Expected Results:**
- ✅ Redirected to homepage
- ✅ Header shows "Sign In" and "Sign Up"
- ✅ Cannot access protected routes
- ✅ Session cleared

---

### 9. Error Handling ✅

**Test: Authentication Errors**

1. Try OAuth with invalid credentials
2. Visit `/auth/error?error=OAuthAccountNotLinked`

**Expected Results:**
- ✅ Error page displays
- ✅ Appropriate error message shown
- ✅ "Try Again" button works
- ✅ "Back to Home" button works

**Test: Network Errors**

1. Stop database
2. Try to sign in

**Expected Results:**
- ✅ Graceful error handling
- ✅ User-friendly error message
- ✅ No application crash

---

### 10. Data Integrity ✅

**Test: User Ownership**

1. Sign in as User A
2. Save a report
3. Note the report ID
4. Sign out and sign in as User B
5. Try to access User A's report via URL

**Expected Results:**
- ✅ Cannot access other user's reports
- ✅ 403 Forbidden error
- ✅ Dashboard only shows own reports

**Test: Cascade Deletion**

1. Sign in
2. Save multiple reports
3. Delete user from database (via Prisma Studio)

**Expected Results:**
- ✅ All user's reports deleted
- ✅ Sessions deleted
- ✅ Accounts deleted
- ✅ No orphaned records

---

### 11. UI/UX Testing ✅

**Test: Responsive Design**

1. Test on mobile viewport (375px)
2. Test on tablet viewport (768px)
3. Test on desktop viewport (1920px)

**Expected Results:**
- ✅ All pages responsive
- ✅ Forms usable on mobile
- ✅ Buttons accessible
- ✅ No horizontal scroll

**Test: Loading States**

1. Observe loading indicators during:
   - Sign in
   - Sign up
   - Saving report
   - Fetching dashboard

**Expected Results:**
- ✅ Loading states visible
- ✅ Buttons disabled during loading
- ✅ Clear feedback to user

**Test: Success Feedback**

1. Save a report
2. Delete a report
3. Sign in/out

**Expected Results:**
- ✅ Visual confirmation of actions
- ✅ Button state changes
- ✅ Smooth transitions

---

## Database Verification

Use Prisma Studio to verify data:

```bash
npm run db:studio
```

**Check:**
- ✅ Users table populated
- ✅ Passwords are hashed
- ✅ Reports linked to users
- ✅ Sessions created/destroyed
- ✅ OAuth accounts linked

---

## Performance Testing

**Test: Analysis Speed**

1. Time anonymous analysis
2. Time authenticated analysis

**Expected:**
- ✅ Similar performance (< 5s difference)
- ✅ No significant overhead from auth check

**Test: Dashboard Load**

1. Create 50+ reports
2. Load dashboard

**Expected:**
- ✅ Loads in < 2 seconds
- ✅ Pagination or limit working (50 reports max)

---

## Security Testing

**Test: Password Security**

1. Check database for password hashes
2. Verify bcrypt format

**Expected:**
- ✅ Passwords hashed (starts with `$2b$`)
- ✅ No plain text passwords

**Test: Session Security**

1. Inspect cookies in browser DevTools
2. Check session token

**Expected:**
- ✅ HttpOnly flag set
- ✅ Secure flag in production
- ✅ SameSite attribute set

**Test: SQL Injection**

1. Try malicious input in forms:
   - Email: `'; DROP TABLE users; --`
   - Password: `' OR '1'='1`

**Expected:**
- ✅ Prisma prevents injection
- ✅ No database errors
- ✅ Invalid credentials error

---

## Browser Compatibility

Test in:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

**Expected:**
- ✅ All features work
- ✅ OAuth redirects work
- ✅ Sessions persist

---

## Test Summary Checklist

- [ ] Anonymous access works
- [ ] User registration works
- [ ] User login works
- [ ] OAuth providers work (if configured)
- [ ] AI insights restricted to auth users
- [ ] Save reports works
- [ ] Dashboard displays reports
- [ ] Delete reports works
- [ ] Protected routes redirect
- [ ] API routes protected
- [ ] Session persists
- [ ] Sign out works
- [ ] Error handling graceful
- [ ] Data ownership enforced
- [ ] UI responsive
- [ ] Loading states visible
- [ ] Database integrity maintained
- [ ] Passwords hashed
- [ ] Sessions secure
- [ ] Cross-browser compatible

---

## Automated Testing (Future)

Consider adding:
- Jest unit tests for API routes
- Playwright E2E tests for user flows
- Cypress component tests
- Load testing with k6

---

## Reporting Issues

If tests fail, collect:
1. Browser console errors
2. Network tab (failed requests)
3. Server logs
4. Database state (Prisma Studio)
5. Environment variables (redacted)

Happy Testing! 🧪
