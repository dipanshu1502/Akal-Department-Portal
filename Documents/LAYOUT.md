# Akal University -- University-Matched Website Layout Specification

**File:** `LAYOUT.md`\
**Version:** 1.0\
**Purpose:** Public-facing layout specification for the Akal University
Dynamic Department Portal\
**Reference:** https://auts.ac.in/\
**Frontend:** React.js + Vite\
**Backend:** Laravel 12 REST API\
**Database:** MySQL

------------------------------------------------------------------------

## 1. Objective

Create a public Department Portal that looks like a natural extension of
the official Akal University website.

The portal must preserve the university's recognizable visual identity
and navigation experience while providing a dedicated, modern interface
for department information.

This document defines the **public website layout** only. Super Admin
and Department Admin dashboard layouts are specified separately in
`DESIGN.md`.

### Important implementation constraint

The existing university website source code and internal design system
have not been supplied. Therefore:

-   Use the publicly visible website as a visual reference.
-   Do not claim pixel-perfect reproduction.
-   Do not copy inaccessible source code or assume its CMS/theme.
-   Keep the header and footer as replaceable React components.
-   Before production integration, request the official logo files,
    approved fonts, header/footer requirements, and any brand guidelines
    from the university IT/web team.

------------------------------------------------------------------------

## 2. Visual direction

The public portal should feel:

-   Institutional and academic.
-   Clean, professional, and trustworthy.
-   Consistent with the official Akal University website.
-   Content-focused, not overly decorative.
-   Responsive across desktop, tablet, and mobile.

Use the university's known brand colours as the starting palette:

  -----------------------------------------------------------------------
  Colour                  Hex                     Usage
  ----------------------- ----------------------- -----------------------
  Akal Yellow             `#F9B900`               Small highlights,
                                                  active indicators,
                                                  selected accents

  Akal Blue               `#087BB5`               Links, primary buttons,
                                                  interactive elements

  Dark Navy               `#172333`               Main headings, dark
                                                  text, footer accents

  White                   `#FFFFFF`               Main page background

  Light Grey              `#F5F7FA`               Alternate section
                                                  backgrounds

  Border Grey             `#E3E8EF`               Borders and separators

  Body Grey               `#475467`               Paragraph text
  -----------------------------------------------------------------------

**Colour rule:** use white as the dominant background, blue for
important interactions, navy for headings, and yellow as a restrained
accent. Do not make every section yellow or blue.

------------------------------------------------------------------------

## 3. Global page structure

Every public page should use the same shared layout:

``` text
┌──────────────────────────────────────────────────────────────┐
│ Optional top information strip                               │
├──────────────────────────────────────────────────────────────┤
│ University logo / name                 Utility links (if used)│
├──────────────────────────────────────────────────────────────┤
│ Main university navigation                                  │
├──────────────────────────────────────────────────────────────┤
│ Breadcrumb                                                   │
├──────────────────────────────────────────────────────────────┤
│ Page-specific content                                        │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ University footer                                            │
└──────────────────────────────────────────────────────────────┘
```

The final top strip, utility links, navigation labels, and footer
columns must be checked against the live official site and approved by
the university. Avoid inventing university contact details or
institutional links.

### Shared React components

-   `UniversityTopbar`
-   `UniversityHeader`
-   `UniversityNavigation`
-   `MobileNavigation`
-   `PageBreadcrumb`
-   `PublicPageContainer`
-   `UniversityFooter`

All pages must reuse these components so that the visual identity
remains consistent.

------------------------------------------------------------------------

## 4. Header and navigation

### 4.1 Desktop header

Proposed structure:

-   Official Akal University logo on the left.
-   University name/tagline only if present in the approved brand
    assets.
-   Utility links or contact shortcuts only if confirmed from the
    official site.
-   Main navigation in the same visual hierarchy as the official
    website.

The header must not be redesigned as a generic software-product navbar.
It should look like a university institutional website header.

### 4.2 Navigation integration

The Department Portal should be discoverable through the existing
**Academics** navigation area.

Proposed navigation behaviour:

-   Keep the university's existing main navigation labels and order
    wherever possible.
-   Add or link to **Departments** under Academics, according to the
    website team's preference.
-   Highlight Academics/Departments when the visitor is within the
    department portal.
-   Do not duplicate the complete university navigation in a visually
    different style.

### 4.3 Mobile header

