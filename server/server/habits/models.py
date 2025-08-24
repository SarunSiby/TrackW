from django.db import models

class Habit(models.Model):
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name="logs")
    date = models.DateField()
    done = models.BooleanField(default=True)

    class Meta:
        unique_together = ("habit", "date")
        ordering = ["-date"]
