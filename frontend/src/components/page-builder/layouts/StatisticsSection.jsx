import React from 'react';

export default function StatisticsSection({ section }) {
  const content = section.content || {};
  const items = Array.isArray(content) ? content : content.items || [];
  const background = section.settings?.background || 'light';

  return (
    <div className={`custom-section-block ${background === 'light' ? 'alt-bg' : ''}`} style={{ padding: '56px 0' }}>
      <div className="university-container">
        <div className="section-head" style={{ marginBottom: 36, textAlign: 'center' }}>
          {section.subtitle && <span className="section-head-kicker">{section.subtitle}</span>}
          <h2>{section.title}</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
        }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                padding: '28px 20px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 800, color: '#087BB5', lineHeight: 1, marginBottom: 8 }}>
                {item.value}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
