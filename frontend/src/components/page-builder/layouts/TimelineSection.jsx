import React from 'react';

export default function TimelineSection({ section }) {
  const content = section.content || {};
  const items = Array.isArray(content) ? content : content.items || [];
  const background = section.settings?.background || 'white';

  return (
    <div className={`custom-section-block ${background === 'light' ? 'alt-bg' : ''}`} style={{ padding: '48px 0' }}>
      <div className="university-container">
        <div className="section-head" style={{ marginBottom: 36 }}>
          {section.subtitle && <span className="section-head-kicker">{section.subtitle}</span>}
          <h2>{section.title}</h2>
        </div>

        <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '3px solid #087BB5', maxWidth: 760, margin: '0 auto' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ position: 'relative', marginBottom: 32 }}>
              <div style={{
                position: 'absolute',
                left: -33,
                top: 4,
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#F9B900',
                border: '3px solid #FFFFFF',
                boxShadow: '0 0 0 2px #087BB5',
              }} />
              <span style={{
                display: 'inline-block',
                backgroundColor: '#087BB5',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: 4,
                marginBottom: 8,
              }}>
                {item.date || 'Milestone'}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#172333', margin: '0 0 6px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 14.5, color: '#475569', margin: 0, lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
