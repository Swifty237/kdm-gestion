/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CONTACT_SERVER_URI: string;
    // ajoute d'autres variables ici si besoin
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
