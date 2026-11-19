# Akal University – Dynamic Department Management Portal

[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

A production-grade, enterprise Multi-Department Content Management System and Public Portal designed for **Akal University** ([auts.ac.in](https://auts.ac.in/)). Built according to institutional branding, strict governance, hierarchical role-based access control, an 8-layout dynamic page builder, structured academic modules, and a multi-tier revision approval workflow.

---

## 🏛️ Project Architecture Overview

```
                                      ┌──────────────────────────────────────────────┐
                                      │           Akal University Portal             │
                                      └──────────────────────┬───────────────────────┘
                                                             │
                             ┌───────────────────────────────┴───────────────────────────────┐
                             ▼                                                               ▼
        ┌─────────────────────────────────────────┐                     ┌─────────────────────────────────────────┐
        │        Public University Portal         │                     │       Administrative Control Suite      │
        ├─────────────────────────────────────────┤                     ├─────────────────────────────────────────┤
        │ • Official Auts.ac.in Header & Topbar   │                     │ • Super Admin Dashboard                 │
        │ • Multi-Faculty Search & Catalog        │                     │   - University-wide KPI Metrics         │
        │ • Single Reusable Department Template   │                     │   - Departments CRUD & Admin Assign     │
        │ • Dynamic Page-Builder Section Engine   │                     │   - Content Approval Center (Diff/Live) │
        │ • Academic Structured Data Tabs         │                     │   - Users & Role Management             │
        │ • Official 6-Column Institutional Footer│                     │   - System Audit Logs & Config Settings │
        └─────────────────────────────────────────┘                     │ • Department Admin Workspace            │
                                                                        │   - Department Profile & Branding       │
                                                                        │   - 8-Type Layout Section Builder       │
                                                                        │   - 8 Structured Module Managers        │
                                                                        │   - Revision Draft/Submit & Feedback    │
                                                                        └─────────────────────────────────────────┘
```

---

## 🎨 Visual Identity & Design System

Built strictly adhering to Akal University's official brand guidelines (`Documents/DESIGN.md`, `Documents/header-footer.md`):

| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Akal Gold / Yellow** | `#F9B900` | Primary accents, buttons, highlight borders, badges, breadcrumbs |
| **Akal Blue** | `#087BB5` | Secondary brand color, headings, active links, accents |
| **Dark Navy** | `#172333` | Institutional topbar, text headings, table headers, sidebar nav |
| **Footer Navy** | `#131e2b` | Official multi-column university footer background |
| **Surface Light** | `#F5F7FA` | Section backgrounds, card containers, subtle borders |
| **Border Line** | `#E2E8F0` | Dividers, card strokes, form controls |

---

## 🧩 Core Capabilities

### 1. Reusable Public Department Template
- Single dynamic frontend template renders any department based entirely on database state.
- **Top Bar & Main Header:** Includes emergency helpline (`1800-2020-100`), quick action links, admissions link, and expandable mega-navigation.
- **Department Hero Section:** Displays department banner image, title, faculty affiliation badge, quick actions (Apply Now, Download Syllabus, Contact).
- **HOD Welcome Card:** Head of Department message, portrait, qualifications, and official email.
- **Section Layout Engine:** Renders dynamic custom sections created via the Page Builder.
- **Structured Modules:**
  - 🎓 **Programmes Offered:** Degree level (UG/PG/Doctoral), intake capacity, duration, eligibility, download curriculum.
  - 👨‍🏫 **Faculty Directory:** Profile cards with designation, research areas, email, and Google Scholar / ResearchGate links.
  - 🔬 **Laboratories & Infrastructure:** Equipment list, room numbers, capacities, and facility photos.
  - 📅 **Department Events & Workshops:** Categorized by upcoming/past with registration links.
  - 🏆 **Student & Faculty Achievements:** Honors, awards, and recognitions with dates.
  - 📄 **Research Publications:** Peer-reviewed papers, journals, indexing (Scopus, UGC-CARE), DOI links.
  - 📢 **Department Notices:** Important updates, date badges, downloadable PDF attachments.
  - 🖼️ **Photo & Event Gallery:** Responsive masonry grid with lightbox preview.

### 2. Custom Section Layout Builder (8 Layout Types)
Department Admins can build unlimited modular page sections without writing code:
1. **`text`**: Rich textual content with lead paragraph and formatted body.
2. **`image_text`**: Side-by-side media and copy with configurable left/right alignment.
3. **`card_grid`**: Multi-column feature cards with icons, titles, and descriptions.
4. **`timeline`**: Chronological milestone tracker for departmental history and developments.
5. **`banner`**: High-impact call-to-action banner with custom background and buttons.
6. **`statistics`**: Key performance metrics (faculty count, labs, placement %, citations).
7. **`gallery`**: Multi-image media showcase with captions.
8. **`accordion`**: Collapsible FAQ and structured information drawers.

### 3. Multi-Tier Governance & Revision Workflow
To ensure institutional compliance, Department Admins cannot publish directly to the live website:
- **Drafting:** Department Admin authors or edits custom sections or department settings.
- **Submission:** Submitting a section packages the JSON payload into `content_revisions` with `pending` status.
- **Review Center:** Super Admin views the unified **Content Approval Center**, inspects raw payload diffs, and checks submitter notes.
- **Approval / Rejection:** Super Admin approves or rejects with mandatory feedback notes visible in the Department Admin's **Submission History**.
- **Publishing:** On approval and publish, changes are committed to the live `department_sections` table and immediately reflected on the public portal.

---

## 🚀 Quick Start Guide

### Prerequisites
- **PHP:** 8.2 or higher
- **Composer:** 2.x
- **Node.js:** 20.x or higher, with `npm`
- **Database:** SQLite (default for development) or MySQL 8 (XAMPP / native)

---

### Backend Setup (Laravel 12 REST API)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Composer dependencies:
   ```bash
   composer install
   ```

3. Configure Environment (`.env`):
   ```env
   APP_NAME="Akal Department Portal"
   APP_ENV=local
   APP_KEY=base64:oXW3aBv89LsmvF/a6q2Xf0V7kC/8o+z9BkmG9vFjI7A=
   APP_DEBUG=true
   APP_URL=http://127.0.0.1:8000

   # Option A: SQLite (Default Development)
   DB_CONNECTION=sqlite

   # Option B: MySQL (XAMPP or Production)
   # DB_CONNECTION=mysql
   # DB_HOST=127.0.0.1
   # DB_PORT=3306
   # DB_DATABASE=akal_department_portal
   # DB_USERNAME=root
   # DB_PASSWORD=
   ```

4. Run Migrations & Seed Institutional Data:
   ```bash
   php artisan migrate:fresh --seed
   ```
   *(This creates faculties, departments, 8 section layout schemas, 5 fully populated departments, academic modules, and test users).*

5. Link Laravel's public upload storage:
   ```bash
   php artisan storage:link
   ```
   Uploaded media is stored under `storage/app/public/departments/{id}/` and exposed through the public storage disk. Keep `APP_URL` set to the API's public base URL.

6. Start the API Server:
   ```bash
   php artisan serve --host 127.0.0.1 --port 8000
   ```
   API will be accessible at: `http://127.0.0.1:8000/api/v1`

---

### Frontend Setup (React 18 + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install NPM dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
   ```

4. Start the Vite Development Server:
   ```bash
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
   Frontend will be live at: `http://localhost:5173`

5. Build for Production:
   ```bash
   npm run build
   ```

---

## 🔐 Default Access Credentials

| Role | Email | Password | Assigned Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `super@akal.ac.in` | `Akal@123` | Full University Oversight, User Management, Content Approvals, System Config |
| **Department Admin** | `deptadmin@akal.ac.in` | `Akal@123` | Computer Science & Engineering (Profile, Sections, Modules, Submissions) |

---

## 🧭 Navigation & URL Map

### Public Website
- `/` or `/departments` — Akal University Department Directory (Filterable by Faculty & Search)
- `/departments/computer-science-engineering` — Computer Science & Engineering Department
- `/departments/physics` — Department of Physics
- `/departments/chemistry` — Department of Chemistry
- `/departments/mathematics` — Department of Mathematics
- `/departments/commerce-management` — Department of Commerce & Management

### Super Admin Suite (`/admin/super`)
- `/admin/login` — Administrative Sign-In
- `/admin/super` — University KPI Metrics & Operations Dashboard
- `/admin/super/departments` — Department Management (CRUD, publish/active toggles, assign admins)
- `/admin/super/approvals` — Content Approval Center (Pending revisions, payload diff, approve, reject with notes)
- `/admin/media` — University-wide Media Library and category management
- `/admin/super/users` — Staff & Department Admin Accounts (Create, assign roles/departments)
- `/admin/super/activity-logs` — Immutable Audit Trail of all portal actions
- `/admin/super/settings` — University Variables (Emergency hotline, toll-free, admission emails)

### Department Admin Suite (`/admin/department`)
- `/admin/department` — Department Operational Dashboard
- `/admin/department/profile` — HOD Welcome, Mission/Vision, Contact & Social Links
- `/admin/department/sections` — Visual 8-Layout Custom Page Section Builder & Reordering
- `/admin/department/modules` — Structured Modules (Faculty, Programmes, Labs, Events, Achievements, Publications, Notices, Galleries)
- `/admin/department/submissions` — Revision Tracker & Super Admin Review Feedback
- `/admin/media` — Department Media Library (limited to assigned departments)

---

## 📡 REST API Endpoints Summary

### Public Endpoints (`/api/v1/public`)
- `GET /public/faculties` — List academic faculties with active departments
- `GET /public/departments` — Filterable department catalog (`?faculty_id=X&search=query`)
- `GET /public/departments/{slug}` — Full department profile, custom sections & structured data
- `GET /public/departments/{slug}/faculty` — Active faculty roster
- `GET /public/departments/{slug}/courses` — Programmes & degree offerings
- `GET /public/departments/{slug}/events` — Departmental events
- `GET /public/departments/{slug}/research` — Publications & achievements
- `GET /public/departments/{slug}/notices` — Published notices
- `GET /public/departments/{slug}/gallery` — Media photo gallery
- `GET /public/departments/{slug}/documents` — Published department documents
- `GET /public/departments/{slug}/uploaded-gallery` — Published uploaded photos

### Authentication (`/api/v1/auth`)
- `POST /auth/login` — Issue Sanctum API token
- `POST /auth/logout` — Revoke token
- `POST /auth/register` — Super admin staff account registration

### Administrative Endpoints (`/api/v1/admin`)
- `GET /admin/stats` — University KPIs and metrics
- `GET /admin/departments` — List all departments (including draft/inactive)
- `POST /admin/departments` — Create new department
- `PUT /admin/departments/{id}` — Update department meta
- `POST /admin/departments/{id}/assign-admin` — Assign department admin
- `GET /admin/section-layouts` — List available layout types & JSON schemas
- `POST /admin/departments/{id}/sections` — Create custom section draft
- `POST /admin/sections/{id}/submit` — Submit section for Super Admin approval
- `GET /admin/revisions` — List pending/approved/rejected revisions
- `POST /admin/revisions/{id}/approve` — Approve revision
- `POST /admin/revisions/{id}/reject` — Reject revision with feedback comments
- `POST /admin/revisions/{id}/publish` — Publish approved revision live
- `GET /admin/departments/{id}/faculty` — CRUD endpoints for faculty members
- `GET /admin/departments/{id}/programmes` — CRUD endpoints for programmes
- `GET /admin/departments/{id}/laboratories` — CRUD endpoints for laboratories
- `GET /admin/departments/{id}/events` — CRUD endpoints for events
- `GET /admin/departments/{id}/achievements` — CRUD endpoints for achievements
- `GET /admin/departments/{id}/publications` — CRUD endpoints for publications
- `GET /admin/departments/{id}/notices` — CRUD endpoints for notices
- `GET /admin/departments/{id}/galleries` — CRUD endpoints for galleries
- `GET /admin/activity-logs` — System audit logs
- `GET /admin/settings` — University settings & contact info
- `GET /admin/media` — Department-scoped media library with filters
- `POST /admin/departments/{id}/media` — Upload a document or image using multipart form data
- `POST /admin/media/{id}/replace` — Submit a replacement file without changing the current published version
- `DELETE /admin/media/{id}` — Request media deletion approval
- `GET /admin/media/pending` — Super Admin media review queue
- `POST /admin/media/{id}/approve|reject|publish` — Review and publish media
- `GET|POST /admin/media/categories` — View categories or create a category (Super Admin)

---

## 🛠️ Testing & Verification

1. **Frontend Production Build:**
   ```bash
   cd frontend
   npm run build
   ```
   *Confirmed: 1,674 modules built with 0 errors.*

2. **Backend Route Verification:**
   ```bash
   cd backend
   php artisan route:list --path=api
   ```
   *Confirmed: 75 routes operational.*

3. **Database & Seeder Verification:**
   ```bash
   cd backend
   php artisan migrate:status
   ```
   *Confirmed: All 15 migrations executed.*

---

## 📄 License & Attribution

Designed and developed for **Akal University** ([auts.ac.in](https://auts.ac.in/)). All institutional branding, emblems, and visual specifications are property of Akal University. Source code distributed under the MIT License.
