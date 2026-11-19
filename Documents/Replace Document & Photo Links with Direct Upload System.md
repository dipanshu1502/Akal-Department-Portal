# Complete Development Prompt – Replace Document & Photo Links with Direct Upload System
## Akal University Multi-Department Website Management Portal

### Project Background

I am developing the Akal University Dynamic Department Management Portal.

**Technology Stack:**
- Frontend: React.js + Vite
- Backend: Laravel 12 REST API
- Database: MySQL
- Authentication: Laravel Sanctum
- UI Framework: Bootstrap 5
- HTTP Client: Axios

The system is designed for all departments of Akal University. It contains:
1. Public Department Websites
2. Super Admin Dashboard
3. Department Admin Dashboard

All department websites use a common reusable template, while each department can manage its own content through the admin dashboard.

---

## 1. Main Requirement

Currently, several sections of the university website use external links or manually entered URLs for documents, PDFs, images and gallery photos.

I want to replace this link-based system with a complete **Direct Document and Photo Upload Management System**.

Instead of asking administrators to paste external URLs, provide an option to upload actual files directly from their computer.

The uploaded files must be stored on the server, and their file paths and metadata must be saved in MySQL.

The uploaded documents and photos should automatically appear on the corresponding public department website after approval and publication.

**Important:** Do not simply add a new upload page. Identify and update all existing sections, forms, components, database fields and APIs that currently use document URLs, image URLs or external file links for university-managed documents and photos.

---

## 2. Identify Existing Link-Based Sections

First, inspect the entire existing project, including frontend components, backend controllers, models, migrations, APIs and database tables.

Identify every place where administrators currently enter or manage:

- PDF document URLs
- Download links
- Document viewing links
- Image URLs
- Gallery image links
- Banner image URLs
- Faculty profile image URLs
- Event photographs
- Notice attachment links
- Syllabus and academic document links
- Annual report links
- Department brochure links
- Research and publication document links
- Achievement certificates and supporting documents

Replace these university-managed file URL fields with actual file upload functionality.

Do not remove normal website navigation links, external references, publication URLs or links to other websites. Only replace links that are intended to represent documents, downloadable files or uploaded images.

---

## 3. Document Upload Management

Create a reusable Document Upload Management component.

### Supported file formats

- PDF
- DOC
- DOCX
- PPT
- PPTX
- XLS
- XLSX
- TXT

### Admin Features

Administrators should be able to:

1. Upload documents directly from their computer.
2. Enter a document title.
3. Add a short description.
4. Select a document category.
5. Select the relevant department.
6. Set an optional publication date.
7. Replace an existing document.
8. Delete a document through the approval workflow.
9. Preview supported documents.
10. Download uploaded documents.
11. View upload date and file size.
12. Search and filter documents by title, category and date.

### Document Categories

Provide configurable categories such as:

- Syllabus
- Academic Calendar
- Notices
- Circulars
- Annual Reports
- Department Brochures
- Admission Documents
- Examination Documents
- Research Publications
- Faculty Documents
- Student Documents
- Other Documents

Super Admin should be able to manage the available categories.

---

## 4. Photo Upload Management

Create a reusable Photo Upload Management component.

### Supported image formats

- JPG / JPEG
- PNG
- WEBP

### Admin Features

1. Upload individual photos.
2. Upload multiple photos together.
3. Add photo title and caption.
4. Add alternative text (ALT text).
5. Select image category.
6. Preview images before submission.
7. Replace existing photos.
8. Delete photos through the approval workflow.
9. Reorder gallery images using drag-and-drop.
10. Search and filter uploaded images.

### Image Categories

- Department Gallery
- Events
- Workshops
- Seminars
- Faculty
- Laboratories
- Campus Activities
- Achievements
- Student Activities
- Homepage Banners
- Other Images

Create an attractive image preview and gallery management interface.

---

## 5. Update Existing Website Sections

Update all relevant existing sections so they use uploaded files instead of manually entered URLs.

### A. Notices and Announcements

Old functionality:
- Admin enters a document URL.

New functionality:
- Admin uploads a PDF or other supported document.
- Admin enters notice title and description.
- Admin selects publication and expiry dates.
- Admin submits the notice for approval.
- After publication, users can view and download the attachment.

