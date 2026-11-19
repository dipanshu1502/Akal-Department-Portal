# Akal University – Multi-Department Website Management System
## Functional Scope & Website Customization Specification

**Project Name:** Akal Department Portal  
**System Type:** Multi-Department Dynamic Website Management System (CMS)  
**Institution:** Akal University, Talwandi Sabo, Punjab, India  
**Version:** 1.0  
**Date:** November 2026

**Technology Stack:** React.js + Vite, Laravel 12 REST API, MySQL, Laravel Sanctum, Bootstrap 5.

---

## 1. Project Overview

The Akal Department Portal will provide a centralized system to create, manage and maintain the websites of all academic departments of Akal University.

Instead of developing a separate application for every department, the university will use one common codebase and shared website management system. Each department will have its own public-facing website, department-specific content and authorized Department Admin accounts.

All department websites will follow a common university design system and shared layout structure. Department Admins will be able to make selected changes through an administrative dashboard without writing code.

New departments should be addable through the Super Admin Dashboard, with their public website generated dynamically.

## 2. Main Objectives

- Provide a centralized platform for all university department websites.
- Use one reusable application and common website template.
- Maintain consistent Akal University branding.
- Allow each department to manage its own content independently.
- Provide controlled website customization through the admin dashboard.
- Allow Super Admin to create departments and assign Department Admins.
- Support mandatory content review and publishing.
- Reduce developer involvement in routine content and layout changes.
- Support future departments without creating separate applications.

## 3. Overall System Architecture

The system contains three main parts:

1. **Public Department Websites** – separate public pages for each department.
2. **Super Admin Dashboard** – central management of departments, users, settings and approvals.
3. **Department Admin Dashboard** – department-specific content and permitted website customization.

All parts use the same Laravel backend and MySQL database. React renders each department website dynamically using its department identifier or URL slug.

```text
                    AKAL UNIVERSITY
                           |
                 Akal Department Portal
                           |
                 Laravel REST API
                           |
                    MySQL Database
                           |
        +------------------+------------------+
        |                  |                  |
  Public Websites    Super Admin       Department Admin
        |              Dashboard          Dashboard
        |                  |                  |
   CSE Website         Manage All       Manage Assigned
   Physics Website    Departments       Department Content
   Chemistry Website  Users & Roles      Website Settings
   Other Websites     Approvals          Submit for Approval
```

## 4. Multi-Department Website Structure

Every department will have its own public website route, generated dynamically.

Illustrative routes:

```text
/departments/cse
/departments/physics
/departments/chemistry
/departments/mathematics
/departments/commerce
/departments/management
```

The final URL structure may be adjusted during university website integration.

Each department website will have:
- A common university header and navigation style.
- Department-specific name and approved identity assets.
- Department-specific banner or homepage slider.
- Department-specific content and sections.
- Permitted department-level navigation items.
- Common university footer structure with department contact details where appropriate.

Department names and page content must be fetched from the backend, not hardcoded in React components.

## 5. Common Design and Department-Level Customization

The platform will use a shared design system. Department Admins will receive controlled customization options so each department can reflect its activities without breaking university-wide design consistency.

### 5.1 Common Elements Controlled Centrally

These elements should normally be controlled by the Super Admin or central university configuration:

- University logo and official identity.
- Core university brand colours.
- Common header and footer structure.
- Global typography and design tokens.
- Common navigation conventions.
- Approved layout components.
- Security and accessibility rules.

### 5.2 Department-Level Customization

Department Admins may manage the following items for their assigned department:

| Feature | Department Admin Capability |
|---|---|
| Department name and introduction | Edit, subject to approval |
| Department logo or approved mark | Upload or replace, subject to approval |
| Homepage banner or slider | Add, edit, remove and reorder |
| Department images | Upload and manage |
| About section | Edit content |
| HOD information | Add and update |
| Faculty and staff | Add, edit and request deletion |
| Courses and programmes | Add, edit and manage |
| Laboratories and facilities | Add and update |
| Research and publications | Add and update |
| Events and activities | Add and update |
| Achievements | Add and update |
| Notices and announcements | Add and update |
| Gallery | Add, edit, remove and reorder images |
| Section visibility | Enable or disable in a proposed revision |
| Section order | Reorder using drag-and-drop |
| Section layout | Select from approved layout options |
| Menu items | Manage permitted department-level menu items |
| Contact information | Edit department contact details |
| Footer department details | Edit permitted department-specific details |
| Background and accent presets | Select from approved options |

