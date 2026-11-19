import React, { useState } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, Send, Save } from 'lucide-react';
import SectionRenderer from './SectionRenderer';
import MediaUploadField from '../media/MediaUploadField';

export default function SectionEditorModal({
  section = null,
  initialLayout = 'text',
  onSave,
  onSubmitForApproval,
  onClose,
  departmentId,
}) {
  const isEditing = Boolean(section?.id);

  const [form, setForm] = useState({
    title: section?.title || 'New Section',
    subtitle: section?.subtitle || '',
    layout_type: section?.layout_type || initialLayout,
    enabled: section?.enabled !== false,
    settings: section?.settings || { background: 'white', columns: 3 },
    content: section?.content || (
      initialLayout === 'card_grid' || initialLayout === 'timeline' || initialLayout === 'statistics' || initialLayout === 'gallery' || initialLayout === 'accordion'
        ? { items: [] }
        : { body: '' }
    ),
  });

  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Field change helper
  const handleField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSetting = (key, val) => {
    setForm((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: val },
    }));
  };

  const handleContentField = (key, val) => {
    setForm((prev) => ({
      ...prev,
      content: { ...prev.content, [key]: val },
    }));
  };

  // Item list helper for grid, timeline, stats, faqs, gallery
  const items = Array.isArray(form.content)
    ? form.content
    : form.content?.items || [];

  const updateItem = (index, key, val) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: val };
    setForm((prev) => ({
      ...prev,
      content: { ...prev.content, items: updated },
    }));
  };

  const addItem = (defaultObj) => {
    setForm((prev) => ({
      ...prev,
      content: { ...prev.content, items: [...items, defaultObj] },
    }));
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      content: { ...prev.content, items: updated },
    }));
  };

  const handleSaveDirect = async () => {
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      alert(e.message || 'Error saving section');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    setSaving(true);
    try {
      if (onSubmitForApproval) {
        await onSubmitForApproval(form);
      }
      onClose();
    } catch (e) {
      alert(e.message || 'Error submitting for review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog-box modal-lg">
        <div className="modal-head">
          <div>
            <h3>{isEditing ? `Edit Section: ${form.title}` : 'Build New Section'}</h3>
            <span className="status-pill draft" style={{ marginTop: 4 }}>
              Layout: {form.layout_type}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showPreview ? 'Hide Preview' : 'Live Preview'}</span>
            </button>
            <button className="btn-icon" onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        <div className="modal-body">
          {showPreview ? (
            <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 16, background: '#FFFFFF' }}>
              <span className="topbar-badge" style={{ marginBottom: 12 }}>Preview Mode</span>
              <SectionRenderer section={form} />
            </div>
          ) : (
            <>
              <div className="form-row-2col">
                <div className="form-group-admin">
                  <label>Section Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleField('title', e.target.value)}
                    placeholder="e.g. Research Highlights, Vision & Mission"
                    required
                  />
                </div>

                <div className="form-group-admin">
                  <label>Subtitle / Category Kicker</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => handleField('subtitle', e.target.value)}
                    placeholder="e.g. Academic Excellence, Student Life"
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group-admin">
                  <label>Background Style</label>
                  <select
                    value={form.settings.background || 'white'}
                    onChange={(e) => handleSetting('background', e.target.value)}
                  >
                    <option value="white">Clean White</option>
                    <option value="light">Subtle Light Grey (#F8FAFC)</option>
                  </select>
                </div>

                <div className="form-group-admin" style={{ display: 'flex', alignItems: 'center', paddingTop: 26 }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.enabled}
                      onChange={(e) => handleField('enabled', e.target.checked)}
                      style={{ width: 'auto' }}
                    />
                    <span>Section is Enabled & Visible</span>
                  </label>
                </div>
              </div>

              {/* Dynamic layout-specific editors */}
              {form.layout_type === 'text' && (
                <div className="form-group-admin">
                  <label>Content Body (Markdown / Text)</label>
                  <textarea
                    rows={6}
                    value={form.content.body || ''}
                    onChange={(e) => handleContentField('body', e.target.value)}
                    placeholder="Enter detailed paragraph text for this section..."
                  />
                </div>
              )}

              {form.layout_type === 'image_text' && (
                <>
                  <div className="form-row-2col">
                    <div className="form-group-admin">
                      <label>Section Image</label>
                      <MediaUploadField departmentId={departmentId} mediaType="image" value={form.content.image} category="Department Gallery" onUploaded={(file) => handleContentField('image', file.file_path)} />
                    </div>
                    <div className="form-group-admin">
                      <label>Image Position</label>
                      <select
                        value={form.content.image_position || 'right'}
                        onChange={(e) => handleContentField('image_position', e.target.value)}
                      >
                        <option value="right">Image on Right, Text on Left</option>
                        <option value="left">Image on Left, Text on Right</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group-admin">
                    <label>Description Narrative</label>
                    <textarea
                      rows={5}
                      value={form.content.body || ''}
                      onChange={(e) => handleContentField('body', e.target.value)}
                    />
                  </div>
                </>
              )}

              {form.layout_type === 'card_grid' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 14 }}>Card Items ({items.length})</h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => addItem({ title: 'New Card', description: '', image: '', link: '' })}
                    >
                      <Plus size={14} /> Add Card
                    </button>
                  </div>

                  {items.map((item, idx) => (
                    <div key={idx} className="editor-item-card">
                      <button type="button" className="item-delete-btn" onClick={() => removeItem(idx)}>
                        <Trash2 size={16} />
                      </button>
                      <div className="form-row-2col">
                        <div className="form-group-admin">
                          <label>Card Title</label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => updateItem(idx, 'title', e.target.value)}
                          />
                        </div>
                        <div className="form-group-admin">
                          <label>Optional Link</label>
                          <input
                            type="text"
                            value={item.link || ''}
                            onChange={(e) => updateItem(idx, 'link', e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <div className="form-group-admin">
                        <label>Description</label>
                        <textarea
                          rows={2}
                          value={item.description || ''}
                          onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Card Image</label>
                        <MediaUploadField departmentId={departmentId} mediaType="image" value={item.image} category="Department Gallery" onUploaded={(file) => updateItem(idx, 'image', file.file_path)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {form.layout_type === 'gallery' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 14 }}>Gallery Photos ({items.length})</h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => addItem({ title: '', description: '', image: '' })}
                    >
                      <Plus size={14} /> Add Photo
                    </button>
                  </div>
                  {items.map((item, idx) => (
                    <div key={idx} className="editor-item-card">
                      <button type="button" className="item-delete-btn" onClick={() => removeItem(idx)}>
                        <Trash2 size={16} />
                      </button>
                      <div className="form-group-admin">
                        <label>Photo Title</label>
                        <input type="text" value={item.title || ''} onChange={(event) => updateItem(idx, 'title', event.target.value)} />
                      </div>
                      <div className="form-group-admin">
                        <label>Photo</label>
                        <MediaUploadField departmentId={departmentId} mediaType="image" value={item.image} category="Department Gallery" onUploaded={(file) => updateItem(idx, 'image', file.file_path)} />
                      </div>
                      <div className="form-group-admin">
                        <label>Caption</label>
                        <input type="text" value={item.description || ''} onChange={(event) => updateItem(idx, 'description', event.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {form.layout_type === 'timeline' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 14 }}>Milestone Entries ({items.length})</h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => addItem({ date: '2026', title: 'Milestone Title', description: '' })}
                    >
                      <Plus size={14} /> Add Milestone
                    </button>
                  </div>

                  {items.map((item, idx) => (
                    <div key={idx} className="editor-item-card">
                      <button type="button" className="item-delete-btn" onClick={() => removeItem(idx)}>
                        <Trash2 size={16} />
                      </button>
                      <div className="form-row-2col">
                        <div className="form-group-admin">
                          <label>Date / Year / Phase</label>
                          <input
                            type="text"
                            value={item.date || ''}
                            onChange={(e) => updateItem(idx, 'date', e.target.value)}
                            placeholder="e.g. 2024 or Phase 1"
                          />
                        </div>
                        <div className="form-group-admin">
                          <label>Title</label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => updateItem(idx, 'title', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group-admin">
                        <label>Description</label>
                        <textarea
                          rows={2}
                          value={item.description || ''}
                          onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {form.layout_type === 'banner' && (
                <>
                  <div className="form-group-admin">
                    <label>Banner Message Callout</label>
                    <textarea
                      rows={3}
                      value={form.content.body || ''}
                      onChange={(e) => handleContentField('body', e.target.value)}
                      placeholder="Prominent message displayed on highlighted background..."
                    />
                  </div>
                  <div className="form-row-2col">
                    <div className="form-group-admin">
                      <label>Call-to-Action Button Label</label>
                      <input
                        type="text"
                        value={form.content.cta_label || ''}
                        onChange={(e) => handleContentField('cta_label', e.target.value)}
                        placeholder="e.g. Apply Now, Contact Dept"
                      />
                    </div>
                    <div className="form-group-admin">
                      <label>Button Link</label>
                      <input
                        type="text"
                        value={form.content.cta_link || ''}
                        onChange={(e) => handleContentField('cta_link', e.target.value)}
                        placeholder="https://... or #contact"
                      />
                    </div>
                  </div>
                </>
              )}

              {form.layout_type === 'statistics' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 14 }}>Statistics Metrics ({items.length})</h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => addItem({ value: '100+', label: 'Metric Label' })}
                    >
                      <Plus size={14} /> Add Stat
                    </button>
                  </div>

                  {items.map((item, idx) => (
                    <div key={idx} className="editor-item-card">
                      <button type="button" className="item-delete-btn" onClick={() => removeItem(idx)}>
                        <Trash2 size={16} />
                      </button>
                      <div className="form-row-2col">
                        <div className="form-group-admin">
                          <label>Stat Value (Big Figure)</label>
                          <input
                            type="text"
                            value={item.value || ''}
                            onChange={(e) => updateItem(idx, 'value', e.target.value)}
                            placeholder="e.g. 95% or 40+ or ₹12 LPA"
                          />
                        </div>
                        <div className="form-group-admin">
                          <label>Stat Label</label>
                          <input
                            type="text"
                            value={item.label || ''}
                            onChange={(e) => updateItem(idx, 'label', e.target.value)}
                            placeholder="e.g. Placement Rate"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {form.layout_type === 'accordion' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 14 }}>Q&A FAQ Items ({items.length})</h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => addItem({ question: 'New Question?', answer: '' })}
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>

                  {items.map((item, idx) => (
                    <div key={idx} className="editor-item-card">
                      <button type="button" className="item-delete-btn" onClick={() => removeItem(idx)}>
                        <Trash2 size={16} />
                      </button>
                      <div className="form-group-admin">
                        <label>Question / Heading</label>
                        <input
                          type="text"
                          value={item.question || ''}
                          onChange={(e) => updateItem(idx, 'question', e.target.value)}
                          placeholder="e.g. What are the eligibility criteria?"
                        />
                      </div>
                      <div className="form-group-admin">
                        <label>Answer / Collapsible Text</label>
                        <textarea
                          rows={2}
                          value={item.answer || ''}
                          onChange={(e) => updateItem(idx, 'answer', e.target.value)}
                          placeholder="Detailed answer text..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSaveDirect} disabled={saving}>
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Draft Section'}</span>
          </button>
          <button
            className="btn-success"
            onClick={handleSubmitReview}
            disabled={saving}
            title="Submits this section to Super Admin for official review and publication"
          >
            <Send size={15} />
            <span>Submit for Super Admin Review</span>
          </button>
        </div>
      </div>
    </div>
  );
}
