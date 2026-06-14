import React from 'react';
import { Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ConcentrationRange from './ConcentrationRange';

function ZoneCompartment({ zoneKey, data }) {
  const { t } = useTranslation();

  const isTZone = zoneKey === 'tzone';
  const themeColor = isTZone ? 'var(--color-tzone)' : 'var(--color-uzone)';
  const themeBg = isTZone ? 'var(--color-tzone-bg)' : 'var(--color-uzone-bg)';
  const borderClass = isTZone ? 'border-tzone' : 'border-uzone';

  const zoneTitle = isTZone ? t('kit.tzone_title') : t('kit.uzone_title');
  const baseLabel = data?.baseType === 'gel' ? t('kit.gel') : t('kit.cream');
  const explanation = isTZone ? t('kit.tzone_explanation') : t('kit.uzone_explanation');

  return (
    <div className={`zone-compartment p-3 rounded h-100 border-2 border ${borderClass}`} style={{ backgroundColor: '#fff' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-light">
        <h4 className="zone-compartment__title mb-0 fw-bold" style={{ color: themeColor }}>
          {zoneTitle}
        </h4>
        <span
          style={{
            backgroundColor: themeBg,
            color: themeColor,
            border: `1px solid ${themeColor}40`
          }}
          className="px-3 py-1 rounded-pill fw-semibold fs-6 text-uppercase"
        >
          {t('kit.core_base_title')}: {baseLabel}
        </span>
      </div>

      <p className="zone-compartment__explanation text-muted small mb-4">
        {explanation}
      </p>

      <div className="zone-compartment__ingredients">
        {data?.ingredients && data.ingredients.length > 0 ? (
          data.ingredients.map((ing, idx) => (
            <ConcentrationRange
              key={idx}
              ingredient={ing}
              zone={zoneKey}
            />
          ))
        ) : (
          <div className="text-center py-4 text-muted small">
            Không cần hoạt chất bổ sung cho phân vùng này.
          </div>
        )}
      </div>
    </div>
  );
}

export default ZoneCompartment;
