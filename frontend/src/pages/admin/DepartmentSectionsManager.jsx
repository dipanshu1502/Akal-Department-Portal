import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  Send,
  ExternalLink,
} from 'lucide-react';
import {
  getAdminDepartments,
  getDepartmentSections,
  createDepartmentSection,
  updateDepartmentSection,
  deleteDepartmentSection,
  reorderDepartmentSections,
  submitSectionForApproval,
  getSectionLayouts,
} from '../../services/api';
import SectionLayoutGallery from '../../components/page-builder/SectionLayoutGallery';
import SectionEditorModal from '../../components/page-builder/SectionEditorModal';

export default function DepartmentSectionsManager() {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [sections, setSections] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [chosenLayout, setChosenLayout] = useState('text');
  const [reorderDirty, setReorderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    Promise.all([getAdminDepartments(), getSectionLayouts()])
      .then(([depts, lay]) => {
        const list = Array.isArray(depts) ? depts : depts?.departments ?? [];
        setDepartments(list);
        setLayouts(Array.isArray(lay) ? lay : lay?.data ?? []);
        if (list.length > 0) {
          setSelectedDeptId(String(list[0].id));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const refreshSections = () => {
    if (!selectedDeptId) return;
    setLoading(true);
    getDepartmentSections(selectedDeptId)
      .then((data) => {
        setSections(Array.isArray(data) ? data : data?.data ?? []);
        setReorderDirty(false);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshSections();
  }, [selectedDeptId]);

  const handleLayoutChosen = (layoutKey) => {
    setChosenLayout(layoutKey);
    setSelectedSection(null);
    setGalleryOpen(false);
    setEditorOpen(true);
  };

  const handleEditSection = (sec) => {
    setSelectedSection(sec);
    setChosenLayout(sec.layout_type);
    setEditorOpen(true);
  };

  const handleSaveSection = async (formData) => {
    if (selectedSection?.id) {
      await updateDepartmentSection(selectedSection.id, formData);
    } else {
      await createDepartmentSection(selectedDeptId, formData);
    }
    refreshSections();
  };

  const handleSubmitForApproval = async (formData) => {
    let secId = selectedSection?.id;
    if (!secId) {
      const created = await createDepartmentSection(selectedDeptId, { ...formData, status: 'pending' });
      secId = created.id || created.data?.id;
    } else {
      await updateDepartmentSection(secId, formData);
    }

    if (secId) {
      await submitSectionForApproval(secId);
    }
    alert('Section successfully submitted to Super Admin for approval review!');
    refreshSections();
  };

  const handleDelete = async (sec) => {
    if (!window.confirm(`Delete section "${sec.title}"?`)) return;
    try {
      await deleteDepartmentSection(sec.id);
      refreshSections();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting section');
    }
  };

  const handleToggle = async (sec) => {
    try {
      await updateDepartmentSection(sec.id, { enabled: !sec.enabled });
      refreshSections();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  // Reorder functions
  const moveUp = (index) => {
    if (index === 0) return;
    const reordered = [...sections];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    setSections(reordered);
    setReorderDirty(true);
  };

  const moveDown = (index) => {
    if (index === sections.length - 1) return;
    const reordered = [...sections];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    setSections(reordered);
    setReorderDirty(true);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const payload = sections.map((sec, idx) => ({ id: sec.id, order: idx + 1 }));
      await reorderDepartmentSections(selectedDeptId, payload);
      setReorderDirty(false);
      refreshSections();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving order');
    } finally {
      setSavingOrder(false);
    }
  };

  const activeDept = departments.find((d) => String(d.id) === String(selectedDeptId));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#087BB5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Visual Page Builder
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#172333', margin: '4px 0 0' }}>
            Custom Section Layout Builder
          </h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
            Arrange and configure additional content sections using approved responsive layout components.
          </p>
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

          <button className="btn-primary" onClick={() => setGalleryOpen(true)}>
            <Plus size={16} />
            <span>Add New Section</span>
          </button>
        </div>
      </div>

      {/* Sections Table Panel */}
      <div className="admin-card-panel">
        <div className="panel-header-bar">
          <div>
            <h2>Sections for {activeDept?.name || 'Department'} ({sections.length})</h2>
            <p>Drag or use Move Up/Down to rearrange the display sequence on the public page.</p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {reorderDirty && (
              <button className="btn-success" onClick={handleSaveOrder} disabled={savingOrder}>
                <CheckCircle size={15} />
                <span>{savingOrder ? 'Saving...' : 'Save Reordered Sequence'}</span>
              </button>
            )}

            {activeDept?.slug && (
              <a
                href={`/departments/${activeDept.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="dept-explore-btn"
                style={{ fontSize: 13 }}
              >
                <span>Live Page</span> <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Order</th>
                <th>Section Title</th>
                <th>Layout Component</th>
                <th>Enabled</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 28, color: '#64748B' }}>
                    Loading custom sections...
                  </td>
                </tr>
              ) : sections.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 36, color: '#64748B' }}>
                    <Layers size={36} color="#94A3B8" style={{ marginBottom: 12 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No custom sections created yet.</p>
                    <small>Click "Add New Section" to select a predefined visual layout.</small>
                  </td>
                </tr>
              ) : (
                sections.map((sec, idx) => (
                  <tr key={sec.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, minWidth: 20 }}>{idx + 1}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            style={{ padding: 2 }}
                            disabled={idx === 0}
                            onClick={() => moveUp(idx)}
                            title="Move Up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            style={{ padding: 2 }}
                            disabled={idx === sections.length - 1}
                            onClick={() => moveDown(idx)}
                            title="Move Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong>{sec.title}</strong>
                      {sec.subtitle && (
                        <div style={{ fontSize: 12, color: '#64748B' }}>{sec.subtitle}</div>
                      )}
                    </td>

                    <td>
                      <span className="status-pill draft" style={{ fontSize: 11.5 }}>
                        {sec.layout_type.replace('_', ' ')}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggle(sec)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: sec.enabled !== false ? '#15803D' : '#94A3B8',
                        }}
                      >
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: sec.enabled !== false ? '#16A34A' : '#CBD5E1',
                        }} />
                        {sec.enabled !== false ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>

                    <td>
                      <span className={`status-pill ${sec.status || 'published'}`}>
                        {sec.status || 'published'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit Section Content"
                          onClick={() => handleEditSection(sec)}
                        >
                          <Edit size={16} color="#087BB5" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Delete Section"
                          onClick={() => handleDelete(sec)}
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

      {/* Layout Gallery Modal */}
      {galleryOpen && (
        <SectionLayoutGallery
          layouts={layouts}
          onSelect={handleLayoutChosen}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      {/* Section Editor Modal */}
      {editorOpen && (
        <SectionEditorModal
          section={selectedSection}
          departmentId={selectedDeptId}
          initialLayout={chosenLayout}
          onSave={handleSaveSection}
          onSubmitForApproval={handleSubmitForApproval}
          onClose={() => {
            setEditorOpen(false);
            setSelectedSection(null);
          }}
        />
      )}
    </div>
  );
}
