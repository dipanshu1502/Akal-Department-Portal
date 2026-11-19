import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Users,
  FlaskConical,
  Calendar,
  FileText,
  Award,
  Bell,
  Camera,
  ExternalLink,
  Download,
  Clock,
  Layers,
} from "lucide-react";
import { getPublicDepartment } from "../../services/api";
import PageBreadcrumb from "../../components/university/PageBreadcrumb";
import SectionRenderer from "../../components/page-builder/SectionRenderer";

export default function DepartmentDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPublicDepartment(slug)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.status === 404 ? "Department not found" : "Unable to load department");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="university-container" style={{ padding: "96px 0", textAlign: "center" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading department...</span>
        </div>
        <p style={{ marginTop: 16, color: "#64748B", fontSize: 16 }}>Loading department details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="university-container" style={{ padding: "80px 0", textAlign: "center" }}>
        <div className="dept-error-card">
          <h2>{error || "Department Unavailable"}</h2>
          <p>The requested department page is either unpublished or does not exist.</p>
          <Link to="/departments" className="btn-primary">Return to Department Directory</Link>
        </div>
      </div>
    );
  }

  const {
    department,
    settings = {},
    sections = [],
    faculty = [],
    programmes = [],
    laboratories = [],
    events = [],
    achievements = [],
    publications = [],
    notices = [],
    galleries = [],
    documents = [],
    uploaded_gallery = [],
  } = data;

  const defaultHero = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80";

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Departments", href: "/departments" },
          { label: department.faculty?.name || "Academic Faculty", href: "/departments" },
          { label: department.name },
        ]}
      />

      {/* Hero Banner */}
      <section className="department-detail-hero" style={{ "--hero-bg-image": `url(${department.hero_image || defaultHero})` }}>
        <div className="university-container">
          <div className="dept-hero-content">
            <span className="dept-hero-kicker">{department.faculty?.name || "Academic Faculty"}</span>
            <h1>{department.name}</h1>
            <p className="dept-hero-subtitle">{settings.tagline || department.short_description || ""}</p>
          </div>
          <div className="dept-hero-meta">
            <span className="dept-chip"><GraduationCap size={14} /> {department.code || "CSE"}</span>
            <span className="dept-chip"><MapPin size={14} /> {department.office_location || ""}</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      {settings.about_text && (
        <section className="dept-content-section" id="about">
          <div className="university-container">
            <div className="dept-about-grid">
              <div className="dept-about-text">
                <span className="section-head-kicker">About Department</span>
                <h2>{department.name}</h2>
                <p className="dept-lead">{department.description || ""}</p>
                <p>{settings.about_text}</p>
              </div>
              <div className="dept-about-image">
                <img src={department.hero_image || defaultHero} alt={department.name} loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* HOD Section */}
      {settings.hod_name && (
        <section className="dept-content-section" id="hod">
          <div className="university-container">
            <div className="section-head">
              <span className="section-head-kicker">Head of Department</span>
              <h2>{settings.hod_name}</h2>
              <p>{settings.hod_designation || "Head of Department"}</p>
            </div>
            <div className="hod-card-box">
              <div className="hod-portrait-wrap">
                {settings.hod_photo
                  ? <img className="hod-portrait" src={settings.hod_photo} alt={settings.hod_name} />
                  : <div className="hod-portrait">{settings.hod_name ? settings.hod_name.charAt(0) : "H"}</div>}
              </div>
              <div className="hod-info">
                <h3 className="hod-name">{settings.hod_name}</h3>
                <span className="hod-designation">{settings.hod_designation || "Head of Department"}</span>
                <p className="hod-message">{settings.hod_message || ""}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {faculty.length > 0 && (
        <section className="dept-content-section" id="faculty">
          <div className="university-container">
            <div className="section-head">
              <span className="section-head-kicker">Our People</span>
              <h2>Faculty &amp; Staff</h2>
            </div>
            <div className="department-cards-grid">
              {faculty.map((member) => (
                <article key={member.id} className="faculty-public-card">
                  {member.profile_image
                    ? <img src={member.profile_image} alt={member.name} loading="lazy" />
                    : <div className="faculty-public-placeholder">{member.name?.charAt(0) || "F"}</div>}
                  <h3>{member.name}</h3>
                  <span>{member.designation}</span>
                  {member.qualification && <p>{member.qualification}</p>}
                  {member.bio && <p>{member.bio}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Academic Programmes */}
      {programmes.length > 0 && (
        <section className="dept-content-section" id="programmes">
          <div className="university-container">
            <div className="section-head">
              <span className="section-head-kicker">Academic Programmes</span>
              <h2>Courses Offered</h2>
              <p>Industry-aligned undergraduate and postgraduate programmes in computing.</p>
            </div>
            <div className="department-cards-grid">
              {programmes.map((prog) => (
                <div key={prog.id} className="programme-card">
                  <div className="prog-icon"><GraduationCap size={20} /></div>
                  <h3>{prog.name}</h3>
                  <span className="prog-code">{prog.code || ""}</span>
                  <p>{prog.description || ""}</p>
                  <div className="prog-meta">
                    <span>{prog.level || ""}</span>
                    <span>{prog.duration || ""}</span>
                    <span>{prog.intake || ""}</span>
                  </div>
                  {prog.syllabus_file && <a href={prog.syllabus_file} target="_blank" rel="noopener noreferrer" className="notice-download-btn"><Download size={14} /><span>View Syllabus</span></a>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Laboratories & Facilities */}
      {laboratories.length > 0 && (
        <section className="dept-content-section" id="facilities">
          <div className="university-container">
            <div className="section-head">
              <span className="section-head-kicker">Laboratories &amp; Facilities</span>
              <h2>State-of-the-Art Labs</h2>
              <p>Well-equipped laboratories for hands-on learning and research.</p>
            </div>
            <div className="department-cards-grid">
              {laboratories.map((lab) => (
                <div key={lab.id} className="facility-card">
                  {lab.image_url && <img className="public-card-image" src={lab.image_url} alt={lab.name} loading="lazy" />}
                  <div className="facility-icon"><FlaskConical size={20} /></div>
                  <h3>{lab.name}</h3>
                  <p>{lab.description || ""}</p>
                  <span className="facility-equip">{lab.equipment || ""}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Page Builder Sections */}
      {sections.map((sec) => (
        <SectionRenderer key={sec.id} section={sec} />
      ))}

      {/* Events */}
      {events.length > 0 && (
        <section className="dept-content-section" id="events">
          <div className="university-container">
            <div className="section-head">
              <span className="section-head-kicker">Upcoming Events</span>
              <h2>Department Events</h2>
              <p>Technical festivals, hackathons, seminars and workshops.</p>
            </div>
            <div className="department-cards-grid">
              {events.map((ev) => (
                <div key={ev.id} className="event-card">
                  {ev.image_url && <img className="public-card-image" src={ev.image_url} alt={ev.title} loading="lazy" />}
                  <div className="event-date"><Calendar size={18} /> {ev.event_date || ""}</div>
                  <h3>{ev.title}</h3>
                  <p>{ev.description || ""}</p>
                  <span className="event-venue">{ev.venue || ""}</span>
                  {ev.report_file && <a href={ev.report_file} target="_blank" rel="noopener noreferrer" className="notice-download-btn"><Download size={14} /><span>Event Report</span></a>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="dept-content-section" id="achievements">
          <div className="university-container">
            <div className="section-head">
              <span className="section-head-kicker">Recognitions</span>
              <h2>Department Achievements</h2>
              <p>Milestones, awards and recognitions earned by students and faculty.</p>
            </div>
            <div className="department-cards-grid">
              {achievements.map((ach) => (
                <div key={ach.id} className="achievement-card">
                  {ach.image_url && <img className="public-card-image" src={ach.image_url} alt={ach.title} loading="lazy" />}
                  <div className="ach-icon"><Award size={20} /></div>
                  <h3>{ach.title}</h3>
                  <p>{ach.description || ""}</p>
                  <span className="ach-year">{ach.year || ""}</span>
                  {ach.certificate_url && <a href={ach.certificate_url} target="_blank" rel="noopener noreferrer" className="notice-download-btn"><Download size={14} /><span>Certificate</span></a>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <section className="dept-content-section" id="publications">
          <div className="university-container">
            <div className="section-head">
              <span className="section-head-kicker">Research</span>
              <h2>Recent Publications</h2>
              <p>Faculty research papers and publications.</p>
            </div>
            <div className="department-cards-grid publication-cards-grid">
              {publications.map((pub) => (
                <div key={pub.id} className="publication-item">
                  <h4>{pub.title}</h4>
                  <p className="pub-authors">{pub.authors || ""}</p>
                  {(pub.journal || pub.year) && (
                    <div className="publication-meta">
                      {pub.journal && <span className="pub-journal">{pub.journal}</span>}
                      {pub.year && <span className="pub-year">{pub.year}</span>}
                    </div>
                  )}
                  {pub.document_file && <a href={pub.document_file} target="_blank" rel="noopener noreferrer" className="notice-download-btn"><Download size={14} /><span>View Publication</span></a>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Notices */}
      {notices.length > 0 && (
        <section className="dept-content-section" id="notices">
          <div className="university-container">
            <div className="section-head">
              <span className="section-head-kicker">Latest Notices</span>
              <h2>Department Notices</h2>
              <p>Important announcements and circulars.</p>
            </div>
            <div className="department-cards-grid">
              {notices.map((nt) => (
                <div key={nt.id} className="notice-card">
                  <h4>{nt.title}</h4>
                  <p>{nt.description || ""}</p>
                  <div className="notice-meta">
                    <span>Published: {new Date(nt.publish_date).toLocaleDateString()}</span>
                    <span>Category: {nt.category}</span>
                  </div>
                  {nt.file_url && (
                    <a href={nt.file_url} target="_blank" rel="noopener noreferrer" className="notice-download-btn">
                      <Download size={14} />
                      <span>Download PDF</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {documents.length > 0 && (
        <section className="dept-content-section" id="documents">
          <div className="university-container">
            <div className="section-head">
              <span className="section-head-kicker">Academic Resources</span>
              <h2>Documents &amp; Downloads</h2>
              <p>Published notices, syllabi, calendars and department documents.</p>
            </div>
            <div className="department-cards-grid">
              {documents.map((document) => (
                <article key={document.id} className="notice-card">
                  <h4>{document.title}</h4>
                  {document.description && <p>{document.description}</p>}
                  <div className="notice-meta">
                    <span>{document.category?.name || "Department document"}</span>
                    <span>{document.file_size_human || ""}</span>
                  </div>
                  <a href={document.url} target="_blank" rel="noopener noreferrer" className="notice-download-btn">
                    <Download size={14} /><span>View / Download</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo Gallery */}
      {(galleries.some((image) => image.image_url) || uploaded_gallery.length > 0) && (
        <section className="dept-content-section" id="gallery">
          <div className="university-container">
            <div className="section-head">
              <span className="section-head-kicker">Visual Showcase</span>
              <h2>Department Photo Gallery</h2>
              <p>Snapshots of laboratories, seminars, workshops, and campus activities.</p>
            </div>
            <div className="gallery-grid-box">
              {[...galleries.filter((image) => image.image_url), ...uploaded_gallery].map((img) => (
                <div key={img.id} className="gallery-thumbnail-card">
                <a href={img.url || img.image_url} target="_blank" rel="noopener noreferrer" aria-label={`View ${img.title || "department photo"}`}>
                  <img src={img.url || img.image_url} alt={img.alt_text || img.title || "Department Gallery"} loading="lazy" />
                </a>
                  {(img.caption || img.title) && (
                    <div className="gallery-caption-overlay">{img.caption || img.title}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="university-container" id="contact" style={{ marginBottom: 64 }}>
        <div className="dept-contact-card">
          <h2>Contact {department.name}</h2>
          <p>Get in touch with the department office for admissions, academic inquiries, or collaborative research.</p>
          <div className="dept-contact-items-grid">
            <div className="contact-info-block">
              <Mail size={22} />
              <div>
                <strong>Official Email:</strong>
                <a href={`mailto:${settings.contact_email || department.official_email}`}>
                  {settings.contact_email || department.official_email || "info@auts.ac.in"}
                </a>
              </div>
            </div>
            <div className="contact-info-block">
              <Phone size={22} />
              <div>
                <strong>Telephone Helpline:</strong>
                <a href={`tel:${settings.contact_phone || department.contact_phone}`}>
                  {settings.contact_phone || department.contact_phone || "1800-2020-100"}
                </a>
              </div>
            </div>
            <div className="contact-info-block">
              <MapPin size={22} />
              <div>
                <strong>Office Location:</strong>
                <span>{settings.contact_address || department.office_location || "Akal University Campus, Talwandi Sabo, Bathinda - 151302"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

