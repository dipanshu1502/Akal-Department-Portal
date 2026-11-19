# Custom Section Layout Builder
## Functional Design & Implementation Specification

**Project:** Akal University – Dynamic Department Management Portal  
**Version:** 1.0  
**Date:** November 2026  
**Frontend:** React.js + Vite  
**Backend:** Laravel 12 REST API  
**Database:** MySQL  
**Authentication:** Laravel Sanctum

---

## 1. Purpose

This document defines the Custom Section Layout Builder for the Akal University Dynamic Department Management Portal.

The feature will allow authorised Department Admins to create and arrange additional content sections on their department pages by selecting predefined visual layouts, entering content, uploading media and previewing the result—without writing code.

The feature will use reusable React components and structured content stored in MySQL. All changes will follow the mandatory Super Admin review and publication workflow.

## 2. Objectives

- Allow department teams to create additional sections without developer involvement.
- Offer a controlled library of consistent, responsive, university-branded layouts.
- Support text, images, cards, statistics, timelines, banners, galleries and similar content.
- Allow admins to preview, reorder, enable, disable and edit sections.
- Preserve the currently published page while new changes are awaiting approval.
- Keep the public-facing design consistent across all department pages.

## 3. User Roles and Permissions

| Role | Permissions | Restrictions |
|---|---|---|
| Department Admin | Create sections; choose layouts; edit content; upload images; reorder sections; preview; submit changes for review. | Can manage only assigned departments; cannot publish directly. |
| Super Admin | Review, approve, reject and publish changes; manage layout availability; manage departments and assignments. | All actions should be recorded in the activity log. |
| Public Visitor | View published sections and their content. | Cannot access drafts, pending submissions or admin controls. |

## 4. Section Layout Library

When an admin selects **Add New Section**, the system will display a visual layout gallery. Each option will show a small preview, a layout name and a short description. The admin selects a layout and then fills in the fields supported by that layout.

| Layout | Purpose and supported content |
|---|---|
| **Text Content** | Heading, rich-text body and optional subheading. Suitable for department information, objectives and descriptions. |
| **Image + Text** | Image on one side and text on the other. The image position can be left or right. |
| **Card Grid** | A collection of cards with image/icon, title, short description and optional link. Supports configurable columns such as 2, 3 or 4, subject to responsive limits. |
| **Timeline** | Chronological list of milestones, events or achievements, with dates and descriptions. |
| **Banner / Highlight** | Full-width highlighted area with heading, supporting text, optional background image and call-to-action link. |
| **Statistics** | Key figures such as student count, faculty count, projects, publications or achievements. |
| **Gallery** | A responsive image gallery with captions and alternative text. |
| **Accordion / FAQ** | Expandable question-and-answer items for frequently asked questions or grouped information. |

## 5. Admin Workflow

1. **Open Page Builder:** Department Admin opens the assigned department dashboard and selects Page Builder / Manage Sections.
2. **Add Section:** Admin clicks Add New Section and enters a section title or selects a suggested section category.
3. **Choose Layout:** The layout gallery appears. Admin selects a predefined layout, such as Card Grid or Image + Text.
4. **Enter Content:** Admin fills the fields, adds cards/items where applicable, uploads approved media and configures available display options.
5. **Arrange and Configure:** Admin reorders sections, changes permitted settings, and enables or disables sections.
6. **Preview:** The system displays a preview using the same reusable components and styles as the public page.
7. **Submit for Approval:** Admin submits the complete page/section change. The submitted revision becomes read-only for that submission or is versioned for further edits.
8. **Review and Publish:** Super Admin reviews the change, approves or rejects it with feedback, and controls publication. Only the published revision appears publicly.

## 6. Editing and Display Controls

| Control | Expected behaviour |
|---|---|
| Section title and subtitle | Edit text fields and optional supporting copy. |
| Content items | Add, edit, remove and reorder cards, timeline entries, FAQs or statistics. |
| Media | Upload images, replace images, add captions and alternative text. |
| Layout settings | Select only the options supported by the chosen layout, such as image position or card columns. |
| Appearance | Choose from approved background, spacing and accent presets aligned with university branding. |
| Visibility | Enable or disable a section in the proposed revision. The change becomes public only after approval and publication. |
| Preview | Preview desktop, tablet and mobile presentation before submitting. |

