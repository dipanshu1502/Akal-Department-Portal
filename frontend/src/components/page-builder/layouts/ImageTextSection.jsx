import React from 'react';

export default function ImageTextSection({ section }) {
  const content = section.content || {};
  const body = content.body || content.text || '';
  const imageUrl = content.image || content.image_url || '';
  const isImageLeft = content.image_position === 'left';
  const background = section.settings?.background || 'white';

  return (
    <div className={`custom-section-block ${background === 'light' ? 'alt-bg' : ''}`} style={{ padding: '48px 0' }}>
      <div className="university-container">
        <div className="section-head" style={{ marginBottom: 24 }}>
          {section.subtitle && <span className="section-head-kicker">{section.subtitle}</span>}
          <h2>{section.title}</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 40,
          alignItems: 'center',
          direction: isImageLeft ? 'ltr' : 'ltr',
        }}>
          {isImageLeft && imageUrl && (
            <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxHeight: 380 }}>
              <img src={imageUrl} alt={section.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div style={{ fontSize: 16, color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {body || 'Description text is not available yet.'}
          </div>

          {!isImageLeft && imageUrl && (
            <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxHeight: 380 }}>
              <img src={imageUrl} alt={section.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
