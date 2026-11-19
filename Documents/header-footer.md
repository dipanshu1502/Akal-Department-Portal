Akal University Official Website – Header, Footer & CSS Recreation Guide
Reference Website: https://auts.ac.in/
Purpose: Development specification for recreating the university-style header, navigation, footer and shared CSS in the Akal Department Portal.
Target Stack: React.js + Vite, Bootstrap 5, plain CSS/CSS modules, React Router
Document Version: 1.0
Prepared: November 2026
1. Purpose and Scope
This document guides the frontend developer in creating reusable React components and CSS that follow the visual structure of the official Akal University website.

The goal is to create a consistent university-style shell for all department websites. The header and footer should be shared components. Department pages should only supply their own page content between these components.

Important: This is a recreation specification based on the publicly visible website structure, not a copy of the original website's private source code or exact CSS. Exact font names, pixel measurements, breakpoints, image assets and hover behaviour should be verified in the browser using the live website and, where possible, approved university brand files.
2. Reference Website Structure
The public website currently exposes the following broad structure:
- Main navigation with Home, About Us, Academics, Admission, Facilities, Journals, Download, Campus Life, Darbaar Sahib, Data Evaluation, Career and Gallery.
- Contact information near the top of the page, including an email contact and a 24x7 phone number.
- Multi-level navigation under sections such as About Us, Academics, Admission and Campus Life.
- A footer containing admission helpline, general queries, address, committees, visit links, departments/cells, useful links, resources and policy links.
The exact menu labels and destinations should be checked against the live site before production release because university navigation can change.
3. Components to Create
Create these reusable React components:
src/
├── components/
│   └── university/
│       ├── UniversityHeader.jsx
│       ├── MainNavigation.jsx
│       ├── MobileNavigation.jsx
│       ├── UniversityFooter.jsx
│       ├── FooterColumn.jsx
│       └── BackToTop.jsx
├── styles/
│   ├── university-tokens.css
│   ├── university-header.css
│   ├── university-navigation.css
│   ├── university-footer.css
│   └── university-responsive.css
└── layouts/
    └── PublicDepartmentLayout.jsx
Component responsibilities
Component	Responsibility
UniversityHeader	University identity/logo area and top contact strip.
MainNavigation	Desktop navigation and dropdown menus.
MobileNavigation	Collapsible mobile menu with nested submenus.
UniversityFooter	Full-width footer and all footer columns.
FooterColumn	Reusable footer heading and link list.
BackToTop	Accessible back-to-top control, if included.
PublicDepartmentLayout	Wraps public pages with shared header and footer.


4. Header Design Specification
The header should look like part of the official university website, not like a generic software dashboard.
4.1 Header areas
Build the header in two main horizontal areas:

A. University identity area
- Display the official Akal University logo.
- Keep the logo clear and correctly proportioned.
- Use the official logo file supplied or approved by the university.
- Avoid stretching, recolouring or recreating the logo.
- Provide enough whitespace around the logo.
- If the department name is displayed in this area, use a clear secondary text treatment.
B. Contact strip
- Display the public email contact.
- Display the university's general contact/helpline number.
- Use small, clear icons beside email and phone details.
- Make email and telephone values clickable using mailto: and tel:.
- Keep the strip compact so it does not dominate the page.
The live homepage currently shows info@auts.ac.in and 1800-2020-100 in its top contact area. Confirm these details before hardcoding them; preferably keep them in a central configuration file.
4.2 Main navigation
The navigation should:
- Use a horizontal desktop menu.
- Support dropdown and nested dropdown menus.
- Keep menu labels readable and appropriately spaced.
- Provide visible hover, focus and active states.
- Use a clear visual distinction between top-level links and submenu links.
- Keep dropdown panels aligned with their parent menu.
- Avoid clipping dropdowns inside containers with overflow: hidden.
- Support keyboard navigation and Escape to close menus.
- Use actual links for navigation, not clickable non-semantic div elements.
Suggested menu structure based on the current public site:
Home

About Us
  About AU
  Founders & Our Parent Body
  University Leadership
  Recognitions & Approvals
  Governance
  Board of Studies
  UGC Mandatory Disclosures

Academics
  Humanities & Social Sciences
    Economics
    Education
    English
    Psychology
    Punjabi
    Social Science
    Sri Guru Granth Sahib Studies
    Multidisciplinary Studies
  Sciences
    Chemistry
    Mathematics
    Life Sciences
    Physics
  Engineering and Technology
    Computer Science & Engineering
  Commerce and Management
    Commerce
    Bachelor of Business Administration
  Paramedical Sciences
    Physiotherapy
    Medical Lab Technology

Admission
  Courses Offered
  After 10+2
  After Graduation
  After Post-Graduation
  Why AU
  AU Scholarships
  How to Apply

Facilities
  Library
  Hostels
  Transport
  Fee Payment
  e-Sanad

Journals
Download
Campus Life
  Events
  Clubs and Societies
  Success Stories
  Talks and Webinars
  Achievements

