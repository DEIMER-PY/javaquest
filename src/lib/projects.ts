import type { Localized } from './course';
export type Project = {
  id: string;
  title: Localized;
  description: Localized;
  unit: number;
  minutes: number;
  lesson: string;
  steps: { title: Localized; body: Localized }[];
  code: string;
  checks: Localized[];
};
export const projects: Project[] = [
  {
    id: 'calculator',
    title: { es: 'Una calculadora con criterio', en: 'A thoughtful calculator' },
    description: {
      es: 'Métodos, decisiones y validación. Tu primera herramienta de terminal.',
      en: 'Methods, decisions, and validation. Your first terminal tool.',
    },
    unit: 4,
    minutes: 35,
    lesson: 'problem-solving',
    steps: [
      {
        title: { es: 'Define las operaciones', en: 'Define operations' },
        body: {
          es: 'Escribe los resultados esperados de suma, resta, multiplicación y división para 8 y 2. Añade el caso 8 dividido entre 0.',
          en: 'Write expected addition, subtraction, multiplication, and division results for 8 and 2. Add division by zero.',
        },
      },
      {
        title: { es: 'Implementa el cálculo', en: 'Implement calculation' },
        body: {
          es: 'Crea calcular(double a, double b, String op). Usa switch y lanza IllegalArgumentException cuando la operación no exista o el divisor sea cero.',
          en: 'Create calculate(double a, double b, String op). Use switch and throw IllegalArgumentException for unknown operations or zero divisors.',
        },
      },
      {
        title: { es: 'Añade una interfaz de terminal', en: 'Add a terminal interface' },
        body: {
          es: 'En tu equipo, usa Scanner para leer líneas y Double.parseDouble para convertir los operandos. Captura errores numéricos sin ocultarlos.',
          en: 'Locally, use Scanner to read lines and Double.parseDouble to convert operands. Handle invalid numeric input visibly.',
        },
      },
      {
        title: { es: 'Comprueba y documenta', en: 'Check and document' },
        body: {
          es: 'Prueba números negativos, decimales, divisor cero y una operación inválida. Documenta javac Main.java y java Main en un README.',
          en: 'Test negatives, decimals, a zero divisor, and an invalid operation. Document javac Main.java and java Main in a README.',
        },
      },
    ],
    code: 'import java.util.Scanner;\n\npublic class Main {\n    static double calcular(double a, double b, String op) {\n        switch (op) {\n            case "+": return a + b;\n            case "-": return a - b;\n            case "*": return a * b;\n            case "/":\n                if (b == 0) throw new IllegalArgumentException("No se divide entre cero");\n                return a / b;\n            default: throw new IllegalArgumentException("Operacion desconocida");\n        }\n    }\n    public static void main(String[] args) {\n        try (Scanner entrada = new Scanner(System.in)) {\n            System.out.println("Primer numero:");\n            double a = Double.parseDouble(entrada.nextLine());\n            System.out.println("Operacion (+ - * /):");\n            String op = entrada.nextLine();\n            System.out.println("Segundo numero:");\n            double b = Double.parseDouble(entrada.nextLine());\n            System.out.println("Resultado: " + calcular(a, b, op));\n        } catch (NumberFormatException e) {\n            System.out.println("Debes escribir un numero valido");\n        } catch (IllegalArgumentException e) {\n            System.out.println(e.getMessage());\n        }\n    }\n}',
    checks: [
      { es: '8 / 2 devuelve 4.0', en: '8 / 2 returns 4.0' },
      { es: '8 / 0 informa el error', en: '8 / 0 reports an error' },
      {
        es: 'Texto en lugar de un número no provoca un cierre sin explicación',
        en: 'Text instead of a number reports a clear error',
      },
    ],
  },
  {
    id: 'guess-number',
    title: { es: 'Adivina el número', en: 'Guess the number' },
    description: {
      es: 'Un juego de terminal con pistas, intentos y una condición de salida.',
      en: 'A terminal game with hints, attempts, and an exit condition.',
    },
    unit: 3,
    minutes: 30,
    lesson: 'while',
    steps: [
      {
        title: { es: 'Diseña las reglas', en: 'Design the rules' },
        body: {
          es: 'El secreto está entre 1 y 100. Hay 7 intentos válidos. Una entrada que no sea número no consume intento.',
          en: 'The secret is between 1 and 100. Allow 7 valid guesses. Nonnumeric input does not consume a guess.',
        },
      },
      {
        title: { es: 'Practica con datos conocidos', en: 'Practice with known data' },
        body: {
          es: 'Usa un secreto fijo, por ejemplo 42, y prueba pistas para 20, 70 y 42. Puedes practicar estas comparaciones en el playground.',
          en: 'Use a fixed secret, such as 42, and check hints for 20, 70, and 42. Practice those comparisons in the playground.',
        },
      },
      {
        title: { es: 'Añade aleatoriedad y entrada local', en: 'Add randomness and local input' },
        body: {
          es: 'Usa Random.nextInt(100) + 1 y Scanner. Limita los intentos con un ciclo y sal de él cuando se acierte.',
          en: 'Use Random.nextInt(100) + 1 and Scanner. Limit guesses with a loop and exit on a correct guess.',
        },
      },
      {
        title: { es: 'Verifica las fronteras', en: 'Verify boundaries' },
        body: {
          es: 'Prueba 0, 101, texto, acierto temprano y agotamiento de intentos. Comprueba que una entrada inválida no reduzca el contador.',
          en: 'Try 0, 101, text, early success, and exhausted guesses. Verify invalid input does not reduce the counter.',
        },
      },
    ],
    code: 'import java.util.Random;\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        int secreto = new Random().nextInt(100) + 1;\n        int intentos = 0;\n        boolean ganado = false;\n        try (Scanner entrada = new Scanner(System.in)) {\n            while (intentos < 7 && !ganado) {\n                System.out.println("Numero de 1 a 100 (intento " + (intentos + 1) + "):");\n                int numero;\n                try { numero = Integer.parseInt(entrada.nextLine()); }\n                catch (NumberFormatException e) { System.out.println("Escribe un entero"); continue; }\n                if (numero < 1 || numero > 100) { System.out.println("Fuera de rango"); continue; }\n                intentos++;\n                if (numero == secreto) { ganado = true; System.out.println("Acertaste!"); }\n                else System.out.println(numero < secreto ? "El secreto es mayor" : "El secreto es menor");\n            }\n            if (!ganado) System.out.println("El secreto era " + secreto);\n        }\n    }\n}',
    checks: [
      { es: 'El secreto siempre está entre 1 y 100', en: 'The secret is always between 1 and 100' },
      { es: 'El acierto termina el juego', en: 'A correct guess ends the game' },
      { es: 'Nunca hay más de 7 intentos válidos', en: 'There are at most 7 valid guesses' },
    ],
  },
  {
    id: 'task-manager',
    title: { es: 'Tu gestor de tareas', en: 'Your task manager' },
    description: {
      es: 'Objetos, colecciones y excepciones en una aplicación que podrás ampliar.',
      en: 'Objects, collections, and exceptions in an application you can extend.',
    },
    unit: 6,
    minutes: 55,
    lesson: 'final-challenge',
    steps: [
      {
        title: { es: 'Modela una tarea', en: 'Model a task' },
        body: {
          es: 'Crea Tarea con título privado y estado completada. El constructor rechaza títulos vacíos. Expón completar() y una representación legible.',
          en: 'Create Task with a private title and completion state. Reject empty titles in the constructor. Expose complete() and a readable representation.',
        },
      },
      {
        title: { es: 'Organiza la colección', en: 'Organize the collection' },
        body: {
          es: 'Usa una List<Tarea> para almacenar elementos. Empieza añadiendo y listando datos definidos en código; después incorpora la terminal.',
          en: 'Store items in a List<Task>. Start by adding and listing predefined data, then incorporate terminal input.',
        },
      },
      {
        title: { es: 'Implementa el menú', en: 'Implement the menu' },
        body: {
          es: 'Ofrece añadir, listar, completar y salir. Convierte el número visible de tarea (desde 1) a índice (desde 0) y valida el rango.',
          en: 'Offer add, list, complete, and exit. Convert visible task numbers (starting at 1) to indexes (starting at 0), checking the range.',
        },
      },
      {
        title: { es: 'Comprueba las reglas', en: 'Check the rules' },
        body: {
          es: 'Prueba lista vacía, título vacío, número inexistente y completar dos veces. Separar clases en archivos será tu siguiente refactor.',
          en: 'Test an empty list, empty title, nonexistent task number, and completing twice. Separating classes into files is your next refactor.',
        },
      },
      {
        title: { es: 'Documenta la siguiente mejora', en: 'Document the next improvement' },
        body: {
          es: 'Los datos están en memoria y se pierden al salir. Describe cómo añadirías archivos o MySQL cuando completes la ruta de persistencia.',
          en: 'Data lives in memory and disappears on exit. Describe how you would add files or MySQL after the persistence path.',
        },
      },
    ],
    code: 'import java.util.ArrayList;\nimport java.util.List;\nimport java.util.Scanner;\n\nclass Tarea {\n    private final String titulo;\n    private boolean completada;\n    Tarea(String titulo) {\n        if (titulo == null || titulo.trim().isEmpty()) throw new IllegalArgumentException("Titulo obligatorio");\n        this.titulo = titulo.trim();\n    }\n    void completar() { completada = true; }\n    public String toString() { return (completada ? "[x] " : "[ ] ") + titulo; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Tarea> tareas = new ArrayList<>();\n        try (Scanner entrada = new Scanner(System.in)) {\n            while (true) {\n                System.out.println("1 Anadir | 2 Listar | 3 Completar | 0 Salir");\n                String opcion = entrada.nextLine();\n                if (opcion.equals("0")) break;\n                try {\n                    switch (opcion) {\n                        case "1":\n                            System.out.println("Titulo:");\n                            tareas.add(new Tarea(entrada.nextLine())); break;\n                        case "2":\n                            if (tareas.isEmpty()) System.out.println("No hay tareas");\n                            for (int i = 0; i < tareas.size(); i++) System.out.println((i + 1) + ". " + tareas.get(i));\n                            break;\n                        case "3":\n                            System.out.println("Numero de tarea:");\n                            int indice = Integer.parseInt(entrada.nextLine()) - 1;\n                            if (indice < 0 || indice >= tareas.size()) throw new IllegalArgumentException("Tarea inexistente");\n                            tareas.get(indice).completar(); break;\n                        default: System.out.println("Opcion invalida");\n                    }\n                } catch (IllegalArgumentException e) { System.out.println("Entrada invalida: " + e.getMessage()); }\n            }\n        }\n    }\n}',
    checks: [
      { es: 'Los títulos vacíos se rechazan', en: 'Empty titles are rejected' },
      {
        es: 'Completar cambia el estado sin duplicar la tarea',
        en: 'Completing changes state without duplicating the task',
      },
      {
        es: 'Los índices inexistentes muestran un mensaje claro',
        en: 'Invalid indexes produce a clear message',
      },
    ],
  },
];
