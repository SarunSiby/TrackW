export default function DayPill({ date, label, done, onToggle }) {
    // date = ISO "YYYY-MM-DD"
    const title = `${label} • ${date} • ${done ? 'Done' : 'Not done'}`;

    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={!!done}
            onClick={() => onToggle(date)}
            className={[
                "w-8 h-8 rounded-full inline-flex items-center justify-center text-[11px] font-medium",
                "transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                done
                    ? "bg-pink-600 text-white hover:bg-pink-700 focus-visible:ring-pink-400"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus-visible:ring-gray-300",
            ].join(" ")}
        >
            {label}
        </button>
    );
}
