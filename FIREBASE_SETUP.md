# Firebase Authentication Setup Guide

## Overview

The Relvanta Platform now uses **Firebase Authentication** instead of Emergent OAuth. This guide will walk you through setting up Firebase for both development and production.

## Why Firebase?

✅ **Emergent Independent** - No dependency on Emergent infrastructure  
✅ **Production Ready** - Scales to millions of users  
✅ **Multiple Providers** - Google, Email, Phone, etc.  
✅ **Free Tier** - 10k monthly active users free  
✅ **Easy Deployment** - Works seamlessly on Vercel + any backend host  

---

## Step 1: Create Firebase Project (5 minutes)

### 1.1 Go to Firebase Console
Visit: https://console.firebase.google.com/

### 1.2 Create New Project
- Click **"Add project"**
- Enter project name: `relvanta-platform` (or your choice)
- Google Analytics: Optional (can disable for now)
- Click **"Create project"**

### 1.3 Enable Google Authentication
1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Google"** provider
5. Toggle **"Enable"**
6. Set support email (your email)
7. Click **"Save"**

---

## Step 2: Get Frontend Credentials

### 2.1 Register Web App
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click the **Web icon** (`</>`)
4. App nickname: `relvanta-web`
5. **Don't** check "Also set up Firebase Hosting"
6. Click **"Register app"**

### 2.2 Copy Configuration
You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

### 2.3 Add to Frontend Environment
Edit `/app/frontend-next/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...

# Keep existing
NEXT_PUBLIC_API_URL=https://document-reviewer.preview.emergentagent.com
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## Step 3: Get Backend Credentials (Service Account)

### 3.1 Generate Service Account Key
1. In Firebase Console, go to **Project Settings** > **Service accounts** tab
2. Click **"Generate new private key"**
3. Confirm by clicking **"Generate key"**
4. A JSON file will download automatically

### 3.2 Store Credentials Securely

**Option A: Use File Path (Development)**

1. Create secrets directory:
   ```bash
   mkdir -p /app/backend/secrets
   ```

2. Move the downloaded JSON file:
   ```bash
   mv ~/Downloads/your-project-firebase-adminsdk-*.json /app/backend/secrets/firebase-admin.json
   ```

3. Update `/app/backend/.env`:
   ```env
   FIREBASE_CREDENTIALS_PATH=secrets/firebase-admin.json
   ```

**Option B: Use Environment Variable (Production/Serverless)**

1. Open the downloaded JSON file
2. Copy the entire JSON content
3. Update `/app/backend/.env`:
   ```env
   FIREBASE_CREDENTIALS_JSON='{"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",...}'
   ```

**⚠️ Security Note:**
- **Never commit** `firebase-admin.json` to git
- **Never commit** `.env` files with real credentials
- Add to `.gitignore`:
  ```
  secrets/
  .env
  .env.local
  ```

---

## Step 4: Configure Authorized Domains

### 4.1 Add Your Domains
1. In Firebase Console, go to **Authentication** > **Settings** tab
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Add:
   - `localhost` (already there)
   - Your production domain: `your-domain.com`
   - Your preview domain (if on Vercel): `*.vercel.app`

---

## Step 5: Test the Setup

### 5.1 Restart Services
```bash
cd /app
sudo supervisorctl restart backend frontend-next
```

### 5.2 Check Backend Logs
```bash
tail -f /var/log/supervisor/backend.out.log
```

Look for:
- ✅ `Firebase Admin SDK initialized from file` or
- ✅ `Firebase Admin SDK initialized from JSON`

If you see warnings, it means credentials aren't set yet (expected if using placeholders).

### 5.3 Test Authentication Flow

1. Navigate to: `http://localhost:3001/login`
2. Click **"Sign in with Google"**
3. Select your Google account
4. You should be redirected to `/private` dashboard
5. Try accessing `/labs` (should work now)

### 5.4 Verify Backend Session
```bash
# Check if session was created
mongosh --eval "use('test_database'); db.user_sessions.find().limit(1).pretty()"

# Check if user was created  
mongosh --eval "use('test_database'); db.users.find().limit(1).pretty()"
```

You should see your user with `firebase_uid` field.

---

## Step 6: Production Deployment

### 6.1 Frontend (Vercel)

