import type { Locale } from './i18n';
export type Localized = { es: string; en: string };
export type Lesson = {
  id: string;
  unit: number;
  title: Localized;
  minutes: number;
  example: string;
  exercise: Localized;
  hint: Localized;
  solution: string;
  question: Localized;
  choices: Localized[];
};
export const units = [
  {
    id: 1,
    title: { es: 'El comienzo de tu aventura', en: 'Your adventure begins' },
    description: {
      es: 'Conoce Java, prepara tus herramientas y escribe tu primer programa.',
      en: 'Meet Java, set up your tools, and write your first program.',
    },
    color: 'green',
    icon: 'rocket',
  },
  {
    id: 2,
    title: { es: 'Habla el idioma de Java', en: 'Speak the language of Java' },
    description: {
      es: 'Tipos, variables, operadores y las primeras conversaciones con tu código.',
      en: 'Types, variables, operators, and your first conversations with code.',
    },
    color: 'blue',
    icon: 'code',
  },
  {
    id: 3,
    title: { es: 'Toma el control', en: 'Take control' },
    description: {
      es: 'Decisiones, repeticiones y el superpoder de encontrar errores.',
      en: 'Decisions, repetition, and the superpower of finding bugs.',
    },
    color: 'orange',
    icon: 'route',
  },
  {
    id: 4,
    title: { es: 'Construye pieza por pieza', en: 'Build piece by piece' },
    description: {
      es: 'Métodos y arrays para resolver problemas con claridad.',
      en: 'Methods and arrays to solve problems clearly.',
    },
    color: 'purple',
    icon: 'blocks',
  },
  {
    id: 5,
    title: { es: 'Piensa en objetos', en: 'Think in objects' },
    description: {
      es: 'Modela el mundo con clases, encapsulación e interfaces.',
      en: 'Model the world with classes, encapsulation, and interfaces.',
    },
    color: 'pink',
    icon: 'box',
  },
  {
    id: 6,
    title: { es: 'Tu primer proyecto de verdad', en: 'Your first real project' },
    description: {
      es: 'Colecciones, excepciones y una aplicación organizada.',
      en: 'Collections, exceptions, and an organized application.',
    },
    color: 'teal',
    icon: 'trophy',
  },
] as const;
export const upcoming = [
  { es: 'Git, Maven, Gradle y pruebas con JUnit', en: 'Git, Maven, Gradle, and JUnit testing' },
  { es: 'Genéricos, archivos, lambdas y streams', en: 'Generics, files, lambdas, and streams' },
  { es: 'SQL, MySQL y conexión con JDBC', en: 'SQL, MySQL, and JDBC connections' },
  { es: 'ORM: Jakarta Persistence e Hibernate', en: 'ORM: Jakarta Persistence and Hibernate' },
  {
    es: 'Spring Boot, Spring Data JPA y APIs REST',
    en: 'Spring Boot, Spring Data JPA, and REST APIs',
  },
  {
    es: 'Autenticación y proyecto React + Java + MySQL',
    en: 'Authentication and a React + Java + MySQL project',
  },
];
export function lessonTitle(lesson: Lesson, locale: Locale) {
  return lesson.title[locale];
}
