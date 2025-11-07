// Client-side configuration
// Change API_BASE if your server runs elsewhere (e.g., production)
const API_BASE = 'http://localhost:5000';

// Export for modules that can import, and attach to window for inline scripts
if (typeof window !== 'undefined') window.API_BASE = API_BASE;
