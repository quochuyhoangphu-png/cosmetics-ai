import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import ZoneCompartment from './ZoneCompartment';
import CoreBaseInfo from './CoreBaseInfo';
import { getFormulation } from '../../services/api';

function MiniFactoryKit({ analysisId }) {
  const { t } = useTranslation();
  const [formulation, setFormulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFormulation() {
      try {
        setLoading(true);
        const response = await getFormulation(analysisId);
        if (response.success) {
          setFormulation(response.data.formulation);
        } else {
          setError(t('common.error'));
        }
      } catch (err) {
        console.error('Error loading formulation:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    }

    if (analysisId) {
      fetchFormulation();
    }
  }, [analysisId, t]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" color="var(--color-primary)" />
        <span className="ms-2">{t('common.loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mini-factory-kit py-3">
      <Card className="dashboard__card border-0 shadow-sm p-4 mb-4">
        <Card.Body>
          <div className="mb-4 pb-3 border-bottom border-light">
            <h3 className="dashboard__section-title mb-1">
              {t('dashboard.kit_title')}
            </h3>
            <p className="dashboard__section-subtitle text-muted mb-0">
              {t('dashboard.kit_desc')}
            </p>
          </div>

          {/* Compartment Box Layout */}
          <div className="mini-factory-kit__box p-3 bg-light rounded border border-light-subtle shadow-sm mb-4">
            <div className="text-center text-uppercase text-muted fw-bold mb-3 small tracking-wide">
              📦 Personalized Customization Dual-Zone Kit Box
            </div>
            <Row className="gy-4">
              <Col lg={6}>
                <ZoneCompartment
                  zoneKey="tzone"
                  data={formulation?.tzone}
                />
              </Col>
              <Col lg={6}>
                <ZoneCompartment
                  zoneKey="uzone"
                  data={formulation?.uzone}
                />
              </Col>
            </Row>
          </div>

          <CoreBaseInfo />
        </Card.Body>
      </Card>
    </div>
  );
}

export default MiniFactoryKit;
