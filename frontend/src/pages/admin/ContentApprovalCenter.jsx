import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  Globe,
  Clock,
  MessageSquare,
  Eye,
  X,
  Send,
  AlertTriangle,
} from 'lucide-react';
import {
  getRevisions,
  approveRevision,
  rejectRevision,
  publishRevision,
  getPendingMedia,
  approveMedia,
  rejectMedia,
  publishMedia,
} from '../../services/api';

export default function ContentApprovalCenter() {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // all, pending, approved, rejected, published

  // Modal
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [rejectComments, setRejectComments] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaComments, setMediaComments] = useState('');

  const fetchRevisions = () => {
    setLoading(true);
    if (activeTab === 'media') {
      getPendingMedia()
        .then((data) => setMediaItems(Array.isArray(data) ? data : []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
      return;
    }
    getRevisions({ status: activeTab === 'all' ? '' : activeTab })
      .then((data) => {
        setRevisions(Array.isArray(data) ? data : data?.data ?? []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRevisions();
  }, [activeTab]);

  const handleApprove = async (rev) => {
    if (!window.confirm(`Approve submission "${rev.title}"?`)) return;
    setActionLoading(true);
    try {
      await approveRevision(rev.id, 'Approved by Super Admin.');
      setSelectedRevision(null);
      fetchRevisions();
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving revision');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectComments.trim()) {
      alert('Please provide feedback comments explaining the rejection reasons.');
      return;
    }

    setActionLoading(true);
    try {
      await rejectRevision(selectedRevision.id, rejectComments.trim());
      setShowRejectForm(false);
      setSelectedRevision(null);
      setRejectComments('');
      fetchRevisions();
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting revision');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async (rev) => {
    if (!window.confirm(`Publish "${rev.title}" directly to the live department website?`)) return;
    setActionLoading(true);
    try {
      await publishRevision(rev.id);
      setSelectedRevision(null);
      fetchRevisions();
    } catch (err) {
      alert(err.response?.data?.message || 'Error publishing revision');
    } finally {
      setActionLoading(false);
    }
  };

  const reviewMediaAction = async (action) => {
    setActionLoading(true);
    try {
      if (action === 'approve') await approveMedia(selectedMedia.id, mediaComments);
      if (action === 'reject') {
        if (!mediaComments.trim()) {
          alert('Enter feedback before rejecting media.');
          return;
        }
        await rejectMedia(selectedMedia.id, mediaComments.trim());
      }
      if (action === 'publish') await publishMedia(selectedMedia.id);
      setSelectedMedia(null);
      setMediaComments('');
      fetchRevisions();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update media review.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#087BB5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quality Governance & Verification
        </span>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#172333', margin: '4px 0 0' }}>
          Content Approval & Publishing Center
        </h1>
        <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
          Review content submissions from Department Administrators before they become visible on the public website.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
        {[
          { key: 'pending', label: 'Pending Review' },
          { key: 'approved', label: 'Approved (Ready to Publish)' },
          { key: 'published', label: 'Published Live' },
          { key: 'rejected', label: 'Rejected with Feedback' },
          { key: 'media', label: 'Media Review' },
          { key: 'all', label: 'All Submissions' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`quick-pill ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'media' ? (
      <div className="admin-card-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>File</th><th>Department</th><th>Type / Category</th><th>Status</th><th>Uploaded</th><th style={{ textAlign: 'right' }}>Review</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 28 }}>Loading media review queue…</td></tr> : mediaItems.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 36 }}>No media awaiting review.</td></tr>
              ) : mediaItems.map((media) => (
                <tr key={media.id}>
                  <td><strong>{media.title}</strong><div style={{ fontSize: 12, color: '#64748B' }}>{media.original_name}</div></td>
                  <td>{media.department?.name}</td>
                  <td>{media.media_type} · {media.category?.name || 'Uncategorized'}</td>
                  <td><span className={`status-pill ${media.delete_requested ? 'pending' : media.status}`}>{media.delete_requested ? 'deletion requested' : media.status}</span></td>
                  <td>{new Date(media.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}><button type="button" className="btn-primary" onClick={() => { setSelectedMedia(media); setMediaComments(''); }}>Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
      <>
      {/* Revisions Table Panel */}
      <div className="admin-card-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Submission Title</th>
                <th>Department</th>
                <th>Submitted By</th>
                <th>Status</th>
                <th>Submission Date</th>
                <th style={{ textAlign: 'right' }}>Review Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 28, color: '#64748B' }}>
                    Loading revisions queue...
                  </td>
                </tr>
              ) : revisions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 36, color: '#64748B' }}>
                    <CheckSquare size={36} color="#94A3B8" style={{ marginBottom: 12 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No revisions in this category.</p>
                  </td>
                </tr>
              ) : (
                revisions.map((rev) => (
                  <tr key={rev.id}>
                    <td>
                      <strong>{rev.title}</strong>
                      <div style={{ fontSize: 11.5, color: '#64748B' }}>
                        Model: <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{rev.model_type}</span>
                        {rev.section && ` · Section #${rev.section.id}`}
                      </div>
                    </td>
                    <td><strong>{rev.department?.name || 'Department'}</strong></td>
                    <td>{rev.submitter?.name || rev.submitter?.email || 'Dept Admin'}</td>
                    <td>
                      <span className={`status-pill ${rev.status}`}>
                        {rev.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5, color: '#64748B' }}>
                      {rev.submitted_at ? new Date(rev.submitted_at).toLocaleString() : new Date(rev.created_at).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: 12.5 }}
                        onClick={() => {
                          setSelectedRevision(rev);
                          setShowRejectForm(false);
                          setRejectComments('');
                        }}
                      >
                        <Eye size={13} />
                        <span>Inspect & Decide</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {selectedMedia && (
        <div className="modal-overlay">
          <div className="modal-dialog-box modal-lg">
            <div className="modal-head">
              <div><h3>Review Media: {selectedMedia.title}</h3><span>{selectedMedia.department?.name} · {selectedMedia.original_name}</span></div>
              <button className="btn-icon" onClick={() => setSelectedMedia(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {selectedMedia.media_type === 'image' ? (
                <img src={selectedMedia.url} alt={selectedMedia.alt_text || selectedMedia.title} style={{ maxWidth: '100%', maxHeight: 360, objectFit: 'contain' }} />
              ) : (
                <a href={selectedMedia.url} target="_blank" rel="noopener noreferrer">Preview / download {selectedMedia.original_name}</a>
              )}
              <p>{selectedMedia.description || selectedMedia.caption}</p>
              <label>Reviewer feedback
                <textarea rows={3} value={mediaComments} onChange={(event) => setMediaComments(event.target.value)} />
              </label>
              {selectedMedia.review_comments && <p><strong>Previous feedback:</strong> {selectedMedia.review_comments}</p>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setSelectedMedia(null)}>Close</button>
              {selectedMedia.status === 'approved' && !selectedMedia.delete_requested && (
                <button type="button" className="btn-success" disabled={actionLoading} onClick={() => reviewMediaAction('publish')}>Publish</button>
              )}
              {selectedMedia.status === 'pending' || selectedMedia.delete_requested ? (
                <>
                  <button type="button" className="btn-danger" disabled={actionLoading} onClick={() => reviewMediaAction('reject')}>Reject</button>
                  <button type="button" className="btn-success" disabled={actionLoading} onClick={() => reviewMediaAction('approve')}>{selectedMedia.delete_requested ? 'Approve deletion' : 'Approve'}</button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Review & Decision Modal */}
      {selectedRevision && (
        <div className="modal-overlay">
          <div className="modal-dialog-box modal-lg">
            <div className="modal-head">
              <div>
                <h3>Review Submission: {selectedRevision.title}</h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                  <span className={`status-pill ${selectedRevision.status}`}>
                    {selectedRevision.status}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748B' }}>
                    Dept: <strong>{selectedRevision.department?.name}</strong>
                  </span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setSelectedRevision(null)}><X size={20} /></button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}>
                  <div style={{ color: '#64748B', fontWeight: 600 }}>Submitted by:</div>
                  <strong>{selectedRevision.submitter?.name || 'Department Administrator'}</strong> ({selectedRevision.submitter?.email})
                </div>

                <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}>
                  <div style={{ color: '#64748B', fontWeight: 600 }}>Submission Timestamp:</div>
                  <strong>{new Date(selectedRevision.created_at).toLocaleString()}</strong>
                </div>
              </div>

              {selectedRevision.review_comments && (
                <div style={{
                  backgroundColor: selectedRevision.status === 'rejected' ? '#FEF2F2' : '#F0FDF4',
                  border: `1px solid ${selectedRevision.status === 'rejected' ? '#F87171' : '#86EFAC'}`,
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 20,
                }}>
                  <strong style={{ color: selectedRevision.status === 'rejected' ? '#B91C1C' : '#15803D', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageSquare size={14} /> Reviewer Feedback:
                  </strong>
                  <p style={{ margin: '6px 0 0', fontSize: 13.5, color: '#334155', fontStyle: 'italic' }}>
                    "{selectedRevision.review_comments}"
                  </p>
                </div>
              )}

              {/* Proposed Payload Content Details */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px', color: '#172333' }}>
                  Proposed Revision Payload:
                </h4>
                <div style={{
                  backgroundColor: '#0F172A',
                  color: '#38BDF8',
                  padding: 16,
                  borderRadius: 8,
                  fontFamily: 'monospace',
                  fontSize: 12.5,
                  maxHeight: 280,
                  overflowY: 'auto',
                }}>
                  <pre style={{ margin: 0 }}>
                    {JSON.stringify(selectedRevision.payload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Reject Form */}
              {showRejectForm && (
                <form onSubmit={handleReject} style={{ backgroundColor: '#FEF2F2', padding: 18, borderRadius: 8, border: '1px solid #FCA5A5', marginTop: 16 }}>
                  <h4 style={{ color: '#B91C1C', margin: '0 0 8px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={16} /> Enter Rejection Reason / Guidance:
                  </h4>
                  <p style={{ fontSize: 12.5, color: '#7F1D1D', margin: '0 0 10px' }}>
                    Please explain why this revision cannot be published so the department admin can make corrections.
                  </p>
                  <textarea
                    rows={3}
                    value={rejectComments}
                    onChange={(e) => setRejectComments(e.target.value)}
                    placeholder="e.g. Please format the research citations according to IEEE standards and re-submit."
                    required
                    style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #F87171', fontSize: 13 }}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowRejectForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-danger" disabled={actionLoading}>
                      Confirm Rejection
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button type="button" className="btn-secondary" onClick={() => setSelectedRevision(null)}>
                Close
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                {selectedRevision.status === 'pending' && !showRejectForm && (
                  <>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => setShowRejectForm(true)}
                      disabled={actionLoading}
                    >
                      <XCircle size={15} />
                      <span>Reject with Feedback</span>
                    </button>

                    <button
                      type="button"
                      className="btn-success"
                      onClick={() => handleApprove(selectedRevision)}
                      disabled={actionLoading}
                    >
                      <CheckCircle size={15} />
                      <span>Approve Submission</span>
                    </button>
                  </>
                )}

                {(selectedRevision.status === 'approved' || selectedRevision.status === 'pending') && !showRejectForm && (
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ backgroundColor: '#15803D' }}
                    onClick={() => handlePublish(selectedRevision)}
                    disabled={actionLoading}
                  >
                    <Globe size={15} />
                    <span>Publish Directly to Live Page</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
