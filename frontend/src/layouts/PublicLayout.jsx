import React from 'react';
import UniversityHeader from '../components/university/UniversityHeader';
import UniversityFooter from '../components/university/UniversityFooter';
import EnquiryStickyButton from '../components/university/EnquiryStickyButton';

export default function PublicLayout({ children }) {
  return (
    <div className="auts-page-layout-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <UniversityHeader />
      <main id="main-content" style={{ flex: 1 }}>
        {children}
      </main>
      <UniversityFooter />
      {/* Sticky Right "Enquiry Now" Vertical Button */}
      <EnquiryStickyButton />
    </div>
  );
}