-   Show the official logo at a suitable size.
-   Use an accessible menu button.
-   Open navigation in a drawer or dropdown consistent with the site's
    mobile behaviour.
-   Keep the Departments link easy to find.
-   Close the menu after navigation.
-   Support keyboard focus and Escape to close.

------------------------------------------------------------------------

## 5. Department listing page

**Route:** `/departments`

### 5.1 Page hierarchy

``` text
University Header
    ↓
Breadcrumb: Home / Academics / Departments
    ↓
Department Page Title
    ↓
Introductory description
    ↓
Search and Faculty Filter
    ↓
Faculty Group
    ├── Department Card
    ├── Department Card
    └── Department Card
    ↓
Next Faculty Group
    ├── Department Card
    └── Department Card
    ↓
University Footer
```

### 5.2 Page title area

Use a simple academic page heading rather than a large marketing-style
landing hero.

Suggested content:

**Heading:** Academic Departments

**Introductory text:** Explore the academic faculties and departments of
Akal University.

Use a subtle light background or a restrained university-branded banner
only if this is consistent with the official site's existing inner
pages.

### 5.3 Search and filter area

Place the search and filter controls above the department groups.

Controls:

-   Search by department name.
-   Faculty/category dropdown.
-   Clear filters action.

Behaviour:

-   Search results update without a full page reload.
-   Filters can be combined.
-   Empty results show a clear message and reset option.
-   Controls must be usable on mobile.

### 5.4 Faculty group heading

Each faculty group should have:

-   Faculty/category name.
-   Optional short description.
-   Thin divider or restrained brand-colour accent.
-   Department cards underneath.

Use the actual approved university faculty/category names from the
official source or data provided by the university. Do not hard-code
example categories as the definitive list.

### 5.5 Department cards

Recommended card layout:

``` text
┌──────────────────────────────────────┐
│                                      │
│          Department Image            │
│                                      │
├──────────────────────────────────────┤
│ Department Name                      │
│ Faculty / Category                   │
│ Short department description         │
│                                      │
│ Explore Department  →                │
└──────────────────────────────────────┘
```

Card rules:

-   Consistent image ratio: 16:9.
-   Same card padding and heading alignment.
-   White background with a subtle border.
-   Small shadow only on hover, if needed.
-   Blue link or button.
-   Yellow hover/active accent, used sparingly.
-   Entire card may be clickable, but retain a visible text link for
    clarity.

### 5.6 Listing data

Cards must be generated from the public departments API. Only active
departments with published public content should appear.

The Super Admin controls:

-   Department name.
-   Slug.
-   Faculty/category.
-   Short description.
-   Card image.
-   Display order.
-   Publication status.

------------------------------------------------------------------------

## 6. Individual department page

**Route:** `/departments/:slug`

All department pages must use a single reusable React layout. The
department slug determines which published content is loaded.

### 6.1 Page structure

``` text
University Header
    ↓
Breadcrumb: Home / Academics / Departments / Department
    ↓
Department Banner / Title
    ↓
Department Quick Navigation (optional)
    ↓
About Department
    ↓
Vision and Mission
    ↓
Head of Department
    ↓
Faculty Members
    ↓
Academic Programmes
    ↓
Laboratories and Facilities
    ↓
Research and Publications
    ↓
Events and Activities
    ↓
Achievements
    ↓
Gallery
    ↓
Notices
    ↓
Department Contact Information
    ↓
University Footer
```

Only enabled sections with published content should render. The order
must come from the department's approved section configuration.

### 6.2 Department title/banner

Use a restrained banner that feels consistent with the university's
inner pages.

Content:

-   Faculty/category label.
-   Department name.
-   Short tagline or approved description.
-   Optional department banner photograph.

Design:

-   Prefer a wide image with a readable navy/blue overlay if text is
    placed on top.
-   Use white text only where contrast is sufficient.
-   If no banner image exists, use a clean white/light-grey title area
    with a navy heading and blue/yellow accent.
-   Avoid oversized, full-screen hero sections that feel unrelated to
    the university's existing website.

### 6.3 Quick navigation

An optional horizontal section navigation can link to:

-   Overview
-   HOD
-   Faculty
-   Programmes
-   Research
-   Events
-   Gallery
-   Notices

Desktop: horizontal links below the department title.

Mobile: horizontally scrollable links or a compact section selector.

