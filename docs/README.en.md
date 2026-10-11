# JavaQuest

A free bilingual Java learning platform, designed for a classroom and a developer portfolio.

![Public landing page](images/landing-desktop-dark.png)

## Features

Thirty Spanish/English lessons cover history, JVM, installation, types, flow control, methods, arrays, objects, collections, and exceptions. A custom javac + TeaVM playground compiles real Java in the browser. Three guided local projects provide a calculator, guessing game, and task manager.

The redesigned public entry includes an expandable curriculum and a searchable thirty-term bilingual glossary. A black/yellow identity, original JQ mark, self-hosted fonts, and coordinated light/dark themes apply throughout the app. Dark is the default; a saved preference takes priority. The learning dashboard lives at `/en/dashboard`, the glossary at `/en/glossary`.

Supabase supports Google/GitHub accounts, private progress, daily activity, project steps, and drafts when configured. Without it, lessons and playground remain available and guest progress is explicitly browser-local. Future SQL, ORM, Spring Boot, and full-stack paths are marked as upcoming.

## Development

```bash
git clone https://github.com/DEIMER-PY/javaquest.git
cd javaquest
npm ci
npm run java:prepare
npm run dev
```

Use Node.js 22+. Visit http://localhost:3000/en. Copy `.env.example` to `.env.local` and follow [setup](setup.md) to enable accounts. Never commit credentials.

```bash
npm run typecheck
npm run lint
npm test
node scripts/verify-java.mjs
npm run build
```

Browser tests use an installed Chrome locally and Chromium in CI. Start the app before `npm run test:e2e`.

Visual tests cover twelve screens, six viewport widths, two languages, and both themes (288 combinations), plus touch targets and text contrast. Generate real screenshots with `node scripts/capture-design.mjs`. See [the design system and references](design-system.md).

## Runtime boundaries

The browser compiler is not a complete desktop JDK. Scanner is unsupported. Terminal projects, system files, Spring Boot, and MySQL run with a local JDK. Execution is interruptible and limited to five seconds and 32 KB output. Compiler resources are SHA-256 pinned and loaded only when needed.

Free hosting remains subject to provider quotas. Read [verification status](verification.md) for external integrations still requiring configuration. No paid service is automatically enabled.

See [architecture](architecture.md), [curriculum](curriculum.md), and [contributing](../CONTRIBUTING.md). Original code is MIT; original educational content is CC BY 4.0. Third-party licenses are preserved.
