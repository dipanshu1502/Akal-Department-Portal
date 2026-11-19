# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

# Akal University – Dynamic Department Management Portal

**Project Name:** Akal University Department Management Portal  
**Project Type:** Dynamic Content Management System (CMS)  
**Version:** 1.0  
**Document Status:** Initial Finalized Specification  
**Frontend:** React.js  
**Backend:** Laravel 12  
**Database:** MySQL  
**Authentication:** Laravel Sanctum  
**Deployment:** Independent Application with Future University Website Integration

---

# 1. Introduction

## 1.1 Purpose

The purpose of this project is to develop a Dynamic Department Management Portal for Akal University, Talwandi Sabo.

The system will provide a centralized platform where the university can create, manage, update, and publish individual department pages through an administrative dashboard.

The portal will be developed as an independent application using React.js, Laravel, and MySQL. It will later be integrated into the official Akal University website.

The system will follow a reusable department page design. Instead of developing separate frontend pages for every department, a single dynamic layout will display department-specific information retrieved from the database.

A Super Admin will have complete control over the system and will be responsible for creating departments, assigning Department Admins, managing content, and approving publication requests.

Department Admins will be able to manage the information and content of their assigned departments.

## 1.2 Project Objectives

The primary objectives are:

1. To develop a centralized Department Management System for Akal University.
2. To provide a dynamic department page creation facility.
3. To implement Super Admin and Department Admin roles.
4. To allow Super Admins to create departments without programming knowledge.
5. To assign individual administrators to different departments.
6. To provide a reusable and university-branded department page layout.
7. To allow Department Admins to manage their department information.
8. To implement a content approval and publishing workflow.
9. To maintain proper security and access control.
10. To reduce dependency on developers for routine website content updates.

## 1.3 Scope of the Project

The system will contain three major components:

**A. Public Department Portal**
- Department listing.
- Faculty-wise department categorization.
- Individual department pages.
- Faculty profiles.
- Courses and academic programmes.
- Research and publications.
- Events and achievements.
- Gallery and notices.

**B. Super Admin Panel**
- Centralized dashboard.
- Department creation and management.
- Department Admin assignment.
- Content approval.
- User management.
- Website-wide settings.
- Activity monitoring.

**C. Department Admin Panel**
- Department dashboard.
- Department profile management.
- Faculty management.
- Courses management.
- Events and achievements.
- Research and publications.
- Gallery management.
- Notices and announcements.
- Content submission for approval.

---

# 2. Overall System Description

## 2.1 Product Perspective

The Akal University Department Management Portal will operate as an independent web application.

It will communicate with a Laravel REST API and use MySQL for storing all department information.

The existing university website source code will not be required during the initial development phase.

The application will be designed to support future integration with the official website:

https://auts.ac.in/

The university's existing visual identity will be followed, including its navigation style, colours, typography, and general website appearance, based on available visual references.

## 2.2 Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Backend | Laravel 12 |
| Database | MySQL 8 |
| API Architecture | REST API |
| Authentication | Laravel Sanctum |
| UI Framework | Bootstrap 5 |
| Icons | Bootstrap Icons / Lucide |
| HTTP Client | Axios |
| Backend Validation | Laravel Form Requests |
| Version Control | Git and GitHub |
| Deployment | University-approved Web Server |

## 2.3 System Architecture

The application will follow a three-tier architecture.

**Presentation Layer**
- Public React website.
- Super Admin dashboard.
- Department Admin dashboard.

**Application Layer**
- Laravel REST API.
- Authentication and authorization.
- Business logic.
- Content management.
- Approval and publishing workflow.

**Data Layer**
- MySQL database.
- User information.
- Department information.
- Content revisions.
- Media records.
- Activity logs.

---

# 3. User Roles and Permissions

The system will support two primary administrative roles.

## 3.1 Super Admin

The Super Admin will have complete access to the system.

Responsibilities:

- Access the Super Admin dashboard.
- Create, update, activate, deactivate, and archive departments.
- Assign administrators to departments.
- Remove or reassign Department Admins.
- View all department information.
- Manage all department content.
- Approve or reject submitted content.
- Publish approved department content.
- Manage website-wide settings.
- View activity logs.
- Manage administrative accounts.

## 3.2 Department Admin

A Department Admin will have access only to the department or departments assigned to their account.

Responsibilities:

- Access the Department Admin dashboard.
- Manage department profile information.
- Update department descriptions.
- Manage HOD information.
- Add, update, and remove faculty records.
- Manage academic programmes.
- Add laboratories and facilities.
- Manage research publications.
- Create department events.
- Add student and faculty achievements.
- Upload gallery images.
- Publish notices through the approval workflow.
- Submit changes for Super Admin approval.
- View submission and approval status.

Department Admins must not access or modify information belonging to departments that have not been assigned to them.

## 3.3 Public Visitors

Public visitors will not require authentication.

They will be able to:

- View all published departments.
- Search and filter departments.
- View department profiles.
- View faculty details.
- Explore academic programmes.
- Read department notices.
- View events and achievements.
- Access research and gallery information.

## 3.4 Role-Permission Matrix

| Functionality | Super Admin | Department Admin | Public |
|---|---|---|---|
| View departments | Yes | Assigned only | Published only |
| Create department | Yes | No | No |
| Edit department details | All | Assigned only | No |
| Assign admins | Yes | No | No |
| Manage faculty | All | Assigned only | View |
| Manage courses | All | Assigned only | View |
| Manage events | All | Assigned only | View |
| Manage gallery | All | Assigned only | View |
| Submit content | Yes | Yes | No |
| Approve content | Yes | No | No |
| Publish content | Yes | No | No |
| View activity logs | All | Own department activities | No |
| Manage system settings | Yes | No | No |

---

# 4. Functional Requirements

## 4.1 Authentication Module

The system shall provide secure login functionality.

Features:

- Email and password authentication.
- Secure password hashing.
- Laravel Sanctum token authentication.
- Logout functionality.
- Password reset.
- Role-based redirection.
- Session and token management.
- Account activation and deactivation.

After login, users will be redirected according to their assigned roles.

## 4.2 Super Admin Dashboard

The Super Admin dashboard will provide a centralized overview of the complete system.

Dashboard statistics:

- Total departments.
- Active departments.
- Inactive departments.
- Total Department Admins.
- Total faculty members.
- Total academic programmes.
- Pending approval requests.
- Published departments.
- Recent administrative activities.

Dashboard modules:

1. Department Management.
2. Admin Management.
3. Content Approval.
4. Faculty Management.
5. Academic Management.
6. Events Management.
7. Research Management.
8. Gallery Management.
9. Notices Management.
10. Activity Logs.
11. System Settings.

## 4.3 Department Management Module

This module will allow the Super Admin to create and manage departments dynamically.

Department creation fields:

- Department Name.
- Department Slug.
- Faculty / Academic Category.
- Department Code.
- Short Description.
- Full Description.
- Department Banner.
- Department Logo.
- HOD Information.
- Official Email.
- Contact Number.
- Office Location.
- Display Order.
- Department Status.

Features:

- Add new department.
- Edit department information.
- View department details.
- Activate or deactivate departments.
- Archive departments.
- Generate unique department URLs.
- Assign Department Admins.
- Enable or disable department sections.

Example department URLs:

- /departments/computer-science
- /departments/physics
- /departments/chemistry
- /departments/mathematics

The frontend will automatically generate pages using the department slug and stored information.

## 4.4 Department Admin Management

The Super Admin will be able to create or assign administrators to individual departments.

Features:

- Create Department Admin accounts.
- Assign existing users.
- Assign one or more departments to an admin.
- Reassign department ownership.
- Activate or deactivate admin accounts.
- Reset admin passwords.
- View admin activity.
- Remove department assignments.