## 7. Example: Research Highlights Section

A Department Admin wants to add a **Research Highlights** section. The admin chooses Card Grid, selects three columns, enters the section heading, and adds cards such as:

- Artificial Intelligence Research
- Publications
- Student Projects

Each card may contain an image, title, short description and an optional approved link. The admin previews the section and submits it. After Super Admin approval and publication, the section is rendered on the public department page.

## 8. Technical Design

### 8.1 Frontend Components (React.js)

Suggested component structure:

```text
SectionRenderer/
├── SectionLayoutGallery.jsx
├── SectionEditor.jsx
├── SectionRenderer.jsx
├── SectionReorderManager.jsx
├── SectionPreview.jsx
└── layouts/
    ├── TextSection.jsx
    ├── ImageTextSection.jsx
    ├── CardGridSection.jsx
    ├── TimelineSection.jsx
    ├── BannerSection.jsx
    ├── StatisticsSection.jsx
    ├── GallerySection.jsx
    └── AccordionSection.jsx
```

**Component responsibilities:**

- `SectionLayoutGallery.jsx` – displays available layout choices and previews.
- `SectionEditor.jsx` – provides a form for the selected layout.
- `SectionRenderer.jsx` – selects and renders the correct component from a trusted layout identifier.
- Layout components – render each supported section type.
- `SectionReorderManager.jsx` – handles ordering of sections.
- `SectionPreview.jsx` – previews the proposed page revision.

### 8.2 Rendering Logic

The backend returns a published section record containing a trusted `layout_type` and structured content. React's `SectionRenderer` maps that identifier to a predefined component. The system must not interpret database content as executable JavaScript or arbitrary HTML.

```jsx
// Illustrative React rendering logic
const layoutMap = {
  text: TextSection,
  image_text: ImageTextSection,
  card_grid: CardGridSection,
  timeline: TimelineSection,
  banner: BannerSection,
  statistics: StatisticsSection,
  gallery: GallerySection,
  accordion: AccordionSection,
};

function SectionRenderer({ section }) {
  const Component = layoutMap[section.layout_type];

  if (!Component) return null;

  return <Component section={section} />;
}
```

### 8.3 Example Structured Section Data

```json
{
  "title": "Research Highlights",
  "layout_type": "card_grid",
  "settings": {
    "columns": 3,
    "background": "white"
  },
  "content": [
    {
      "title": "Artificial Intelligence Research",
      "description": "Research activities in AI and data science.",
      "image": "media/research-ai.jpg",
      "link": null,
      "alt_text": "Research team working in a laboratory"
    }
  ]
}
```

## 9. Suggested Database Design

| Table | Purpose |
|---|---|
| `section_types` | Stores the approved layout/type registry: key, name, description, schema/configuration and active status. |
| `department_sections` | Stores section identity and department association: `department_id`, `section_type_id` or `layout_type`, title, sort order and enabled status. |
| `content_revisions` | Stores versioned section/page configuration and structured JSON payload, submitter, status, reviewer, review notes and timestamps. |
| `media` | Stores uploaded file path, original name, MIME type, size, alt text, uploader and ownership/department reference. |
| `activity_logs` | Records section creation, edits, submissions, approvals, rejections, publication and deletion requests. |

**Important implementation note:** The data model should distinguish the working draft/submitted revision from the currently published revision. Section order, enabled/disabled state and deletion requests must also be versioned or included in the page revision so the public page does not change before approval.

## 10. Approval and Versioning Rules

- Department Admin changes are saved as drafts until submitted.
- A submitted revision is reviewed by a Super Admin.
- Super Admin may approve or reject the revision and must be able to provide review comments.
- Approval does not silently overwrite the live page; publication is a distinct controlled action if that is the university's chosen workflow.
- The last published revision remains visible while a new revision is pending or rejected.
- A deletion or disable action is treated as a content change and requires approval before it affects the public page.
- All review and publication actions are recorded with actor and timestamps.

## 11. Security and Content Restrictions

