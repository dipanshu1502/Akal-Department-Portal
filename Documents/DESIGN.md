# Akal University -- Dynamic Department Portal

## UI/UX Design Specification

**Document:** `DESIGN.md`\
**Version:** 1.0\
**Status:** Design Baseline\
**Project:** Akal University Department Management Portal\
**Frontend:** React.js + Vite\
**Backend:** Laravel 12 REST API\
**Database:** MySQL\
**Reference Website:** https://auts.ac.in/

------------------------------------------------------------------------

## 1. Design Vision

The Akal University Department Portal will be a reusable, dynamic
content management platform that presents every university department
through one consistent public-facing design.

The portal must look and feel like a natural extension of the official
Akal University website. It should use the university's visual identity,
familiar navigation patterns, professional academic imagery, clear
typography, and a clean white layout.

The system will have three interfaces:

1.  **Public Website** -- visitors browse published departments and
    their information.
2.  **Super Admin Dashboard** -- the central administrator creates
    departments, assigns Department Admins, manages all content, and
    approves submissions.
3.  **Department Admin Dashboard** -- each Department Admin manages the
    content of their assigned department and submits changes for
    approval.

The design must be responsive, accessible, easy to maintain, and
suitable for future integration into `auts.ac.in`.

> The existing university website source code is not available to this
> project. Therefore, the first version will recreate the visual
> language using publicly visible references. Exact header, footer,
> fonts, spacing, and integration details should be confirmed with the
> university IT team before production integration.

------------------------------------------------------------------------

## 2. Design Principles

-   **University consistency:** public pages should visually match the
    official university website.
-   **Reusable templates:** all departments use the same React page
    template.
-   **Dynamic content:** department information comes from Laravel APIs
    and MySQL.
-   **Administrative simplicity:** non-technical users can manage
    content without editing code.
-   **Approval before publication:** Department Admin changes remain
    unpublished until approved by Super Admin.
-   **Clear hierarchy:** important academic information should be easy
    to find.
-   **Responsive by default:** layouts must work on desktop, tablet, and
    mobile.
-   **Accessible UI:** readable contrast, keyboard navigation, visible
    focus states, and meaningful image alternatives.

------------------------------------------------------------------------

## 3. Brand and Visual System

### 3.1 Core colours

  -----------------------------------------------------------------------
  Token                   Hex                     Intended use
  ----------------------- ----------------------- -----------------------
  Akal Yellow             `#F9B900`               Highlights, selected
                                                  states, small accents
                                                  and primary
                                                  call-to-action emphasis

  Akal Blue               `#087BB5`               Links, primary actions,
                                                  interactive elements

  Dark Navy               `#172333`               Main headings, dark
                                                  surfaces, footer and
                                                  navigation accents

  White                   `#FFFFFF`               Main page background
                                                  and cards

  Light Grey              `#F5F7FA`               Section backgrounds and
                                                  dashboard canvas

  Border Grey             `#E3E8EF`               Dividers, inputs and
                                                  card borders

  Body Text               `#344054`               Paragraph text

  Muted Text              `#667085`               Supporting labels and
                                                  metadata

  Success                 `#16803C`               Approved, published and
                                                  successful states

  Warning                 `#B7791F`               Pending review and
                                                  draft warnings

  Danger                  `#C62828`               Rejected, destructive
                                                  and error states
  -----------------------------------------------------------------------

Use yellow sparingly. Large yellow backgrounds should be avoided unless
the official website uses them in that context. Blue and navy should
carry most of the interface structure.

### 3.2 Typography

Use a clean sans-serif family. Preferred implementation:

-   Primary: `Inter`, if approved and available.
-   Fallback: `Arial`, `Helvetica`, sans-serif.

Suggested scale:

  Element                 Desktop size Weight
  --------------------- -------------- --------
  Public hero heading         40--48px 700
  Page heading                32--38px 700
  Section heading             24--30px 650
  Card heading                18--20px 600
  Body                            16px 400
  Supporting text                 14px 400
  Labels                      12--13px 500

