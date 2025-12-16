# Railway Deployment Guide

## Environment Variables Required

To deploy the frontend on Railway, you need to set the following environment variables in your Railway project:

### For Production (Railway):
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-domain.com
BACKEND_API_URL=https://your-backend-domain.com
```

**Replace `your-backend-domain.com` with your actual backend API URL** (e.g., `backen-0e0b51c0b9bd.herokuapp.com` or your Railway backend URL)

## How to Set Environment Variables on Railway

1. Go to your Railway Dashboard: https://railway.app
2. Select your `frontend` project
3. Click on the **Variables** tab
4. Add the environment variables listed above
5. Redeploy the application

## Local Development

For local development, create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3000
BACKEND_API_URL=http://localhost:3000
```

Then run:
```bash
npm run dev
```

## Troubleshooting

- If the app shows blank page, check browser console for 404 errors on API calls
- Ensure backend API URL is correct and accessible
- Check Railway logs for any build or runtime errors
- Verify CORS is enabled on backend for your frontend domain
