// Tema Bootstrap personalizado para TrackFilmes
// Adicione este arquivo antes da importação do Bootstrap
// Ou adicione ao seu arquivo principal index.js

// Tema personalizado do Bootstrap (opcional)
export const bootstrapCustomTheme = `
  :root {
    --bs-primary: #1e3a8a;
    --bs-secondary: #64748b;
    --bs-success: #10b981;
    --bs-info: #0ea5e9;
    --bs-warning: #f59e0b;
    --bs-danger: #ef4444;
    --bs-light: #f8fafc;
    --bs-dark: #1f2937;
    --bs-primary-rgb: 30, 58, 138;
    --bs-secondary-rgb: 100, 116, 139;
    --bs-success-rgb: 16, 185, 129;
    --bs-info-rgb: 14, 165, 233;
    --bs-warning-rgb: 245, 158, 11;
    --bs-danger-rgb: 239, 68, 68;
    --bs-light-rgb: 248, 250, 252;
    --bs-dark-rgb: 31, 41, 55;
    --bs-white-rgb: 255, 255, 255;
    --bs-black-rgb: 0, 0, 0;
    --bs-body-color-rgb: 55, 65, 81;
    --bs-body-bg-rgb: 248, 250, 252;
    --bs-font-sans-serif: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --bs-font-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --bs-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
    --bs-body-font-family: var(--bs-font-sans-serif);
    --bs-body-font-size: 1rem;
    --bs-body-font-weight: 400;
    --bs-body-line-height: 1.6;
    --bs-body-color: #374151;
    --bs-body-bg: #f8fafc;
    --bs-border-width: 1px;
    --bs-border-style: solid;
    --bs-border-color: #e5e7eb;
    --bs-border-color-translucent: rgba(0, 0, 0, 0.175);
    --bs-border-radius: 0.375rem;
    --bs-border-radius-sm: 0.25rem;
    --bs-border-radius-lg: 0.5rem;
    --bs-border-radius-xl: 1rem;
    --bs-border-radius-2xl: 2rem;
    --bs-border-radius-pill: 50rem;
    --bs-heading-color: #1f2937;
    --bs-link-color: #1e3a8a;
    --bs-link-hover-color: #172b6f;
    --bs-code-color: #ef4444;
  }
`;

// Para adicionar a fonte Poppins ao seu documento
export const addGoogleFonts = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
};

// Criar um objeto nomeado para exportação
const themeExports = {
  bootstrapCustomTheme,
  addGoogleFonts,
};

export default themeExports;
