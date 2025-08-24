import { useEffect, useState } from 'react'
import DayPill from './DayPill'
import { toggleHabit, habitStats } from '../api'
import { localISODate } from '../utils/date'


export default function HabitCard({ habit }) {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')


    async function load() {
        try {
            setError('')
            setLoading(true)
            const data = await habitStats(habit.id)
            setStats(data)
        } catch (e) {
            setError(e.message || 'Failed to load')
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => { load() }, [habit.id])


    async function onToggle(date) {
        try {
            await toggleHabit(habit.id, date)
            await load()
        } catch (e) {
            setError(e.message || 'Failed to toggle')
        }
    }


    if (loading) return <div className="bg-white rounded-2xl p-4 shadow">Loading…</div>
    if (error) return <div className="bg-white rounded-2xl p-4 shadow text-red-600">{error}</div>
    if (!stats) return null


    const today = localISODate()
    const todayDone = stats.last7.find(x => x.date === today && x.done)


    return (
        <div className="bg-white rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">{habit.name}</h3>
                <div className="text-sm text-gray-500">🔥 Streak: {stats.current_streak}</div>
            </div>


            <div className="mt-3 flex items-center gap-2">
                {stats.last7.map(d => (
                    <DayPill key={d.date} date={d.date} done={d.done} onToggle={onToggle} />
                ))}
                <button
                    onClick={() => onToggle(today)}
                    className="ml-auto px-3 py-1 border rounded-lg"
                >
                    {todayDone ? 'Unmark Today' : 'Mark Today'}
                </button>
            </div>


            <div className="mt-2 text-xs text-gray-500">
                7-day: {(stats.rate7 * 100).toFixed(0)}% · 30-day: {(stats.rate30 * 100).toFixed(0)}%
            </div>
        </div>
    )
}