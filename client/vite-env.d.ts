/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_API_KEY: string;
    readonly VITE_FLUTTERWAVE_PUBLIC_KEY: string;
    readonly VITE_VTPASS_API_KEY: string;
    readonly VITE_VTPASS_SECRET_KEY: string;
    readonly VITE_VTPASS_PUBLIC_KEY: string;
    readonly VITE_VTPASS_API_USERNAME: string;
    readonly VITE_VTPASS_API_PASSWORD: string;
    readonly VITE_URL: string;
    readonly VITE_FRONTEND_URL: string;
    // add more environment variables here...
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}