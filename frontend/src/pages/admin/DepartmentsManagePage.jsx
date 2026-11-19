import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  UserPlus,
  ExternalLink,
  Layers,
  Search,
  CheckCircle,
  XCircle,
  X,
  Save,
  AlertTriangle,
} from 'lucide-react';
import {
  getAdminDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  assignDepartmentAdmin,
  removeDepartmentAdmin,
  getPublicFaculties,
} from '../../services/api';
import MediaUploadField from '../../components/media/MediaUploadField';

export default function DepartmentsManagePage() {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [activeDept, setActiveDept] = useState(null);

  // Remove Admin Confirmation Modal
  const [targetAdminToRemove, setTargetAdminToRemove] = useState(null);
  const [removingAdmin, setRemovingAdmin] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    code: '',
    faculty_id: '',
    short_description: '',
    description: '',
    hero_image: '',
    official_email: '',
    contact_phone: '',
    office_location: '',
    is_active: true,
    is_published: false,
  });

  const [assignEmail, setAssignEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = () => {
    setLoading(true);
    Promise.all([getAdminDepartments(), getPublicFaculties()])
      .then(([depts, facs]) => {
        setDepartments(Array.isArray(depts) ? depts : depts?.departments ?? []);
        setFaculties(Array.isArray(facs) ? facs : facs?.faculties ?? []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const openCreateModal = () => {
    setActiveDept(null);
    setFormData({
      name: '',
      slug: '',
      code: '',
      faculty_id: faculties[0]?.id || '',
      short_description: '',
      description: '',
      hero_image: '',
      official_email: '',
      contact_phone: '',
      office_location: '',
      is_active: true,
      is_published: false,
    });
    setEditModalOpen(true);
  };

  const openEditModal = (dept) => {
    setActiveDept(dept);
    setFormData({
      name: dept.name,
      slug: dept.slug,
      code: dept.code || '',
      faculty_id: dept.faculty_id || '',
      short_description: dept.short_description || '',
      description: dept.description || '',
      hero_image: dept.hero_image || '',
      official_email: dept.official_email || '',
      contact_phone: dept.contact_phone || '',
      office_location: dept.office_location || '',
      is_active: Boolean(dept.is_active),
      is_published: Boolean(dept.is_published),
    });
    setEditModalOpen(true);
  };

  const openAssignModal = (dept) => {
    setActiveDept(dept);
    setAssignEmail('');
    setAssignModalOpen(true);
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeDept?.id) {
        await updateDepartment(activeDept.id, formData);
      } else {
        await createDepartment(formData);
      }
      setEditModalOpen(false);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving department');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = async (dept) => {
    if (!window.confirm(`Are you sure you want to delete the department "${dept.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDepartment(dept.id);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting department');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignEmail.trim()) return;

    setSaving(true);
    try {
      await assignDepartmentAdmin(activeDept.id, assignEmail.trim());
      setAssignModalOpen(false);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error assigning administrator');
    } finally {
      setSaving(false);
    }
  };

  const promptRemoveAdmin = (dept, user) => {
    setTargetAdminToRemove({
      deptId: dept.id,
      deptName: dept.name,
      userId: user.id,
      userName: user.name,
    });
  };

  const executeRemoveAdmin = async () => {
    if (!targetAdminToRemove) return;
    setRemovingAdmin(true);
    try {
      await removeDepartmentAdmin(targetAdminToRemove.deptId, targetAdminToRemove.userId);
      setTargetAdminToRemove(null);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing administrator');
    } finally {
      setRemovingAdmin(false);
    }
  };

  const filtered = departments.filter((d) =>
    !search ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.code && d.code.toLowerCase().includes(search.toLowerCase())) ||
    (d.slug && d.slug.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#087BB5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Academic Structure Management
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#172333', margin: '4px 0 0' }}>
            Department Catalog ({departments.length})
          </h1>
        </div>

        <button className="btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          <span>Add New Department</span>
        </button>
      </div>

      <div className="admin-card-panel">
        <div className="panel-header-bar">
          <div className="search-box-wrap" style={{ maxWidth: 360 }}>
            <Search size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, slug or code..."
            />
          </div>
          <span style={{ fontSize: 13, color: '#64748B' }}>
            Showing {filtered.length} of {departments.length} departments
          </span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Faculty</th>
                <th>Assigned Admins</th>
                <th>Status</th>
                <th>Public URL</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 28, color: '#64748B' }}>
                    Loading departments catalog...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 28, color: '#64748B' }}>
                    No departments found. Click "Add New Department" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <strong>{dept.name}</strong>
                      <div style={{ fontSize: 11.5, color: '#64748B' }}>
                        Code: <strong>{dept.code || 'N/A'}</strong> · Slug: <code>{dept.slug}</code>
                      </div>
                    </td>
                    <td>{dept.faculty?.name || '—'}</td>
                    <td>
                      {dept.users && dept.users.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {dept.users.map((u) => (
                            <span key={u.id} className="dept-assign-pill">
                              <span>{u.name}</span>
                              <button
                                type="button"
                                className="dept-remove-tag-btn"
                                onClick={() => promptRemoveAdmin(dept, u)}
                                title={`Remove ${u.name} from ${dept.name}`}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#D97706', fontSize: 12, fontStyle: 'italic' }}>
                          No admin assigned
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${dept.is_published ? 'published' : 'pending'}`}>
                        {dept.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/departments/${dept.slug}`} target="_blank" className="dept-explore-btn" style={{ fontSize: 12.5 }}>
                        <span>Preview</span> <ExternalLink size={12} />
                      </Link>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Assign Department Admin"
                          onClick={() => openAssignModal(dept)}
                        >
                          <UserPlus size={16} color="#087BB5" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit Department"
                          onClick={() => openEditModal(dept)}
                        >
                          <Edit size={16} color="#475569" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Delete Department"
                          onClick={() => handleDeleteDepartment(dept)}
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

      {/* Add / Edit Department Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog-box modal-lg">
            <div className="modal-head">
              <h3>{activeDept ? `Edit Department: ${activeDept.name}` : 'Create New Academic Department'}</h3>
              <button className="btn-icon" onClick={() => setEditModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveDepartment}>
              <div className="modal-body">
                <div className="form-row-2col">
                  <div className="form-group-admin">
                    <label>Department Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setFormData({ ...formData, name, slug: activeDept ? formData.slug : slug });
                      }}
                      placeholder="e.g. Department of Biotechnology"
                      required
                    />
                  </div>

                  <div className="form-group-admin">
                    <label>URL Slug * (Unique)</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. biotechnology"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group-admin">
                    <label>Faculty Category *</label>
                    <select
                      value={formData.faculty_id}
                      onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
                    >
                      <option value="">Select Academic Faculty</option>
                      {faculties.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-admin">
                    <label>Department Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. BIO, CSE, PHY"
                    />
                  </div>
                </div>

                <div className="form-group-admin">
                  <label>Short Description (Tagline)</label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="One-line summary for cards and search listings..."
                  />
                </div>

                <div className="form-group-admin">
                  <label>Full Department Overview / Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive background, academic philosophy and objectives..."
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-group-admin">
                    <label>Official Email</label>
                    <input
                      type="email"
                      value={formData.official_email}
                      onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
                      placeholder="dept@auts.ac.in"
                    />
                  </div>

                  <div className="form-group-admin">
                    <label>Contact Phone</label>
                    <input
                      type="text"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder="+91-1655-257000"
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-group-admin">
                    <label>Office Location</label>
                    <input
                      type="text"
                      value={formData.office_location}
                      onChange={(e) => setFormData({ ...formData, office_location: e.target.value })}
                      placeholder="e.g. Science Block, 2nd Floor"
                    />
                  </div>

                  <div className="form-group-admin">
                    <label>Department Hero Banner Image</label>
                    {activeDept
                      ? <MediaUploadField departmentId={activeDept.id} mediaType="image" value={formData.hero_image} category="Homepage Banners" onUploaded={(file) => setFormData((current) => ({ ...current, hero_image: file.file_path }))} />
                      : <small>Save the department first, then edit it to upload its hero image.</small>}
                  </div>
                </div>

                <div className="form-row-2col" style={{ marginTop: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: 'auto' }}
                    />
                    <span>Active Department</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      style={{ width: 'auto' }}
                    />
                    <span>Published on Public Portal</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  <Save size={15} />
                  <span>{saving ? 'Saving...' : 'Save Department'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Administrator Modal */}
      {assignModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog-box">
            <div className="modal-head">
              <h3>Assign Department Administrator</h3>
              <button className="btn-icon" onClick={() => setAssignModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleAssignSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: 13.5, color: '#475569', margin: '0 0 16px' }}>
                  Assign an existing or new faculty admin account to manage content for{' '}
                  <strong>{activeDept?.name}</strong>.
                </p>

                <div className="form-group-admin">
                  <label>Administrator Email *</label>
                  <input
                    type="email"
                    value={assignEmail}
                    onChange={(e) => setAssignEmail(e.target.value)}
                    placeholder="e.g. deptadmin@akal.ac.in"
                    required
                  />
                  <small style={{ color: '#64748B', display: 'block', marginTop: 4 }}>
                    Enter an existing user's email (e.g. <code>deptadmin@akal.ac.in</code>) or create an account in User Management.
                  </small>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setAssignModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  <UserPlus size={15} />
                  <span>{saving ? 'Assigning...' : 'Assign Administrator'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mini-Window Card: Remove Administrator Confirmation */}
      {targetAdminToRemove && (
        <div className="modal-overlay">
          <div className="modal-dialog-box" style={{ maxWidth: 460 }}>
            <div className="modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 style={{ color: '#DC2626', fontSize: 17 }}>Remove Administrator</h3>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Confirm removal of assignment</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setTargetAdminToRemove(null)}><X size={20} /></button>
            </div>

            <div className="modal-body">
              <p style={{ margin: '0 0 12px', fontSize: 14, color: '#1E293B', lineHeight: 1.6 }}>
                Are you sure you want to remove <strong>{targetAdminToRemove.userName}</strong> as an administrator for <strong>{targetAdminToRemove.deptName}</strong>?
              </p>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, padding: '12px 14px', fontSize: 12.5, color: '#991B1B', lineHeight: 1.5 }}>
                This user will no longer be able to manage or submit content updates for {targetAdminToRemove.deptName}.
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setTargetAdminToRemove(null)}
                disabled={removingAdmin}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-admin-danger"
                onClick={executeRemoveAdmin}
                disabled={removingAdmin}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Trash2 size={15} />
                <span>{removingAdmin ? 'Removing...' : 'Confirm Remove'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
