from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from habits.views import HabitViewSet
from django.views.generic import RedirectView

# create router + register HabitViewSet
router = DefaultRouter()
router.register(r"habits", HabitViewSet, basename="habit")

urlpatterns = [
    path("", RedirectView.as_view(url="/api/", permanent=False)),  # optional redirect
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),  # router is now defined
]
