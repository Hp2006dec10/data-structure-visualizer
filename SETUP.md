# Setup Guide

## Quick Start

Follow these steps to get the Data Structure Visualizer running on your local machine.

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- A Google account for Firebase
- Firebase account (free tier is sufficient)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Firebase

### 2.1 Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter a project name (e.g., "data-structure-visualizer")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2.2 Enable Google Authentication

1. In your Firebase project, go to **Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Click on **Google** in the providers list
5. Enable Google sign-in
6. Set a project support email
7. Click "Save"

### 2.3 Create a Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (or Test mode for development)
4. Select a location close to you
5. Click "Enable"

### 2.4 Set Firestore Security Rules

1. Go to **Firestore Database** > **Rules** tab
2. Paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userActivities/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

### 2.5 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app with a nickname (e.g., "Data Structure Visualizer")
5. Copy the configuration values

## Step 3: Configure Environment Variables

Create a file named `.env.local` in the root directory:

```bash
# Copy this template and fill in your Firebase values
cp .env.local.example .env.local
```

Or create it manually with these values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Important:** Replace all the placeholder values with your actual Firebase configuration.

## Step 4: Run the Application

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 5: Test the Application

1. You should see the home page with 10 data structure cards
2. Click "Sign in with Google" in the top right
3. Sign in with your Google account
4. Select any data structure (e.g., Stack)
5. Try adding elements and watch the visualization
6. Check the code highlight and logs

## Troubleshooting

### Issue: Firebase authentication not working

**Solution:**
- Verify all environment variables in `.env.local` are correct
- Check that Google sign-in is enabled in Firebase Console
- Make sure you're using the correct Firebase project

### Issue: Firestore access denied

**Solution:**
- Check that Firestore security rules are set correctly (see Step 2.4)
- Verify you're authenticated (signed in with Google)
- Check browser console for specific error messages

### Issue: Build errors

**Solution:**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node -v` (should be v18 or higher)

### Issue: Images not loading

**Solution:**
- Check that `lh3.googleusercontent.com` is in `next.config.ts` domains
- If using custom domains, add them to the configuration

### Issue: Port already in use

**Solution:**
- Use a different port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

## Next Steps

Once the app is running:

1. Explore different data structures
2. Try various operations (push, pop, insert, delete, etc.)
3. Use iterative and sequential operations
4. Upload CSV files for bulk operations
5. Check your logs in the activity panel

## Production Deployment

To deploy to production:

1. Push your code to GitHub
2. Import to Vercel (recommended for Next.js)
3. Add environment variables in Vercel dashboard
4. Deploy!

See the main README.md for more deployment options.

## Need Help?

- Check the main README.md for detailed documentation
- Open an issue on GitHub
- Check Firebase documentation: https://firebase.google.com/docs
- Check Next.js documentation: https://nextjs.org/docs

## Common Firebase Console Locations

- **Authentication**: Left sidebar > Authentication > Sign-in method
- **Firestore**: Left sidebar > Firestore Database
- **Project Settings**: Left sidebar > Project Settings > General
- **Usage/Billing**: Left sidebar > Usage and billing

## Security Notes

- Never commit `.env.local` to version control (already in .gitignore)
- Keep Firebase security rules updated
- Regularly review Firebase usage in the console
- Use different Firebase projects for development and production