Each assignment will be maintained in the database.

## 4.5 Dynamic Department Page Management

This is the core feature of the system.

A single reusable React.js page template will be developed for all departments.

Department Admins will manage the content through configurable sections.

Available sections:

1. About Department.
2. Vision and Mission.
3. Head of Department Message.
4. Faculty Members.
5. Academic Programmes.
6. Laboratories and Facilities.
7. Research and Publications.
8. Department Events.
9. Student Achievements.
10. Faculty Achievements.
11. Gallery.
12. Notices and Announcements.
13. Contact Information.

Features:

- Enable or disable sections.
- Update section content.
- Add and remove sections.
- Change section display order.
- Manage section titles.
- Upload relevant images.
- Preview department pages.
- Submit changes for approval.

The system will use structured content and reusable section templates instead of allowing unrestricted HTML or arbitrary code execution.

## 4.6 Faculty Management

Department Admins will manage faculty information.

Fields:

- Faculty Name.
- Profile Photograph.
- Designation.
- Qualification.
- Specialization.
- Experience.
- Official Email.
- Contact Number, where approved.
- Research Interests.
- Biography.
- Publications.
- Display Order.
- Status.

Features:

- Add faculty.
- Edit faculty.
- Delete or archive faculty.
- Upload profile photographs.
- Display faculty profiles publicly after approval.

## 4.7 Academic Programmes Management

This module will manage programmes offered by individual departments.

Fields:

- Programme Name.
- Programme Level.
- Programme Code.
- Duration.
- Eligibility.
- Programme Description.
- Intake Information.
- Syllabus / Curriculum Document.
- Programme Status.

Programme levels may include:

- Undergraduate.
- Postgraduate.
- Doctoral.
- Diploma.
- Certificate.

## 4.8 Laboratories and Facilities Management

Features:

- Add laboratory details.
- Laboratory name.
- Description.
- Facilities available.
- Laboratory photographs.
- Equipment information.
- Display order.
- Active / inactive status.

## 4.9 Events and Activities Management

Features:

- Create department events.
- Add event title and description.
- Set event date.
- Add venue and organizer.
- Upload event posters.
- Add event photographs.
- Maintain past and upcoming events.
- Submit events for approval.

## 4.10 Research and Publications Management

Features:

- Add research publications.
- Publication title.
- Authors.
- Journal / Conference name.
- Publication date.
- DOI or external link.
- Research project details.
- Funding information, where applicable.

## 4.11 Achievements Management

Features:

- Add student achievements.
- Add faculty achievements.
- Add awards and recognitions.
- Add competition details.
- Upload certificates or images.
- Set achievement date.

## 4.12 Gallery Management

Features:

- Upload images.
- Add captions.
- Organize gallery albums.
- Categorize photographs.
- Manage image display order.
- Delete or archive media.
- Optimize images for web display.

## 4.13 Notices and Announcements

Features:

- Create department notices.
- Add notice title.
- Description.
- Publish date.
- Expiry date.
- Upload PDF documents.
- Mark important notices.
- Submit notices for approval.

---

# 5. Content Approval and Publishing Workflow

The system will implement a mandatory Super Admin approval mechanism.

Department Admins will not be able to publish content directly.

## 5.1 Content Submission

When a Department Admin creates or modifies content:

1. The changes will be saved as a draft or pending revision.
2. The admin will preview the updated information.
3. The admin will submit the changes for approval.
4. The system will notify the Super Admin through the dashboard.

## 5.2 Approval Process

The Super Admin will be able to:

- Review submitted content.
- Preview changes.
- Compare the submitted version with the published version.
- Approve submissions.
- Reject submissions.
- Add rejection comments.

## 5.3 Approval Status

| Status | Description |
|---|---|
| Draft | Content is being edited |
| Pending | Submitted for approval |
| Approved | Approved by Super Admin |
| Rejected | Rejected with feedback |
| Published | Visible on the public website |