- Enforce department-level permissions in Laravel policies/middleware and API queries; do not rely only on hiding frontend buttons.
- Validate all submitted fields and JSON structures against the selected layout's schema.
- Allow only approved file types and enforce upload size limits; store uploads safely and validate file contents.
- Do not allow arbitrary HTML, JavaScript, iframe or script injection from department admins.
- Sanitize any rich text using a maintained allowlist-based sanitizer.
- Use Laravel Sanctum authentication and role-based authorization for protected endpoints.
- Public endpoints must return published content only; draft and pending revisions must never be exposed.
- Log important actions and protect administrative routes against unauthorised access.

## 12. Suggested API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/admin/departments/{department}/sections` | List sections for an assigned department. |
| GET | `/api/admin/section-layouts` | List active layout choices and their supported configuration. |
| POST | `/api/admin/departments/{department}/sections` | Create a draft section. |
| PUT | `/api/admin/sections/{section}` | Update a draft section. |
| POST | `/api/admin/sections/{section}/submit` | Submit a revision for review. |
| POST | `/api/admin/departments/{department}/sections/reorder` | Save proposed section order in a revision. |
| GET | `/api/admin/revisions/{revision}` | View a submitted revision. |
| POST | `/api/super-admin/revisions/{revision}/approve` | Approve a revision. |
| POST | `/api/super-admin/revisions/{revision}/reject` | Reject a revision with comments. |
| POST | `/api/super-admin/revisions/{revision}/publish` | Publish an approved revision. |
| GET | `/api/public/departments/{slug}` | Fetch public department data and published sections only. |

These endpoints are a suggested API contract and should be finalised alongside the Laravel routes, policies and database migrations.

## 13. Non-Functional Requirements

- **Responsive:** Layouts must work on desktop, tablet and mobile.
- **Consistency:** All layouts must follow the Akal University visual identity and approved design tokens.
- **Accessibility:** Provide keyboard-accessible controls, visible focus states, semantic headings and image alternative text.
- **Performance:** Optimise images, lazy-load non-critical media and avoid unnecessary rendering.
- **Maintainability:** Use reusable components and a controlled layout registry.
- **Reliability:** Retain published versions and support safe recovery from rejected or failed revisions.

## 14. Recommended Visual Design Rules

The public page should retain the university's approved visual identity:

- Akal Yellow: `#F9B900`
- Akal Blue: `#087BB5`
- Dark Navy: `#172333`
- White backgrounds

Layout choices should be polished but restrained, with consistent typography, spacing, card borders and image ratios. Admin-only builder screens may use a more utility-focused interface, while the public preview must resemble the actual department page.

## 15. Development Phases

1. **Phase 1 – Layout registry:** Define approved layout types, field schemas and design tokens.
2. **Phase 2 – React components:** Build reusable responsive components for each supported layout.
3. **Phase 3 – Admin builder:** Build layout gallery, editor forms, media upload, reorder controls and preview.
4. **Phase 4 – Laravel APIs and database:** Implement section storage, validation, permissions, revisions and media handling.
5. **Phase 5 – Approval workflow:** Implement Super Admin review, feedback, approval and publication.
6. **Phase 6 – Testing and integration:** Test role access, responsive display, version preservation, security and university website integration.

## 16. Acceptance Criteria

- Department Admin can add a section by selecting a predefined layout without writing code.
- The editor displays only fields supported by the selected layout.
- Admin can add, edit, remove and reorder supported content items.
- Admin can preview the proposed result at common screen sizes.
- Admin can submit changes for Super Admin review.
- Pending or rejected changes do not alter the public page.
- Only published revisions are returned by public APIs.
- A Department Admin cannot modify another department's content.
- The system rejects unsupported layout identifiers, unsafe content and invalid uploads.
- Section and page configuration changes are traceable through revision history and activity logs.

## 17. Final Recommendation

Implement a controlled drag-and-drop Page Builder with a predefined layout library. Department Admins should have enough flexibility to create useful department-specific content, while the university retains control over visual consistency, security and publication.

Start with the eight layouts described in this document; add more only when a genuine department requirement is identified.

---

**End of Document**
