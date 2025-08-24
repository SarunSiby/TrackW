import { useEffect, useState } from 'react'
import { listHabits, createHabit } from './api'
import HabitCard from './components/HabitCard'
import Button from './components/Button'

export default function App() {
    const [habits, setHabits] = useState([])
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    // search + sort
    const [search, setSearch] = useState('')
    const [ordering, setOrdering] = useState('-created_at') // newest first

    async function load() {
        try {
            setError('')
            setLoading(true)
            const data = await listHabits({ search, ordering })
            setHabits(data)
        } catch (e) {
            setError(e.message || 'Failed to load habits')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])                // initial load
    useEffect(() => { load() }, [search, ordering])// reload when filters change

    async function onAdd(e) {
        e.preventDefault()
        const trimmed = name.trim()
        if (!trimmed) return
        try {
            await createHabit(trimmed)
            setName('')
            await load()
        } catch (e) {
            setError(e.message || 'Failed to create habit')
        }
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <div className="max-w-3xl mx-auto space-y-6">
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-pink-600">Habit Tracker (Lite)</h1>
                    <span className="text-sm text-gray-500">{habits.length} habits</span>
                </header>

                {/* controls row: add + search + sort */}
                <div className="bg-white rounded-2xl p-4 shadow flex flex-col sm:flex-row gap-3">
                    <form onSubmit={onAdd} className="flex gap-2 flex-1">
                        <input
                            className="flex-1 border rounded-xl p-2"
                            placeholder="Add a new habit (e.g., Drink water)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button type="submit" variant="primary">Add</Button>
                    </form>

                    <input
                        className="border rounded-xl p-2 w-full sm:w-56"
                        placeholder="Search habits…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="border rounded-xl p-2 w-full sm:w-40"
                        value={ordering}
                        onChange={(e) => setOrdering(e.target.value)}
                    >
                        <option value="-created_at">Newest</option>
                        <option value="created_at">Oldest</option>
                        <option value="name">Name A–Z</option>
                        <option value="-name">Name Z–A</option>
                    </select>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200">
                        {error}
                    </div>
                )}

                <main className="space-y-3">
                    {loading && <div className="text-gray-600">Loading…</div>}
                    {!loading && habits.map((h) => (
                        <HabitCard key={h.id} habit={h} refresh={load} />
                    ))}
                    {!loading && habits.length === 0 && (
                        <p className="text-gray-500">No habits yet. Add one above.</p>
                    )}
                </main>
            </div>
        </div>
    )
}
