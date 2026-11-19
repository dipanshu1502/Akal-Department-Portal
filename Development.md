# MASTER DEVELOPMENT PROMPT
## Akal Department Portal – Complete Full-Stack Development

Act as a Senior Full-Stack Software Architect and Developer. Your task is to design, develop, test and prepare a complete production-ready web application named **Akal Department Portal – Dynamic Department Management System**.

The application is being developed for Akal University, Talwandi Sabo, Punjab, India.

## 1. FIRST STEP: READ PROJECT DOCUMENTATION

Before writing any code, carefully read and understand all documents available inside the `Documents` folder:

1. `srs.md` – Software Requirements Specification.
2. `DESIGN.md` – Complete UI/UX Design Specification.
3. `LAYOUT.md` – Public Website Layout Specification.
4. `Akal_Department_Portal_Custom_Section_Layout_Builder.md` – Custom Section Layout Builder Specification.

These documents are the primary source of project requirements.

Important:
- Do not skip any document.
- Follow the requirements and design decisions described in these files.
- Do not unnecessarily change the finalized technology stack or project architecture.
- Identify missing requirements and report them before making major architectural decisions.
- Maintain consistency across all modules.

## 2. TECHNOLOGY STACK

Use the following technologies:

**Frontend**
- React.js
- Vite
- Bootstrap 5
- React Router DOM
- Axios
- Lucide React Icons
- Context API for global state management

**Backend**
- Laravel 12
- PHP 8.2+
- Laravel REST API
- Laravel Sanctum Authentication
- Laravel Validation and Authorization

**Database**
- MySQL
- Eloquent ORM
- Laravel Migrations and Seeders

**Development Environment**
- Windows 11
- XAMPP
- Composer
- Node.js and NPM
- VS Code

Keep the frontend and backend independently deployable.

## 3. PROJECT ARCHITECTURE

Use the following structure:

```text
Akal-Department-Portal/
│
├── Documents/
│   ├── srs.md
│   ├── DESIGN.md
│   ├── LAYOUT.md
│   └── Akal_Department_Portal_Custom_Section_Layout_Builder.md
│
├── frontend/
│   └── React + Vite Application
│
├── backend/
│   └── Laravel 12 REST API
│
├── README.md
└── .gitignore
```

Create a clean, modular and scalable architecture.

## 4. THREE MAIN INTERFACES

Develop three separate interfaces.

### A. Public Website

Develop the public-facing department website.

Features:
- University-matched homepage and department navigation.
- Dynamic department listing.
- Department categories and faculties.
- Individual department pages generated dynamically using department slugs.
- Department introduction and overview.
- HOD information.
- Faculty members.
- Courses and programmes.
- Laboratories and facilities.
- Research and publications.
- Achievements.
- Events and activities.
- Notices and announcements.
- Image galleries.
- Custom sections created through the Page Builder.
- Responsive navigation and footer.

All public content must be fetched dynamically through Laravel APIs.

Do not hardcode department information in React components.

### B. Super Admin Dashboard

Develop a complete Super Admin dashboard.

Features:
- Dashboard with statistics.
- Create, edit and manage departments.
- Manage faculty and department categories.
- Assign multiple Department Admins to departments.
- Create and manage user accounts.
- View all departments.
- Review submitted content.
- Approve or reject content with feedback.
- Publish approved content.
- Manage section layouts.
- Manage website settings.
- View activity logs.
- Manage uploaded media.
- Manage department page configurations.

Super Admin must have complete administrative access.

### C. Department Admin Dashboard

Develop a separate dashboard for Department Admins.

Features:
- Dashboard with department statistics.
- Manage assigned department information.
- Manage HOD information.
- Manage faculty members.
- Manage courses and programmes.
- Manage laboratories.
- Manage research and publications.
- Manage events and achievements.
- Manage notices and galleries.
- Create custom sections.
- Edit and delete content through approval workflow.
- Preview department pages.
- Submit changes for Super Admin approval.
- View submission status and review feedback.

A Department Admin must only access their assigned department or departments.

Department Admins must never publish content directly.

## 5. CUSTOM SECTION LAYOUT BUILDER

Implement a visual Page Builder based on the dedicated specification document.

Department Admins should be able to:

- Add new custom sections.
- Enter section titles and descriptions.
- Select predefined layouts from a visual layout gallery.
- Add, edit and remove content items.
- Upload images.
- Change card order.
- Reorder complete sections using drag-and-drop.
- Enable or disable sections.
- Configure approved background and appearance options.
- Preview desktop, tablet and mobile layouts.
- Save drafts.
- Submit changes for approval.

Initially implement these layouts:

1. Text Content
2. Image + Text
3. Card Grid
4. Timeline
5. Banner / Highlight
6. Statistics
7. Gallery
8. Accordion / FAQ

Use reusable React components and a centralized SectionRenderer.

Do not allow arbitrary JavaScript or unsafe HTML injection.

The Page Builder must use structured JSON content stored in MySQL.

## 6. CONTENT APPROVAL WORKFLOW

Implement a mandatory approval workflow.

Workflow:

Department Admin
→ Create or Edit Content
→ Save Draft
→ Submit for Approval
→ Super Admin Review
→ Approve or Reject
→ Publish Approved Revision
→ Public Website Displays Updated Content

Important rules:

- Pending changes must not overwrite published content.
- Existing published content must remain visible until a new version is published.
- Super Admin can provide rejection comments.
- Maintain revision history.
- Deletion requests must also follow approval.
- Section ordering and visibility changes must also follow approval.
- Record reviewer, submitter and timestamps.
- Maintain activity logs.

