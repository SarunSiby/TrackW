export default function DayPill({ date, done, onToggle }) {
    return (
        <button
            onClick={() => onToggle(date)}
            title={date}
            className={`w-8 h-8 rounded-full border text-sm transition ${
                done ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
            }`}
        >
            {new Date(date).toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1)}
        </button>
    )
}