### B. Academic Documents

Provide direct upload for:
- Syllabus
- Academic Calendar
- Course Structure
- Programme Details
- Curriculum
- Regulations
- Examination Guidelines

Display documents in an organized list with title, category, upload date and download option.

### C. Department Gallery

Old functionality:
- Admin enters image URLs.

New functionality:
- Admin uploads multiple photos.
- Admin adds captions and categories.
- Admin arranges photo order.
- Public website displays a responsive image gallery.

### D. Faculty and Staff

Allow admins to upload faculty profile photographs directly.

Fields:
- Name
- Designation
- Qualification
- Email
- Profile Description
- Profile Photograph

### E. Homepage Banner / Slider

Allow authorized administrators to upload banner images.

Fields:
- Banner Title
- Subtitle
- Banner Image
- Optional Button Text
- Optional Button Link
- Display Order
- Active / Inactive Status

### F. Events and Activities

Allow admins to:
- Upload event photographs.
- Upload event reports in PDF format.
- Add event descriptions.
- Add event date and venue.
- Manage event gallery images.

### G. Research and Publications

Allow admins to upload:
- Research reports
- Publication PDFs
- Conference reports
- Project reports
- Supporting documents

Keep DOI, journal URLs and external publication links as URL fields where applicable. These are references, not file uploads.

---

## 6. Media Library

Create a centralized **Media Library** inside the Admin Dashboard.

It should provide access to all uploaded documents and images belonging to the departments the logged-in admin is authorized to manage.

### Media Library Features

- View all uploaded files.
- Grid view for images.
- List view for documents.
- Search by filename and title.
- Filter by department.
- Filter by file type.
- Filter by category.
- Filter by upload date.
- Preview images.
- Preview supported PDF documents.
- Download files.
- Replace files through a new revision.
- View file details.
- Show file size and upload date.
- Show upload status.
- Show whether a file is currently published or pending approval.

Department Admin must only see files belonging to their assigned departments.

Super Admin should have access to all departments' media.

---

## 7. Upload Interface Design

Create an attractive and user-friendly upload interface using Bootstrap 5.

### Upload Component UI

Include:

- Drag-and-drop upload area.
- Browse Files button.
- File type information.
- Maximum file size information.
- Upload progress indicator.
- Image thumbnail preview.
- Document filename preview.
- Remove selected file option before submission.
- Title and description fields.
- Category selection.
- Save Draft button.
- Submit for Approval button.

Example layout:

```text
---------------------------------------------
          Upload Document / Photo
---------------------------------------------

     Drag and drop your files here

              OR

            Browse Files

 Supported: PDF, DOCX, PPTX, JPG, PNG, WEBP

---------------------------------------------
 File Title:       [_____________________]

 Category:         [Select Category       ]

 Description:      [_____________________]

 Department:       [Select Department     ]

---------------------------------------------

 [Save Draft]       [Submit for Approval]
---------------------------------------------
```

For image uploads, display thumbnails before submission.

For document uploads, display filename, extension and file size.

---

## 8. Backend File Storage

Use Laravel's filesystem functionality.

Store uploaded files in organized directories.

Suggested structure:

```text
storage/app/public/
    departments/
        cse/
            documents/
            images/
            banners/

        physics/
            documents/
            images/
            banners/

        chemistry/
            documents/
            images/
            banners/
```

Use Laravel Storage APIs instead of manually moving files.

Create appropriate storage configuration and public access using:

```bash
php artisan storage:link
```

Generate file URLs using Laravel's storage URL functionality.

Do not save the binary file itself inside MySQL.

Save the file path and metadata in the database.

The storage system should be configurable so that local storage can later be replaced with cloud object storage without redesigning the entire application.

---

## 9. Database Design

Create or update the database schema to support document and photo uploads.

Suggested tables:

### Table: media

