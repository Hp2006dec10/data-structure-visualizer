# Data Structure Visualizer

An interactive web application for visualizing and understanding various data structures. Built with Next.js, TypeScript, and Firebase.

## Features

- **Interactive Visualizations**: Visual representations of 10 different data structures
- **Google Authentication**: Secure login with Google OAuth
- **Operation Logging**: Track all operations performed on data structures
- **Iterative & Sequential Operations**: Support for bulk operations (add multiple items, add ranges, etc.)
- **Code Display**: Python implementation code with syntax highlighting and function highlighting
- **Firestore Integration**: Cloud storage for user activity logs
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS
- **Smooth Animations**: Framer Motion powered animations for better user experience

## Data Structures Supported

1. ✅ **Stack** - LIFO (Last In First Out) data structure
2. ✅ **Queue** - FIFO (First In First Out) data structure
3. ✅ **Linked List** - Linear data structure with nodes
4. ✅ **Array** - Collection of elements at contiguous memory
5. ✅ **Hash Table** - Key-value pair storage
6. ✅ **Graph** - Network of interconnected nodes
7. ⏳ **Tree** - Hierarchical data structure (Placeholder)
8. ✅ **Binary Search Tree** - Sorted binary tree with highlighted insertion path
9. ⏳ **AVL Tree** - Self-balancing binary search tree (Placeholder)
10. ⏳ **Heap** - Complete binary tree for priority operations (Placeholder)

## Tech Stack

### Frontend
- **Next.js** - React framework
- **TypeScript** - Type safety
- **React** - UI library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

### Backend
- **Next.js API Routes** - Server-side logic
- **Firebase** - Authentication & Firestore database

### Database
- **Firestore** - NoSQL cloud database

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd data-structure-visualizer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Google Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in
   - Add your domain to authorized domains
4. Create a **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode (or test mode for development)
   - Set up security rules (see below)

5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Copy your web app's configuration

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Set Up Firestore Security Rules

Go to Firestore Database > Rules and use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userActivities/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Users

1. **Sign In**: Click "Sign in with Google" on the home page
2. **Select a Data Structure**: Click on any data structure card to view its visualization
3. **Perform Operations**:
   - Use basic operations (Push, Pop, Insert, Delete, etc.)
   - Use iterative operations to perform multiple operations at once
   - Use sequential operations to add ranges of values
   - Upload CSV files for bulk operations
4. **View Code**: See the Python implementation with highlighted functions
5. **Check Logs**: View your operation history in the activity log

### For Developers

#### Adding a New Data Structure

1. Create a new page in `app/[datastructure]/page.tsx`
2. Add the Python code to `data-structures/python-codes/index.ts`
3. Update `app/page.tsx` to add the new card
4. Update `types/index.ts` to include the new data structure type

#### Customizing Styles

- Modify Tailwind classes in components
- Update color schemes in individual pages
- Adjust animations in Framer Motion components


## Future Enhancements

- [ ] Complete AVL Tree implementation with balancing animations
- [ ] Complete Heap implementation with heapify operations
- [ ] Add more operations (search, traversal algorithms)
- [ ] Add algorithm visualizations (BFS, DFS, sorting, etc.)
- [ ] Add graph algorithm visualizations
- [ ] Export logs as PDF or CSV
- [ ] Add tutorial mode for first-time users
- [ ] Dark mode support
- [ ] Multi-language support
