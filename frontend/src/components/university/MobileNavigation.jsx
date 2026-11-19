import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, Shield, X, Phone, Mail } from 'lucide-react';
import AkalLogo from './AkalLogo';

export default function MobileNavigation({ isOpen, onClose, faculties = [] }) {
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [openFacultyId, setOpenFacultyId] = useState(null);
  const token = localStorage.getItem('akal_portal_token');
  const user = JSON.parse(localStorage.getItem('akal_portal_user') || 'null');
  const adminPath = user?.role === 'super_admin' ? '/admin/super' : user?.role === 'department_admin' ? '/admin/department' : '/admin/login';

  if (!isOpen) return null;

  return (
    <div className={`mobile-menu-drawer ${isOpen ? 'open' : ''}`}>
      <div className="mobile-drawer-header" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
        <AkalLogo variant="default" size="small" showTagline={true} />
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', padding: 6, cursor: 'pointer', color: '#172333' }}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <div style={{ padding: '12px 16px' }}>
        <a
          href="https://auts.ac.in/how-to-apply"
          target="_blank"
          rel="noopener noreferrer"
          className="admission-open-cta-btn"
          style={{ width: '100%', textAlign: 'center', display: 'block', marginBottom: 12 }}
        >
          ADMISSION OPEN 2026-27
        </a>
      </div>

      <ul className="mobile-nav-list" style={{ listStyle: 'none', padding: '0 16px', margin: 0 }}>
        <li className="mobile-nav-item">
          <NavLink to="/" className="mobile-nav-header" onClick={onClose}>
            Home
          </NavLink>
        </li>

        <li className="mobile-nav-item">
          <a href="https://auts.ac.in/about-us" className="mobile-nav-header" target="_blank" rel="noopener noreferrer">
            About Us
          </a>
        </li>

        <li className="mobile-nav-item">
          <NavLink to="/departments" className="mobile-nav-header" onClick={onClose}>
            Departments Directory
          </NavLink>
        </li>

        <li className="mobile-nav-item">
          <button
            className="mobile-nav-header"
            onClick={() => setAcademicsOpen(!academicsOpen)}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', cursor: 'pointer' }}
          >
            <span style={{ fontWeight: 600, color: '#172333' }}>Academic Faculties</span>
            {academicsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {academicsOpen && (
            <ul className="mobile-submenu" style={{ listStyle: 'none', paddingLeft: 12, margin: '6px 0' }}>
              {faculties.map((faculty) => (
                <li key={faculty.id} style={{ marginBottom: 8 }}>
                  <button
                    type="button"
                    onClick={() => setOpenFacultyId(openFacultyId === faculty.id ? null : faculty.id)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', border: 0, background: 'none', textAlign: 'left', fontWeight: 600, color: '#172333' }}
                  >
                    {faculty.name}
                    {openFacultyId === faculty.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {openFacultyId === faculty.id && (
                    <ul style={{ listStyle: 'none', paddingLeft: 12, margin: '4px 0' }}>
                      {faculty.departments?.length > 0 ? faculty.departments.map((department) => (
                        <li key={department.id}>
                          <NavLink
                            to={`/departments/${department.slug}`}
                            className="mobile-sub-link"
                            onClick={onClose}
                            style={{ display: 'block', padding: '4px 0', fontSize: 13, color: '#334155' }}
                          >
                            {department.name}
                          </NavLink>
                        </li>
                      )) : <li>No departments available.</li>}
                    </ul>
                  )}
                </li>
              ))}
              {faculties.length === 0 && <li>No faculties available.</li>}
            </ul>
          )}
        </li>

        <li className="mobile-nav-item">
          <a href="https://auts.ac.in/admission" className="mobile-nav-header" target="_blank" rel="noopener noreferrer">
            Admission
          </a>
        </li>

        <li className="mobile-nav-item">
          <a href="https://auts.ac.in/facilities" className="mobile-nav-header" target="_blank" rel="noopener noreferrer">
            Facilities
          </a>
        </li>

        <li className="mobile-nav-item">
          <a href="https://auts.ac.in/journals" className="mobile-nav-header" target="_blank" rel="noopener noreferrer">
            Journals
          </a>
        </li>

        <li className="mobile-nav-item">
          <a href="https://auts.ac.in/download" className="mobile-nav-header" target="_blank" rel="noopener noreferrer">
            Download
          </a>
        </li>

        <li className="mobile-nav-item">
          <a href="https://auts.ac.in/campus-life" className="mobile-nav-header" target="_blank" rel="noopener noreferrer">
            Campus Life
          </a>
        </li>

        <li className="mobile-nav-item">
          <a href="https://auts.ac.in/gallery" className="mobile-nav-header" target="_blank" rel="noopener noreferrer">
            Gallery
          </a>
        </li>

        <li className="mobile-nav-item" style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #E2E8F0' }}>
          <NavLink to={adminPath} className="mobile-nav-header" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--akal-blue)', fontWeight: 700 }}>
            <Shield size={16} />
            <span>{token ? 'Admin Dashboard' : 'Admin Sign In'}</span>
          </NavLink>
        </li>
      </ul>

      <div style={{ padding: '20px 16px', background: '#F8FAFC', marginTop: 16, borderTop: '1px solid #E2E8F0', fontSize: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Phone size={13} color="var(--akal-gold)" />
          <span>Helpline: <strong>1800-2020-100</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Mail size={13} color="var(--akal-gold)" />
          <span>info@auts.ac.in</span>
        </div>
      </div>
    </div>
  );
}
