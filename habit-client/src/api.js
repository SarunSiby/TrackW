const API = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'


export async function listHabits() {
    const r = await fetch(`${API}/habits/`)
    if (!r.ok) throw new Error('Failed to fetch habits')
    return r.json()
}


export async function createHabit(name) {
    const r = await fetch(`${API}/habits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
    if (!r.ok) throw new Error('Failed to create habit')
    return r.json()
}


export async function toggleHabit(id, date) {
    const r = await fetch(`${API}/habits/${id}/toggle/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(date ? { date } : {})
    })
    if (!r.ok) throw new Error('Failed to toggle habit')
    return r.json()
}


export async function habitStats(id) {
    const r = await fetch(`${API}/habits/${id}/stats/`)
    if (!r.ok) throw new Error('Failed to load stats')
    return r.json()
}

export async function updateHabit(id, name) {
    const r = await fetch(`${API}/habits/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    if (!r.ok) throw new Error('Failed to update habit');
    return r.json();
}

export async function deleteHabit(id) {
    const r = await fetch(`${API}/habits/${id}/`, { method: 'DELETE' });
    if (!r.ok) throw new Error('Failed to delete habit');
    return true;
}