| Field | Description |
|---|---|
| id | Primary Key |
| department_id | Department ID |
| uploaded_by | User ID |
| title | File title |
| description | File description |
| original_name | Original filename |
| stored_name | Stored filename |
| file_path | Server storage path |
| mime_type | MIME type |
| extension | File extension |
| file_size | File size in bytes |
| media_type | document / image |
| category_id | Media category |
| source_type | upload / external_link |
| external_url | External URL, if applicable |
| alt_text | Image alternative text |
| caption | Image caption |
| display_order | Display order |
| status | Draft / Pending / Approved / Rejected / Published |
| created_at | Creation timestamp |
| updated_at | Update timestamp |

### Table: media_categories

| Field | Description |
|---|---|
| id | Primary Key |
| name | Category name |
| media_type | Document / Image / Both |
| department_id | Optional department association |
| created_at | Creation timestamp |

### Important Database Rules

- Use foreign keys where appropriate.
- Use indexed department and category fields.
- Use unique stored filenames.
- Preserve the original filename for display.
- Do not store absolute local computer paths.
- Do not store file binary data in MySQL.
- Keep upload metadata and approval history.
- Use soft deletion or revision-based deletion where required.

Review the existing database before creating these tables. Reuse or extend existing media/document tables if they already exist. Avoid duplicate tables and redundant fields.

---

## 10. Approval Workflow

All uploaded files must follow the existing Super Admin approval process.

### Workflow

```text
Department Admin
       |
 Select File
       |
 Upload File
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
Publish  Feedback
   |
Public Website Displays File
```

Rules:

- Department Admin cannot publish uploaded files directly.
- Super Admin can approve or reject uploads.
- Rejected files should show the reviewer's comments.
- Only published files should appear on public department websites.
- Replacing a published file must not immediately overwrite the currently published version.
- The existing published file must remain available until the replacement is approved and published.
- Deletion must also follow the approval workflow.
- Keep revision history and activity logs.

---

## 11. Public Website Display

Update public department websites to display uploaded documents and photos.

### Document Display

Display:
- Document title
- Category
- Description
- Publication date
- File size
- View button
- Download button

### Photo Display

Display:
- Image thumbnail
- Image title
- Caption
- Category

Use responsive image grids and a lightbox/gallery viewer where appropriate.

### Public Access Rules

- Public visitors can access published public documents and images.
- Draft, pending and rejected files must never be exposed through public APIs.
- Do not expose private documents belonging to users or restricted administrative areas.
- Use controlled download/view endpoints where access control is required.

---

## 12. API Development

Create or update Laravel REST API endpoints.

Suggested endpoints:

### Document APIs

```text
GET     /api/admin/departments/{id}/documents
POST    /api/admin/departments/{id}/documents
GET     /api/admin/documents/{id}
PUT     /api/admin/documents/{id}
DELETE  /api/admin/documents/{id}
POST    /api/admin/documents/{id}/submit
```

### Photo APIs

```text
GET     /api/admin/departments/{id}/photos
POST    /api/admin/departments/{id}/photos
POST    /api/admin/departments/{id}/photos/bulk
PUT     /api/admin/photos/{id}
DELETE  /api/admin/photos/{id}
POST    /api/admin/photos/{id}/submit
```

### Media Library APIs

```text
GET     /api/admin/media
GET     /api/admin/media/{id}
GET     /api/admin/media/categories
POST    /api/admin/media/categories
```

### Super Admin Review APIs

```text
GET     /api/super-admin/media/pending
POST    /api/super-admin/media/{id}/approve
POST    /api/super-admin/media/{id}/reject
POST    /api/super-admin/media/{id}/publish
```

### Public APIs

```text
GET     /api/public/departments/{slug}/documents
GET     /api/public/departments/{slug}/gallery
GET     /api/public/departments/{slug}/events
```

Use Laravel validation, policies, authorization middleware and proper HTTP response codes.

Use multipart/form-data for file uploads.

---

## 13. Frontend Development

Create reusable React components.

Suggested structure:

```text
frontend/src/
    components/
        media/
            FileUpload.jsx
            ImageUpload.jsx
            MultipleImageUpload.jsx
            DocumentCard.jsx
            ImageGallery.jsx
            MediaLibrary.jsx
            UploadProgress.jsx
            FilePreview.jsx

    pages/
        admin/
            DocumentManagement.jsx
            PhotoManagement.jsx
            MediaLibraryPage.jsx

        superadmin/
            MediaApproval.jsx

    services/
        mediaService.js
        documentService.js
        photoService.js
```

