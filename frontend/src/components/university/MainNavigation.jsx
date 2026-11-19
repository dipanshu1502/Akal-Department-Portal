import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export default function MainNavigation({ faculties = [] }) {
  return (
    <nav className="university-navbar" aria-label="Main university navigation">
      <div className="university-container nav-container">
        <ul className="nav-links">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/departments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Departments
            </NavLink>
          </li>

          <li className="nav-item">
            <span className="nav-link" style={{ cursor: 'pointer' }}>
              Academics <ChevronDown size={14} />
            </span>
            <ul className="nav-dropdown">
              {faculties.length > 0 ? (
                faculties.map((fac) => (
                  <li key={fac.id} className="dropdown-item-nested">
                    <span className="dropdown-link" style={{ cursor: 'pointer' }}>
                      {fac.name.replace('Faculty of ', '')}
                      {fac.departments && fac.departments.length > 0 && <ChevronDown size={12} style={{ transform: 'rotate(-90deg)' }} />}
                    </span>
                    {fac.departments && fac.departments.length > 0 && (
                      <ul className="nested-dropdown">
                        {fac.departments.map((dept) => (
                          <li key={dept.id}>
                            <NavLink to={`/departments/${dept.slug}`} className="dropdown-link">
                              {dept.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))
              ) : (
                <>
                  <li><NavLink to="/departments/computer-science-engineering" className="dropdown-link">Computer Science & Engineering</NavLink></li>
                  <li><NavLink to="/departments/physics" className="dropdown-link">Department of Physics</NavLink></li>
                  <li><NavLink to="/departments/chemistry" className="dropdown-link">Department of Chemistry</NavLink></li>
                  <li><NavLink to="/departments/mathematics" className="dropdown-link">Department of Mathematics</NavLink></li>
                  <li><NavLink to="/departments/commerce-management" className="dropdown-link">Commerce & Management</NavLink></li>
                </>
              )}
            </ul>
          </li>

          <li className="nav-item">
            <a href="https://auts.ac.in/admission" target="_blank" rel="noopener noreferrer" className="nav-link">
              Admissions
            </a>
          </li>

          <li className="nav-item">
            <a href="https://auts.ac.in/facilities" target="_blank" rel="noopener noreferrer" className="nav-link">
              Facilities
            </a>
          </li>

          <li className="nav-item">
            <a href="https://auts.ac.in/campus-life" target="_blank" rel="noopener noreferrer" className="nav-link">
              Campus Life
            </a>
          </li>

          <li className="nav-item">
            <a href="https://auts.ac.in/gallery" target="_blank" rel="noopener noreferrer" className="nav-link">
              University Gallery
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
