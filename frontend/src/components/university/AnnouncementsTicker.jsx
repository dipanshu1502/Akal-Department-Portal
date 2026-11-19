import React from 'react';
import { Volume2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Akal University Announcements Ticker Bar
 * Matches the blue & yellow ticker bar directly beneath the navigation on https://auts.ac.in/
 */
export default function AnnouncementsTicker() {
  const announcements = [
    { text: 'HSS Admission Eligibility Criteria & Guidelines for Session 2026-27', link: '/departments' },
    { text: 'National Workshop on Radiochemistry and Applications of Radioisotopes, Oct 17-18, 2026', link: '/departments/chemistry' },
    { text: 'Admissions Open: B.Tech CSE, BCA, B.Sc (Hons), M.Sc, MBA, Ph.D Programmes', link: '/departments' },
    { text: 'Akal University Entrance & Scholarship Test (AUEST) – Merit Scholarships up to 100%', link: 'https://auts.ac.in/scholarships' },
  ];

  return (
    <div className="auts-ticker-bar" aria-label="Latest university announcements">
      <div className="ticker-wrapper">
        {/* Left Gold Announcements Label */}
        <div className="ticker-label-box">
          <Volume2 size={16} className="ticker-icon" />
          <span className="ticker-title">Announcements</span>
        </div>

        {/* Scrolling News Ticker */}
        <div className="ticker-content-track">
          <div className="ticker-marquee">
            {announcements.map((item, idx) => (
              <span key={idx} className="ticker-item">
                <span className="ticker-dot">•</span>
                {item.link.startsWith('http') ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="ticker-link">
                    {item.text}
                  </a>
                ) : (
                  <Link to={item.link} className="ticker-link">
                    {item.text}
                  </Link>
                )}
              </span>
            ))}
            {/* Duplicated for seamless continuous ticker loop */}
            {announcements.map((item, idx) => (
              <span key={`dup-${idx}`} className="ticker-item" aria-hidden="true">
                <span className="ticker-dot">•</span>
                {item.link.startsWith('http') ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="ticker-link">
                    {item.text}
                  </a>
                ) : (
                  <Link to={item.link} className="ticker-link">
                    {item.text}
                  </Link>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