Darbaar Sahib
Data Evaluation
Career
Gallery
This is a reference menu outline, not a requirement to reproduce every external link. Confirm current destinations and menu ownership before implementation. The Department Portal may use a smaller department-level menu while preserving the shared university header style.
4.3 Dropdown behaviour
Desktop:
- Open dropdown on hover and keyboard focus.
- Also support click/tap for touch-enabled laptops.
- Keep submenu open while the pointer moves from parent to submenu.
- Use a small transition, but do not make navigation dependent on animation.
- Show an indicator on menu items that contain children.
Mobile:
- Replace the desktop navigation with a menu button.
- Open a full-width or slide-down navigation panel.
- Use tap-to-expand nested menus.
- Keep submenu state independent for each menu item.
- Close the menu after selecting a route.
- Prevent background page scrolling only while the mobile drawer is open, if a drawer is used.
5. Footer Design Specification
The footer should be a reusable, full-width university footer. Use a dark background treatment consistent with the university's official visual identity, with readable text and clear column separation. Verify exact colours and visual treatment from the live site before final styling.
5.1 Footer content groups
The current public website exposes these footer content groups:

Column 1 – Admission Helpline
- School Visit contact numbers.
- Admission helpline number.
- WhatsApp contact link, if still active.
- Admission email address.
Column 2 – General Queries
- General enquiry phone numbers.
- General enquiry email.
- University postal address.
- How to Reach / map link.
Column 3 – Committees
- Central Anti-Ragging Committee.
- Central Caste Based Discrimination Committee.
- Central Gender Sensitisation / ASH Committee.
- Central Discipline Committee.
- Central Grievance Redressal Committee (Students).
- Central Grievance Redressal Committee (Employees).
- Grievances and Redressal Cell.
- Women Cell.
- Equal Opportunity Cell/Centre.
- Socio-Economically Disadvantaged Groups Cell.
Column 4 – Visit Here
- National Education Policy.
- Free UPSC Coaching.
- Akal Alumni Association.
- Akal Business School.
- AU Scholarships.
- Clubs and Societies.
- Achievers.
- Eminent Visitors.
Column 5 – Departments / University Cells
- Research and Development Cell.
- Alumni Association.
- Internal Quality Assurance Cell.
- Training and Placement Cell.
- NCC.
- NSS.
- Red Ribbon Club.
- Counselling Cell.
- Social Responsibility.
- Akal Incubation Centre.
- Center for Competitive Exams.
- Green Chemistry Network Centre Chapter.
- Students Services Center.
Column 6 – Useful Links
- Kalgidhar Society.
- University Grants Commission.
- Council of Scientific & Industrial Research.
- Department of Science & Technology.
- Science & Engineering Research Board.
- Bhabha Atomic Research Centre.
- Tata Institute of Fundamental Research.
- Indian Council of Social Science Research.
- National Programme on Technology Enhanced Learning.
- Blog archive.
- Conference Archive.
- NCTE Portal.
Additional footer groups
- Resources: Downloads and Announcements.
- Policy: Terms and Conditions and Privacy Policy.
- Copyright statement.
The live site may reorganize these groups. Keep footer content data-driven so links and labels can be updated without rewriting the component.
5.2 Footer layout
Desktop:
- Use a responsive multi-column grid.
- Keep column headings visually distinct.
- Use consistent vertical spacing between links.
- Allow long link names to wrap naturally.
- Keep contact details easy to scan.
- Add a separate bottom copyright row.
Tablet:
- Reduce the number of columns per row.
- Keep each group together where possible.
Mobile:
- Stack footer groups vertically or use accessible accordion groups.
- Keep phone, email and address readable.
- Ensure links have comfortable touch targets.
- Do not force the user to scroll horizontally.
5.3 Footer interactions
- Email links must use mailto:.
- Phone numbers must use tel:.
- WhatsApp links must use the approved official destination.
- External links should open safely; use rel="noopener noreferrer" when opening a new tab.
- Map link should point to the approved university map/location destination.
- Do not invent missing URLs. Keep unknown destinations configurable and fill them after verification.
6. CSS Design System
Create CSS variables in university-tokens.css. The following colours are the Akal University project palette already selected for the portal; verify them against official brand guidelines before treating them as exact website CSS values.
:root {
  --akal-yellow: #F9B900;
  --akal-blue: #087BB5;
  --akal-navy: #172333;
  --akal-white: #FFFFFF;

  --university-text: #333333;
  --university-muted: #6B7280;
  --university-border: #E5E7EB;
  --university-surface: #F7F8FA;

  --header-height:  auto;
  --container-width: 1200px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;

  --radius-small: 4px;
  --radius-medium: 8px;

  --shadow-dropdown: 0 8px 24px rgba(0, 0, 0, 0.12);
}
Do not treat the variables above as measured values from the original site's stylesheet. They are maintainable starting tokens for the recreation.
6.1 CSS requirements
- Use a shared .university-container class for consistent page width.
- Use box-sizing: border-box globally.
- Avoid global selectors that unintentionally change Bootstrap components.
- Scope header styles under .university-header.
- Scope navigation styles under .university-nav.
- Scope footer styles under .university-footer.
- Use CSS variables rather than repeating colour values.
- Use :focus-visible styles for keyboard users.
- Use prefers-reduced-motion to reduce non-essential transitions.
- Ensure dropdowns have a sufficiently high z-index.
- Use responsive images with max-width: 100%; height: auto;.
- Do not use fixed heights for text-heavy header or footer areas.
6.2 Suggested CSS file ownership
File	Styles
university-tokens.css	Colours, widths, spacing, typography and shared variables.
university-header.css	Logo area, top contact strip and header spacing.
university-navigation.css	Desktop menu, dropdowns, nested dropdowns and mobile toggle.
university-footer.css	Footer background, columns, links, contacts and copyright row.
university-responsive.css	Tablet/mobile adjustments for header, menu and footer.


