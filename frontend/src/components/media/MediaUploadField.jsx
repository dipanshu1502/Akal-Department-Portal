import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { getMedia, getMediaCategories, replaceMedia, uploadMedia } from '../../services/api';

const acceptByType = {
  document: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt',
  image: '.jpg,.jpeg,.png,.webp',
};

export default function MediaUploadField({
  departmentId,
  mediaType,
  value = '',
  category = '',
  title = '',
  description = '',
  altText = '',
  caption = '',
  multiple = false,
  onUploaded,
}) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    getMediaCategories()
      .then((items) => {
        const matching = (Array.isArray(items) ? items : []).filter((item) => item.media_type === mediaType || item.media_type === 'both');
        setCategories(matching);
        const selected = matching.find((item) => item.name.toLowerCase() === category.toLowerCase());
        setCategoryId(selected ? String(selected.id) : '');
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Unable to load media categories.');
      });
  }, [mediaType, category]);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length || !departmentId) return;

    setError('');
    setUploading(true);
    setProgress(0);
    const uploaded = [];
    try {
      const currentMedia = value
        ? (await getMedia({ media_type: mediaType })).find((media) => media.file_path === value)
        : null;
      for (let index = 0; index < files.length; index += 1) {
        const metadata = {
          category_id: categoryId,
          title: title || files[index].name.replace(/\.[^.]+$/, ''),
          description,
          alt_text: altText,
          caption,
        };
        const reportProgress = (percent) => setProgress(Math.round(((index + percent / 100) / files.length) * 100));
        const media = index === 0 && currentMedia
          ? await replaceMedia(currentMedia.id, files[index], metadata, reportProgress)
          : await uploadMedia(
            departmentId,
            files[index],
            { ...metadata, media_type: mediaType, status: 'pending' },
            reportProgress,
          );
        uploaded.push(media);
      }
      setUploadedFiles((existing) => [...uploaded, ...existing]);
      onUploaded?.(multiple ? uploaded : uploaded[0]);
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="media-upload-field">
      {categories.length > 0 && (
        <select
          aria-label="Upload category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          disabled={uploading}
        >
          <option value="">Select category (optional)</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      )}
      <label className="media-upload-button">
        <Upload size={15} />
        <span>{uploading ? `Uploading ${progress}%` : multiple ? 'Choose photos' : `Upload ${mediaType}`}</span>
        <input
          type="file"
          accept={acceptByType[mediaType]}
          multiple={multiple}
          onChange={handleFiles}
          disabled={uploading || !departmentId}
          hidden
        />
      </label>
      {uploading && <progress max="100" value={progress} aria-label="Upload progress" />}
      {value && !uploadedFiles.length && <small className="media-upload-status">Current file: {value.split(/[\\/]/).pop()}</small>}
      {uploadedFiles.map((file) => (
        <div className="media-upload-status" key={file.id}>
          <CheckCircle size={14} />
          <span>{file.original_name} · Pending approval</span>
          <button type="button" onClick={() => setUploadedFiles((items) => items.filter((item) => item.id !== file.id))} aria-label="Dismiss upload confirmation">
            <X size={14} />
          </button>
        </div>
      ))}
      {error && <small className="media-upload-error"><AlertCircle size={14} />{error}</small>}
      <small className="media-upload-help">
        {mediaType === 'image' ? 'JPG, PNG or WEBP · max 5 MB' : 'PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX or TXT · max 20 MB'}
      </small>
    </div>
  );
}
