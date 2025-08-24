# server/server/server/settings.py
from pathlib import Path
import os

# --- Paths ---
BASE_DIR = Path(__file__).resolve().parent.parent

# --- Security / Debug ---
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-secret-key-change-later")
DEBUG = os.getenv("DJANGO_DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "*").split(",")
CSRF_TRUSTED_ORIGINS = (
    os.getenv("DJANGO_CSRF_TRUSTED", "").split(",")
    if os.getenv("DJANGO_CSRF_TRUSTED")
    else []
)

# --- Applications ---
INSTALLED_APPS = [
    # Core Django apps (keep these for sessions, staticfiles, admin etc.)
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "corsheaders",
    "django_filters",

    # Local apps
    "habits",
]

# --- Middleware ---
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # keep high for CORS
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# --- URL routing + WSGI entrypoint (missing in your file) ---
ROOT_URLCONF = "server.urls"
WSGI_APPLICATION = "server.wsgi.application"

# --- Templates (needed even if you don’t use server-side HTML; DRF/admin rely on it) ---
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# --- Database ---
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# --- i18n / timezone ---
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = False  # keep False if you want naive local dates

# --- Static (Render will serve via gunicorn; fine for API) ---
STATIC_URL = "static/"

# --- REST Framework (hide browsable API in production if desired) ---
REST_FRAMEWORK = {
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_RENDERER_CLASSES": (
        ["rest_framework.renderers.JSONRenderer"]
        if not DEBUG
        else [
            "rest_framework.renderers.JSONRenderer",
            "rest_framework.renderers.BrowsableAPIRenderer",
        ]
    ),
}

# --- CORS ---
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = (
    os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
    if os.getenv("CORS_ALLOWED_ORIGINS")
    else []
)