Only show links for sections that are enabled and published.

### 6.4 Content section layout

Use a consistent pattern:

-   Section heading in dark navy.
-   Small blue or yellow accent line, if appropriate.
-   Body content in a readable column.
-   Light-grey background for selected alternating sections only.
-   White cards for profiles and structured content.

Do not put every section inside a separate heavy bordered box. Use
spacing, headings, and subtle separators to establish hierarchy.

### 6.5 HOD section

Desktop:

-   Portrait on one side.
-   Name, designation, and message on the other side.

Mobile:

-   Portrait followed by the HOD's details and message.

Hide the section when no approved HOD information exists.

### 6.6 Faculty section

-   Responsive card grid.
-   Consistent portrait ratio (3:4).
-   Name and designation.
-   Optional qualification/specialization.
-   Official email only where approved for public display.

Suggested columns:

-   Desktop: 3 or 4.
-   Tablet: 2.
-   Mobile: 1 or 2 depending on available width.

### 6.7 Academic programmes

Use simple programme cards or a structured table depending on the amount
of information.

Each programme may show:

-   Programme name.
-   Level.
-   Duration.
-   Short description.
-   Eligibility/curriculum link, if provided.

Do not display empty fields.

### 6.8 Research, events and achievements

Use restrained academic content cards.

Each item may contain:

-   Title.
-   Date/year.
-   Short summary.
-   Approved image.
-   Supporting document or external link.

Use consistent card styles across all departments.

### 6.9 Gallery

-   Responsive image grid.
-   Consistent spacing.
-   Optional album categories.
-   Accessible image descriptions.
-   Optimized thumbnails.
-   Open larger images in an accessible lightbox, if implemented.

### 6.10 Notices

Use a clean list layout with:

-   Notice title.
-   Date.
-   Optional category/priority.
-   Document link.

Avoid oversized announcement banners for ordinary notices.

------------------------------------------------------------------------

## 7. Footer

Use the same footer structure and visual language as the official
university website, after checking and confirming its actual contents.

Possible content areas, subject to official confirmation:

-   University identity/logo.
-   Official address.
-   Contact information.
-   Quick links.
-   Academic links.
-   Social media links.
-   Copyright statement.

Do not invent phone numbers, email addresses, postal addresses, or
social media URLs. Use only verified information supplied by the
university or displayed on its official website.

The footer should use the approved university dark/navy treatment if
that matches the current site.

------------------------------------------------------------------------

## 8. Layout measurements and responsive behaviour

Suggested starting values; adjust after comparing with the official
site.

  Property                             Desktop      Tablet     Mobile
  -------------------------- ----------------- ----------- ----------
  Main container                  1200--1280px       Fluid      Fluid
  Side gutter                             32px        24px       16px
  Section vertical spacing            56--72px    44--56px   32--40px
  Department card columns                 3--4           2          1
  Faculty card columns                    3--4           2       1--2
  Header                       Full navigation     Compact     Drawer
  Footer                          Multi-column   2 columns    Stacked

Avoid horizontal overflow at all supported viewport widths.

------------------------------------------------------------------------

## 9. Interaction and state requirements

Every public page must include:

-   Loading state while data is fetched.
-   Clear error state if the API fails.
-   Not-found state for unknown department slugs.
-   Empty state for departments with no optional content.
-   Fallback for missing images.
-   Accessible focus and hover states.
-   Functional breadcrumbs.
-   Working search and filters.
-   Correct links for notices and documents.

Public pages must never display:

-   Draft content.
-   Pending revisions.
-   Rejected revisions.
-   Inactive departments.
-   Disabled sections.
-   Private administrative information.

The public API must enforce these rules; hiding content only in React is
not sufficient.

------------------------------------------------------------------------

## 10. React component layout

Suggested public components:

``` text
src/
├── components/
│   └── public/
│       ├── UniversityTopbar.jsx
│       ├── UniversityHeader.jsx
│       ├── UniversityNavigation.jsx
│       ├── MobileNavigation.jsx
│       ├── UniversityFooter.jsx
│       ├── PageBreadcrumb.jsx
│       ├── DepartmentCard.jsx
│       ├── FacultyGroup.jsx
│       ├── DepartmentHero.jsx
│       ├── DepartmentQuickNav.jsx
│       ├── DepartmentSectionRenderer.jsx
│       ├── FacultyCard.jsx
│       ├── ProgrammeCard.jsx
│       ├── EventCard.jsx
│       ├── NoticeList.jsx
│       └── GalleryGrid.jsx
│
├── layouts/
│   └── PublicLayout.jsx
│
├── pages/
│   └── public/
│       ├── DepartmentsPage.jsx
│       └── DepartmentDetailPage.jsx
│
├── services/
│   └── publicDepartmentApi.js
│
└── styles/
    ├── tokens.css
    ├── public-layout.css
    └── departments.css
```

