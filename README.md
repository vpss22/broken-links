# Music Funnel AI

A tool to find broken creator funnels automatically. This project uses AI-powered lead scoring to identify music creators with broken Instagram links, missing Linktrees, and inactive accounts.

## Structure

```
.
├── frontend/         # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx       # Landing page
│   │   │   └── Dashboard.tsx  # Lead scanner dashboard
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript types
│   │   └── App.tsx            # Router setup
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vercel.json            # Vercel deployment config
├── backend/          # FastAPI backend
│   ├── main.py       # Main API entry point
│   ├── ai.py         # Lead scoring algorithm
│   ├── scraper.py    # Lead scanning logic
│   └── requirements.txt
├── render.yaml       # Render deployment config
└── README.md
```

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + Python 3.11
- **Deployment**: Vercel (frontend) + Render (backend)

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- npm or yarn

### Running the Backend

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

### Running the Frontend

```bash
# In a new terminal, from the project root:
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

The frontend is configured with a Vite proxy that forwards `/api/*` requests to the backend running on `http://localhost:8000`.

## Deployment

### 1. Backend on Render (Free Tier)

1. Push this repository to GitHub
2. Go to [render.com](https://render.com) and create a new account
3. Click **New +** and select **Web Service**
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `music-funnel-backend` (or your preferred name)
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
6. Click **Create Web Service**

Once deployed, note your Render URL (e.g., `https://music-funnel-backend.onrender.com`)

### 2. Frontend on Vercel (Free Tier)

1. Go to [vercel.com](https://vercel.com) and create an account
2. Click **Add New...** > **Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL` = `https://your-render-backend.onrender.com` (your Render backend URL)
6. Click **Deploy**

**Important**: Update the `vercel.json` file to replace `your-render-backend.onrender.com` with your actual Render backend URL:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-actual-backend.onrender.com/$1"
    }
  ]
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/scan` | Scan and score all leads |

## Lead Scoring Algorithm

Leads are scored based on the following criteria:

- **Instagram 404**: +4 points (broken link)
- **No Linktree**: +1 point (missing funnel)
- **Inactive account**: +2 points
- **10K+ subscribers**: +1 point (high value)

**Tier Classification**:
- **HOT**: Score >= 6
- **WARM**: Score >= 3
- **COLD**: Score < 3

## Environment Variables

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL (for production) | Yes (for prod) |

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `PYTHON_VERSION` | Python version | `3.11` |

## Troubleshooting

### CORS Errors
The backend is configured with `allow_origins=["*"]` for development. For production, update the CORS configuration in `backend/main.py` to only allow your frontend domain:

```python
allow_origins=["https://your-vercel-frontend.vercel.app"]
```

### Build Failures
- Ensure Node.js 20+ is installed
- Delete `node_modules` and `package-lock.json` and run `npm install` again
- Check that all TypeScript types are properly defined in `src/types/index.ts`

### API Connection Issues
- Verify the `VITE_API_URL` environment variable is set correctly in Vercel
- Check that the Render backend is running and accessible
- Ensure the `/api` rewrite rule in `vercel.json` points to the correct backend URL
