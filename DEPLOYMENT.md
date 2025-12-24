# Deployment Guide - Vercel

This guide covers deploying both the frontend (Next.js) and backend (FastAPI) to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed: `npm i -g vercel`
3. A PostgreSQL database (recommended for production)
   - Vercel Postgres (https://vercel.com/docs/storage/vercel-postgres)
   - Supabase (https://supabase.com)
   - Neon (https://neon.tech)
   - Any other PostgreSQL provider

## Part 1: Deploy Backend (FastAPI)

### Step 1: Set Up Database

**Important**: SQLite doesn't work on Vercel's serverless environment. You need a hosted PostgreSQL database.

#### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to Storage > Create Database > Postgres
3. Note down the `DATABASE_URL` connection string

#### Option B: External Provider

1. Create a PostgreSQL database with your preferred provider
2. Get the connection string in this format:
   ```
   postgresql://user:password@host:port/database
   ```

### Step 2: Deploy Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `contextfort-backend` (or your preferred name)
   - In which directory is your code located? **.**
   - Want to override settings? **N**

4. Add environment variable:
   ```bash
   vercel env add DATABASE_URL
   ```
   - What's the value? Paste your PostgreSQL connection string
   - Which environments? Select **Production**, **Preview**, and **Development**

5. Initialize the database (run this once):
   - After deployment, you'll need to run the database initialization
   - You can create a one-time serverless function or run it locally pointing to the production database
   - Add this endpoint to `main.py` if you want to initialize via API:
   ```python
   @app.post("/init-db")
   async def initialize_database():
       database.init_db()
       return {"message": "Database initialized"}
   ```
   - Then call: `curl -X POST https://your-backend-url.vercel.app/init-db`
   - **Important**: Remove this endpoint after initialization for security

6. Deploy to production:
   ```bash
   vercel --prod
   ```

7. Note your backend URL (e.g., `https://contextfort-backend.vercel.app`)

## Part 2: Deploy Frontend (Next.js)

### Step 1: Configure Environment Variables

1. Navigate to the frontend directory:
   ```bash
   cd ../contextfort-dashboard
   ```

2. Update `.env.local` with your production backend URL:
   ```env
   NEXT_PUBLIC_POST_MONITOR_API=https://your-backend-url.vercel.app
   NEXT_PUBLIC_CLICK_DETECTION_API=https://your-backend-url.vercel.app
   NEXT_PUBLIC_REFRESH_INTERVAL_POST=5000
   NEXT_PUBLIC_REFRESH_INTERVAL_CLICK=1000
   ```

### Step 2: Deploy Frontend

1. Deploy to Vercel:
   ```bash
   vercel
   ```

2. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `contextfort-dashboard` (or your preferred name)
   - In which directory is your code located? **.**
   - Want to override settings? **N**

3. Add environment variables via Vercel CLI or Dashboard:
   ```bash
   vercel env add NEXT_PUBLIC_POST_MONITOR_API
   vercel env add NEXT_PUBLIC_CLICK_DETECTION_API
   vercel env add NEXT_PUBLIC_REFRESH_INTERVAL_POST
   vercel env add NEXT_PUBLIC_REFRESH_INTERVAL_CLICK
   ```

   Or add them in the Vercel Dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add each variable for Production, Preview, and Development environments

4. Deploy to production:
   ```bash
   vercel --prod
   ```

5. Your frontend will be available at `https://contextfort-dashboard.vercel.app` (or your custom domain)

## Part 3: Configure CORS

Update the CORS configuration in `backend/main.py` to allow your frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-url.vercel.app",
        "http://localhost:3000",  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Redeploy the backend after making this change:
```bash
cd backend
vercel --prod
```

## Alternative: Deploy via GitHub Integration

### Backend

1. Push your backend code to a GitHub repository
2. Go to Vercel Dashboard > Add New Project
3. Import your repository
4. Set Root Directory to `backend`
5. Add the `DATABASE_URL` environment variable
6. Deploy

### Frontend

1. Push your frontend code to a GitHub repository (or use the same repo)
2. Go to Vercel Dashboard > Add New Project
3. Import your repository
4. Set Root Directory to `contextfort-dashboard`
5. Framework Preset: Next.js (auto-detected)
6. Add all environment variables
7. Deploy

## Verifying Deployment

1. Check backend health:
   ```bash
   curl https://your-backend-url.vercel.app/docs
   ```
   You should see the FastAPI Swagger documentation.

2. Check frontend:
   - Open `https://your-frontend-url.vercel.app` in your browser
   - The dashboard should load and connect to the backend

## Troubleshooting

### Backend Issues

1. **Database connection errors**:
   - Verify your `DATABASE_URL` environment variable is correct
   - Make sure your database allows connections from Vercel's IP addresses
   - Check if you need to add Vercel's IPs to your database's allowlist

2. **Import errors**:
   - Ensure all dependencies are in `requirements.txt`
   - Check the build logs in Vercel Dashboard

3. **Cold start issues**:
   - Serverless functions may have cold starts. Consider Vercel's Edge Functions for faster response times

### Frontend Issues

1. **API connection errors**:
   - Verify environment variables are set correctly in Vercel Dashboard
   - Check CORS configuration in the backend
   - Verify the backend URL is accessible

2. **Build errors**:
   - Check the build logs in Vercel Dashboard
   - Ensure all dependencies are in `package.json`

## Custom Domains

To add custom domains:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Update your DNS records as instructed
5. Update environment variables with your custom domain URLs

## Environment Variables Summary

### Backend
- `DATABASE_URL`: PostgreSQL connection string

### Frontend
- `NEXT_PUBLIC_POST_MONITOR_API`: Backend API URL
- `NEXT_PUBLIC_CLICK_DETECTION_API`: Backend API URL (same as above)
- `NEXT_PUBLIC_REFRESH_INTERVAL_POST`: Refresh interval in ms (default: 5000)
- `NEXT_PUBLIC_REFRESH_INTERVAL_CLICK`: Refresh interval in ms (default: 1000)

## Monitoring and Logs

- View logs in Vercel Dashboard under your project's "Logs" tab
- Set up monitoring and alerts in Vercel Dashboard > Settings > Monitoring
- Consider integrating with external monitoring services (Sentry, LogRocket, etc.)

## Cost Considerations

- Vercel's Hobby plan includes:
  - Unlimited deployments
  - 100GB bandwidth per month
  - Serverless function execution limits

- For production apps, consider upgrading to Pro plan for:
  - Higher bandwidth limits
  - Longer serverless function execution times
  - Team collaboration features
  - Custom deployment protection

## Next Steps

1. Set up custom domains
2. Configure SSL certificates (automatic with Vercel)
3. Set up monitoring and error tracking
4. Configure deployment protection for production
5. Set up preview deployments for testing
6. Update the Chrome extension to point to your production backend
