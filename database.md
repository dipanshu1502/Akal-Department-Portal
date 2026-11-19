# Database and Data Storage

## At a glance

- Backend: Laravel 12 REST API; the React frontend reads and writes data through that API.
- Active database in this workspace: **MySQL/MariaDB**, selected by `DB_CONNECTION=mysql` in `backend/.env`.
- MySQL database: `akal_department_portal` on `127.0.0.1:3306` (XAMPP MariaDB).
- The old SQLite file at `backend/database/database.sqlite` is retained as a local backup; it is no longer the active application database.
- Uploaded media files are stored separately from database rows, on Laravel's local `public` filesystem disk.

The `.env` file is machine-specific and is not included here. To change the database engine, update the backend environment configuration and ensure the corresponding database exists before running migrations.

## Where data is stored

| Data | Storage location |
| --- | --- |
| Application records (users, departments, content, settings, approvals, media metadata, etc.) | Selected relational database. In this workspace, MySQL database `akal_department_portal`. |
| Uploaded images and documents | `backend/storage/app/public/departments/{department_id}/images/` or `backend/storage/app/public/departments/{department_id}/documents/`. |
| Public access to uploaded files | Laravel's `public` disk serves URLs under `/storage`; `php artisan storage:link` links `backend/public/storage` to `backend/storage/app/public`. |
| Laravel application logs | `backend/storage/logs/`, not the application database. |
| Browser login state | Frontend `localStorage` keys `akal_portal_token` and `akal_portal_user`. The bearer token itself is also persisted in the database as a Sanctum personal access token. |

The `media` table stores a file's metadata and relative storage path, not the file bytes. Other content records can also hold image/document URLs or paths (for example, department logos, faculty photos, and syllabus files). Back up both the database **and** `backend/storage/app/public`; a database backup alone does not include uploaded files.

## Database schema

The schema is defined by the migrations in `backend/database/migrations/`. The `id`, `created_at`, and `updated_at` columns below are omitted from most table summaries for readability; Laravel migrations add them to the application tables unless noted otherwise. `migrations` is Laravel's own migration-history table.

### Users, departments, and layout

| Table | What it stores |
| --- | --- |
| `users` | User name, unique email, password hash, optional email verification time, role (`super_admin` or `department_admin`), optional `department_id`, remember token, and timestamps. Passwords are hashed; they are not stored as plain text. |
| `faculties` | Faculty name, unique slug, description, active flag, and display order. |
| `departments` | Optional faculty link; name, unique slug, code, short and full descriptions, hero image/logo references, official email, phone, office location, active/published flags, publication time, and display order. |
| `department_user` | Many-to-many assignments between users and departments. |
| `department_sections` | Department page sections: title/subtitle, layout type, JSON `content` and `settings`, enabled flag, publication status, and display order. |
| `section_types` | Section-layout definitions: unique key, name, description, icon, JSON schema, active flag, and display order. |
| `department_settings` | One settings row per department: site title/tagline, banner and about text, HOD name/designation/message/photo, contact details, theme colors, and JSON navigation. |

### Department content

| Table | What it stores |
| --- | --- |
| `faculty_members` | Department staff profiles: name, designation, qualification, specialization, experience, email/phone, office, research interests, bio, profile image reference, status, and display order. |
| `programmes` | Academic programmes: name/code, level, duration, eligibility, intake, description, curriculum highlights, syllabus file reference, status, and sort order. |
| `laboratories` | Lab name, description, facilities, equipment, image reference, location, in-charge name, status, and sort order. |
| `events` | Event title/description, start and optional end dates, venue, organizer, category, image and registration references, featured flag, status, and optional report file reference. |
| `achievements` | Achievement title/description/date/category, recipient, awarding organization, image/certificate references, and sort order. |
| `publications` | Publication title, authors, journal/conference, year, DOI/link, abstract, citation, optional document file reference, and sort order. |
| `galleries` | Gallery title/category, image URL/reference, caption, alt text, and display order. |
| `notices` | Notice title/description, category, publish/expiry dates, optional file reference, important flag, and active flag. |

These content tables belong to a department through `department_id`. Public department endpoints return active/published department content; individual modules also filter by their status where applicable.

### Workflow, audit, and media

| Table | What it stores |
| --- | --- |
| `content_revisions` | Proposed content JSON (`payload`), model/section reference, title, workflow status, submitter and reviewer IDs, review comments, and submitted/reviewed/published times. |
| `activity_logs` | Optional user/department references, action, description, IP address, and optional JSON `properties`. |
| `system_settings` | Unique setting key, text value, group, and description; used for institution-wide configuration. |
| `media_categories` | Media category name/type and optional department association. A null department association allows a shared category. The media-library migration inserts default document and image categories. |
| `media` | Department, uploader, optional category, replacement/reviewer references, title/description, original and stored filenames, relative file path, MIME type, extension, byte size, image/document type, alt text/caption, display order, approval/publication status and timestamps, review comments, and delete-request flag. Media rows use soft deletes. |
| `personal_access_tokens` | Laravel Sanctum API tokens: tokenable user/model, token name/hash, abilities, last-used/expiry times, and timestamps. |

### Relationships and deletion behavior

- A faculty can have multiple departments; a department owns its sections, settings, module records, revisions, logs, and media.
- Users can be assigned to departments through `department_user`. Users can submit/review revisions, and upload/review media.
- Foreign keys generally cascade department-owned data when a department is deleted. Optional references such as revision section/reviewer and media category/reviewer/replacement are set to null when their referenced row is deleted, where the migration specifies this behavior.
- `media` uses soft deletion; its row is marked deleted instead of immediately removed by Eloquent. Uploaded-file deletion is handled separately by the media controller.
- `department_sections.content`, `department_sections.settings`, `department_settings.navigation`, `section_types.schema`, `content_revisions.payload`, and `activity_logs.properties` are JSON fields.

## Media upload flow

1. The frontend submits a file and metadata to the Laravel API.
2. The API validates image/document type and allowed formats, then writes the file to the `public` disk under the department-specific `images` or `documents` directory.
3. A corresponding `media` row records the file path, size, type, descriptive metadata, uploader, and workflow status.
4. Public department APIs expose published media; administrative APIs manage drafts, submissions, approvals, replacements, and deletion.

Thus, files and their metadata are separate: moving or deleting the storage directory without updating/restoring the corresponding database can break file links.

## Migrations, seed data, and tests

Run commands from the `backend` directory:

```bash
php artisan migrate
php artisan db:seed
```

The main seeder creates demo users, section layout types, system settings, sample faculties/departments, and sample department content. The README describes the sample as including five populated departments and eight section layout schemas. The media-library migration also inserts default media categories.

> **Warning:** `php artisan migrate:fresh --seed` drops all existing tables and recreates them before seeding. Use it only when you intend to erase the current database.

Automated tests configure SQLite `:memory:` in `backend/phpunit.xml`, so those tests use a temporary in-memory database rather than the persistent local SQLite file.

## Configuration notes

- `DB_CONNECTION` chooses the connection. In the current workspace it is `sqlite`; the README's development setup also documents SQLite. For MySQL, configure the connection details in `backend/.env` and create the target database first.
- `backend/.env.example` sets `SESSION_DRIVER=database`, `CACHE_STORE=database`, and `QUEUE_CONNECTION=database`. The checked-in migrations listed above do not create the Laravel `sessions`, `cache`, `cache_locks`, or `jobs` tables. If database-backed sessions, cache, or queues are used, ensure their required tables exist (or choose another supported driver).
- Keep local database credentials in `.env`, not in source control or this document.
