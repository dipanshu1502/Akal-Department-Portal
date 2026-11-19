import React, { useEffect, useState } from 'react';
import { Download, FileText, Image, Search, Trash2, Upload } from 'lucide-react';
import {
  deleteMedia,
  downloadMedia,
  getAdminDepartments,
  getMedia,
  getMediaCategories,
  createMediaCategory,
  deleteMediaCategory,
  replaceMedia,
  submitMedia,
  uploadMedia,
  updateMedia,
  updateMediaCategory,
} from '../../services/api';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [media, setMedia] = useState([]);
  const [filters, setFilters] = useState({ search: '', department_id: '', media_type: '', category_id: '' });
  const [departmentId, setDepartmentId] = useState('');
  const [fileType, setFileType] = useState('document');
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', media_type: 'document' });
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [isSuperAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('akal_portal_user') || '{}').role === 'super_admin';
    } catch {
      return false;
    }
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const refresh = () => {
    setLoading(true);
    getMedia(Object.fromEntries(Object.entries(filters).filter(([, value]) => value)))
      .then((items) => setMedia(Array.isArray(items) ? items : []))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load media library.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([getAdminDepartments(), getMediaCategories()])
      .then(([deptResult, categoryResult]) => {
        const list = Array.isArray(deptResult) ? deptResult : deptResult?.departments ?? [];
        setDepartments(list);
        if (list.length) {
          setDepartmentId(String(list[0].id));
          setFilters((current) => ({ ...current, department_id: list.length === 1 ? '' : current.department_id }));
        }
        setCategories(Array.isArray(categoryResult) ? categoryResult : []);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load upload options.'));
  }, []);

  useEffect(() => {
    refresh();
  }, [filters]);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!files.length || !departmentId) {
      setError('Choose a department and at least one file.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const uploadStatus = event.nativeEvent.submitter?.dataset.uploadStatus || 'pending';
      for (const file of files) {
        await uploadMedia(departmentId, file, {
          media_type: fileType,
          category_id: categoryId,
          status: uploadStatus,
          title: title || file.name.replace(/\.[^.]+$/, ''),
          description,
          alt_text: fileType === 'image' ? altText : '',
          caption: fileType === 'image' ? caption : '',
        }, (progress) => setUploadProgress(Math.round(((files.indexOf(file) + progress / 100) / files.length) * 100)));
      }
      setFiles([]);
      setTitle('');
      setDescription('');
      setAltText('');
      setCaption('');
      setUploadProgress(0);
      refresh();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Upload failed. Check the file type and size.');
      refresh();
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (item) => {
    try {
      const blob = await downloadMedia(item.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = item.original_name;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to download this file.');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Submit "${item.title}" for deletion approval?`)) return;
    try {
      await deleteMedia(item.id);
      refresh();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to request deletion.');
    }
  };

  const saveMetadata = async (item) => {
    try {
      await updateMedia(item.id, editFields);
      setEditingId(null);
      refresh();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save media details.');
    }
  };

  const handleReplace = async (item, event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      await replaceMedia(item.id, file);
      refresh();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to submit a file replacement.');
    }
  };

  const handleSubmitDraft = async (item) => {
    try {
      await submitMedia(item.id);
      refresh();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to submit this file for approval.');
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    try {
      const created = await createMediaCategory(newCategory);
      setCategories((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategory({ name: '', media_type: 'document' });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create media category.');
    }
  };

  const handleRenameCategory = async (category) => {
    const name = window.prompt('Category name', category.name)?.trim();
    if (!name || name === category.name) return;
    try {
      const updated = await updateMediaCategory(category.id, { name });
      setCategories((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to rename category.');
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await deleteMediaCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete category.');
    }
  };

  const availableCategories = categories.filter((item) => item.media_type === fileType || item.media_type === 'both');

  useEffect(() => {
    const urls = files.filter((file) => file.type.startsWith('image/')).map((file) => URL.createObjectURL(file));
    setFilePreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  return (
    <div className="media-library-page">
      <div className="media-library-heading">
        <div>
          <span className="media-library-kicker">Centralized department assets</span>
          <h1>Media Library</h1>
          <p>Upload documents and photos for Super Admin review. Only published media appears on public department pages.</p>
        </div>
      </div>

      {error && <div className="media-library-alert" role="alert">{error}</div>}

      <form className="media-library-upload admin-card-panel" onSubmit={handleUpload}>
        <div className="media-upload-title"><Upload size={18} /><h2>Upload files</h2></div>
        <div className="media-library-upload-grid">
          <label>Department
            <select value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} required>
              <option value="">Select department</option>
              {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
            </select>
          </label>
          <label>File type
            <select value={fileType} onChange={(event) => { setFileType(event.target.value); setFiles([]); setCategoryId(''); }}>
              <option value="document">Documents</option>
              <option value="image">Photos</option>
            </select>
          </label>
          <label>Category
            <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">Choose category</option>
              {availableCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label
            className="media-file-picker"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              setFiles(Array.from(event.dataTransfer.files || []));
            }}
          >
            <span>{files.length ? `${files.length} file(s) selected` : 'Drop files here or browse'}</span>
            <input
              type="file"
              multiple={fileType === 'image'}
              accept={fileType === 'image' ? '.jpg,.jpeg,.png,.webp' : '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt'}
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
            />
          </label>
        </div>
        <div className="media-library-upload-grid media-upload-metadata">
          <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Defaults to filename" /></label>
          <label>Description<input value={description} onChange={(event) => setDescription(event.target.value)} /></label>
          {fileType === 'image' && <label>Alternative text<input value={altText} onChange={(event) => setAltText(event.target.value)} /></label>}
          {fileType === 'image' && <label>Caption<input value={caption} onChange={(event) => setCaption(event.target.value)} /></label>}
        </div>
        {files.length > 0 && (
          <div className="media-selected-files">
            {files.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}`}>
                {filePreviews[index] && <img src={filePreviews[index]} alt={`Preview of ${file.name}`} />}
                <span>{file.name} · {formatBytes(file.size)}</span>
                <button type="button" className="media-remove-selection" onClick={() => setFiles((current) => current.filter((selected) => selected !== file))}>Remove</button>
              </div>
            ))}
          </div>
        )}
        {uploading && <progress className="media-library-progress" max="100" value={uploadProgress} aria-label="Upload progress" />}
        <div className="media-upload-footer">
          <small>Images up to 5 MB · documents up to 20 MB</small>
          <div className="media-upload-actions">
            <button type="submit" data-upload-status="draft" className="btn-secondary" disabled={uploading || !files.length}>Save Draft</button>
            <button type="submit" data-upload-status="pending" className="btn-primary" disabled={uploading || !files.length}>
              <Upload size={15} />{uploading ? 'Uploading…' : 'Submit for Approval'}
            </button>
          </div>
        </div>
      </form>

      {isSuperAdmin && (
        <div className="media-category-panel admin-card-panel">
          <form className="media-category-form" onSubmit={handleCreateCategory}>
            <strong>Manage categories</strong>
            <input required value={newCategory.name} onChange={(event) => setNewCategory({ ...newCategory, name: event.target.value })} placeholder="New category name" />
            <select value={newCategory.media_type} onChange={(event) => setNewCategory({ ...newCategory, media_type: event.target.value })}>
              <option value="document">Documents</option><option value="image">Images</option><option value="both">Both</option>
            </select>
            <button type="submit" className="btn-secondary">Add category</button>
          </form>
          <div className="media-category-list">
            {categories.map((category) => (
              <span key={category.id}>{category.name}<small>{category.media_type}</small>
                <button type="button" onClick={() => handleRenameCategory(category)}>Rename</button>
                <button type="button" onClick={() => handleDeleteCategory(category)}>Remove</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <section className="admin-card-panel media-library-panel">
        <div className="media-library-filters">
          <label className="media-search"><Search size={16} /><input value={filters.search} placeholder="Search title or filename" onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></label>
          <select value={filters.department_id} onChange={(event) => setFilters({ ...filters, department_id: event.target.value })}>
            <option value="">All departments</option>
            {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
          </select>
          <select value={filters.media_type} onChange={(event) => setFilters({ ...filters, media_type: event.target.value })}>
            <option value="">All file types</option><option value="document">Documents</option><option value="image">Images</option>
          </select>
          <select value={filters.category_id} onChange={(event) => setFilters({ ...filters, category_id: event.target.value })}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">All statuses</option><option value="draft">Draft</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="published">Published</option><option value="rejected">Rejected</option><option value="archived">Archived</option>
          </select>
          <label className="media-date-filter">From<input type="date" value={filters.date_from || ''} onChange={(event) => setFilters({ ...filters, date_from: event.target.value })} /></label>
          <label className="media-date-filter">To<input type="date" value={filters.date_to || ''} onChange={(event) => setFilters({ ...filters, date_to: event.target.value })} /></label>
        </div>

        {loading ? <p className="media-library-empty">Loading media…</p> : media.length === 0 ? (
          <p className="media-library-empty">No uploaded files match these filters.</p>
        ) : (
          <div className="media-library-grid">
            {media.map((item) => (
              <article className="media-library-card" key={item.id}>
                {item.media_type === 'image' ? (
                  <img className="media-card-preview" src={item.url} alt={item.alt_text || item.title} />
                ) : item.extension === 'pdf' ? (
                  <iframe className="media-card-preview" src={item.url} title={`Preview: ${item.title}`} />
                ) : (
                  <div className="media-card-document"><FileText size={34} /><span>{item.extension.toUpperCase()}</span></div>
                )}
                <div className="media-card-details">
                  <strong title={item.title}>{item.title}</strong>
                  <span>{item.department?.name} · {item.category?.name || 'Uncategorized'}</span>
                  <span>{formatBytes(item.file_size)} · {new Date(item.created_at).toLocaleDateString()}</span>
                  <span className={`status-pill ${item.status}`}>{item.delete_requested ? 'deletion pending' : item.status}</span>
                  <div className="media-card-actions">
                    <button type="button" className="btn-secondary" onClick={() => handleDownload(item)}><Download size={14} />Download</button>
                    {(item.status === 'draft' || item.status === 'rejected') && <button type="button" className="btn-primary" onClick={() => handleSubmitDraft(item)}>Submit</button>}
                    <button type="button" className="btn-secondary" onClick={() => { setEditingId(editingId === item.id ? null : item.id); setEditFields({ title: item.title, description: item.description || '', category_id: item.category_id || '', alt_text: item.alt_text || '', caption: item.caption || '', display_order: item.display_order }); }}>Edit</button>
                    <label className="media-replace-button">Replace<input type="file" accept={item.media_type === 'image' ? '.jpg,.jpeg,.png,.webp' : '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt'} onChange={(event) => handleReplace(item, event)} /></label>
                    <button type="button" className="btn-icon" title="Request deletion" onClick={() => handleDelete(item)}><Trash2 size={15} /></button>
                  </div>
                  {editingId === item.id && (
                    <div className="media-edit-fields">
                      <input value={editFields.title || ''} onChange={(event) => setEditFields({ ...editFields, title: event.target.value })} aria-label="Media title" />
                      <textarea value={editFields.description || ''} onChange={(event) => setEditFields({ ...editFields, description: event.target.value })} aria-label="Media description" placeholder="Description" />
                      {item.media_type === 'image' && <><input value={editFields.alt_text || ''} onChange={(event) => setEditFields({ ...editFields, alt_text: event.target.value })} aria-label="Alternative text" placeholder="Alternative text" /><input value={editFields.caption || ''} onChange={(event) => setEditFields({ ...editFields, caption: event.target.value })} aria-label="Image caption" placeholder="Caption" /></>}
                      <select value={editFields.category_id || ''} onChange={(event) => setEditFields({ ...editFields, category_id: event.target.value })}>
                        <option value="">Uncategorized</option>
                        {categories.filter((category) => category.media_type === item.media_type || category.media_type === 'both').map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                      </select>
                      {item.media_type === 'image' && <input type="number" min="0" value={editFields.display_order || 0} onChange={(event) => setEditFields({ ...editFields, display_order: Number(event.target.value) })} aria-label="Gallery order" />}
                      <button type="button" className="btn-primary" onClick={() => saveMetadata(item)}>Save details</button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