## 5.4 Publishing Rules

- Only approved content can be published.
- Rejected content will require correction and resubmission.
- Existing published content will remain visible while new revisions are pending.
- Every revision will be recorded.
- The system will maintain information about who submitted and approved each revision.
- The Super Admin will have the ability to publish approved content.

---

# 6. Public Website Requirements

## 6.1 Department Listing Page

The public department page will display all active and published departments.

Features:

- University-style header and navigation.
- Department page title.
- Introductory description.
- Faculty-wise categorization.
- Department cards.
- Department photographs or banners.
- Search functionality.
- Category filters.
- View Department links.

## 6.2 Individual Department Page

Each department will use the same reusable layout.

Page structure:

1. University Header.
2. Breadcrumb Navigation.
3. Department Hero / Banner.
4. Department Introduction.
5. About Department.
6. Vision and Mission.
7. HOD Message.
8. Faculty Members.
9. Academic Programmes.
10. Laboratories and Facilities.
11. Research and Publications.
12. Events and Activities.
13. Achievements.
14. Gallery.
15. Notices.
16. Department Contact Details.
17. University Footer.

Only enabled and published sections will be displayed.

## 6.3 University Design Consistency

The public interface will follow the visual identity of Akal University.

Primary colours:

| Colour | Hex Code |
|---|---|
| Akal Yellow | #F9B900 |
| Akal Blue | #087BB5 |
| Dark Navy | #172333 |
| Background | #FFFFFF |

Design requirements:

- Similar header and navigation appearance.
- Consistent university branding.
- Professional typography.
- Responsive layouts.
- Accessible navigation.
- Consistent footer.
- Optimized images.
- Mobile-friendly department pages.

Since the existing website source code is not available, the initial project will recreate the required visual appearance using available public references. Actual shared header/footer components and final integration will be handled with the university IT team's support.

---

# 7. Database Architecture

The application will use MySQL as its relational database.

## 7.1 Core Database Tables

| Table | Purpose |
|---|---|
| users | Administrative user accounts |
| faculties | Academic faculty categories |
| departments | Department master information |
| department_user | Admin-to-department assignments |
| section_types | Available department section types |
| department_sections | Dynamic department page sections |
| content_revisions | Content approval and version history |
| faculty_members | Faculty records |
| courses | Academic programmes |
| laboratories | Department laboratories |
| events | Department events |
| achievements | Student and faculty achievements |
| publications | Research publications |
| galleries | Gallery records |
| media | Uploaded media files |
| notices | Department notices |
| activity_logs | Administrative activity records |

## 7.2 Important Database Relationships

- One faculty can contain multiple departments.
- One department can have multiple Department Admins.
- One admin can be assigned to multiple departments.
- One department can contain multiple sections.
- One department can have multiple faculty members.
- One department can offer multiple courses.
- One department can organize multiple events.
- One department can maintain multiple publications.
- One department can contain multiple gallery records.
- One content revision belongs to a specific department section.
- Every approval record will identify the responsible reviewer.

## 7.3 Database Design Principles

- Primary and foreign keys.
- Referential integrity.
- Proper indexing.
- Unique department slugs.
- Soft deletion where appropriate.
- Created and updated timestamps.
- JSON fields for structured dynamic section content.
- Versioned content revisions.
- Separate media metadata and physical file storage.

---

# 8. API Architecture

The backend will expose RESTful APIs for communication with the React frontend.

Base API URL:

`/api/v1`

## 8.1 Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /auth/login | User login |
| POST | /auth/logout | Logout |
| GET | /auth/me | Current user |
| POST | /auth/forgot-password | Password reset request |
| POST | /auth/reset-password | Reset password |

