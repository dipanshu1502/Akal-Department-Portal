import React from 'react';

export default function GallerySection({ section }) {
  const content = section.content || {};
  const items = Array.isArray(content) ? content : content.items || [];
  const background = section.settings?.background || 'white';

  return (
    <div className={`custom-section-block ${background === 'light' ? 'alt-bg' : ''}`} style={{ padding: '48px 0' }}>
      <div className="university-container">
        <div className="section-head" style={{ marginBottom: 32 }}>
          {section.subtitle && <span className="section-head-kicker">{section.subtitle}</span>}
          <h2>{section.title}</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                position: 'relative',
                minHeight: 200,
                backgroundColor: '#E2E8F0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title || section.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              {(item.title || item.caption) && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  color: '#FFFFFF',
                  padding: '14px 12px 8px',
                  fontSize: 13,
                }}>
                  {item.title && <strong>{item.title}</strong>}
                  {item.caption && <div style={{ fontSize: 12, color: '#E2E8F0' }}>{item.caption}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
