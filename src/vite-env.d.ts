/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORTAL_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