## 8.2 Super Admin APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /admin/dashboard | Dashboard statistics |
| GET | /admin/departments | List departments |
| POST | /admin/departments | Create department |
| GET | /admin/departments/{id} | View department |
| PUT | /admin/departments/{id} | Update department |
| DELETE | /admin/departments/{id} | Archive department |
| POST | /admin/departments/{id}/assign-admin | Assign admin |
| GET | /admin/users | Manage users |
| GET | /admin/approvals | Pending approvals |
| POST | /admin/revisions/{id}/approve | Approve content |
| POST | /admin/revisions/{id}/reject | Reject content |
| POST | /admin/revisions/{id}/publish | Publish approved revision |

## 8.3 Department Admin APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /department/dashboard | Dashboard |
| GET | /department/profile | Department details |
| PUT | /department/profile | Update profile |
| GET | /department/sections | List sections |
| POST | /department/sections | Create section |
| PUT | /department/sections/{id} | Update section |
| POST | /department/sections/{id}/submit | Submit for approval |
| GET | /department/faculty | Faculty list |
| POST | /department/faculty | Add faculty |
| PUT | /department/faculty/{id} | Update faculty |
| GET | /department/courses | Course list |
| POST | /department/events | Create event |
| POST | /department/notices | Create notice |

All department-specific APIs must verify the authenticated user's department assignments.

## 8.4 Public APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /public/departments | Published departments |
| GET | /public/departments/{slug} | Department details |
| GET | /public/departments/{slug}/faculty | Faculty |
| GET | /public/departments/{slug}/courses | Academic programmes |
| GET | /public/departments/{slug}/events | Events |
| GET | /public/departments/{slug}/research | Publications |
| GET | /public/departments/{slug}/gallery | Gallery |
| GET | /public/departments/{slug}/notices | Notices |

Public APIs must only return published and publicly visible information.

---

# 9. Non-Functional Requirements

## 9.1 Performance

- Public pages should load efficiently.
- API responses should be optimized.
- Database queries should use appropriate indexes.
- Images should be compressed and optimized.
- Pagination should be implemented for large datasets.
- Frequently accessed public content may use caching.

## 9.2 Security

- Passwords must be securely hashed.
- Authentication must use Laravel Sanctum.
- Role-based authorization must be enforced on the backend.
- Department ownership must be checked on every protected request.
- Uploaded files must be validated.
- File types and file sizes must be restricted.
- SQL injection must be prevented through secure ORM/query practices.
- CSRF, XSS and other common web vulnerabilities must be addressed.
- Administrative actions must be logged.
- Production must use HTTPS.
- Secrets must be stored outside source control.

## 9.3 Usability

- Simple administrative interface.
- Consistent navigation.
- Responsive dashboard.
- Clear form validation.
- Search and filtering.
- User-friendly approval notifications.
- Easy content management without programming knowledge.

## 9.4 Compatibility

The system should support:

- Google Chrome.
- Microsoft Edge.
- Mozilla Firefox.
- Safari.
- Android browsers.
- iOS browsers.

## 9.5 Maintainability

- Modular React components.
- Laravel MVC architecture.
- Reusable service classes.
- Database migrations.
- API versioning.
- Proper documentation.
- Git-based source control.

## 9.6 Scalability

The application should be designed to support the addition of new departments, administrators, faculty members, events, and content without requiring separate frontend implementations.

The deployment environment must be sized and load-tested according to actual traffic expectations.

---

# 10. User Interface Requirements

## 10.1 Public Interface

Pages:

- Departments Home.
- Department Details.
- Faculty Profiles.
- Academic Programmes.
- Events.
- Research.
- Achievements.
- Gallery.
- Notices.

## 10.2 Super Admin Interface

Pages:

- Admin Login.
- Dashboard.
- Departments List.
- Add Department.
- Edit Department.
- Department Details.
- Admin Management.
- Assign Admin.
- Pending Approvals.
- Revision Details.
- Faculty Overview.
- Activity Logs.
- Website Settings.

## 10.3 Department Admin Interface

Pages:

