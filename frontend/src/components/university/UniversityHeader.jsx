import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Shield, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import UniversityTopbar from './UniversityTopbar';
import AkalLogo from './AkalLogo';
import AnnouncementsTicker from './AnnouncementsTicker';
import MobileNavigation from './MobileNavigation';
import { getPublicFaculties } from '../../services/api';

const FACULTY_MENU_ITEMS = [
  { slug: 'humanities-social-sciences', name: 'Humanities & Social Sciences' },
  { slug: 'sciences', name: 'Sciences' },
  { slug: 'engineering-technology', name: 'Engineering and Technology' },
  { slug: 'commerce-management', name: 'Commerce and Management' },
  { slug: 'paramedical-sciences', name: 'Paramedical Sciences' },
];

/**
 * Akal University Header
 * Matches https://auts.ac.in/ header:
 * - Two-Tone Topbar with angled diagonal cut
 * - Akal University Shield Logo Crest with "THE FIRST CHOICE OF TOPPERS"
 * - Official auts.ac.in navigation links + Departments dropdown
 * - Gold "ADMISSION OPEN" CTA button
 * - Announcements Ticker Bar
 */
export default function UniversityHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const token = localStorage.getItem('akal_portal_token');
  const user = JSON.parse(localStorage.getItem('akal_portal_user') || 'null');

  useEffect(() => {
    getPublicFaculties()
      .then((data) => {
        setFaculties(Array.isArray(data) ? data : data?.faculties ?? []);
      })
      .catch((error) => console.error('Unable to load faculties for navigation.', error));
  }, []);

  const navigationFaculties = FACULTY_MENU_ITEMS.map((menuFaculty) => {
    const faculty = faculties.find((item) => item.slug === menuFaculty.slug);
    return {
      ...faculty,
      id: faculty?.id ?? menuFaculty.slug,
      slug: menuFaculty.slug,
      name: menuFaculty.name,
      departments: faculty?.departments ?? [],
    };
  });

  const adminPath = user?.role === 'super_admin' ? '/admin/super' : user?.role === 'department_admin' ? '/admin/department' : '/admin/login';

  return (
    <>
      {/* Topbar with diagonal split */}
      <UniversityTopbar />

      {/* Main Header */}
      <header className="university-header">
        <div className="university-container header-inner-wrap">
          {/* Logo on Left */}
          <Link to="/" className="university-logo-link" aria-label="Akal University Home">
            <AkalLogo variant="default" size="normal" showTagline={true} />
          </Link>

          {/* Desktop Navigation & Actions */}
          <div className="header-nav-and-actions">
            <nav className="desktop-main-menu" aria-label="Main menu">
              {/* Row 1 Navigation Items */}
              <div className="nav-row-main">
                <a href="https://auts.ac.in/about-us" target="_blank" rel="noopener noreferrer" className="auts-nav-link">
                  About Us
                </a>

                {/* Academics / Departments dropdown */}
                <div className="nav-has-dropdown">
                  <NavLink to="/departments" className={({ isActive }) => `auts-nav-link ${isActive ? 'active' : ''}`}>
                    <span>Academics</span>
                    <ChevronDown size={13} className="dropdown-caret" />
                  </NavLink>

                  <div className="auts-dropdown-menu">
                    <div className="dropdown-header-note">
                      <strong>Academic Faculties & Departments</strong>
                    </div>
                    <div className="faculty-dropdown-list">
                      {navigationFaculties.map((faculty) => (
                        <div key={faculty.id} className="faculty-dropdown-item">
                          <button type="button" className="faculty-dropdown-trigger" aria-haspopup="true">
                            <span>{faculty.name}</span>
                            <ChevronRight size={14} />
                          </button>
                          <div className="faculty-departments-menu">
                            {faculty.departments?.length > 0 ? faculty.departments.map((department) => (
                              <NavLink key={department.id} to={`/departments/${department.slug}`} className="sub-dept-link">
                                {department.name}
                              </NavLink>
                            )) : (
                              <span className="sub-dept-link">No departments available.</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="dropdown-footer-link">
                      <NavLink to="/departments" className="all-depts-btn">
                        View All Departments Catalog →
                      </NavLink>
                    </div>
                  </div>
                </div>

                <a href="https://auts.ac.in/admission" target="_blank" rel="noopener noreferrer" className="auts-nav-link">
                  Admission
                </a>

                <a href="https://auts.ac.in/facilities" target="_blank" rel="noopener noreferrer" className="auts-nav-link">
                  Facilities
                </a>

                <a href="https://auts.ac.in/journals" target="_blank" rel="noopener noreferrer" className="auts-nav-link">
                  Journals
                </a>

                <a href="https://auts.ac.in/download" target="_blank" rel="noopener noreferrer" className="auts-nav-link">
                  Download
                </a>

                <a href="https://auts.ac.in/campus-life" target="_blank" rel="noopener noreferrer" className="auts-nav-link">
                  Campus Life
                </a>

                <a href="https://auts.ac.in/darbaar-sahib" target="_blank" rel="noopener noreferrer" className="auts-nav-link d-none d-xl-inline-block">
                  Darbaar Sahib
                </a>

                <a href="https://auts.ac.in/data-evaluation" target="_blank" rel="noopener noreferrer" className="auts-nav-link d-none d-xl-inline-block">
                  Data Evaluation
                </a>

                <a href="https://auts.ac.in/career" target="_blank" rel="noopener noreferrer" className="auts-nav-link">
                  Career
                </a>

                <a href="https://auts.ac.in/gallery" target="_blank" rel="noopener noreferrer" className="auts-nav-link">
                  Gallery
                </a>

                <NavLink to="/departments" className={({ isActive }) => `auts-nav-link departments-nav-pill ${isActive ? 'active' : ''}`}>
                  Departments
                </NavLink>
              </div>
            </nav>

            {/* Right Action Buttons */}
            <div className="header-action-buttons">
              {/* Gold "ADMISSION OPEN" Button from Screenshot */}
              <a
                href="https://auts.ac.in/how-to-apply"
                target="_blank"
                rel="noopener noreferrer"
                className="admission-open-cta-btn"
              >
                ADMISSION OPEN
              </a>

              {/* Admin Portal Gateway */}
              <Link to={adminPath} className="admin-portal-pill-btn" title="Administrative Access">
                <Shield size={14} />
                <span>{token ? 'Dashboard' : 'Admin'}</span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                className="mobile-nav-toggle-btn d-lg-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileNavigation
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          faculties={navigationFaculties}
        />
      </header>

      {/* Announcements Ticker Bar directly below header */}
      <AnnouncementsTicker />
    </>
  );
}
