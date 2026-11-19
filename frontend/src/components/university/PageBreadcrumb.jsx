import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function PageBreadcrumb({ items = [] }) {
  return (
    <div className="page-breadcrumb-bar">
      <div className="university-container">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumb-list">
            <li className="breadcrumb-item">
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Home size={13} />
                <span>Home</span>
              </Link>
            </li>

            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <React.Fragment key={index}>
                  <li className="breadcrumb-separator" aria-hidden="true">
                    <ChevronRight size={12} />
                  </li>
                  <li className="breadcrumb-item">
                    {isLast || !item.href ? (
                      <span className="breadcrumb-current">{item.label}</span>
                    ) : (
                      <Link to={item.href}>{item.label}</Link>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