1. **Add Environment Variables in Vercel Dashboard:**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_API_URL=https://api.your-domain.com
   NEXT_PUBLIC_ENVIRONMENT=production
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### 6.2 Backend (Railway/Fly.io/Render)

1. **Add Environment Variables:**
   ```
   MONGO_URL=mongodb+srv://...  # Use MongoDB Atlas
   DB_NAME=production_database
   CORS_ORIGINS=https://your-domain.com
   FIREBASE_CREDENTIALS_JSON={"type":"service_account",...}
   ```

2. **Deploy using your platform's CLI**

3. **Update Frontend API URL:**
   - In Vercel, update `NEXT_PUBLIC_API_URL` to your backend URL

---

## Troubleshooting

### Issue: "Firebase is not configured" message on login page

**Solution:**
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set in `.env.local`
- Restart frontend: `sudo supervisorctl restart frontend-next`
- Clear browser cache and cookies

### Issue: "Invalid or expired Firebase token" on backend

**Possible causes:**
1. **Backend credentials not set**
   - Check `/app/backend/.env` has `FIREBASE_CREDENTIALS_PATH` or `FIREBASE_CREDENTIALS_JSON`
   - Check backend logs for Firebase initialization messages

2. **Wrong project**
   - Frontend and backend must use the **same** Firebase project
   - Verify `projectId` matches in both configurations

3. **Clock skew**
   - Ensure server time is synchronized
   - Run: `sudo ntpdate -s time.nist.gov`

### Issue: "Popup blocked" during sign-in

**Solution:**
- Allow popups for your domain in browser settings
- Or use redirect flow instead (requires code change)

### Issue: Backend shows "Firebase credentials not found"

**Expected behavior** if you haven't added credentials yet. The app will work for:
- ✅ Public content (products, services)
- ❌ Protected content (labs, private dashboard)

Add credentials when ready to test authentication.

---

## Authentication Flow Diagram

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │ 1. Click "Sign in with Google"
       ↓
┌─────────────┐
│  Firebase   │
│    Auth     │ 2. Google OAuth
└──────┬──────┘
       │ 3. Returns ID Token
       ↓
┌─────────────┐
│  Frontend   │
│  (Next.js)  │ 4. Send token to backend
└──────┬──────┘
       │ POST /api/auth/session
       │ Authorization: Bearer <firebase_token>
       ↓
┌─────────────┐
│  Backend    │
│  (FastAPI)  │ 5. Verify token with Firebase Admin
└──────┬──────┘
       │ 6. Create session in MongoDB
       │ 7. Return session cookie
       ↓
┌─────────────┐
│  MongoDB    │
│  (Database) │ Store: user, session
└─────────────┘
```

---

## Security Best Practices

### ✅ DO:
- Use environment variables for all credentials
- Enable HTTPS in production
- Set up Firebase security rules
- Use HTTP-only cookies for sessions
- Implement rate limiting
- Monitor authentication logs

### ❌ DON'T:
- Commit credentials to git
- Use the same Firebase project for dev and prod (optional but recommended)
- Hardcode API keys in code
- Expose service account keys publicly

---

## Cost Estimation

Firebase Authentication is **free** for:
- Up to 10,000 monthly active users
- Email/password and federated identity providers (Google, etc.)

After 10k users:
- Check Firebase pricing: https://firebase.google.com/pricing

---

## Next Steps

1. ✅ Complete Firebase setup following this guide
2. ✅ Test authentication locally
3. ✅ Configure production environment variables
4. ✅ Deploy to Vercel (frontend) and your chosen backend host
5. ✅ Point custom domain to deployments
6. ✅ Set up monitoring and error tracking

---

## Additional Resources

- **Firebase Console:** https://console.firebase.google.com/
- **Firebase Auth Docs:** https://firebase.google.com/docs/auth
- **Firebase Admin SDK:** https://firebase.google.com/docs/admin/setup
- **Next.js + Firebase:** https://firebase.google.com/docs/web/setup

---

## Support

If you encounter issues:
1. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`
2. Check frontend logs: `tail -f /var/log/supervisor/frontend-next.err.log`
3. Verify MongoDB connection: `mongosh`
4. Test API health: `curl http://localhost:8001/health`

---

**Last Updated:** January 31, 2025  
**Status:** ✅ Firebase Integration Complete (Credentials Pending)
