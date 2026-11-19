import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  FlaskConical,
  Calendar,
  Award,
  FileText,
  Bell,
  Camera,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import {
  getAdminDepartments,
  getMedia,
  deleteMedia,
  updateMedia,
  getDepartmentFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getDepartmentProgrammes,
  createProgramme,
  updateProgramme,
  deleteProgramme,
  getDepartmentLaboratories,
  createLaboratory,
  updateLaboratory,
  deleteLaboratory,
  getDepartmentEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getDepartmentAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getDepartmentPublications,
  createPublication,
  updatePublication,
  deletePublication,
  getDepartmentNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getDepartmentGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
} from '../../services/api';
import MediaUploadField from '../../components/media/MediaUploadField';

export default function DepartmentModuleManagePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'faculty';

  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminDepartments()
      .then((depts) => {
        const list = Array.isArray(depts) ? depts : depts?.departments ?? [];
        setDepartments(list);
        if (list.length > 0) {
          setSelectedDeptId(String(list[0].id));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const refreshItems = () => {
    if (!selectedDeptId) return;
    setLoading(true);

    let fetcher = null;
    if (currentTab === 'faculty') fetcher = getDepartmentFaculty;
    else if (currentTab === 'programmes') fetcher = getDepartmentProgrammes;
    else if (currentTab === 'laboratories') fetcher = getDepartmentLaboratories;
    else if (currentTab === 'events') fetcher = getDepartmentEvents;
    else if (currentTab === 'achievements') fetcher = getDepartmentAchievements;
    else if (currentTab === 'publications') fetcher = getDepartmentPublications;
    else if (currentTab === 'notices') fetcher = getDepartmentNotices;
    else if (currentTab === 'galleries') fetcher = getDepartmentGalleries;

    if (fetcher) {
      fetcher(selectedDeptId)
        .then((res) => {
          setItems(Array.isArray(res) ? res : res?.data ?? []);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    refreshItems();
  }, [selectedDeptId, currentTab]);

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  // Open modal
  const openCreateModal = () => {
    setEditItem(null);
    if (currentTab === 'faculty') {
      setFormData({ name: '', designation: '', qualification: '', specialization: '', experience: '', email: '', phone: '', profile_image: '', status: 'active' });
    } else if (currentTab === 'programmes') {
      setFormData({ name: '', code: '', level: 'undergraduate', duration: '4 Years', intake: '60 Seats', eligibility: '', description: '', syllabus_file: '', status: 'active' });
    } else if (currentTab === 'laboratories') {
      setFormData({ name: '', description: '', facilities: '', equipment: '', image_url: '', location: '', incharge_name: '', status: 'active' });
    } else if (currentTab === 'events') {
      setFormData({ title: '', description: '', event_date: new Date().toISOString().split('T')[0], venue: '', category: 'workshop', image_url: '', report_file: '', status: 'upcoming' });
    } else if (currentTab === 'achievements') {
      setFormData({ title: '', description: '', achievement_date: new Date().toISOString().split('T')[0], category: 'student', recipient_name: '', award_by: '', image_url: '', certificate_url: '' });
    } else if (currentTab === 'publications') {
      setFormData({ title: '', authors: '', journal_conference: '', year: 2025, doi: '', link: '', abstract: '', document_file: '' });
    } else if (currentTab === 'notices') {
      setFormData({ title: '', description: '', category: 'general', publish_date: new Date().toISOString().split('T')[0], expiry_date: '', file_url: '', is_important: false });
    } else if (currentTab === 'galleries') {
      setFormData({ title: '', category: 'labs', image_url: '', caption: '', alt_text: '', uploaded_gallery_images: [] });
    }
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (currentTab === 'faculty') {
        if (editItem?.id) await updateFaculty(editItem.id, formData);
        else await createFaculty(selectedDeptId, formData);
      } else if (currentTab === 'programmes') {
        if (editItem?.id) await updateProgramme(editItem.id, formData);
        else await createProgramme(selectedDeptId, formData);
      } else if (currentTab === 'laboratories') {
        if (editItem?.id) await updateLaboratory(editItem.id, formData);
        else await createLaboratory(selectedDeptId, formData);
      } else if (currentTab === 'events') {
        if (editItem?.id) await updateEvent(editItem.id, formData);
        else await createEvent(selectedDeptId, formData);
      } else if (currentTab === 'achievements') {
        if (editItem?.id) await updateAchievement(editItem.id, formData);
        else await createAchievement(selectedDeptId, formData);
      } else if (currentTab === 'publications') {
        if (editItem?.id) await updatePublication(editItem.id, formData);
        else await createPublication(selectedDeptId, formData);
      } else if (currentTab === 'notices') {
        if (editItem?.id) await updateNotice(editItem.id, formData);
        else await createNotice(selectedDeptId, formData);
      } else if (currentTab === 'galleries') {
        const { uploaded_gallery_images = [], ...galleryPayload } = formData;
        for (const media of uploaded_gallery_images) {
          await updateMedia(media.id, {
            title: galleryPayload.title || media.title,
            caption: galleryPayload.caption || '',
            alt_text: galleryPayload.alt_text || '',
          });
        }
        if (editItem?.id) await updateGallery(editItem.id, galleryPayload);
        else await createGallery(selectedDeptId, galleryPayload);
        const additionalImages = uploaded_gallery_images.filter((media) => media.file_path !== galleryPayload.image_url);
        for (const media of additionalImages) {
          await createGallery(selectedDeptId, {
            title: formData.title || media.title,
            caption: formData.caption || media.caption || '',
            alt_text: formData.alt_text || '',
            category: formData.category,
            image_url: media.file_path,
          });
        }
      }

      setModalOpen(false);
      refreshItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      if (currentTab === 'faculty') await deleteFaculty(item.id);
      else if (currentTab === 'programmes') await deleteProgramme(item.id);
      else if (currentTab === 'laboratories') await deleteLaboratory(item.id);
      else if (currentTab === 'events') await deleteEvent(item.id);
      else if (currentTab === 'achievements') await deleteAchievement(item.id);
      else if (currentTab === 'publications') await deletePublication(item.id);
      else if (currentTab === 'notices') await deleteNotice(item.id);
      else if (currentTab === 'galleries') {
        const media = await getMedia({ media_type: 'image' });
        const linkedMedia = (Array.isArray(media) ? media : []).find((file) => file.file_path === item.image_url);
        if (linkedMedia) await deleteMedia(linkedMedia.id);
        await deleteGallery(item.id);
      }

      refreshItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting record');
    }
  };

  const activeDept = departments.find((d) => String(d.id) === String(selectedDeptId));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#087BB5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Structured Department Data
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#172333', margin: '4px 0 0' }}>
            Module Records Manager
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {departments.length > 1 && (
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="faculty-filter-select"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          )}

          <button className="btn-primary" onClick={openCreateModal}>
            <Plus size={16} />
            <span>Add New {currentTab.slice(0, -1)}</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 6 }}>
        {[
          { key: 'faculty', label: 'Faculty & Staff', icon: Users },
          { key: 'programmes', label: 'Programmes & Degrees', icon: GraduationCap },
          { key: 'laboratories', label: 'Laboratories', icon: FlaskConical },
          { key: 'events', label: 'Events & Seminars', icon: Calendar },
          { key: 'achievements', label: 'Achievements', icon: Award },
          { key: 'publications', label: 'Publications', icon: FileText },
          { key: 'notices', label: 'Notices & Circulars', icon: Bell },
          { key: 'galleries', label: 'Photo Gallery', icon: Camera },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              className={`quick-pill ${currentTab === tab.key ? 'active' : ''}`}
              onClick={() => setTab(tab.key)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Data Table Panel */}
      <div className="admin-card-panel">
        <div className="panel-header-bar">
          <h2>
            {currentTab.toUpperCase()} Records for {activeDept?.name} ({items.length})
          </h2>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title / Name</th>
                <th>Category / Details</th>
                <th>Status / Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 28, color: '#64748B' }}>
                    Loading records...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 36, color: '#64748B' }}>
                    No records found in this category. Click "+ Add New" to add one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name || item.title}</strong>
                      <div style={{ fontSize: 12, color: '#64748B' }}>
                        {item.designation || item.code || item.authors || item.recipient_name || item.caption || ''}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, color: '#475569' }}>
                        {item.qualification || item.duration || item.location || item.venue || item.journal_conference || item.category || ''}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill published" style={{ fontSize: 11 }}>
                        {item.status || item.publish_date || item.event_date || item.year || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => openEditModal(item)}
                          title="Edit Record"
                        >
                          <Edit size={16} color="#087BB5" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => handleDelete(item)}
                          title="Delete Record"
                        >
                          <Trash2 size={16} color="#EF4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Form Modal based on Tab */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog-box modal-lg">
            <div className="modal-head">
              <h3>{editItem ? `Edit ${currentTab.slice(0, -1)}` : `Add New ${currentTab.slice(0, -1)}`}</h3>
              <button className="btn-icon" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                {currentTab === 'faculty' && (
                  <>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Faculty Full Name *</label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Designation Title *</label>
                        <input
                          type="text"
                          value={formData.designation || ''}
                          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                          placeholder="e.g. Associate Professor"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Qualifications</label>
                        <input
                          type="text"
                          value={formData.qualification || ''}
                          onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                          placeholder="Ph.D., M.Tech (CSE)"
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Specialization Focus</label>
                        <input
                          type="text"
                          value={formData.specialization || ''}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          placeholder="Machine Learning, Computer Vision"
                        />
                      </div>
                    </div>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Profile Photograph</label>
                        <MediaUploadField departmentId={selectedDeptId} mediaType="image" value={formData.profile_image} category="Faculty" title={formData.name} onUploaded={(file) => setFormData((current) => ({ ...current, profile_image: file.file_path }))} />
                      </div>
                    </div>
                  </>
                )}

                {currentTab === 'programmes' && (
                  <>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Programme Title *</label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. B.Tech in Computer Science & Engineering"
                          required
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Programme Level</label>
                        <select
                          value={formData.level || 'undergraduate'}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        >
                          <option value="undergraduate">Undergraduate (UG)</option>
                          <option value="postgraduate">Postgraduate (PG)</option>
                          <option value="doctoral">Doctoral (Ph.D.)</option>
                          <option value="diploma">Diploma</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Duration</label>
                        <input
                          type="text"
                          value={formData.duration || ''}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          placeholder="4 Years (8 Semesters)"
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Approved Intake</label>
                        <input
                          type="text"
                          value={formData.intake || ''}
                          onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                          placeholder="60 Seats"
                        />
                      </div>
                    </div>
                    <div className="form-group-admin">
                      <label>Eligibility Criteria</label>
                      <textarea
                        rows={2}
                        value={formData.eligibility || ''}
                        onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                      />
                    </div>
                    <div className="form-group-admin">
                      <label>Course Description</label>
                      <textarea
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="form-group-admin">
                      <label>Syllabus Document</label>
                      <MediaUploadField departmentId={selectedDeptId} mediaType="document" value={formData.syllabus_file} category="Syllabus" title={`${formData.name || 'Programme'} syllabus`} onUploaded={(file) => setFormData((current) => ({ ...current, syllabus_file: file.file_path }))} />
                    </div>
                  </>
                )}

                {currentTab === 'laboratories' && (
                  <>
                    <div className="form-group-admin">
                      <label>Laboratory Name *</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Artificial Intelligence & Deep Learning Lab"
                        required
                      />
                    </div>
                    <div className="form-group-admin">
                      <label>Description & Purpose</label>
                      <textarea
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Equipment Details</label>
                        <input
                          type="text"
                          value={formData.equipment || ''}
                          onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                          placeholder="NVIDIA RTX 4090 GPUs, 32-core Xeon servers"
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Faculty Incharge</label>
                        <input
                          type="text"
                          value={formData.incharge_name || ''}
                          onChange={(e) => setFormData({ ...formData, incharge_name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group-admin">
                      <label>Laboratory Photograph</label>
                      <MediaUploadField departmentId={selectedDeptId} mediaType="image" value={formData.image_url} category="Laboratories" title={formData.name} onUploaded={(file) => setFormData((current) => ({ ...current, image_url: file.file_path }))} />
                    </div>
                  </>
                )}

                {currentTab === 'events' && (
                  <>
                    <div className="form-group-admin">
                      <label>Event Title *</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Date *</label>
                        <input
                          type="date"
                          value={formData.event_date || ''}
                          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Venue / Location</label>
                        <input
                          type="text"
                          value={formData.venue || ''}
                          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                          placeholder="University Auditorium"
                        />
                      </div>
                    </div>
                    <div className="form-group-admin">
                      <label>Description</label>
                      <textarea
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="form-group-admin">
                      <label>Event Photograph</label>
                      <MediaUploadField departmentId={selectedDeptId} mediaType="image" value={formData.image_url} category="Events" title={formData.title} onUploaded={(file) => setFormData((current) => ({ ...current, image_url: file.file_path }))} />
                    </div>
                    <div className="form-group-admin">
                      <label>Event Report</label>
                      <MediaUploadField departmentId={selectedDeptId} mediaType="document" value={formData.report_file} category="Event Reports" title={`${formData.title || 'Event'} report`} onUploaded={(file) => setFormData((current) => ({ ...current, report_file: file.file_path }))} />
                    </div>
                  </>
                )}

                {currentTab === 'publications' && (
                  <>
                    <div className="form-group-admin">
                      <label>Research Paper Title *</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group-admin">
                      <label>Authors *</label>
                      <input
                        type="text"
                        value={formData.authors || ''}
                        onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                        placeholder="Dr. Upinder Kaur, Er. Harpreet Kaur"
                        required
                      />
                    </div>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Journal / Conference *</label>
                        <input
                          type="text"
                          value={formData.journal_conference || ''}
                          onChange={(e) => setFormData({ ...formData, journal_conference: e.target.value })}
                          placeholder="IEEE Transactions on Cloud Computing"
                          required
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Year *</label>
                        <input
                          type="number"
                          value={formData.year || 2025}
                          onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group-admin">
                      <label>DOI / Web Link</label>
                      <input
                        type="text"
                        value={formData.doi || ''}
                        onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                        placeholder="10.1109/..."
                      />
                    </div>
                    <div className="form-group-admin">
                      <label>Research Paper / Supporting Document</label>
                      <MediaUploadField departmentId={selectedDeptId} mediaType="document" value={formData.document_file} category="Research Publications" title={formData.title} onUploaded={(file) => setFormData((current) => ({ ...current, document_file: file.file_path }))} />
                    </div>
                  </>
                )}

                {currentTab === 'notices' && (
                  <>
                    <div className="form-group-admin">
                      <label>Notice Heading *</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Publish Date *</label>
                        <input
                          type="date"
                          value={formData.publish_date || ''}
                          onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Category</label>
                        <select
                          value={formData.category || 'general'}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="academic">Academic</option>
                          <option value="exam">Examination</option>
                          <option value="admission">Admission</option>
                          <option value="general">General</option>
                        </select>
                      </div>
                      <div className="form-group-admin">
                        <label>Expiry Date</label>
                        <input type="date" value={formData.expiry_date || ''} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group-admin">
                      <label>Notice Content</label>
                      <textarea
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="form-group-admin">
                      <label>Notice Attachment</label>
                      <MediaUploadField departmentId={selectedDeptId} mediaType="document" value={formData.file_url} category="Notices" title={formData.title} description={formData.description} onUploaded={(file) => setFormData((current) => ({ ...current, file_url: file.file_path }))} />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={Boolean(formData.is_important)}
                        onChange={(e) => setFormData({ ...formData, is_important: e.target.checked })}
                        style={{ width: 'auto' }}
                      />
                      <span>Mark as Important Notice (Yellow Flag)</span>
                    </label>
                  </>
                )}

                {currentTab === 'achievements' && (
                  <>
                    <div className="form-group-admin">
                      <label>Achievement Title *</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Recipient Name</label>
                        <input
                          type="text"
                          value={formData.recipient_name || ''}
                          onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                          placeholder="Simranpreet Singh & Team"
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Awarding Body / Organization</label>
                        <input
                          type="text"
                          value={formData.award_by || ''}
                          onChange={(e) => setFormData({ ...formData, award_by: e.target.value })}
                          placeholder="Ministry of Education"
                        />
                      </div>
                    </div>
                    <div className="form-group-admin">
                      <label>Description</label>
                      <textarea
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div className="form-row-2col">
                      <div className="form-group-admin">
                        <label>Achievement Photograph</label>
                        <MediaUploadField departmentId={selectedDeptId} mediaType="image" value={formData.image_url} category="Achievements" title={formData.title} onUploaded={(file) => setFormData((current) => ({ ...current, image_url: file.file_path }))} />
                      </div>
                      <div className="form-group-admin">
                        <label>Certificate / Supporting Document</label>
                        <MediaUploadField departmentId={selectedDeptId} mediaType="document" value={formData.certificate_url} category="Achievement Certificates" title={`${formData.title || 'Achievement'} certificate`} onUploaded={(file) => setFormData((current) => ({ ...current, certificate_url: file.file_path }))} />
                      </div>
                    </div>
                  </>
                )}

                {currentTab === 'galleries' && (
                  <>
                    <div className="form-group-admin">
                      <label>Gallery Photos *</label>
                      <MediaUploadField departmentId={selectedDeptId} mediaType="image" multiple value={formData.image_url} category="Department Gallery" title={formData.title} caption={formData.caption} altText={formData.alt_text} onUploaded={(uploaded) => {
                        const files = Array.isArray(uploaded) ? uploaded : [uploaded];
                        setFormData((current) => ({
                          ...current,
                          image_url: files[0]?.file_path || current.image_url,
                          uploaded_gallery_images: [...(current.uploaded_gallery_images || []), ...files],
                        }));
                      }} />
                    </div>
                    <div className="form-group-admin">
                      <label>Caption / Title</label>
                      <input
                        type="text"
                        value={formData.caption || formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, caption: e.target.value, title: e.target.value })}
                        placeholder="e.g. AI Lab Hackathon 2026"
                      />
                    </div>
                    <div className="form-group-admin">
                      <label>Alternative Text</label>
                      <input type="text" value={formData.alt_text || ''} onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })} />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  <Save size={15} />
                  <span>{saving ? 'Saving...' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
