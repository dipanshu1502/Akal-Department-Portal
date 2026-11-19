import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function BannerSection({ section }) {
  const content = section.content || {};
  const body = content.body || content.text || '';
  const ctaLabel = content.cta_label || 'Get in Touch';
  const ctaLink = content.cta_link || '#contact';

  return (
    <div style={{ padding: '36px 0' }}>
      <div className="university-container">
        <div style={{
          background: 'linear-gradient(135deg, #172333 0%, #087BB5 100%)',
          borderRadius: 16,
          padding: '48px 40px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24,
          boxShadow: '0 10px 25px -5px rgba(8, 123, 181, 0.25)',
        }}>
          <div style={{ maxWidth: 680 }}>
            {section.subtitle && (
              <span style={{ color: '#F9B900', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {section.subtitle}
              </span>
            )}
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: '6px 0 12px', color: '#FFFFFF' }}>
              {section.title}
            </h2>
            <p style={{ fontSize: 16, color: '#E2E8F0', margin: 0, lineHeight: 1.6 }}>
              {body}
            </p>
          </div>

          <div>
            <a
              href={ctaLink}
              style={{
                backgroundColor: '#F9B900',
                color: '#172333',
                fontWeight: 700,
                fontSize: 14,
                padding: '12px 24px',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              }}
            >
              <span>{ctaLabel}</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
