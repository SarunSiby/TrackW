import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const remove = useCallback((id) => {
        setToasts((t) => t.filter(x => x.id !== id))
    }, [])

    const show = useCallback((message, type = 'success', ms = 2500) => {
        const id = Math.random().toString(36).slice(2)
        setToasts((t) => [...t, { id, message, type }])
        if (ms > 0) setTimeout(() => remove(id), ms)
    }, [remove])

    return (
        <ToastCtx.Provider value={{ show }}>
            {children}
            {/* toaster UI */}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`min-w-[220px] max-w-[320px] rounded-xl px-3 py-2 shadow-lg border text-sm
              ${t.type === 'error'
                            ? 'bg-red-600 text-white border-red-700'
                            : 'bg-black text-white border-black'}`}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastCtx.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastCtx)
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
    return ctx
}