## 7. DATABASE DESIGN

Design a normalized MySQL database based on the SRS.

Include appropriate tables for:

- users
- roles (if required by the selected role architecture)
- faculties
- departments
- department_user
- department_sections
- section_types
- content_revisions
- media
- faculty_members
- programmes
- laboratories
- events
- achievements
- publications
- galleries
- notices
- activity_logs
- system_settings

You may introduce additional tables when required by the SRS.

Requirements:
- Proper primary and foreign keys.
- Appropriate indexes.
- Unique constraints.
- Timestamps.
- Soft deletes where appropriate.
- Proper relationships.
- JSON columns for structured dynamic section content where suitable.
- Separate published and draft revision handling.

Create Laravel migrations, models, relationships and seeders.

Do not create incomplete or dummy database structures.

## 8. AUTHENTICATION AND SECURITY

Implement Laravel Sanctum authentication.

Features:
- Login and logout.
- User management.
- Role-based access control.
- Department-level authorization.
- Secure API endpoints.
- Request validation.
- Password hashing.
- Secure media upload.
- Protection against unauthorized access.
- Proper CORS configuration.

Backend authorization is mandatory. Hiding frontend buttons is not sufficient.

Public API endpoints must return published content only.

## 9. UI/UX DESIGN REQUIREMENTS

Follow the Akal University branding:

- Akal Yellow: #F9B900
- Akal Blue: #087BB5
- Dark Navy: #172333
- White background.

Design requirements:

- Clean and premium university website appearance.
- Professional academic design.
- Modern typography.
- Proper spacing and alignment.
- Responsive layouts.
- Attractive cards and content sections.
- Consistent headers and footers.
- Clean dashboard sidebars.
- Proper tables and forms.
- Loading states.
- Empty states.
- Error messages.
- Success notifications.
- Confirmation dialogs.

The public website must look like an official university website, not a generic SaaS dashboard.

Use reusable components and shared design tokens.

## 10. DEVELOPMENT APPROACH

Develop the application in the following phases.

**Phase 1 – Project Setup**
- Create React + Vite frontend.
- Create Laravel 12 backend.
- Configure MySQL.
- Configure Sanctum.
- Configure Axios and API communication.
- Set up project structure.

**Phase 2 – Database and Authentication**
- Create migrations.
- Create models and relationships.
- Create seeders.
- Implement login and logout.
- Implement role and department permissions.

**Phase 3 – Super Admin**
- Build dashboard.
- Department management.
- User management.
- Department Admin assignments.
- Approval management.

**Phase 4 – Department Admin**
- Build dashboard.
- Department profile management.
- Faculty, courses and other content modules.
- Content submission workflow.

**Phase 5 – Custom Page Builder**
- Layout gallery.
- Section editor.
- Reusable section components.
- Drag-and-drop ordering.
- Media uploads.
- Responsive preview.
- Revision and approval integration.

**Phase 6 – Public Website**
- Homepage.
- Department directory.
- Dynamic department pages.
- Dynamic content rendering.
- University branding.
- Responsive header and footer.

**Phase 7 – Testing and Optimization**
- Authentication testing.
- Authorization testing.
- API testing.
- CRUD testing.
- Approval workflow testing.
- Responsive testing.
- Security checks.
- Performance optimization.

**Phase 8 – Deployment Preparation**
- Production environment configuration.
- Database setup.
- Build optimization.
- Deployment documentation.
- Environment variable documentation.
- Backup and migration instructions.

## 11. CODING RULES

Follow these rules throughout development:

1. Write clean, readable and maintainable code.
2. Use reusable React components.
3. Use Laravel controllers, models, services and Form Requests appropriately.
4. Keep API responses consistent.
5. Follow REST API conventions.
6. Use proper validation on frontend and backend.
7. Never hardcode database records in frontend.
8. Do not use fake data as actual application data.
9. Avoid unnecessary packages.
10. Do not leave incomplete modules or placeholder buttons.
11. Implement proper loading, error and success states.
12. Keep frontend and backend code separate.
13. Use environment variables for configuration.
14. Write comments where business logic needs explanation.
15. Do not expose secrets or credentials in source code.

## 12. DEVELOPMENT EXECUTION RULES

Do not attempt to generate the entire application in one huge response.

Work phase by phase.

Before starting:
1. Read all documentation.
2. Analyze requirements.
3. Present the final project architecture.
4. Present the database ER structure.
5. Present the implementation roadmap.

Then start implementation.

For every phase:
- Explain what will be developed.
- Create the required files.
- Provide complete working code.
- Mention exact file paths.
- Provide installation and execution commands.
- Explain how to test the completed functionality.
- Fix errors before moving to the next phase.

Do not recreate files unnecessarily or overwrite completed modules.

Maintain a development checklist and update it after completing each phase.

If a requirement is unclear, ask before making a major decision.

## 13. FINAL EXPECTED RESULT

Deliver a complete, functional and scalable Akal Department Portal with:

- Public Department Website.
- Super Admin Dashboard.
- Department Admin Dashboard.
- Dynamic Department Management.
- Custom Section Layout Builder.
- Content Approval and Publishing Workflow.
- MySQL Database.
- Laravel REST API.
- Secure Authentication.
- Responsive University-Branded UI.
- Complete Setup and Deployment Documentation.

The final application should be ready for demonstration to Akal University management and should be structured for future integration with the official university website.

**Start by reading all four documentation files inside the Documents folder. Do not start coding until you have analyzed them and presented the architecture and development plan.**