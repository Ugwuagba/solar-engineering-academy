# Solar Engineering Academy: Antigravity Implementation Plan

**Target Application:** A modernized, unified solar training platform inspired by Solar Energy International (`solarenergy.org`), featuring self-paced & cohort courses, interactive video classroom, 70% quiz gating, instant payment webhooks, and verifiable credentials.

**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, NextAuth.js (JWT), Lucide Icons.

---

## Task 1: Environment, Dependencies & Database Schema
- [ ] Initialize Next.js 15 App Router project with TypeScript and Tailwind CSS.
- [ ] Install dependencies:
  - Core: `@prisma/client`, `prisma`, `next-auth`, `bcryptjs`, `zod`, `clsx`, `tailwind-merge`, `lucide-react`
  - Classroom & Media: `@types/bcryptjs`
- [ ] Configure `prisma/schema.prisma` with exact relational models:
  - `User` (id, email, passwordHash, name, role [STUDENT, ADMIN])
  - `Course` (id, code, title, slug, description, level [INTRODUCTORY, INTERMEDIATE, ADVANCED], deliveryType [SELF_PACED, COHORT], contactHours, price, isPublished)
  - `Cohort` (id, courseId, name, startDate, endDate, maxCapacity)
  - `Module` (id, courseId, title, sortOrder)
  - `Lesson` (id, moduleId, title, sortOrder, videoUrl, durationSec, contentMarkdown, downloadableUrl, isFreePreview)
  - `Quiz` (id, moduleId, title, passingScore [default 70])
  - `Question` (id, quizId, text, optionsJson, correctOptionIndex, explanation)
  - `Enrollment` (id, userId, courseId, status [ACTIVE, COMPLETED], progressPercent, cohortId)
  - `Progress` (id, enrollmentId, lessonId, isCompleted, watchedSec)
  - `QuizAttempt` (id, userId, quizId, score, passed, attemptedAt)
  - `Certificate` (id, certificateCode, userId, courseId, contactHours, issuedAt)
- [ ] Generate Prisma Client (`npx prisma generate`).
- [ ] Create `prisma/seed.ts` populating 2 complete flagship courses:
  - `PVOL101`: Commercial & Industrial Solar PV Design (40 Contact Hours)
  - `BESS201`: Battery Energy Storage System Sizing & Safety (24 Contact Hours)
  - Include 4 modules per course, 3 lessons per module, and an end-of-module quiz with 3 technical calculation/concept questions.
- [ ] Run seed script and verify database integrity in the terminal.

---

## Task 2: Authentication & Route Protection Middleware
- [ ] Implement NextAuth.js handlers under `app/api/auth/[...nextauth]/route.ts` with Credentials Provider and Prisma adapter.
- [ ] Configure JWT session callbacks to encode `user.id` and `user.role` (STUDENT vs ADMIN).
- [ ] Create authentication forms:
  - `app/(auth)/login/page.tsx`
  - `app/(auth)/register/page.tsx`
- [ ] Configure `middleware.ts` to enforce strict route boundaries:
  - `/learn/:path*` redirects unauthenticated users to `/login`.
  - `/admin/:path*` restricts access strictly to users with role `ADMIN`.

---

## Task 3: Public Solar Academy Portal & Course Landing
- [ ] Create the global navigation header (`components/Navbar.tsx`) featuring brand logo, Course Catalog link, Student Dashboard link, and Auth states.
- [ ] Build the Course Catalog (`app/(public)/courses/page.tsx`):
  - Filter pills: Delivery Mode ("All", "Self-Paced / On-Demand", "Scheduled Cohorts") and Level ("100-Level", "200-Level", "300-Level").
  - Course cards highlighting course code badge (e.g., `PVOL101`), verified contact hours, price, and syllabus summary.
- [ ] Build the dynamic Course Landing page (`app/(public)/courses/[slug]/page.tsx`):
  - Sticky checkout sidebar with price, contact hours, and direct "Enroll Now" CTA.
  - Expandable syllabus accordion rendering Modules, Lessons, and Quiz badges.
  - Downloadable tools preview (Sizing spreadsheets, Single-Line Diagrams, BOQs).

---

## Task 4: Interactive Split-Screen Classroom Player
- [ ] Build the learning layout (`app/(classroom)/learn/[courseSlug]/layout.tsx`):
  - Collapsible course syllabus sidebar displaying module progress, completed checkmarks, and locked state badges.
- [ ] Build the active lesson view (`app/(classroom)/learn/[courseSlug]/module/[moduleId]/lesson/[lessonId]/page.tsx`):
  - Responsive video player container with playback speed controls (0.75x to 2x) and auto-play next trigger.
  - Bottom tab navigation: "Lesson Overview", "Engineering Downloads & Schematics", and "Notes".
- [ ] Build state persistence:
  - Client hook syncing playback position (`watchedSec`) to `/api/progress` every 5 seconds.
  - Auto-mark lecture completed when watch progress exceeds 90%.

---

## Task 5: Interactive Quiz & Progression Lock Engine
- [ ] Build the end-of-module quiz page (`app/(classroom)/learn/[courseSlug]/module/[moduleId]/quiz/page.tsx`):
  - Clean question-by-question or single-scroll quiz UI.
  - Interactive radio selections with immediate explanation feedback upon submission.
- [ ] Create the grading server action:
  - Calculate percentage score against `Quiz.passingScore` (70%).
  - Record attempt in `QuizAttempt` table.
- [ ] Implement progression gating:
  - Server-side guard preventing student access to Module $N+1$ until Module $N$ quiz is recorded with `passed: true`.
  - Visual lock badge on sidebar items with a tooltip: *"Score 70% on Module [N] Quiz to unlock."*

---

## Task 6: Payment Webhooks & Instant Enrollment
- [ ] Build checkout initialization endpoint (`/api/checkout/initialize`):
  - Generate hosted checkout payload (Stripe Checkout Session or Paystack Transaction Init).
- [ ] Build the cryptographic webhook listener (`/api/webhooks/payment`):
  - Verify webhook signature secret.
  - Extract `userId` and `courseId` from transaction metadata.
  - Execute atomic transaction:
    - Create `Enrollment` record (`status: ACTIVE`, `progressPercent: 0`).
    - Initialize blank `Progress` entries for all course lessons.
- [ ] Create payment success callback view (`app/(public)/checkout/success/page.tsx`) with instant "Enter Classroom" redirect.

---

## Task 7: Verifiable Credential Engine & Public Verification
- [ ] Build certificate auto-generation trigger:
  - Evaluates when all course modules are completed and all quizzes are passed.
  - Generates a unique certificate record with a permanent slug (e.g., `SEI-PV-94821`).
- [ ] Build the public verification portal (`app/(public)/verify/[certificateCode]/page.tsx`):
  - Renders official credential badge, student full name, course title, completion timestamp, and accredited training contact hours.
- [ ] Printable / PDF certificate view styled for standard A4 landscape with institutional border.

---

## Task 8: Antigravity Automated Verification
- [ ] Launch development server (`npm run dev`) in the terminal.
- [ ] Use `/browser` to validate the full end-to-end workflow:
  1. Register a test student.
  2. Browse `/courses` and open `/courses/pvol101`.
  3. Enroll student and navigate directly to `/learn/pvol101/...`.
  4. Complete Lesson 1, complete the Module 1 Quiz with $\ge 70\%$, and verify that Module 2 unlocks.
  5. Check that the `/verify` route resolves correctly.
- [ ] Run `npm run build` and ensure zero TypeScript or bundling errors.