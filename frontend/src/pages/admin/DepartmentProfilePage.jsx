import React, { useState, useEffect } from 'react';
import { Building2, Save, Send, CheckCircle, ExternalLink } from 'lucide-react';
import {
  getAdminDepartments,
  getDepartmentSettings,
  updateDepartmentSettings,
  createRevision,
} from '../../services/api';
import MediaUploadField from '../../components/media/MediaUploadField';

export default function DepartmentProfilePage() {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [settings, setSettings] = useState({
    website_title: '',
    tagline: '',
    banner_title: '',
    banner_text: '',
    about_text: '',
    hod_name: '',
    hod_designation: '',
    hod_message: '',
    hod_photo: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    primary_color: '#087BB5',
    accent_color: '#F9B900',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getAdminDepartments()
      .then((depts) => {
        const list = Array.isArray(depts) ? depts : depts?.departments ?? [];
        setDepartments(list);
        if (list.length > 0) {
          setSelectedDeptId(String(list[0].id));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDeptId) return;

    setLoading(true);
    getDepartmentSettings(selectedDeptId)
      .then((res) => {
        const data = res?.settings || res || {};
        setSettings({
          website_title: data.website_title || '',
          tagline: data.tagline || '',
          banner_title: data.banner_title || '',
          banner_text: data.banner_text || '',
          about_text: data.about_text || '',
          hod_name: data.hod_name || '',
          hod_designation: data.hod_designation || '',
          hod_message: data.hod_message || '',
          hod_photo: data.hod_photo || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          contact_address: data.contact_address || '',
          primary_color: data.primary_color || '#087BB5',
          accent_color: data.accent_color || '#F9B900',
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedDeptId]);

  const handleField = (key, val) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleDirectSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await updateDepartmentSettings(selectedDeptId, settings);
      setMessage({ type: 'success', text: 'Department profile settings updated successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    setSaving(true);
    setMessage(null);

    try {
      await createRevision({
        department_id: Number(selectedDeptId),
        model_type: 'settings',
        title: `Profile & Settings Update for ${activeDept?.name || 'Department'}`,
        payload: settings,
        status: 'pending',
      });
      setMessage({ type: 'success', text: 'Settings submitted to Super Admin for approval review!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting settings for review');
    } finally {
      setSaving(false);
    }
  };

  const activeDept = departments.find((d) => String(d.id) === String(selectedDeptId));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#087BB5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Brand & Identity Configuration
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#172333', margin: '4px 0 0' }}>
            Department Profile & Settings
          </h1>
        </div>

        {departments.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Active Department:</span>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="faculty-filter-select"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="admin-card-panel" style={{ maxWidth: 900 }}>
        <div className="panel-header-bar">
          <div>
            <h2>{activeDept?.name || 'Department Settings'}</h2>
            <p>Customize banner headlines, HOD remarks, and verified contact details.</p>
          </div>
          {activeDept?.slug && (
            <a
              href={`/departments/${activeDept.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="dept-explore-btn"
              style={{ fontSize: 13 }}
            >
              <span>Preview Public Page</span> <ExternalLink size={13} />
            </a>
          )}
        </div>

        {message && (
          <div style={{
            padding: '12px 24px',
            backgroundColor: '#F0FDF4',
            color: '#15803D',
            borderBottom: '1px solid #BBF7D0',
            fontSize: 13.5,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <CheckCircle size={16} />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleDirectSave} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#087BB5', margin: '0 0 16px', borderBottom: '1px solid #E2E8F0', paddingBottom: 6 }}>
            1. Hero Banner & Tagline
          </h3>

          <div className="form-row-2col">
            <div className="form-group-admin">
              <label>Banner Headline</label>
              <input
                type="text"
                value={settings.banner_title}
                onChange={(e) => handleField('banner_title', e.target.value)}
                placeholder="e.g. Department of Computer Science & Engineering"
              />
            </div>

            <div className="form-group-admin">
              <label>Department Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleField('tagline', e.target.value)}
                placeholder="e.g. Where Innovation Meets Algorithmic Excellence"
              />
            </div>
          </div>

          <div className="form-group-admin">
            <label>Banner Narrative Sub-text</label>
            <textarea
              rows={2}
              value={settings.banner_text}
              onChange={(e) => handleField('banner_text', e.target.value)}
              placeholder="Highlighting facilities, admissions, or research focus..."
            />
          </div>

          <div className="form-group-admin">
            <label>Comprehensive About Department Text</label>
            <textarea
              rows={4}
              value={settings.about_text}
              onChange={(e) => handleField('about_text', e.target.value)}
              placeholder="Overview of curriculum, department vision, laboratory exposure..."
            />
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#087BB5', margin: '28px 0 16px', borderBottom: '1px solid #E2E8F0', paddingBottom: 6 }}>
            2. Head of Department (HOD) Profile
          </h3>

          <div className="form-row-2col">
            <div className="form-group-admin">
              <label>HOD Full Name</label>
              <input
                type="text"
                value={settings.hod_name}
                onChange={(e) => handleField('hod_name', e.target.value)}
                placeholder="e.g. Dr. Upinder Kaur"
              />
            </div>

            <div className="form-group-admin">
              <label>Designation Title</label>
              <input
                type="text"
                value={settings.hod_designation}
                onChange={(e) => handleField('hod_designation', e.target.value)}
                placeholder="e.g. Professor & Head of Department"
              />
            </div>
          </div>

          <div className="form-group-admin">
            <label>HOD Photograph</label>
            <MediaUploadField departmentId={selectedDeptId} mediaType="image" value={settings.hod_photo} category="Faculty" onUploaded={(file) => handleField('hod_photo', file.file_path)} />
          </div>

          <div className="form-group-admin">
            <label>HOD Welcome Message / Statement</label>
            <textarea
              rows={3}
              value={settings.hod_message}
              onChange={(e) => handleField('hod_message', e.target.value)}
              placeholder="Inspiring welcome remarks for prospective students and researchers..."
            />
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#087BB5', margin: '28px 0 16px', borderBottom: '1px solid #E2E8F0', paddingBottom: 6 }}>
            3. Department Office & Contact Information
          </h3>

          <div className="form-row-2col">
            <div className="form-group-admin">
              <label>Department Official Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => handleField('contact_email', e.target.value)}
                placeholder="dept@auts.ac.in"
              />
            </div>

            <div className="form-group-admin">
              <label>Office Telephone / Extension</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => handleField('contact_phone', e.target.value)}
                placeholder="+91-1655-257000"
              />
            </div>
          </div>

          <div className="form-group-admin">
            <label>Physical Office Location</label>
            <textarea
              rows={2}
              value={settings.contact_address}
              onChange={(e) => handleField('contact_address', e.target.value)}
              placeholder="e.g. Academic Block 2, Akal University Campus, Talwandi Sabo, Bathinda - 151302"
            />
          </div>

          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              className="btn-success"
              onClick={handleSubmitForReview}
              disabled={saving || loading}
            >
              <Send size={15} />
              <span>Submit Changes for Review</span>
            </button>

            <button type="submit" className="btn-primary" disabled={saving || loading}>
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Directly'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
