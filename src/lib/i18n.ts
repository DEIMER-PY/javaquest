export type Locale = 'es' | 'en';
export function isLocale(value: string): value is Locale {
  return value === 'es' || value === 'en';
}
export function t(locale: Locale, es: string, en: string) {
  return locale === 'es' ? es : en;
}
export const labels = {
  es: {
    home: 'Mi aventura',
    learn: 'Ruta de aprendizaje',
    playground: 'Playground',
    projects: 'Proyectos',
    resources: 'Herramientas',
    profile: 'Mi progreso',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    start: 'Comenzar mi aventura',
    continue: 'Continuar aprendiendo',
    minutes: 'min',
    lessons: 'lecciones',
    unit: 'UNIDAD',
    completed: 'Completada',
    practice: 'Practicar',
    coming: 'Próximamente',
    free: 'Gratis, para siempre para tu clase',
    language: 'Cambiar idioma',
    theme: 'Cambiar tema',
    guest: 'Explorador',
    save: 'Guardar',
    loading: 'Cargando…',
  },
  en: {
    home: 'My adventure',
    learn: 'Learning path',
    playground: 'Playground',
    projects: 'Projects',
    resources: 'Tools',
    profile: 'My progress',
    login: 'Sign in',
    logout: 'Sign out',
    start: 'Start my adventure',
    continue: 'Continue learning',
    minutes: 'min',
    lessons: 'lessons',
    unit: 'UNIT',
    completed: 'Completed',
    practice: 'Practice',
    coming: 'Coming next',
    free: 'Free for everyone in your class',
    language: 'Change language',
    theme: 'Switch theme',
    guest: 'Explorer',
    save: 'Save',
    loading: 'Loading…',
  },
};