All changes must follow the configured approval and publishing process. The Super Admin should be able to configure permissions for individual customization features.

### 5.3 Restricted Customization

Department Admins must not be allowed to:
- Replace or remove official university identity without authorization.
- Change global brand colours or global typography.
- Edit shared header/footer code.
- Add arbitrary JavaScript, CSS, scripts or unsafe HTML.
- Install plugins or modify application code.
- Publish changes directly when approval is mandatory.

This keeps department websites consistent, secure and maintainable.

## 6. Public Department Website Content

The shared website template should support the following common sections. The Super Admin may configure which section types are available, and each Department Admin can manage content permitted for their department.

### 6.1 Common Website Sections

1. Home
2. About the Department
3. Vision and Mission
4. Head of Department (HOD) Message
5. Faculty and Staff
6. Courses and Programmes
7. Laboratories and Infrastructure
8. Research and Publications
9. Projects and Innovations
10. Student Achievements
11. Placements and Internships
12. Events and Activities
13. Workshops and Seminars
14. Notices and Announcements
15. Student Clubs and Societies
16. Photo Gallery
17. Department Committees
18. Contact Information

The final list can be adjusted according to university requirements and individual department needs.

### 6.2 Department-Specific Sections

Departments may need content that is not relevant to every other department. Examples:

- **CSE:** Coding clubs, software projects, hackathons and technical events.
- **Physics:** Research facilities, instruments, seminars and laboratory activities.
- **Chemistry:** Laboratories, research areas and practical facilities.
- **Commerce:** Industry interaction, finance activities and professional workshops.

Such content can be added using the Custom Section Layout Builder, provided the required layout is enabled by the Super Admin.

## 7. Admin Interfaces and Responsibilities

### 7.1 Super Admin Dashboard

The Super Admin has centralized control over the portal.

Features:
- Dashboard with university-wide statistics.
- Create, edit, activate and deactivate departments.
- Generate department website routes using unique slugs.
- Assign one or more Department Admins to departments.
- Manage users and roles.
- Configure common website settings.
- Manage approved layout types and section templates.
- Review department content submissions.
- Approve or reject submissions with comments.
- Publish approved revisions.
- Manage global navigation and shared design settings.
- View activity logs and revision history.
- Manage media rules and upload restrictions.

### 7.2 Department Admin Dashboard

A Department Admin may be assigned to one or more departments. The dashboard must show only departments assigned to that user.

Features:
- View department-specific dashboard statistics.
- Update department profile and permitted website settings.
- Manage HOD, faculty and staff information.
- Manage programmes and courses.
- Manage laboratories and facilities.
- Manage research, publications and projects.
- Manage events, achievements and notices.
- Manage galleries and department images.
- Add and configure custom website sections.
- Reorder sections and permitted menu items.
- Preview the website on desktop, tablet and mobile.
- Save drafts and submit changes for approval.
- View review status and Super Admin feedback.

Department-level access must be enforced by the Laravel backend, not only by hiding dashboard controls.

## 8. Dynamic Website Customization Workflow

A Department Admin should be able to customize the department website through a guided dashboard interface:

1. Log in to the Department Admin Dashboard.
2. Select an assigned department.
3. Open **Website Settings** or **Page Builder**.
4. Select the item to customize, such as banner, section, menu or contact information.
5. Edit content or choose approved layout and appearance options.
6. Preview the proposed changes.
7. Save as draft or submit for approval.
8. Super Admin reviews the submission.
9. Super Admin approves or rejects it with feedback.
10. An approved revision is published by the Super Admin.
11. The public department website displays the published version.

The currently published website must remain unchanged while a new revision is pending or rejected.

## 9. Custom Section Layout Builder

The Custom Section Layout Builder will allow Department Admins to create department-specific sections without writing code.

Initial layout library:

