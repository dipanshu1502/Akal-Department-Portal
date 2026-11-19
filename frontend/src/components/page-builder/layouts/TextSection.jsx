import React from 'react';

export default function TextSection({ section }) {
  const content = section.content || {};
  const body = content.body || content.text || content.description || '';
  const background = section.settings?.background || 'white';

  return (
    <div className={`custom-section-block ${background === 'light' ? 'alt-bg' : ''}`} style={{ padding: '40px 0' }}>
      <div className="university-container">
        <div className="section-head" style={{ marginBottom: 20 }}>
          {section.subtitle && <span className="section-head-kicker">{section.subtitle}</span>}
          <h2>{section.title}</h2>
        </div>
        <div style={{ fontSize: 16, color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line', maxWidth: 880 }}>
          {body || 'No published content available for this section yet.'}
        </div>
      </div>
    </div>
  );
}
