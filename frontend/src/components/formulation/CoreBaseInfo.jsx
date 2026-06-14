import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { BiInfoCircle, BiShieldQuarter, BiCoinStack } from 'react-icons/bi';

function CoreBaseInfo() {
  const { t } = useTranslation();

  return (
    <div className="core-base-info mt-4">
      <Row className="gy-3">
        <Col md={6}>
          <Card className="border-0 bg-light-subtle h-100 p-3 rounded">
            <div className="d-flex align-items-start">
              <BiInfoCircle className="text-primary fs-4 me-3 mt-1" />
              <div>
                <h5 className="fs-6 fw-bold mb-1">{t('kit.core_base_title')}</h5>
                <p className="text-muted small mb-3">
                  {t('kit.core_base_message')}
                </p>
                <div className="p-2 bg-white rounded border border-light font-monospace small">
                  <strong>{t('kit.formula_label')}:</strong>
                  <div className="text-primary fw-bold mt-1 text-center" style={{ fontSize: '0.85rem' }}>
                    C_final = Σ(V_active × C_active) / (V_base + Σ V_active)
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 bg-light-subtle h-100 p-3 rounded">
            <div className="d-flex align-items-start mb-3">
              <BiShieldQuarter className="text-success fs-4 me-3 mt-1" />
              <div>
                <h5 className="fs-6 fw-bold mb-1 text-success d-flex align-items-center">
                  {t('kit.legal_compliance')}
                  <Badge bg="success" className="ms-2" style={{ fontSize: '0.65rem' }}>Active</Badge>
                </h5>
                <p className="text-muted small mb-0">
                  {t('kit.legal_text')}
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start pt-2 border-top border-light-subtle">
              <BiCoinStack className="text-warning fs-4 me-3 mt-1" />
              <div>
                <h5 className="fs-6 fw-bold mb-1">{t('kit.cost_note')}</h5>
                <p className="text-muted small mb-0">
                  Công nghệ nhà máy mini tại chỗ giúp giảm thiểu chi phí đóng gói, lưu kho và vận chuyển lên tới 60%.
                </p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CoreBaseInfo;
