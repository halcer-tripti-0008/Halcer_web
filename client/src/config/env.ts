/**
 * Validated public (browser) configuration. Vite inlines VITE_* variables at build time,
 * so nothing here may be secret. The app fails loudly at startup if config is invalid.
 *
 * Validated by hand rather than with Zod: this module is on the critical path, and Zod
 * would add tens of kB to the entry bundle for three variables. Zod remains the tool
 * for forms and API payloads, which load lazily with their pages.
 */
function readVariable(name: keyof ImportMetaEnv, isValid: (value: string) => boolean): string {
  const value: unknown = import.meta.env[name];
  if (typeof value !== 'string' || value.trim() === '' || !isValid(value)) {
    throw new Error(`Invalid client environment variable ${name}. See client/.env.example.`);
  }
  return value;
}

const isPathOrUrl = (value: string) => value.startsWith('/') || URL.canParse(value);
const isHttpUrl = (value: string) => URL.canParse(value) && /^https?:/.test(value);

export const env = {
  apiBaseUrl: readVariable('VITE_API_BASE_URL', isPathOrUrl),
  siteUrl: readVariable('VITE_SITE_URL', isHttpUrl).replace(/\/$/, ''),
  siteName: readVariable('VITE_SITE_NAME', () => true),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
