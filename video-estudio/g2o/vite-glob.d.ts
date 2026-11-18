// Tipo de `import.meta.glob` (lo resuelve vite al compilar). Esta carpeta no carga `vite/client` (tsconfig con `types: []`), así que se declara acá lo mínimo.
interface ImportMeta {
  glob(patron: string, opciones?: { query?: string; import?: string; eager?: boolean }): Record<string, () => Promise<unknown>>;
}