- Admin Login.
- Dashboard.
- Department Profile.
- Page Sections.
- Faculty Management.
- Courses Management.
- Laboratory Management.
- Events Management.
- Achievements Management.
- Research Management.
- Gallery Management.
- Notices Management.
- Content Preview.
- Submission History.

---

# 11. Deployment and Integration Requirements

## 11.1 Independent Deployment

Initially, the application will be deployed independently.

Proposed structure:

- Public Portal: `departments.example-domain`
- Admin Panel: `departments.example-domain/admin`
- API: `departments-api.example-domain/api/v1`

These are illustrative addresses. Final domain configuration will depend on university infrastructure.

## 11.2 University Website Integration

After successful development and testing, the university IT team can integrate the portal into:

`https://auts.ac.in/departments`

Integration requirements:

- Configure domain routing or reverse proxy.
- Configure the appropriate hosting environment.
- Integrate the public department link into the Academics menu.
- Match the existing website header and footer.
- Configure HTTPS and security policies.
- Configure production API endpoints.
- Configure database and media storage.
- Test all public and administrative functions.

The application will be delivered independently with its complete source code and deployment documentation.

---

# 12. Testing Requirements

The following testing activities will be performed:

## 12.1 Functional Testing

- User login and logout.
- Department creation.
- Department Admin assignment.
- Faculty management.
- Dynamic section management.
- Content submission.
- Approval and rejection.
- Publishing.
- Public department page display.

## 12.2 Authorization Testing

- Super Admin global access.
- Department Admin restricted access.
- Prevention of unauthorized department updates.
- Prevention of unauthorized approval actions.
- Public access restrictions for unpublished content.

## 12.3 Integration Testing

- React and Laravel API integration.
- Database operations.
- File uploads.
- Authentication tokens.
- Content revision workflow.

## 12.4 Responsive Testing

- Desktop.
- Laptop.
- Tablet.
- Mobile.

---

# 13. Development Roadmap

| Phase | Development Activities |
|---|---|
| Phase 1 | Requirements, SRS and UI/UX design |
| Phase 2 | Project setup and database architecture |
| Phase 3 | Laravel backend and authentication |
| Phase 4 | Super Admin dashboard |
| Phase 5 | Department creation and admin assignment |
| Phase 6 | Dynamic department page builder |
| Phase 7 | Department Admin dashboard |
| Phase 8 | Content approval and publishing |
| Phase 9 | Public React website |
| Phase 10 | API integration and testing |
| Phase 11 | Deployment and university integration |
| Phase 12 | Documentation and final handover |

---

# 14. Expected Deliverables

At the completion of the project, the following deliverables will be provided:

1. Complete React.js frontend source code.
2. Complete Laravel backend source code.
3. MySQL database schema and SQL export.
4. Super Admin dashboard.
5. Department Admin dashboard.
6. Dynamic department page system.
7. Content approval and publishing workflow.
8. API documentation.
9. Database documentation.
10. Installation and deployment guide.
11. User and administrator guide.
12. Testing documentation.
13. Source code repository.
14. Final project handover package.

---

# 15. Future Enhancements

The system may be extended in future with:

- Multi-language department pages.
- Advanced SEO management.
- Department-specific analytics.
- Website-wide search.
- Automated email notifications.
- Integration with university ERP.
- Faculty profile integration.
- Alumni and student project showcases.
- Advanced media management.
- Scheduled content publishing.
- More granular administrative permissions.

---

# 16. Conclusion

The Akal University Dynamic Department Management Portal will provide a centralized, secure, and scalable platform for managing all university department pages.

Its reusable page architecture will eliminate the need to develop separate frontend pages for individual departments.

The Super Admin will have complete control over department creation, administrator assignment, and content approval, while Department Admins will manage the information of their assigned departments.

By combining React.js, Laravel, and MySQL, the system will provide a maintainable solution that can initially operate independently and later be integrated into the official Akal University website.

**End of Software Requirements Specification (SRS)**