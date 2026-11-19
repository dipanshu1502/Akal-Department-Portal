import React, { useState } from 'react';
import { X, Send, CheckCircle2, Phone, Mail } from 'lucide-react';

/**
 * Akal University Floating "Enquiry Now" Sticky Tab & Modal
 * Matches the magenta side tab seen on https://auts.ac.in/
 */
export default function EnquiryStickyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science & Engineering',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Computer Science & Engineering',
        message: '',
      });
    }, 2500);
  };

  return (
    <>
      {/* Sticky Right Tab */}
      <button
        className="auts-enquiry-sticky-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open admission enquiry form"
      >
        <span className="enquiry-btn-text">Enquiry Now</span>
      </button>

      {/* Enquiry Modal */}
      {isOpen && (
        <div className="auts-enquiry-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="auts-enquiry-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-modal-title"
          >
            <div className="enquiry-modal-header">
              <div className="modal-title-wrap">
                <span className="enquiry-badge">Akal University Admissions</span>
                <h3 id="enquiry-modal-title">Admission Enquiry 2026-27</h3>
                <p>Have questions regarding programmes, fees, or eligibility? Contact our counselling cell.</p>
              </div>
              <button
                className="close-enquiry-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close enquiry modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="enquiry-modal-body">
              {submitted ? (
                <div className="enquiry-success-message">
                  <CheckCircle2 size={52} color="#16A34A" />
                  <h4>Thank You for Reaching Out!</h4>
                  <p>Our academic counsellor will contact you shortly via phone or email.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="enquiry-form">
                  <div className="form-group-item">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group-item">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group-item">
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group-item">
                    <label>Interested Department / Programme</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering (B.Tech / BCA / MCA)</option>
                      <option value="Department of Physics">Department of Physics (B.Sc / M.Sc / Ph.D)</option>
                      <option value="Department of Chemistry">Department of Chemistry (B.Sc / M.Sc / Ph.D)</option>
                      <option value="Department of Mathematics">Department of Mathematics (B.Sc / M.Sc / Ph.D)</option>
                      <option value="Commerce & Management">Commerce & Management (B.Com / BBA / MBA)</option>
                      <option value="Humanities & Social Sciences">Humanities & Social Sciences (BA / MA)</option>
                    </select>
                  </div>

                  <div className="form-group-item">
                    <label>Your Query (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Mention your queries regarding admissions, scholarships or syllabus..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="submit-enquiry-btn">
                    <Send size={16} />
                    <span>Submit Admission Enquiry</span>
                  </button>

                  <div className="enquiry-direct-help">
                    <span>Or call directly:</span>
                    <a href="tel:18002020100" className="direct-call-link">
                      <Phone size={13} />
                      <strong>1800-2020-100</strong> (Toll-Free)
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
