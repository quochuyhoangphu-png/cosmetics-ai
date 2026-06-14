import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import SkinMetricsChart from './SkinMetricsChart';
import DataValidationBadge from './DataValidationBadge';

function RawDataSection({ skinData }) {
  const { t } = useTranslation();

  const metrics = [
    {
      label: t('dashboard.metrics.sebum'),
      value: skinData?.skinMetrics?.tzone?.sebum || 0,
      unit: '%',
      variant: 'danger', // Reddish
      desc: t('kit.tzone_explanation')
    },
    {
      label: t('dashboard.metrics.pore'),
      value: skinData?.skinMetrics?.tzone?.poreSize || 0,
      unit: '%',
      variant: 'info', // Tealish
      desc: 'Kích thước và chiều sâu lỗ chân lông vùng chữ T.'
    },
    {
      label: t('dashboard.metrics.moisture'),
      value: skinData?.skinMetrics?.uzone?.moisture || 0,
      unit: '%',
      variant: 'success', // Greenish
      desc: t('kit.uzone_explanation')
    },
    {
      label: t('dashboard.metrics.pigmentation'),
      value: skinData?.skinMetrics?.uzone?.pigmentation || 0,
      unit: '%',
      variant: 'warning', // Orangish
      desc: 'Mức độ sạm màu, tàn nhang vùng chữ U.'
    },
    {
      label: t('dashboard.metrics.sensitivity'),
      value: skinData?.skinMetrics?.overall?.sensitivity || 0,
      unit: '%',
      variant: 'dark', // Dark
      desc: 'Ngưỡng nhạy cảm của lớp sừng bảo vệ da.'
    },
    {
      label: t('dashboard.metrics.acne'),
      value: skinData?.skinMetrics?.overall?.acneSeverity || 0,
      max: 5,
      unit: '/5',
      variant: 'primary',
      desc: 'Mức độ nghiêm trọng của mụn trứng cá (GEA Scale).'
    }
  ];

  return (
    <div className="dashboard__raw-section">
      <Card className="dashboard__card border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pb-3 border-bottom border-light">
            <div>
              <h3 className="dashboard__section-title mb-1">
                {t('dashboard.raw_data_title')}
              </h3>
              <p className="dashboard__section-subtitle text-muted mb-0">
                {t('dashboard.raw_data_desc')}
              </p>
            </div>
            <div className="mt-3 mt-md-0">
              <DataValidationBadge />
            </div>
          </div>

          <Row className="align-items-center">
            <Col lg={5} className="mb-4 mb-lg-0 text-center">
              <div className="dashboard__chart-container p-2 bg-white rounded">
                <SkinMetricsChart metrics={skinData?.skinMetrics} />
              </div>
              <div className="mt-3 text-center">
                <span className="dashboard__profile-badge px-3 py-1.5 rounded-pill bg-light text-primary font-weight-bold small">
                  {t('dashboard.profile_badge')}
                </span>
              </div>
            </Col>

            <Col lg={7}>
              <Row>
                {metrics.map((item, idx) => {
                  const percent = item.max
                    ? (item.value / item.max) * 100
                    : item.value;
                  return (
                    <Col md={6} key={idx} className="mb-3">
                      <div className="p-3 bg-light rounded border border-light-subtle h-100">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-muted small fw-medium">{item.label}</span>
                          <span className="fw-bold text-dark">
                            {item.value}
                            <span className="text-muted small fw-normal">{item.unit}</span>
                          </span>
                        </div>
                        <ProgressBar
                          now={percent}
                          variant={item.variant}
                          className="my-2"
                          style={{ height: '6px' }}
                        />
                        <p className="text-muted mb-0 small" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                          {item.desc}
                        </p>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>

          <div className="mt-4 p-3 bg-light-subtle border border-light rounded text-muted small">
            💡 <strong>{t('common.next')}:</strong> {t('dashboard.data_note')}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RawDataSection;
