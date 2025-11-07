// Client-side configuration
const API_BASE = 'https://abdaa-server.vercel.app';

// Export for modules that can import, and attach to window for inline scripts
if (typeof window !== 'undefined') {
    window.API_BASE = API_BASE;
}

// باقي إعدادات السيرفر
app.use(express.json());