Requirements:

- Use Axios for API calls.
- Use `FormData` for file uploads.
- Display loading and error states.
- Display upload progress.
- Validate files before sending.
- Refresh lists after successful actions.
- Use reusable components instead of duplicating upload logic.
- Maintain the existing Akal University design system.
- Ensure the UI is responsive.

---

## 14. Security Requirements

Implement strong file upload security.

- Validate MIME type and extension on the server.
- Do not trust the filename or browser-provided MIME type alone.
- Set configurable maximum file sizes.
- Generate random stored filenames.
- Prevent executable file uploads.
- Store files outside executable application code directories.
- Prevent path traversal.
- Enforce department-level authorization.
- Restrict access to private files.
- Sanitize document titles, descriptions and captions.
- Apply image dimension and file-size limits where appropriate.
- Consider malware scanning for production deployment.
- Log upload, replacement, publication and deletion actions.

Never allow users to upload PHP, JavaScript or other executable server-side files.

---

## 15. File Replacement and Version Management

When an admin replaces a document or image:

1. Upload the new file as a new revision.
2. Keep the existing published file available.
3. Submit the replacement for approval.
4. Super Admin reviews the new version.
5. After approval and publication, the new version becomes active.
6. Preserve the previous version according to the university's retention policy.

Do not permanently delete an old published file immediately when a new version is uploaded.

---

## 16. Implementation Instructions

Follow this implementation order:

### Phase 1 – Project Inspection
- Inspect all existing frontend and backend files.
- Identify current URL-based document and image fields.
- Identify existing media tables and APIs.
- Identify all pages and forms that need changes.
- Prepare a list of affected files before modifying code.

### Phase 2 – Database
- Update migrations.
- Create or extend media tables.
- Add relationships and indexes.
- Preserve existing data where possible.

### Phase 3 – Backend
- Implement upload services.
- Implement file validation.
- Implement storage paths.
- Implement media APIs.
- Implement permissions and approval workflow.
- Implement file replacement and deletion revisions.

### Phase 4 – Frontend
- Create reusable upload components.
- Update existing document and image management forms.
- Build Media Library.
- Update public document and gallery components.
- Add preview, progress and error handling.

### Phase 5 – Testing
Test:
- Single document upload.
- Multiple photo upload.
- Unsupported file rejection.
- Oversized file rejection.
- Department-level authorization.
- Super Admin approval.
- Rejected upload behaviour.
- File replacement.
- File deletion.
- Public document download.
- Public photo display.
- Responsive upload interface.
- Existing published files remaining available during pending revisions.

---

## 17. Important Development Rules

1. First inspect the existing project. Do not assume the current folder structure or database schema.
2. Do not rewrite the entire application.
3. Do not remove existing functionality unrelated to document/photo links.
4. Replace only university-managed document and image URL fields with direct uploads.
5. Preserve genuine external website, DOI, YouTube and reference links.
6. Reuse existing authentication, role permissions and approval workflow.
7. Follow existing coding conventions.
8. Do not create duplicate models, migrations, tables or APIs.
9. Do not hardcode department names or file URLs.
10. Keep all uploaded content department-specific.
11. Ensure Department Admins cannot access other departments' files.
12. Ensure only published files appear publicly.
13. Keep file storage configurable for future cloud migration.
14. Update the existing pages and components rather than creating disconnected duplicate interfaces.
15. Provide complete working code, not just UI mockups or sample snippets.

---

## 18. Final Expected Result

After implementation:

- Admins will upload actual documents instead of entering document URLs.
- Admins will upload actual photos instead of entering image URLs.
- Multiple images can be uploaded together.
- Existing document and photo sections will use the new upload system.
- All uploaded files will be stored securely on the server.
- MySQL will store file paths and metadata.
- Super Admin will approve or reject uploads.
- Published files will automatically appear on the relevant department website.
- Users will be able to view and download public documents.
- Users will be able to view department photo galleries.
- Admins will be able to manage all their uploaded media through a centralized Media Library.

**The final implementation must work with the existing Akal University Multi-Department Portal architecture using React.js, Laravel 12 and MySQL.**