| Layout | Description |
|---|---|
| Text Content | Heading, subheading and formatted text. |
| Image + Text | Image beside a text block, with permitted image positioning. |
| Card Grid | Cards containing image or icon, title, description and optional link. |
| Timeline | Chronological milestones, events or achievements. |
| Banner / Highlight | Full-width highlighted content with optional image and call-to-action. |
| Statistics | Key figures and achievement metrics. |
| Gallery | Responsive image collection with captions and alternative text. |
| Accordion / FAQ | Expandable question-and-answer items. |

Admin controls:
- Add and edit sections.
- Select a predefined layout.
- Add, edit, remove and reorder content items.
- Upload images and enter alternative text.
- Select approved background and appearance presets.
- Enable or disable a section in a proposed revision.
- Reorder complete sections using drag-and-drop.
- Preview responsive layouts.
- Submit changes for approval.

React should render sections through reusable components selected by a trusted `layout_type`. The application must not execute arbitrary code stored in the database.

## 10. Approval and Publishing Workflow

All department website changes must follow the mandatory approval workflow.

```text
Department Admin
       |
 Create / Edit Content
       |
    Save Draft
       |
 Submit for Approval
       |
 Super Admin Review
       |
   +---+---+
   |       |
Approve  Reject
   |       |
Publish  Feedback to Admin
   |
Public Website Updated
```

Rules:
- Department Admins cannot publish directly.
- Submitted revisions retain submitter and submission timestamp.
- Super Admins can approve or reject with comments.
- Approval and publication should be separately tracked.
- The last published version remains visible until a new version is published.
- Deletion, section visibility and section ordering changes must also be versioned and approved.
- Keep revision history and activity logs.

## 11. Suggested Technical Architecture

### 11.1 Frontend

Use React.js with Vite.

```text
frontend/src/
├── components/
│   ├── common/
│   ├── public/
│   ├── department/
│   ├── admin/
│   └── page-builder/
├── layouts/
│   ├── PublicLayout.jsx
│   ├── SuperAdminLayout.jsx
│   └── DepartmentAdminLayout.jsx
├── pages/
│   ├── public/
│   ├── superadmin/
│   └── department-admin/
├── services/
├── context/
├── hooks/
├── routes/
├── assets/
└── App.jsx
```

Use reusable public website components so the same template can render different department data.

### 11.2 Backend

Use Laravel 12 as a REST API backend.

```text
backend/app/
├── Models/
├── Http/
│   ├── Controllers/Api/
│   ├── Requests/
│   └── Middleware/
├── Policies/
├── Services/
└── Support/
```

Use Laravel policies and middleware to enforce role and department-level permissions.

### 11.3 Database

Use MySQL with Laravel migrations and Eloquent ORM.

| Table | Purpose |
|---|---|
| users | User accounts and authentication details. |
| roles or role field | Super Admin and Department Admin role management. |
| faculties | University faculty or school groupings. |
| departments | Department identity, name, slug and status. |
| department_user | Many-to-many assignment of Department Admins to departments. |
| department_settings | Department-specific permitted website settings. |
| department_sections | Section identity, department association and ordering references. |
| section_types | Registry of approved section layouts. |
| content_revisions | Draft, submitted, approved, rejected and published revision records. |
| faculty_members | Department faculty and staff information. |
| programmes | Courses and academic programmes. |
| laboratories | Labs and facilities. |
| events | Department events and activities. |
| achievements | Student and department achievements. |
| publications | Research publications and related details. |
| notices | Department notices and announcements. |
| media | Uploaded images and files with metadata. |
| activity_logs | Audit trail of important actions. |
| system_settings | Central university-level settings. |

The final schema should be designed from the complete SRS. Avoid duplicate or overlapping tables. Model published content separately from working drafts so pending changes cannot affect the live website.

## 12. Suggested API Groups

These are illustrative endpoint names; final request and response structures should be defined during implementation.

### Public APIs
- `GET /api/public/departments`
- `GET /api/public/departments/{slug}`
- `GET /api/public/departments/{slug}/sections`

### Super Admin APIs
- `GET /api/super-admin/dashboard`
- `GET /api/super-admin/departments`
- `POST /api/super-admin/departments`
- `PUT /api/super-admin/departments/{id}`
- `POST /api/super-admin/departments/{id}/admins`
- `GET /api/super-admin/revisions`
- `POST /api/super-admin/revisions/{id}/approve`
- `POST /api/super-admin/revisions/{id}/reject`
- `POST /api/super-admin/revisions/{id}/publish`

