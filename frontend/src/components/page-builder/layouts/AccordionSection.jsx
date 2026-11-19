import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AccordionSection({ section }) {
  const content = section.content || {};
  const items = Array.isArray(content) ? content : content.items || [];
  const background = section.settings?.background || 'white';
  const [openIndexes, setOpenIndexes] = useState([0]);

  const toggle = (idx) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className={`custom-section-block ${background === 'light' ? 'alt-bg' : ''}`} style={{ padding: '48px 0' }}>
      <div className="university-container">
        <div className="section-head" style={{ marginBottom: 32 }}>
          {section.subtitle && <span className="section-head-kicker">{section.subtitle}</span>}
          <h2>{section.title}</h2>
        </div>

        <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: 15.5,
                    fontWeight: 700,
                    color: '#172333',
                    cursor: 'pointer',
                  }}
                >
                  <span>{item.question || item.title || `Question ${idx + 1}`}</span>
                  {isOpen ? <ChevronUp size={18} color="#087BB5" /> : <ChevronDown size={18} color="#64748B" />}
                </button>
                {isOpen && (
                  <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', fontSize: 14.5, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {item.answer || item.description || ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
