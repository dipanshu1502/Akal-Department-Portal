import React from 'react';

/**
 * Official Akal University Logo Crest + "THE FIRST CHOICE OF TOPPERS"
 * Matches https://auts.ac.in/ header and footer branding
 */
export default function AkalLogo({ variant = 'default', size = 'normal', showTagline = true }) {
  const isYellowBg = variant === 'yellow-bg'; // Used on yellow bottom footer
  const isDarkBg = variant === 'dark-bg';     // Used on dark footer

  const primaryColor = isYellowBg ? '#083247' : isDarkBg ? '#FFFFFF' : '#083247';
  const accentColor = isYellowBg ? '#087BB5' : isDarkBg ? '#F9B900' : '#087BB5';
  const taglineColor = isYellowBg ? '#083247' : isDarkBg ? '#F1F5F9' : '#087BB5';
  const borderColor = isYellowBg ? 'rgba(8, 50, 71, 0.3)' : isDarkBg ? 'rgba(255, 255, 255, 0.25)' : 'rgba(8, 50, 71, 0.2)';

  const height = size === 'small' ? 44 : size === 'large' ? 64 : 54;

  return (
    <div
      className="akal-logo-wrapper"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        userSelect: 'none',
      }}
    >
      {/* Akal Shield Crest */}
      <svg
        width={height * 0.85}
        height={height}
        viewBox="0 0 76 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        {/* Outer Shield Outline */}
        <path
          d="M3 6C3 6 24 3 38 3C52 3 73 6 73 6V54C73 69 49 84 38 87C27 84 3 69 3 54V6Z"
          stroke={accentColor}
          strokeWidth="3.5"
          fill={isYellowBg ? 'transparent' : isDarkBg ? 'rgba(255,255,255,0.05)' : '#FFFFFF'}
        />
        {/* Inner Shield Border */}
        <path
          d="M8 11C8 11 25 8.5 38 8.5C51 8.5 68 11 68 11V52C68 64.5 47 77.5 38 80.5C29 77.5 8 64.5 8 52V11Z"
          stroke={primaryColor}
          strokeWidth="1.8"
          fill="none"
        />
        {/* Top Text: AKAL */}
        <text
          x="38"
          y="26"
          textAnchor="middle"
          fill={primaryColor}
          fontSize="12"
          fontWeight="900"
          letterSpacing="2.5"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          AKAL
        </text>
        {/* Middle Line */}
        <line x1="14" y1="30" x2="62" y2="30" stroke={accentColor} strokeWidth="1.2" />
        {/* Sub Text: UNIVERSITY */}
        <text
          x="38"
          y="39"
          textAnchor="middle"
          fill={primaryColor}
          fontSize="7"
          fontWeight="700"
          letterSpacing="1"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          UNIVERSITY
        </text>
        {/* Open Book Emblem at base */}
        <path
          d="M26 62C31 59 36 60 38 62C40 60 45 59 50 62V48C45 45 40 46 38 48C36 46 31 45 26 48V62Z"
          fill="none"
          stroke={accentColor}
          strokeWidth="2"
        />
        <line x1="38" y1="48" x2="38" y2="62" stroke={accentColor} strokeWidth="1.5" />
        {/* Radiating Sun Arcs */}
        <path
          d="M24 70C31 73 45 73 52 70"
          stroke={primaryColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {/* Vertical Divider Line */}
      {showTagline && (
        <>
          <div
            style={{
              width: 1.5,
              height: height * 0.75,
              backgroundColor: borderColor,
            }}
          />

          {/* Tagline: THE FIRST CHOICE OF TOPPERS */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              lineHeight: 1.15,
              textAlign: 'left',
            }}
          >
            <span
              style={{
                fontSize: size === 'small' ? '10px' : size === 'large' ? '14px' : '12px',
                fontWeight: 700,
                letterSpacing: '1.2px',
                color: taglineColor,
                textTransform: 'uppercase',
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              }}
            >
              THE
            </span>
            <span
              style={{
                fontSize: size === 'small' ? '12px' : size === 'large' ? '17px' : '14px',
                fontWeight: 900,
                letterSpacing: '0.8px',
                color: primaryColor,
                textTransform: 'uppercase',
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              }}
            >
              FIRST CHOICE
            </span>
            <span
              style={{
                fontSize: size === 'small' ? '11px' : size === 'large' ? '15px' : '13px',
                fontWeight: 800,
                letterSpacing: '1px',
                color: taglineColor,
                textTransform: 'uppercase',
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              }}
            >
              OF TOPPERS
            </span>
          </div>
        </>
      )}
    </div>
  );
}
