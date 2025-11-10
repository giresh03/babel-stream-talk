export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'ws://localhost:8000',
} as const;

