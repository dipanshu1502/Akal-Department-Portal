import React from 'react';
import { Mail, Phone, MapPin, ArrowUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import AkalLogo from './AkalLogo';

/**
 * Akal University Footer
 * Matches https://auts.ac.in/ footer from Screenshot 2:
 * - Deep dark petrol blue background (#072C3F / #083247)
 * - Yellow circle address icon & "How to Reach" Google Map card
 * - Columns with bold white titles and yellow underline accents
 * - Full-width bright Akal Yellow bottom bar with Logo and "Copyright All Right Reserved 2023, Akal University"
 * - Circular yellow scroll to top button
 */
export default function UniversityFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="university-footer">
      {/* Upper Main Footer in Deep Petrol Blue */}
      <div className="university-container footer-body-container">
        <div className="footer-columns-grid">
          {/* Column 1: Address & Map (Exact match to Screenshot 2) */}
          <div className="footer-col address-map-col">
            <div className="address-with-icon">
              <div className="yellow-pin-circle">
                <MapPin size={20} />
              </div>
              <div className="address-text-lines">
                <span>Raman Road,</span>
                <span>Talwandi Sabo,</span>
                <span>Bathinda (Punjab), India-151302</span>
              </div>
            </div>

            <div className="how-to-reach-section">
              <span className="how-to-reach-title">How to Reach</span>
              <div className="map-card-wrapper">
                <div className="map-card-inner">
                  <div className="map-header">
                    <span className="map-pin-label">Akal University</span>
                    <span className="map-punjabi-label">ਅਕਾਲ ਯੂਨੀਵਰਸਿਟੀ</span>
                    <a
                      href="https://maps.google.com/?q=Akal+University+Talwandi+Sabo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-open-link"
                    >
                      Maps <ExternalLink size={11} />
                    </a>
                  </div>
                  {/* Embedded Google Map iframe / interactive view */}
                  <iframe
                    title="Akal University Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3448.9669049971933!2d75.0740925!3d29.986341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391136b69cfdca13%3A0xe968ca783f940ae0!2sAkal%20University!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="120"
                    style={{ border: 0, borderRadius: 4 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="map-attribution">
                    <span>Talwandi Sabo, Bathinda</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Cell/Centre (Exact match to Screenshot 2) */}
          <div className="footer-col">
            <h4 className="footer-col-title">Cell/Centre</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://auts.ac.in/sedg" target="_blank" rel="noopener noreferrer">
                  Socio-Economically Disadvantaged Groups Cell (SEDG)
                </a>
              </li>
              <li>
                <a href="https://auts.ac.in/counselling" target="_blank" rel="noopener noreferrer">
                  Counselling Cell
                </a>
              </li>
              <li>
                <a href="https://auts.ac.in/social-responsibility" target="_blank" rel="noopener noreferrer">
                  Social Responsibility
                </a>
              </li>
              <li>
                <a href="https://auts.ac.in/aic" target="_blank" rel="noopener noreferrer">
                  Akal Incubation Centre AIC
                </a>
              </li>
              <li>
                <a href="https://auts.ac.in/cce" target="_blank" rel="noopener noreferrer">
                  Center for Competitive Exams CCE
                </a>
              </li>
              <li>
                <a href="https://auts.ac.in/green-chemistry" target="_blank" rel="noopener noreferrer">
                  Green Chemistry Network Centre Chapter
                </a>
              </li>
              <li>
                <a href="https://auts.ac.in/students-services" target="_blank" rel="noopener noreferrer">
                  Students Services Center
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Policy & Downloads (Exact match to Screenshot 2) */}
          <div className="footer-col">
            <h4 className="footer-col-title">Policy & Resources</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://auts.ac.in/download" target="_blank" rel="noopener noreferrer">
                  Downloads
                </a>
              </li>
              <li>
                <a href="https://auts.ac.in/announcements" target="_blank" rel="noopener noreferrer">
                  Announcements
                </a>
              </li>
              <li style={{ marginTop: 12, marginBottom: 6 }}>
                <span className="policy-subheading">Policy</span>
              </li>
              <li>
                <a href="https://auts.ac.in/terms" target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="https://auts.ac.in/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="https://auts.ac.in/ugc-disclosures" target="_blank" rel="noopener noreferrer">
                  UGC Mandatory Disclosures
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: University Departments Portal */}
          <div className="footer-col">
            <h4 className="footer-col-title">Departments Portal</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/departments/computer-science-engineering">
                  Computer Science & Engineering
                </Link>
              </li>
              <li>
                <Link to="/departments/physics">
                  Department of Physics
                </Link>
              </li>
              <li>
                <Link to="/departments/chemistry">
                  Department of Chemistry
                </Link>
              </li>
              <li>
                <Link to="/departments/mathematics">
                  Department of Mathematics
                </Link>
              </li>
              <li>
                <Link to="/departments/commerce-management">
                  Commerce & Management
                </Link>
              </li>
              <li style={{ marginTop: 8 }}>
                <Link to="/departments" className="all-depts-link-pill">
                  View All Departments Directory →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Helpline & Verification */}
          <div className="footer-col helpline-col">
            <h4 className="footer-col-title">Admission Helpline</h4>
            <div className="footer-contact-row">
              <Phone size={15} className="contact-icon" />
              <div>
                <span className="contact-type">24x7 Toll-Free:</span>
                <a href="tel:18002020100" className="contact-val">1800-2020-100</a>
              </div>
            </div>
            <div className="footer-contact-row">
              <Mail size={15} className="contact-icon" />
              <div>
                <span className="contact-type">General Email:</span>
                <a href="mailto:info@auts.ac.in" className="contact-val">info@auts.ac.in</a>
              </div>
            </div>
            <div className="footer-contact-row">
              <Mail size={15} className="contact-icon" />
              <div>
                <span className="contact-type">Admissions Email:</span>
                <a href="mailto:admission@auts.ac.in" className="contact-val">admission@auts.ac.in</a>
              </div>
            </div>

            <div className="footer-admin-link-box">
              <Link to="/admin/login" className="footer-admin-link">
                Staff & Admin Portal Sign In →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Bright Akal Yellow Bottom Bar (Exact match to Screenshot 2) */}
      <div className="auts-bottom-gold-bar">
        <div className="university-container bottom-gold-inner">
          {/* Logo on Left in Navy */}
          <div className="gold-bar-logo">
            <AkalLogo variant="yellow-bg" size="small" showTagline={true} />
          </div>

          {/* Copyright on Right */}
          <div className="gold-bar-copyright">
            <span>Copyright All Right Reserved 2023, Akal University</span>
          </div>
        </div>
      </div>

      {/* Floating Circular Yellow Scroll to Top Button */}
      <button
        className="auts-back-to-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>
    </footer>
  );
}
