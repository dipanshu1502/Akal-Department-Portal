import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, Layers, Users, GraduationCap } from 'lucide-react';
import { getPublicDepartments, getPublicFaculties } from '../../services/api';
import PageBreadcrumb from '../../components/university/PageBreadcrumb';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');

  useEffect(() => {
    Promise.all([getPublicDepartments(), getPublicFaculties()])
      .then(([deptData, facData]) => {
        setDepartments(Array.isArray(deptData) ? deptData : deptData?.departments ?? []);
        setFaculties(Array.isArray(facData) ? facData : facData?.faculties ?? []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      !search ||
      dept.name.toLowerCase().includes(search.toLowerCase()) ||
      (dept.code && dept.code.toLowerCase().includes(search.toLowerCase())) ||
      (dept.short_description && dept.short_description.toLowerCase().includes(search.toLowerCase()));

    const matchesFaculty =
      selectedFaculty === 'all' || String(dept.faculty_id) === String(selectedFaculty);

    return matchesSearch && matchesFaculty;
  });

  // Group departments by faculty
  const facultyGroups = faculties.map((faculty) => ({
    ...faculty,
    departments: filteredDepartments.filter((d) => d.faculty_id === faculty.id),
  })).filter((group) => group.departments.length > 0);

  // Departments without faculty
  const ungrouped = filteredDepartments.filter((d) => !d.faculty_id);

  return (
    <>
      <PageBreadcrumb items={[{ label: 'Academics', href: '#' }, { label: 'Departments' }]} />

      {/* Directory Hero */}
      <section className="directory-hero">
        <div className="university-container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="hero-kicker">Akal University · Academic Excellence</span>
          <h1>Academic Faculties & Departments</h1>
          <p>
            Explore our state-of-the-art faculties, research-led undergraduate and postgraduate programmes,
            advanced scientific laboratories, and accomplished academic mentors.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="directory-filter-bar">
        <div className="university-container">
          <div className="filter-controls-row">
            <div className="search-box-wrap">
              <Search size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search departments by name, code or keyword..."
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <select
                className="faculty-filter-select"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
              >
                <option value="all">All Academic Faculties ({departments.length})</option>
                {faculties.map((fac) => (
                  <option key={fac.id} value={fac.id}>{fac.name}</option>
                ))}
              </select>

              {(search || selectedFaculty !== 'all') && (
                <button
                  className="btn-secondary"
                  onClick={() => { setSearch(''); setSelectedFaculty('all'); }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Department Cards Catalog */}
      <section className="directory-section">
        <div className="university-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#64748B' }}>
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading departments...</span>
              </div>
              <p style={{ marginTop: 16, fontSize: 16 }}>Loading academic departments from server...</p>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <BookOpen size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
              <h3 style={{ color: '#172333', fontSize: 20, fontWeight: 700 }}>No departments match your filter</h3>
              <p style={{ color: '#64748B', maxWidth: 460, margin: '8px auto 20px' }}>
                Try adjusting your search query or select "All Academic Faculties" to browse all active departments.
              </p>
              <button
                className="btn-primary"
                onClick={() => { setSearch(''); setSelectedFaculty('all'); }}
              >
                Reset Search
              </button>
            </div>
          ) : (
            <>
              {facultyGroups.map((group) => (
                <div key={group.id} className="faculty-group-block">
                  <div className="faculty-group-header">
                    <div>
                      <h2>{group.name}</h2>
                      {group.description && <p>{group.description}</p>}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#087BB5', backgroundColor: '#E0F2FE', padding: '3px 10px', borderRadius: 12 }}>
                      {group.departments.length} {group.departments.length === 1 ? 'Department' : 'Departments'}
                    </span>
                  </div>

                  <div className="department-cards-grid">
                    {group.departments.map((dept) => (
                      <DepartmentCard key={dept.id} department={dept} facultyName={group.name} />
                    ))}
                  </div>
                </div>
              ))}

              {ungrouped.length > 0 && (
                <div className="faculty-group-block">
                  <div className="faculty-group-header">
                    <h2>Other Academic Departments</h2>
                  </div>
                  <div className="department-cards-grid">
                    {ungrouped.map((dept) => (
                      <DepartmentCard key={dept.id} department={dept} facultyName="Academic Department" />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function DepartmentCard({ department, facultyName }) {
  const defaultImage = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="department-public-card">
      <div className="dept-card-media">
        <img
          src={department.hero_image || defaultImage}
          alt={department.name}
          loading="lazy"
        />
        {department.code && <span className="dept-card-code">{department.code}</span>}
      </div>

      <div className="dept-card-body">
        <span className="dept-card-faculty">{facultyName.replace('Faculty of ', '')}</span>
        <h3 className="dept-card-title">{department.name}</h3>
        <p className="dept-card-desc">{department.short_description || department.description}</p>

        <div className="dept-card-footer">
          <Link to={`/departments/${department.slug}`} className="dept-explore-btn">
            <span>Explore Department</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