On mobile, reduce large headings while preserving hierarchy and line
spacing.

### 3.3 Layout and spacing

-   Use a centered content container with a maximum width around
    1200--1280px.
-   Use consistent horizontal gutters: 24--32px desktop, 16--20px
    mobile.
-   Use a spacing scale based on 4px or 8px increments.
-   Public content sections should have generous vertical spacing.
-   Cards should use subtle borders and restrained shadows.
-   Avoid excessive gradients, glass effects, heavy animations, and
    unnecessary decoration.

### 3.4 Shape and elevation

-   Buttons: 4--8px radius.
-   Inputs: 6px radius.
-   Cards: 8--12px radius.
-   Dashboard panels: 10--12px radius.
-   Shadows: subtle and used only to distinguish elevated elements.

------------------------------------------------------------------------

## 4. Public Website Design

### 4.1 Public navigation/header

The public header should follow the official Akal University website's
navigation style.

Proposed elements:

-   University logo and name.
-   Main navigation links consistent with the official site.
-   Academics menu containing a Departments link.
-   Responsive mobile navigation.
-   Clear active state for the current section.

The portal should not introduce an unrelated visual identity. The final
header and footer should be aligned with the official website after the
university provides or confirms the approved assets and specifications.

### 4.2 Department listing page

**Route:** `/departments`

Page sections:

1.  University header.
2.  Breadcrumb: Home / Departments.
3.  Hero/banner area.
4.  Page title: "Academic Departments".
5.  Short introductory text.
6.  Search field.
7.  Faculty/category filter.
8.  Faculty-wise department groups.
9.  Department cards.
10. University footer.

#### Department card content

Each card may display:

-   Department image or approved banner thumbnail.
-   Department name.
-   Faculty/category name.
-   Short description.
-   "Explore Department" link.

Cards should use consistent image ratios and heights. The department
name must remain readable on smaller screens.

#### Search and filters

-   Search by department name.
-   Filter by faculty/category.
-   Provide a clear/reset filter action.
-   Show an informative empty state when no results match.
-   Search should be keyboard accessible.

#### Listing behaviour

-   Only active and published departments appear publicly.
-   Departments should be grouped by faculty/category where appropriate.
-   Display order should be controlled by the Super Admin.
-   Pagination or "Load More" may be used if the department count
    becomes large.

### 4.3 Individual department page

**Route pattern:** `/departments/:slug`

All departments use one reusable page template. The API returns the
department's published content and enabled sections.

Proposed page structure:

1.  University header.
2.  Breadcrumb: Home / Departments / Department Name.
3.  Department hero/banner.
4.  Optional department quick-navigation menu.
5.  About Department.
6.  Vision and Mission.
7.  Head of Department message.
8.  Faculty Members.
9.  Academic Programmes.
10. Laboratories and Facilities.
11. Research and Publications.
12. Events and Activities.
13. Student and Faculty Achievements.
14. Gallery.
15. Notices and Announcements.
16. Contact information.
17. University footer.

Only sections that are enabled and have published content should be
displayed. The order should come from the department's saved section
configuration.

### 4.4 Department hero

The hero area should contain:

-   Department name.
-   Faculty/category label.
-   Short tagline or description.
-   Department banner image.
-   Optional call-to-action such as "Explore Programmes".

Use a readable overlay where text appears over an image. Ensure
sufficient text contrast. If no banner is available, use a consistent
branded fallback rather than a broken image.

### 4.5 About, Vision and Mission

Use readable text widths and clear subheadings. Avoid very long
full-width paragraphs. Support lists and approved rich-text formatting.

### 4.6 HOD section

Display:

-   HOD photograph.
-   Name.
-   Designation.
-   Qualification, if provided.
-   Message.
-   Optional official contact information.

If no HOD information is configured, hide the section rather than
showing empty placeholders.

### 4.7 Faculty directory

Faculty cards should display:

