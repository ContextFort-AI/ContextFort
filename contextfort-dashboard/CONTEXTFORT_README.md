# ContextFort Security Dashboard

A professional Next.js dashboard for real-time security incident monitoring. Built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui components.

## 🚀 Features

- **Overview Dashboard**: Combined statistics from POST monitor and click detection
- **POST Request Monitoring**: Real-time detection of suspicious POST requests with sensitive data
- **Click Detection**: Live monitoring of legitimate vs suspicious clicks with AI-based detection
- **Real-time Updates**: Automatic polling of backend APIs with customizable refresh intervals
- **Professional UI**: Modern, responsive dashboard with dark mode support
- **Type-Safe**: Full TypeScript implementation with type definitions for all data models

## 📋 Prerequisites

Make sure the backend servers are running:

1. **POST Monitor Backend** (Port 8000)
   ```bash
   cd /Users/rishabharya/Desktop/context/blocker/backend
   ./start.sh
   ```

2. **Click Detection Backend** (Port 9999)
   ```bash
   cd /Users/rishabharya/Desktop/context/blocker/browser-ai-detector
   python3 server-with-db.py
   ```

## 🏃 Running the Dashboard

### Development Mode
```bash
cd /Users/rishabharya/Desktop/context/contextfort-dashboard
npm run dev
```

The dashboard will be available at: **http://localhost:3000**

### Production Build
```bash
npm run build
npm start
```

## 📊 Dashboard Pages

### 1. Overview Dashboard
**Route**: `/dashboard/overview`

- Combined statistics from both monitoring systems
- KPI cards showing total incidents, POST requests, suspicious clicks
- Top blocked domains chart
- Click distribution (legitimate vs suspicious)
- Recent activity timeline
- Quick action cards to navigate to detailed views

### 2. POST Request Monitor
**Route**: `/dashboard/post-requests`

- Real-time list of detected POST requests
- Displays matched fields containing sensitive data
- Shows target URL, hostname, and source page
- Delete individual requests or clear all
- Auto-refresh every 5 seconds
- Connection status indicator

### 3. Click Detection
**Route**: `/dashboard/click-detection`

- Live activity feed of click events
- Visual distinction between legitimate and suspicious clicks
- Action type classification (navigation, button, input, click)
- Real-time status with pulsing indicator
- Page title and URL for each event
- Auto-refresh every 2 seconds

## ⚙️ Configuration

Environment variables in `.env.local`:

```env
# Backend API URLs
NEXT_PUBLIC_POST_MONITOR_API=http://127.0.0.1:8000
NEXT_PUBLIC_CLICK_DETECTION_API=http://localhost:9999

# Refresh intervals (milliseconds)
NEXT_PUBLIC_REFRESH_INTERVAL_POST=5000
NEXT_PUBLIC_REFRESH_INTERVAL_CLICK=1000
```

## 🔌 API Integration

### POST Monitor API (Port 8000)
- `GET /api/stats` - Get POST monitor statistics
- `GET /api/blocked-requests` - Get all blocked requests
- `DELETE /api/blocked-requests/:id` - Delete a specific request
- `DELETE /api/blocked-requests` - Clear all requests

### Click Detection API (Port 9999)
- `GET /api/stats` - Get click detection statistics
- `GET /api/recent` - Get recent click events (limit: 100)

## 📁 Project Structure

```
src/
├── app/
│   └── (main)/
│       └── dashboard/
│           ├── overview/         # Overview dashboard
│           ├── post-requests/    # POST monitor page
│           └── click-detection/  # Click detection page
├── components/
│   ├── dashboard/
│   │   └── stat-card.tsx        # Reusable stat card component
│   └── ui/                      # shadcn/ui components
├── hooks/
│   ├── use-post-stats.ts        # POST monitor data hooks
│   └── use-click-stats.ts       # Click detection data hooks
├── lib/
│   └── api/
│       ├── post-monitor.ts      # POST monitor API client
│       └── click-detection.ts   # Click detection API client
├── types/
│   └── incidents.ts             # TypeScript type definitions
└── navigation/
    └── sidebar/
        └── sidebar-items.ts     # Navigation configuration
```

## 🎨 Customization

### Branding
Update app configuration in `src/config/app-config.ts`:
```typescript
export const APP_CONFIG = {
  name: "ContextFort Security",
  meta: {
    title: "ContextFort Security - Real-time Incident Dashboard",
    description: "...",
  },
};
```

### Navigation
Modify sidebar navigation in `src/navigation/sidebar/sidebar-items.ts`

### Theme
The dashboard supports light/dark mode and multiple theme presets. Configure in the UI settings.

## 🔧 Development

### Adding New Pages
1. Create page in `src/app/(main)/dashboard/[your-page]/page.tsx`
2. Add route to `src/navigation/sidebar/sidebar-items.ts`
3. Create necessary components and hooks

### API Client Pattern
```typescript
// Example: Create new API client
export class NewAPI {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:PORT') {
    this.baseURL = baseURL;
  }

  async getData(): Promise<YourType> {
    const response = await fetch(`${this.baseURL}/api/endpoint`);
    return await response.json();
  }
}
```

### Custom Hooks
```typescript
// Example: Create custom hook with polling
export function useYourData(options = {}) {
  const { refreshInterval = 5000 } = options;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.getData();
      setData(result);
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data };
}
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## 📝 Notes

- The dashboard uses client-side polling for real-time updates
- For production, consider implementing WebSocket connections for true real-time data
- Backend APIs must be accessible from the Next.js application
- CORS is handled by the backend servers

## 🐛 Troubleshooting

### Connection Issues
- Verify backend servers are running: `lsof -i :8000 -i :9999`
- Check API URLs in `.env.local`
- Ensure no CORS issues (check browser console)

### Build Errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check` (if available)

### Performance
- Adjust polling intervals in `.env.local`
- Reduce data limits in API calls
- Enable production mode for better performance

## 📄 License

This project uses the same license as the base template (Studio Admin).

## 🙏 Acknowledgments

- Built on [next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)
- Uses [shadcn/ui](https://ui.shadcn.com/) components
- Powered by [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