### Department Admin APIs
- `GET /api/admin/my-departments`
- `GET /api/admin/departments/{id}/settings`
- `PUT /api/admin/departments/{id}/settings`
- `GET /api/admin/departments/{id}/sections`
- `POST /api/admin/departments/{id}/sections`
- `PUT /api/admin/sections/{id}`
- `POST /api/admin/sections/{id}/submit`
- `POST /api/admin/departments/{id}/media`

## 13. Design System and Branding

All department websites should follow the university's approved identity.

| Design Token | Value |
|---|---|
| Akal Yellow | `#F9B900` |
| Akal Blue | `#087BB5` |
| Dark Navy | `#172333` |
| Base background | `#FFFFFF` |

Design principles:
- Clean and professional academic appearance.
- Consistent header and footer structure.
- Shared typography, spacing and component styles.
- Responsive layouts for desktop, tablet and mobile.
- Department-specific content and approved visual accents.
- Accessible colour contrast, keyboard navigation and image alternative text.

Department-level customization must use approved options. Global design tokens should remain under central control.

## 14. Security and Access Control

- Use Laravel Sanctum for authenticated API access.
- Enforce role-based and department-level authorization on the backend.
- Ensure a Department Admin can access only assigned departments.
- Validate all content and uploaded files.
- Restrict accepted file types and file sizes.
- Sanitize rich text using an allowlist-based approach.
- Do not allow arbitrary JavaScript, CSS or executable HTML.
- Ensure public APIs return published content only.
- Keep drafts and pending revisions private.
- Record important administrative actions in activity logs.
- Store credentials and environment-specific configuration in environment variables.

## 15. Non-Functional Requirements

- **Scalability:** Add departments without creating separate applications.
- **Maintainability:** Use shared components and a modular backend.
- **Performance:** Optimise images and load non-critical content efficiently.
- **Responsiveness:** Support common desktop, tablet and mobile screen sizes.
- **Accessibility:** Use semantic structure, keyboard-accessible controls and alternative text.
- **Reliability:** Preserve published versions and revision history.
- **Security:** Enforce backend authorization and safe content handling.
- **Usability:** Allow routine content updates without developer involvement.

## 16. Development Phases

1. **Requirements and Architecture:** Review project documents and finalize system architecture.
2. **Database Design:** Prepare ER diagram, migrations, relationships and seed data.
3. **Authentication and Permissions:** Implement Sanctum, roles and department assignments.
4. **Super Admin Dashboard:** Build department, user, settings and approval management.
5. **Department Admin Dashboard:** Build department content and website settings management.
6. **Dynamic Website Engine:** Build shared templates and slug-based department rendering.
7. **Page Builder:** Build layout gallery, editors, media upload, reordering and preview.
8. **Approval Workflow:** Implement revision history, review feedback and controlled publishing.
9. **Testing:** Test permissions, public visibility, responsive layouts and content workflows.
10. **Deployment and Integration:** Prepare production configuration and coordinate integration with the university IT team.

## 17. Acceptance Criteria

- Super Admin can create a department and assign one or more Department Admins.
- A public department website is generated using the shared template and department slug.
- Different departments display their own database-driven content.
- Department Admins can manage only their assigned departments.
- Department Admins can customize permitted website settings without coding.
- Admins can add, edit, reorder, enable and disable supported sections.
- Admins can preview changes before submission.
- All changes follow the approval and publication workflow.
- Pending or rejected revisions do not alter the live website.
- Public APIs expose published content only.
- Core university branding remains centrally controlled.
- Another department can be added without developing a separate website application.

## 18. Final Recommendation

Develop the Akal Department Portal as a **multi-department CMS with one shared website engine and controlled department-level customization**.

Every department should receive:
- Its own public website route.
- Its own content and media.
- Its own assigned Department Admins.
- Its own configurable sections and selected appearance options.

The university should retain control over core branding, shared layouts, security and publication.

This approach will allow Akal University to manage all department websites through one centralized platform while giving each department enough flexibility to maintain its own identity and academic information.

---

**End of Document**
