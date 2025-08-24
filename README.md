# TrackW – Habit Tracker (React + Django)

A tiny, one-day full‑stack practice app. Frontend is **React + Vite + Tailwind v3**. Backend is **Django + DRF + SQLite**.

---

## ✨ Features

* Add habits (e.g., “Drink water”).
* Toggle completion for today (and recent dates).
* See 7‑day streak strip + basic stats (current streak, 7/30‑day rate).

---

## 🧱 Project Structure

```
TrackW/
├─ habit-client/              # React + Vite + Tailwind v3 (frontend)
│  ├─ .env                    # VITE_API_BASE=http://127.0.0.1:8000/api
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ tailwind.config.js
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ index.css
│     ├─ api.js
│     ├─ utils/date.js
│     └─ components/
│        ├─ HabitCard.jsx
│        └─ DayPill.jsx
└─ server/                    # Django + DRF (backend)
   ├─ manage.py
   ├─ habits/
   │  ├─ models.py
   │  ├─ serializers.py
   │  ├─ views.py
   │  └─ migrations/
   └─ server/
      ├─ settings.py
      └─ urls.py
```

---

## 🚀 Quick Start

### 1) Backend (Django + DRF)

> Windows‑friendly; run in PowerShell.

```powershell
# From TrackW/
python -m venv venv
./venv/Scripts/activate

pip install --upgrade pip
pip install django djangorestframework django-cors-headers

# If you haven't created it already
python -m django startproject server
cd server
python manage.py startapp habits
```

**server/server/settings.py** (key bits)

```python
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
DEBUG = True
ALLOWED_HOSTS = ["*"]
INSTALLED_APPS = [
    "django.contrib.admin","django.contrib.auth","django.contrib.contenttypes",
    "django.contrib.sessions","django.contrib.messages","django.contrib.staticfiles",
    "rest_framework","corsheaders","habits",
]
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
TEMPLATES = [{
    "BACKEND":"django.template.backends.django.DjangoTemplates","DIRS":[],"APP_DIRS":True,
    "OPTIONS":{"context_processors":[
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]
DATABASES = {"default":{"ENGINE":"django.db.backends.sqlite3","NAME": BASE_DIR/"db.sqlite3"}}
CORS_ALLOW_ALL_ORIGINS = True
```

**habits/models.py**

```python
from django.db import models

class Habit(models.Model):
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name="logs")
    date = models.DateField()
    done = models.BooleanField(default=True)
    class Meta:
        unique_together = ("habit","date")
        ordering = ["-date"]
```

**habits/serializers.py**

```python
from rest_framework import serializers
from .models import Habit, HabitLog

class HabitLogSerializer(serializers.ModelSerializer):
    class Meta: model = HabitLog; fields = ["id","date","done"]

class HabitSerializer(serializers.ModelSerializer):
    logs = HabitLogSerializer(many=True, read_only=True)
    class Meta: model = Habit; fields = ["id","name","created_at","logs"]
```

**habits/views.py**

```python
import datetime as dt
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Habit, HabitLog
from .serializers import HabitSerializer, HabitLogSerializer

class HabitViewSet(viewsets.ModelViewSet):
    queryset = Habit.objects.all().order_by("-created_at")
    serializer_class = HabitSerializer

    @action(detail=True, methods=["post"])
    def toggle(self, request, pk=None):
        habit = self.get_object()
        date_str = request.data.get("date")
        date = dt.date.fromisoformat(date_str) if date_str else dt.date.today()
        log, created = HabitLog.objects.get_or_create(habit=habit, date=date, defaults={"done": True})
        if not created:
            log.done = not log.done
            if log.done: log.save()
            else: log.delete(); return Response({"toggled":"undone","date":str(date)})
        return Response(HabitLogSerializer(log).data)

    @action(detail=True, methods=["get"])
    def stats(self, request, pk=None):
        habit = self.get_object(); today = dt.date.today()
        last7 = [(today - dt.timedelta(days=i)) for i in range(6,-1,-1)]
        logs = HabitLog.objects.filter(habit=habit, date__gte=today - dt.timedelta(days=30))
        done = {l.date for l in logs if l.done}
        seven = [{"date": str(d), "done": d in done} for d in last7]
        streak = 0; d = today
        while d in done: streak += 1; d -= dt.timedelta(days=1)
        last30 = [(today - dt.timedelta(days=i)) for i in range(30)]
        c7 = sum(1 for d in last7 if d in done); c30 = sum(1 for d in last30 if d in done)
        return Response({"current_streak": streak, "last7": seven, "rate7": round(c7/7,2), "rate30": round(c30/30,2)})
```

**server/urls.py**

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from habits.views import HabitViewSet

router = DefaultRouter(); router.register(r"habits", HabitViewSet, basename="habit")
urlpatterns = [ path("admin/", admin.site.urls), path("api/", include(router.urls)), ]
```

Run it:

```powershell
# still inside TrackW/server
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8000
```

Visit: [http://127.0.0.1:8000/api/habits/](http://127.0.0.1:8000/api/habits/)

---

### 2) Frontend (React + Vite + Tailwind v3)

```powershell
# From TrackW/
cd habit-client
npm install
npm install -D tailwindcss@3.4.10 postcss autoprefixer
npx tailwindcss init -p
```

**postcss.config.js**

```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

**tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**.env**

```
VITE_API_BASE=http://127.0.0.1:8000/api
```

Run it:

```powershell
npm run dev
```

Open the printed `http://localhost:51xx/` URL.

---

## 🔌 API Endpoints

* `GET /api/habits/` – list habits
* `POST /api/habits/` – create `{ name }`
* `POST /api/habits/{id}/toggle/` – toggle completion for today or `{"date":"YYYY-MM-DD"}`
* `GET /api/habits/{id}/stats/` – streak + last7 + rates

---

## 🧪 Quick Test (without frontend)

Use the DRF browsable API at `http://127.0.0.1:8000/api/habits/` → **Raw data** →

```json
{ "name": "Read 20 min" }
```

Then visit `http://127.0.0.1:8000/api/habits/1/stats/`.

---

## 🩹 Troubleshooting

* **Frontend looks plain** → ensure Tailwind v3 setup (`postcss.config.js` uses `tailwindcss: {}`) and `import './index.css'` is in `main.jsx`.
* **“Failed to fetch”** → frontend `.env` not pointing to backend; restart Vite after editing `.env`.
* **CORS error** → `django-cors-headers` installed, in `INSTALLED_APPS`, middleware at top, `CORS_ALLOW_ALL_ORIGINS = True`.
* **Can’t find `manage.py`** → run Django commands from the folder that *contains* `manage.py`.

---

## 🗺️ Roadmap (optional)

* Edit/Delete habit (use DRF default `update`, `destroy`).
* Month grid view (30‑day calendar).
* Auth (per‑user habits) via SimpleJWT.
* Deploy: backend (Railway/Render) + frontend (Vercel).

---

## 📄 License

MIT (or your choice).
