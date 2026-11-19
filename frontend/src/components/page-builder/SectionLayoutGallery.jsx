import React from 'react';
import {
  FileText,
  Image,
  LayoutGrid,
  Clock,
  Flag,
  BarChart2,
  Camera,
  HelpCircle,
  X,
} from 'lucide-react';

const iconMap = {
  text: FileText,
  image_text: Image,
  card_grid: LayoutGrid,
  timeline: Clock,
  banner: Flag,
  statistics: BarChart2,
  gallery: Camera,
  accordion: HelpCircle,
};

export default function SectionLayoutGallery({ layouts = [], onSelect, onClose }) {
  const defaultLayouts = [
    { key: 'text', name: 'Text Content', description: 'Heading, subheading and rich text description.' },
    { key: 'image_text', name: 'Image + Text', description: 'Image beside a descriptive text narrative.' },
    { key: 'card_grid', name: 'Card Grid', description: 'Interactive cards with titles, descriptions and links.' },
    { key: 'timeline', name: 'Timeline', description: 'Chronological history, milestones or key phases.' },
    { key: 'banner', name: 'Banner / Highlight', description: 'Prominent full-width message callout.' },
    { key: 'statistics', name: 'Statistics', description: 'Key performance metrics and numerical highlights.' },
    { key: 'gallery', name: 'Photo Gallery', description: 'Visual collection of campus and department photos.' },
    { key: 'accordion', name: 'Accordion / FAQ', description: 'Collapsible questions and answers.' },
  ];

  const items = layouts.length > 0 ? layouts : defaultLayouts;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog-box modal-lg">
        <div className="modal-head">
          <div>
            <h3>Choose a Section Layout</h3>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748B' }}>
              Select a pre-designed responsive layout from the Akal University design library.
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <div className="layout-picker-grid">
            {items.map((layout) => {
              const Icon = iconMap[layout.key] || FileText;
              return (
                <div
                  key={layout.key}
                  className="layout-picker-card"
                  onClick={() => onSelect(layout.key)}
                >
                  <div className="layout-card-icon">
                    <Icon size={24} />
                  </div>
                  <h4>{layout.name}</h4>
                  <p>{layout.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