-   Profile photograph.
-   Name.
-   Designation.
-   Qualification or specialization, if approved for public display.
-   Official email, if provided.
-   Optional profile detail link.

Provide a faculty detail view only if the university wants individual
profile pages. Otherwise, use a consistent card grid.

### 4.8 Programmes

Programme cards should display:

-   Programme name.
-   Level (UG, PG, Doctoral, Diploma or Certificate).
-   Duration.
-   Short description.
-   Eligibility or curriculum link, where available.

Only approved information should be shown.

### 4.9 Research, events and achievements

Use consistent content cards with:

-   Title.
-   Date or year.
-   Short summary.
-   Image or document, if applicable.
-   Read-more or external link where relevant.

Events may be grouped into upcoming and past events. Do not infer event
status from missing dates.

### 4.10 Gallery and notices

Gallery:

-   Responsive image grid.
-   Album/category grouping where required.
-   Accessible image descriptions.
-   Optimized image delivery.

Notices:

-   Notice title.
-   Publication date.
-   Expiry date, if applicable.
-   Optional PDF/document link.
-   Clear "Important" treatment for priority notices.

Expired notices should follow a university-approved visibility policy.

------------------------------------------------------------------------

## 5. Super Admin Dashboard Design

### 5.1 Overall layout

Use a professional CMS dashboard layout:

-   Fixed or collapsible left sidebar.
-   Top navigation bar.
-   Main content area.
-   Breadcrumbs.
-   Page title and contextual actions.
-   Responsive sidebar drawer on mobile.

The dashboard should use a light background, white cards, navy headings,
blue actions, and yellow accents.

### 5.2 Sidebar navigation

Proposed menu:

1.  Dashboard
2.  Departments
3.  Faculty Categories
4.  Admin Management
5.  Content Approvals
6.  Media Library
7.  Activity Logs
8.  Website Settings
9.  Profile
10. Logout

Menu items should be permission-aware and have clear active states.

### 5.3 Dashboard overview

Summary cards:

-   Total Departments.
-   Active Departments.
-   Published Departments.
-   Department Admins.
-   Pending Approvals.
-   Total Faculty Members.

These are live values from the API, not hard-coded demo numbers.

Additional dashboard areas:

-   Recent department updates.
-   Pending approval queue.
-   Recent admin activity.
-   Quick action: "Add Department".

### 5.4 Department management

Department list table columns:

-   Department name.
-   Faculty/category.
-   Assigned admins.
-   Status.
-   Last updated.
-   Actions.

Actions:

-   View.
-   Edit.
-   Assign Admin.
-   Preview.
-   Activate/deactivate.
-   Archive.

Provide search, category filter, status filter, pagination, and
confirmation for destructive actions.

### 5.5 Add/Edit department form

Suggested fields:

**Basic information** - Department name. - Unique slug. - Department
code. - Faculty/category. - Short description. - Full description.

**Branding** - Department banner. - Department logo or image. - Image
alternative text.

**Contact** - Official email. - Official phone, if approved. -
Office/location details.

**Administration** - Assign one or more Department Admins. - Department
status. - Display order.

**Page configuration** - Select enabled section types. - Set section
order. - Save as draft.

The form should support validation, upload progress, clear error
messages, and a preview action.

### 5.6 Admin management

Admin list should show:

-   Name.
-   Email.
-   Assigned department(s).
-   Account status.
-   Last activity, if available.
-   Actions.

Super Admin actions:

-   Create admin.
-   Assign department(s).
-   Change assignment.
-   Deactivate account.
-   Trigger password reset.

Never display stored passwords. Account invitations or password reset
should use secure flows.

### 5.7 Content approval centre

This is a key Super Admin feature.

Approval list columns:

-   Department.
-   Section/content type.
-   Submitted by.
-   Submission date.
-   Revision status.
-   Actions.

Review screen:

-   Existing published content.
-   Submitted revision.
-   Visual preview.
-   Difference/changed-field summary where feasible.
-   Approve action.
-   Reject action with mandatory feedback.

