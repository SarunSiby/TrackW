import { X } from "lucide-react";   // 👈 add this at top with other imports
import { useEffect, useState } from "react";
import DayPill from "./DayPill";
import { toggleHabit, habitStats, updateHabit, deleteHabit } from "../api";
import { localISODate, weekdayShort } from "../utils/date";
import Button from "./Button";

export default function HabitCard({ habit, refresh }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(habit.name);

    async function load() {
        try {
            setError("");
            setLoading(true);
            const data = await habitStats(habit.id);
            setStats(data);
        } catch (e) {
            setError(e.message || "Failed to load");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [habit.id]);

    async function onToggle(date) {
        try {
            await toggleHabit(habit.id, date);
            await load();
            if (refresh) await refresh();
        } catch (e) {
            setError(e.message || "Failed to toggle");
        }
    }

    async function onSave() {
        const next = editName.trim();
        if (!next || next === habit.name) {
            setIsEditing(false);
            setEditName(habit.name);
            return;
        }
        try {
            await updateHabit(habit.id, next);
            setIsEditing(false);
            if (refresh) await refresh();
        } catch (e) {
            setError(e.message || "Failed to update habit");
        }
    }

    async function onDelete() {
        if (!window.confirm("Delete this habit?")) return;
        try {
            await deleteHabit(habit.id);
            if (refresh) await refresh();
        } catch (e) {
            setError(e.message || "Failed to delete habit");
        }
    }

    if (loading)
        return <div className="bg-white rounded-2xl p-4 shadow">Loading…</div>;
    if (error)
        return (
            <div className="bg-white rounded-2xl p-4 shadow text-red-600">{error}</div>
        );
    if (!stats) return null;

    const today = localISODate();
    const todayDone = stats.last7.find((x) => x.date === today && x.done);

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {/* Header: title + actions */}
            <div className="flex items-center gap-3">
                {isEditing ? (
                    <input
                        className="border border-gray-200 rounded-xl p-2 flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                    />
                ) : (
                    <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                )}

                <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-gray-500">🔥 Streak: {stats.current_streak}</span>

                    {isEditing ? (
                        <>
                            <Button variant="primary" onClick={onSave}>Save</Button>
                            <Button variant="secondary" onClick={() => { setIsEditing(false); setEditName(habit.name); }}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit</Button>
                            <button
                                onClick={onDelete}
                                className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                                title="Delete habit"
                            >
                                <X size={16} />
                            </button>

                        </>
                    )}

                    <Button
                        variant={todayDone ? "secondary" : "primary"}
                        className="ml-1"
                        onClick={() => onToggle(today)}
                    >
                        {todayDone ? "Unmark Today" : "Mark Today"}
                    </Button>
                </div>
            </div>

            {/* 7-day pills — show weekday shorthand */}
            <div className="mt-3 flex items-center gap-2">
                {stats.last7.map((d) => (
                    <DayPill
                        key={d.date}
                        date={d.date}
                        label={weekdayShort(d.date)}  // 👈 "Sun", "Mon", ...
                        done={d.done}
                        onToggle={onToggle}
                    />
                ))}
            </div>

            <div className="mt-2 text-xs text-gray-500">
                7-day: {(stats.rate7 * 100).toFixed(0)}% · 30-day: {(stats.rate30 * 100).toFixed(0)}%
            </div>
        </div>
    );
}