7. React Integration
Use a shared public layout so every department page automatically receives the same header and footer.

Example:
import UniversityHeader from "../components/university/UniversityHeader";
import UniversityFooter from "../components/university/UniversityFooter";

export default function PublicDepartmentLayout({ children }) {
  return (
    <>
      <UniversityHeader />
      <main id="main-content">
        {children}
      </main>
      <UniversityFooter />
    </>
  );
}
A department route can then use the layout:
<Route
  path="/departments/:slug"
  element={
    <PublicDepartmentLayout>
      <DepartmentHome />
    </PublicDepartmentLayout>
  }
/>
If the department page itself loads data by slug, use React Router's route parameters inside DepartmentHome or a route-level page component.
8. Configuration-Driven Menus and Footer
Do not hardcode long navigation and footer lists directly inside JSX. Keep them in configuration files or fetch them from the backend.

Suggested structure:
src/
└── config/
    ├── universityNavigation.js
    ├── universityFooter.js
    └── universityContact.js
Example navigation item:
export const universityNavigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      {
        label: "Sciences",
        href: "/academics/sciences",
        children: [
          { label: "Physics", href: "/departments/physics" },
          { label: "Chemistry", href: "/departments/chemistry" },
          { label: "Mathematics", href: "/departments/mathematics" },
        ],
      },
    ],
  },
];
Example contact configuration:
export const universityContact = {
  email: "info@auts.ac.in",
  phone: "1800-2020-100",
  address: "Raman Road, Talwandi Sabo, Bathinda (Punjab), India-151302",
};
Treat the above contact values as reference values observed on the public site; verify them before production use.
9. Accessibility and Quality Requirements
- Use semantic <header>, <nav>, <main> and <footer> elements.
- Add a skip link to the main content.
- Give the logo meaningful alternative text.
- Ensure menu buttons expose aria-expanded and aria-controls.
- Ensure dropdowns work with keyboard as well as pointer input.
- Use visible focus indicators.
- Maintain sufficient text/background contrast.
- Do not communicate active state through colour alone.
- Ensure all interactive elements can be reached by keyboard.
- Test mobile menu and nested navigation with touch input.
- Use descriptive link text instead of repeated “Click here”.
10. Verification Checklist
Before finalizing the header and footer, compare the implementation with the live official website at desktop, tablet and mobile widths.
Header
- [ ] Official approved logo is used without distortion.
- [ ] Contact strip has verified email and phone values.
- [ ] Main navigation labels and destinations are checked.
- [ ] Dropdown and nested dropdown alignment is correct.
- [ ] Active, hover and keyboard-focus states are visible.
- [ ] Mobile menu opens, expands nested items and closes correctly.
- [ ] Header does not overlap page content.
Footer
- [ ] Footer groups match the currently approved university links.
- [ ] Phone and email links work.
- [ ] Address is correct.
- [ ] External destinations are verified.
- [ ] Long link names wrap correctly.
- [ ] Footer is responsive and does not overflow horizontally.
- [ ] Copyright text is confirmed by the university.
CSS and Integration
- [ ] Styles are scoped and do not break Bootstrap.
- [ ] Shared header/footer appear on every department page.
- [ ] No department-specific content is hardcoded into the shared shell.
- [ ] CSS variables are centralized.
- [ ] Layout works at common viewport sizes.
- [ ] Accessibility and keyboard checks pass.
11. Important Integration Notes
1. The department portal is being developed independently; it does not have access to the official university website's private source code.
2. Recreate the visible design using approved logo/image assets and browser inspection. Do not assume the original site's CSS files, theme files or backend can be reused.
3. Ask the university IT/web team for the official logo files, brand guidelines, font details, approved header/footer assets and any required integration rules.
4. Confirm whether the university expects the department portal to be integrated under a path such as /departments/ or on a subdomain. This depends on server, routing, security and IT-team configuration.
5. Keep the shared header and footer replaceable. If the university later supplies official components or approved assets, they can be integrated without rebuilding every department page.
6. Verify all phone numbers, emails, menu labels and external links before publishing.
12. Reference
- Official Akal University website: https://auts.ac.in/
- Public homepage navigation and footer were reviewed as the structural reference for this document.