Approval and publication should be distinct states if the system
requires an additional publishing action. The final workflow must be
consistent throughout the UI.

------------------------------------------------------------------------

## 6. Department Admin Dashboard Design

### 6.1 Overall layout

Use the same dashboard design language as the Super Admin panel, but
show only the assigned department context.

Header should clearly display the active department name. If an admin
has more than one assigned department, provide a department selector
limited to their assignments.

### 6.2 Sidebar navigation

1.  Dashboard
2.  Department Profile
3.  Page Sections
4.  Faculty
5.  Programmes
6.  Laboratories
7.  Research
8.  Events
9.  Achievements
10. Gallery
11. Notices
12. Submission History
13. Profile
14. Logout

### 6.3 Department dashboard

Show:

-   Department name.
-   Published page status.
-   Pending submissions.
-   Draft content count.
-   Faculty count.
-   Programme count.
-   Recent updates.
-   Approval/rejection feedback.
-   Preview public page action.

### 6.4 Content editor

The editor should be structured and form-based. Avoid exposing HTML,
JavaScript, or database fields to administrators.

Common editor controls:

-   Title.
-   Short description.
-   Rich-text description with a restricted formatting toolbar.
-   Image/document upload.
-   Alt text/caption.
-   Display order.
-   Visibility toggle.
-   Save Draft.
-   Preview.
-   Submit for Approval.

### 6.5 Dynamic section manager

Department Admins may manage sections only within the capabilities
allowed by the Super Admin.

Controls:

-   Enable/disable a section.
-   Edit section content.
-   Reorder sections.
-   Preview section.
-   Save draft.
-   Submit for approval.

The available section types should come from the system's section
registry. Do not allow administrators to inject arbitrary executable
code or unrestricted HTML.

------------------------------------------------------------------------

## 7. Approval and Publishing UI

### 7.1 Department Admin flow

1.  Admin edits content.
2.  Admin saves a draft.
3.  Admin previews the draft.
4.  Admin submits it for approval.
5.  The revision status becomes "Pending".
6.  Admin can view submission status and reviewer feedback.

### 7.2 Super Admin flow

1.  Super Admin opens Content Approvals.
2.  Selects a pending submission.
3.  Reviews the proposed changes.
4.  Approves or rejects with feedback.
5.  Approved revision becomes eligible for publication.
6.  Published content becomes visible on the public page.

### 7.3 Status labels

  Status      UI treatment
  ----------- ---------------
  Draft       Neutral grey
  Pending     Amber
  Approved    Blue or green
  Rejected    Red
  Published   Green

Use text labels as well as colour; status must never be communicated by
colour alone.

### 7.4 Revision safety

-   Pending changes must not overwrite the published version.
-   Rejected submissions must retain reviewer feedback.
-   Every revision must record submitter, reviewer, timestamps, and
    decision.
-   The public website must read only the current published version.
-   A rollback mechanism should be considered for restoring a previous
    published revision.

------------------------------------------------------------------------

## 8. Dynamic Section System

The system should support reusable section types, not separate
hard-coded pages per department.

Initial section registry:

  Section type       Example content
  ------------------ ------------------------------------
  About              Description and overview
  Vision & Mission   Vision, mission and objectives
  HOD Message        HOD profile and message
  Faculty            Faculty member records
  Programmes         Academic programme cards
  Laboratories       Facilities and laboratory details
  Research           Publications and projects
  Events             Seminars, workshops and activities
  Achievements       Awards and recognitions
  Gallery            Images and albums
  Notices            Announcements and documents
  Contact            Department contact details

Each department may have a different enabled section set and display
order. The page template remains consistent.

------------------------------------------------------------------------

## 9. Responsive Design Requirements

### Desktop

-   Full university navigation.
-   Multi-column department cards.
-   Full dashboard sidebar.
-   Tables with clear actions.
-   Wide content container.