### Public routes

``` jsx
<Route element={<PublicLayout />}>
  <Route path="/departments" element={<DepartmentsPage />} />
  <Route
    path="/departments/:slug"
    element={<DepartmentDetailPage />}
  />
</Route>
```

------------------------------------------------------------------------

## 11. Design tokens starter CSS

These tokens are a starting point and should be refined after checking
the live website's exact typography, widths, and spacing.

``` css
:root {
  --akal-yellow: #F9B900;
  --akal-blue: #087BB5;
  --akal-navy: #172333;

  --color-white: #FFFFFF;
  --color-page: #FFFFFF;
  --color-section: #F5F7FA;
  --color-border: #E3E8EF;
  --color-text: #344054;
  --color-muted: #667085;

  --font-primary: Inter, Arial, Helvetica, sans-serif;

  --container-width: 1240px;
  --page-gutter: 32px;

  --radius-card: 10px;
  --radius-control: 6px;

  --shadow-card: 0 2px 10px rgba(23, 35, 51, 0.06);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-page);
  color: var(--color-text);
  font-family: var(--font-primary);
}

.container {
  width: min(
    calc(100% - 2 * var(--page-gutter)),
    var(--container-width)
  );
  margin-inline: auto;
}

@media (max-width: 767px) {
  :root {
    --page-gutter: 16px;
  }
}
```

------------------------------------------------------------------------

## 12. Data-driven page rendering

The department page must not contain hard-coded department-specific
content.

Expected rendering flow:

1.  Visitor opens `/departments/computer-science`.
2.  React reads the `slug` route parameter.
3.  React requests the public department API.
4.  Laravel finds the department and its current published revision.
5.  Laravel returns the department details and enabled sections in
    display order.
6.  React renders each section using the appropriate reusable component.
7.  Missing optional sections are omitted.
8.  Unknown or unpublished departments return an appropriate not-found
    response.

Example response shape (illustrative):

``` json
{
  "department": {
    "name": "Computer Science and Engineering",
    "slug": "computer-science",
    "faculty": "Engineering and Technology"
  },
  "sections": [
    {
      "type": "about",
      "title": "About the Department",
      "display_order": 1,
      "content": {}
    },
    {
      "type": "faculty",
      "title": "Our Faculty",
      "display_order": 2,
      "content": {}
    }
  ]
}
```

The actual API response contract must be finalized with the backend
implementation.

------------------------------------------------------------------------

## 13. Final visual QA checklist

Before accepting the public layout, verify:

-   [ ] Header resembles the official Akal University website.
-   [ ] Official logo and approved assets are used.
-   [ ] Navigation labels and hierarchy are confirmed.
-   [ ] Academics/Departments navigation works.
-   [ ] Breadcrumbs are consistent.
-   [ ] Department listing groups are clear.
-   [ ] Department cards have consistent sizing.
-   [ ] Individual department pages share one template.
-   [ ] Section order follows approved configuration.
-   [ ] Unpublished content is never visible.
-   [ ] Footer uses verified official information.
-   [ ] Desktop, tablet, and mobile layouts work.
-   [ ] Keyboard navigation and focus states work.
-   [ ] Images have suitable fallbacks and alt text.
-   [ ] Loading, empty, error, and not-found states are present.
-   [ ] No sample data or placeholder contact details remain in
    production.

------------------------------------------------------------------------

## 14. Final layout decision

The Department Portal will use a **university-matched institutional
layout**, not a generic SaaS or commercial landing-page design.

The public interface will share the university's visual language,
navigation hierarchy, restrained use of brand colours, academic content
presentation, and footer style.

The department listing and individual department pages will be
data-driven and generated through reusable React components. The same
layout will support every department, while Super Admin-controlled
configuration determines which sections appear and in what order.

The final pixel-level match must be validated against the current
official website and approved university assets before deployment.
