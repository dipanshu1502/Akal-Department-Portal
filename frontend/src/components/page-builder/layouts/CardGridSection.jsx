import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CardGridSection({ section }) {
  const content = section.content || {};
  const items = Array.isArray(content) ? content : content.items || [];
  const columns = section.settings?.columns || 3;
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
          gridTemplateColumns: `repeat(auto-fill, minmax(${columns === 4 ? '240px' : columns === 2 ? '420px' : '300px'}, 1fr))`,
          gap: 24,
        }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: background === 'light' ? '#FFFFFF' : '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                padding: 24,
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {item.image && (
                <div style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 16, minHeight: 160, backgroundColor: '#F8FAFC' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                </div>
              )}
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#172333', margin: '0 0 10px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 16px', flex: 1 }}>
                {item.description}
              </p>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                  <span>Learn more</span> <ArrowRight size={13} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
