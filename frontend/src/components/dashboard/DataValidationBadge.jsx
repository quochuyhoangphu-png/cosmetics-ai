import React from 'react';
import { useTranslation } from 'react-i18next';
import { BiCheckShield } from 'react-icons/bi';

function DataValidationBadge() {
  const { t } = useTranslation();

  return (
    <div className="dashboard__validation-badge d-flex align-items-center">
      <BiCheckShield className="dashboard__validation-badge-icon me-2" />
      <span className="dashboard__validation-badge-text">
        {t('dashboard.validation_badge')}
      </span>
      <span className="dashboard__validation-badge-dot ms-2"></span>
    </div>
  );
}

export default DataValidationBadge;
