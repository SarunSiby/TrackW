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

        log, created = HabitLog.objects.get_or_create(
            habit=habit, date=date, defaults={"done": True}
        )
        if not created:
            log.done = not log.done
            if log.done:
                log.save()
            else:
                log.delete()
                return Response({"toggled": "undone", "date": str(date)})
        return Response(HabitLogSerializer(log).data)

    @action(detail=True, methods=["get"])
    def stats(self, request, pk=None):
        habit = self.get_object()
        today = dt.date.today()
        last7 = [(today - dt.timedelta(days=i)) for i in range(6, -1, -1)]
        logs = HabitLog.objects.filter(habit=habit, date__gte=today - dt.timedelta(days=30))
        done = {l.date for l in logs if l.done}

        seven = [{"date": str(d), "done": d in done} for d in last7]

        streak = 0
        d = today
        while d in done:
            streak += 1
            d -= dt.timedelta(days=1)

        last30 = [(today - dt.timedelta(days=i)) for i in range(30)]
        c7 = sum(1 for d in last7 if d in done)
        c30 = sum(1 for d in last30 if d in done)

        return Response({
            "current_streak": streak,
            "last7": seven,
            "rate7": round(c7/7, 2),
            "rate30": round(c30/30, 2),
        })
