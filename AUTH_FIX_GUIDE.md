# Authentication Fix Guide

## Issues Identified and Fixed

### 1. ✅ Login Issue: "Invalid email or password"

**Problem:** User registered but cannot log in with correct credentials.

**Possible Causes:**
- Password mismatch (most common)
- Database connection issue
- Session/cache problem
- Case-sensitive email

**Solutions Provided:**

#### A. Test Your Login Credentials
Run the diagnostic script to verify your password:
```bash
node scripts/test-login.js
```

This will:
- Check if your email exists in the database
- Test if your password matches the stored hash
- Provide specific feedback on what's wrong

#### B. Reset Your Password
If you forgot your password or it's not working:
```bash
node scripts/reset-password.js
```

This will:
- Look up your account by email
- Let you set a new password
- Hash it properly and save to database

#### C. Check Database
View all users and their details:
```bash
node scripts/check-auth.js
```

### 2. ✅ OAuth Buttons Not Functional

**Problem:** Google and GitHub sign-in buttons are visible but not configured.

**Solution:** OAuth buttons are now **hidden by default** until you configure them.

#### To Enable OAuth (Optional):

**For Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret
7. Add to `.env`:
   ```env
   GOOGLE_CLIENT_ID="your-client-id-here"
   GOOGLE_CLIENT_SECRET="your-client-secret-here"
   ```

**For GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and generate Client Secret
5. Add to `.env`:
   ```env
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   ```

**Enable OAuth in the code:**
After adding credentials to `.env`, update these files:
- `app/auth/signin/page.tsx` - Line 69: Change `false` to `true`
- `app/auth/signup/page.tsx` - Line 102: Change `false` to `true`

## Diagnostic Scripts

### 1. `scripts/check-auth.js`
Shows all users in the database and their authentication status.

**Usage:**
```bash
node scripts/check-auth.js
```

**Output:**
- Total users count
- Each user's email, name, and password status
- OAuth accounts linked
- Password hash preview

### 2. `scripts/test-login.js`
Interactive tool to test if your login credentials work.

**Usage:**
```bash
node scripts/test-login.js
```

**Prompts:**
- Enter your email
- Enter your password
- Shows if credentials match

### 3. `scripts/reset-password.js`
Interactive tool to reset your password.

**Usage:**
```bash
node scripts/reset-password.js
```

**Prompts:**
- Enter your email
- Enter new password (min 6 characters)
- Confirm new password
- Updates database

## Common Issues & Solutions

### Issue: "User not found"
**Solution:** 
- Check if you're using the correct email
- Run `node scripts/check-auth.js` to see all registered emails
- Register a new account if needed

### Issue: "Password does not match"
**Solution:**
- You may have mistyped during registration
- Use `node scripts/reset-password.js` to set a new password
- Ensure Caps Lock is off

### Issue: "Database connection failed"
**Solution:**
- Ensure `prisma/dev.db` exists
- Run `npx prisma generate`
- Run `npx prisma db push`

### Issue: OAuth buttons still showing
**Solution:**
- OAuth buttons are now hidden by default
- They only show when `hasOAuthProviders = true` in the code
- This prevents confusion when OAuth is not configured

### Issue: Session problems
**Solution:**
- Clear browser cookies and cache
- Try incognito/private browsing mode
- Restart the development server

## Technical Details

### Password Hashing
- Uses `bcryptjs` with salt rounds of 12
- Passwords are never stored in plain text
- Registration: `bcrypt.hash(password, 12)`
- Login: `bcrypt.compare(inputPassword, storedHash)`

### Database Schema
```prisma
model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  password      String?   // Hashed password for credentials login
  name          String?
  // ... other fields
}
```

### Authentication Flow
1. **Registration:**
   - User submits email + password
   - Password is hashed with bcrypt
   - User created in database
   - Auto-login after registration

2. **Login:**
   - User submits email + password
   - System finds user by email
   - Compares input password with stored hash
   - Creates JWT session if match

3. **OAuth (when configured):**
   - User clicks Google/GitHub button
   - Redirects to provider
   - Provider authenticates user
   - Callback creates/links account
   - Creates session

## Testing Checklist

After fixes, test these scenarios:

- [ ] Register new account with email/password
- [ ] Log out
- [ ] Log in with same credentials
- [ ] Try wrong password (should fail)
- [ ] Try wrong email (should fail)
- [ ] Reset password using script
- [ ] Log in with new password
- [ ] OAuth buttons are hidden (unless configured)
- [ ] Check database has user record

## Files Modified

1. **lib/auth.ts**
   - Made OAuth providers conditional
   - Only loads Google/GitHub if credentials exist

2. **app/auth/signin/page.tsx**
   - Added OAuth button visibility toggle
   - Improved error handling
   - Hidden OAuth by default

3. **app/auth/signup/page.tsx**
   - Added OAuth button visibility toggle
   - Improved error handling
   - Hidden OAuth by default

4. **.env**
   - Added OAuth credential placeholders
   - Added helpful comments

5. **scripts/** (new)
   - `check-auth.js` - Database diagnostic
   - `test-login.js` - Credential tester
   - `reset-password.js` - Password reset tool

## Support

If you're still having issues:

1. Run all diagnostic scripts
2. Check the terminal for error messages
3. Verify `.env` file is properly configured
4. Ensure database file exists: `prisma/dev.db`
5. Try deleting `node_modules` and running `npm install`
6. Check NextAuth configuration in `lib/auth.ts`

## Current User

Based on diagnostics, you have one registered user:
- **Email:** bensamoladoyin.btehub@gmail.com
- **Name:** Benjamin Oladoyin
- **Password:** Set (hashed)
- **Created:** Oct 29, 2025

**To fix your login:**
Run `node scripts/reset-password.js` and set a new password you'll remember.