### Tablet

-   Reduced card columns.
-   Collapsible dashboard sidebar.
-   Simplified navigation.
-   Tables may scroll horizontally or use compact layouts.

### Mobile

-   Mobile navigation drawer.
-   Single-column department cards.
-   Stacked content sections.
-   Dashboard sidebar becomes a drawer.
-   Forms use full-width controls.
-   Buttons have comfortable touch targets.
-   Avoid horizontal overflow.

Suggested breakpoints:

  Device    Width
  --------- ------------------
  Mobile    Up to 767px
  Tablet    768px--1023px
  Desktop   1024px and above

------------------------------------------------------------------------

## 10. Interaction and Component Guidelines

Reusable React components should include:

### Public components

-   `UniversityHeader`
-   `UniversityFooter`
-   `Breadcrumbs`
-   `DepartmentHero`
-   `DepartmentCard`
-   `FacultyCard`
-   `ProgrammeCard`
-   `EventCard`
-   `AchievementCard`
-   `GalleryGrid`
-   `NoticeList`
-   `DepartmentSectionRenderer`

### Admin components

-   `AdminSidebar`
-   `AdminTopbar`
-   `DashboardStatCard`
-   `DataTable`
-   `SearchFilterBar`
-   `FormField`
-   `ImageUploader`
-   `RichTextEditor`
-   `StatusBadge`
-   `ConfirmationDialog`
-   `ApprovalReviewPanel`
-   `SectionManager`
-   `PreviewPanel`

Interaction rules:

-   Show loading indicators during API requests.
-   Show success/error feedback after actions.
-   Disable submit buttons while saving.
-   Confirm archive/delete actions.
-   Preserve form input when validation fails.
-   Use empty states when no records exist.
-   Use skeletons or suitable loading states for public content.
-   Provide accessible labels and keyboard focus.

------------------------------------------------------------------------

## 11. Image and Media Guidelines

-   Use official university assets wherever permission is available.
-   Use approved department photographs and faculty portraits.
-   Do not use unapproved personal photographs.
-   Maintain consistent image ratios.
-   Compress images before delivery.
-   Generate appropriate thumbnail sizes.
-   Store files using safe, non-executable file handling.
-   Validate MIME type, extension, and file size.
-   Keep media metadata in the database and files in managed storage.
-   Provide fallback images for missing optional media.

Suggested ratios:

  Usage               Ratio
  ------------------- ----------------------------------------------
  Department banner   16:5 or 16:6
  Department card     16:9
  Faculty portrait    3:4
  Event thumbnail     16:9
  Gallery             Original ratio with consistent grid cropping

------------------------------------------------------------------------

## 12. Accessibility and Usability

-   Maintain readable text contrast.
-   Use semantic HTML landmarks and headings.
-   Add alternative text to meaningful images.
-   Ensure all controls are keyboard accessible.
-   Provide visible focus indicators.
-   Label all form inputs.
-   Show validation errors in text.
-   Do not rely on colour alone for status.
-   Respect reduced-motion preferences.
-   Ensure menus and dialogs are usable with keyboard and screen
    readers.

------------------------------------------------------------------------

## 13. Public Routes and Admin Routes

### Public routes

  Route                              Screen
  ---------------------------------- ---------------------------
  `/departments`                     Department listing
  `/departments/:slug`               Dynamic department detail
  `/departments/:slug/faculty/:id`   Optional faculty detail
  `/departments/:slug/events`        Optional event listing

### Super Admin routes

  Route                           Screen
  ------------------------------- -----------------------
  `/admin/login`                  Admin login
  `/admin/dashboard`              Super Admin dashboard
  `/admin/departments`            Department management
  `/admin/departments/create`     Add department
  `/admin/departments/:id/edit`   Edit department
  `/admin/users`                  Admin management
  `/admin/approvals`              Approval queue
  `/admin/approvals/:id`          Review submission
  `/admin/media`                  Media library
  `/admin/activity-logs`          Activity history
  `/admin/settings`               Global settings

