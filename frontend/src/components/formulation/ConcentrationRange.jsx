import React from 'react';
import { useTranslation } from 'react-i18next';

function ConcentrationRange({ ingredient, zone }) {
  const { t } = useTranslation();

  // Extract variables
  const { name, optimalPercent, minPercent, maxPercent, function: purpose } = ingredient;

  // Calculate position marker (percentage along the min-max bar)
  // Formula: position% = ((optimal - min) / (max - min)) * 100
  const rangeDiff = maxPercent - minPercent;
  const positionPercent = rangeDiff > 0 ? ((optimalPercent - minPercent) / rangeDiff) * 100 : 50;

  // Zone specific styles
  const isTZone = zone === 'tzone';
  const barBg = isTZone ? 'var(--color-tzone-bg)' : 'var(--color-uzone-bg)';
  const activeColor = isTZone ? 'var(--color-tzone)' : 'var(--color-uzone)';

  return (
    <div className="concentration-range mb-4">
      <div className="d-flex justify-content-between align-items-baseline mb-1">
        <div>
          <span className="concentration-range__name fw-bold text-dark">{name}</span>
          {purpose && (
            <span className="concentration-range__function text-muted small ms-2 d-none d-sm-inline">
              ({purpose})
            </span>
          )}
        </div>
        <span className="concentration-range__optimal fw-bold" style={{ color: activeColor }}>
          {t('kit.optimal')}: {optimalPercent}%
        </span>
      </div>

      {/* Visual range bar */}
      <div
        className="concentration-range__bar-container position-relative rounded"
        style={{
          height: '12px',
          backgroundColor: barBg,
          margin: '8px 0'
        }}
      >
        {/* Active Range Fill */}
        <div
          className="concentration-range__active-bar position-absolute rounded"
          style={{
            left: '0%',
            right: '0%',
            height: '100%',
            backgroundColor: isTZone ? 'rgba(26, 188, 156, 0.2)' : 'rgba(230, 126, 34, 0.2)',
          }}
        />

        {/* Optimal Value Marker Pin */}
        <div
          className="concentration-range__marker position-absolute rounded-circle border border-white"
          style={{
            left: `calc(${positionPercent}% - 8px)`,
            top: '-2px',
            width: '16px',
            height: '16px',
            backgroundColor: activeColor,
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            transition: 'left 0.5s ease-in-out',
            zIndex: 2
          }}
        />
      </div>

      {/* Bar range labels */}
      <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
        <span>Min: {minPercent}%</span>
        <span>Max: {maxPercent}%</span>
      </div>
    </div>
  );
}

export default ConcentrationRange;
