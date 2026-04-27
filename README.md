# TWS Recommender

Sistem rekomendasi True Wireless Stereo (TWS) berbasis preferensi pengguna menggunakan metode **Content-Based Filtering**.

## Struktur Project

```
tws-recommender/
├── backend/      # FastAPI + MongoDB (API rekomendasi)
└── frontend/     # Next.js 16 + Tailwind v4 (UI)
```

## Tech Stack

- **Frontend:** Next.js, React 19, Tailwind CSS v4, lucide-react
- **Backend:** FastAPI, MongoDB, Python 3.11+

## Menjalankan Project

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
# buat file .env (contoh: MONGO_URI=..., DB_NAME=...)
uvicorn app.main:app --reload
```

API jalan di `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App jalan di `http://localhost:3000`.

## Environment Variables

Buat file `backend/.env`:

```
MONGO_URI=mongodb://localhost:27017
DB_NAME=tws_recommender
```
