import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/Toast.jsx'   // 👈 import it

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ToastProvider>          {/* 👈 wrap here */}
            <App />
        </ToastProvider>
    </StrictMode>,
)