### Department Admin routes

  Route                       Screen
  --------------------------- ----------------------
  `/department/dashboard`     Department dashboard
  `/department/profile`       Department profile
  `/department/sections`      Section manager
  `/department/faculty`       Faculty management
  `/department/programmes`    Programme management
  `/department/events`        Event management
  `/department/research`      Research management
  `/department/gallery`       Gallery management
  `/department/notices`       Notice management
  `/department/submissions`   Submission history

All protected routes must also be authorized by Laravel. Frontend route
guards are for user experience only and are not a substitute for backend
authorization.

------------------------------------------------------------------------

## 14. Frontend Implementation Structure

Suggested React structure:

``` text
frontend/
└── src/
    ├── assets/
    ├── components/
    │   ├── common/
    │   ├── public/
    │   └── admin/
    ├── layouts/
    │   ├── PublicLayout.jsx
    │   ├── SuperAdminLayout.jsx
    │   └── DepartmentAdminLayout.jsx
    ├── pages/
    │   ├── public/
    │   ├── superadmin/
    │   └── department-admin/
    ├── services/
    │   └── api.js
    ├── hooks/
    ├── context/
    ├── routes/
    ├── utils/
    ├── styles/
    └── App.jsx
```

Recommended frontend dependencies:

-   React
-   Vite
-   React Router
-   Axios
-   Bootstrap 5
-   Bootstrap Icons or Lucide React

Use a consistent component library and avoid duplicating page layout
code.

------------------------------------------------------------------------

## 15. Backend Design Dependencies

The design relies on the following backend capabilities:

-   Public APIs return only published department content.
-   Super Admin APIs support global management.
-   Department Admin APIs enforce department assignments.
-   Dynamic sections are returned in configured display order.
-   Content revisions preserve pending changes separately.
-   Approval actions record reviewer and decision.
-   Media upload APIs validate and store approved file types.
-   API responses provide clear validation and authorization errors.

The UI must never assume that a change is published simply because it
has been saved.

------------------------------------------------------------------------

## 16. Design Acceptance Criteria

The design will be considered ready for implementation when:

-   Public department listing follows the university visual identity.
-   Every department uses the same reusable page template.
-   Department content and sections are data-driven.
-   Disabled or unpublished sections do not appear publicly.
-   Super Admin can access all management screens.
-   Department Admin sees only assigned department data.
-   Department Admin can save drafts and submit changes.
-   Super Admin can review, approve, and reject submissions.
-   Existing published content remains visible while revisions are
    pending.
-   Public, Super Admin, and Department Admin interfaces work on mobile,
    tablet, and desktop.
-   Loading, empty, success, validation, and error states are designed.
-   Final branding assets and integration details are confirmed with the
    university.

------------------------------------------------------------------------

## 17. Recommended Design and Development Order

1.  Confirm the official university logo, header, footer, typography,
    and visual references.
2.  Design the public Department Listing page.
3.  Design the reusable Individual Department page.
4.  Design the Super Admin dashboard.
5.  Design the Department Admin dashboard.
6.  Design Add/Edit Department forms.
7.  Design the Dynamic Section Manager.
8.  Design the Approval and Revision screens.
9.  Create reusable React components and design tokens.
10. Connect the interfaces to Laravel APIs.
11. Test responsive layouts and role-based workflows.
12. Prepare the independent deployment and university integration
    handover.

------------------------------------------------------------------------

## 18. Final Design Decision

The Akal University Department Portal will use a **university-branded
public interface and a modern CMS-style administrative interface**.

The public website will maintain consistency with the official Akal
University website. The administrative dashboards will prioritize
usability and efficient content management.

A single reusable department page template, dynamic section
configuration, department-specific administrator assignments, and
mandatory Super Admin approval will form the foundation of the design.

This document is the baseline for UI/UX implementation. Exact visual
matching and final integration should be validated against approved
university assets and guidance from the university IT team.
