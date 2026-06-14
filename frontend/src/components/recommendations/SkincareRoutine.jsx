import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Card } from 'react-bootstrap';
import { BiChevronRight } from 'react-icons/bi';

function SkincareRoutine({ recommendations }) {
  const { t } = useTranslation();

  // Find where recommended products belong in the 5 steps
  const getProductForStep = (stepNumber) => {
    return recommendations?.find((p) => p.routineStep === stepNumber);
  };

  const steps = [
    {
      step: 1,
      title: t('products.cleanser'),
      genericDesc: 'Rửa mặt dịu nhẹ kiểm soát nhờn pH 5.5',
      time: 'Sáng / Tối'
    },
    {
      step: 2,
      title: t('products.toner'),
      genericDesc: 'Cân bằng da nhẹ nhàng',
      time: 'Sáng / Tối'
    },
    {
      step: 3,
      title: t('products.treatment'),
      genericDesc: 'Sản phẩm đặc trị',
      time: 'Tối'
    },
    {
      step: 4,
      title: t('products.moisturizer'),
      genericDesc: 'Dưỡng ẩm khóa ẩm nhẹ dịu',
      time: 'Sáng / Tối'
    },
    {
      step: 5,
      title: t('products.sunscreen'),
      genericDesc: 'Kem chống nắng kiểm soát dầu SPF 50+ PA++++',
      time: 'Sáng'
    }
  ];

  return (
    <div className="skincare-routine mt-5">
      <h4 className="skincare-routine__title mb-4 text-center text-md-start">
        {t('products.skincare_routine')}
      </h4>

      <div className="skincare-routine__timeline">
        <Row className="flex-nowrap overflow-auto py-2 gx-3">
          {steps.map((stepItem, idx) => {
            const product = getProductForStep(stepItem.step);
            return (
              <Col key={idx} xs={10} sm={6} md={4} lg={3} className="flex-shrink-0">
                <Card className={`skincare-routine__card border-0 shadow-sm h-100 ${product ? 'border-primary border bg-primary bg-opacity-10' : 'bg-light'}`}>
                  <Card.Body className="p-3 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-primary rounded-pill">
                          {t('products.step')} {stepItem.step}
                        </span>
                        <small className="text-muted fw-semibold">{stepItem.time}</small>
                      </div>
                      <h5 className="skincare-routine__step-title fs-6 fw-bold text-dark mb-1">
                        {stepItem.title}
                      </h5>
                      <p className="skincare-routine__step-desc text-muted mb-3" style={{ fontSize: '0.8rem' }}>
                        {product ? product.name : stepItem.genericDesc}
                      </p>
                    </div>
                    {product ? (
                      <div className="skincare-routine__instructions p-2 bg-white rounded border border-light mt-auto">
                        <span className="d-block fw-bold text-primary" style={{ fontSize: '0.7rem' }}>
                          👉 Hướng dẫn sử dụng:
                        </span>
                        <span className="text-muted d-block small" style={{ fontSize: '0.7rem', lineHeight: '1.2' }}>
                          {product.routineInstructions || 'Thoa đều lên toàn mặt.'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted d-block small mt-auto" style={{ fontSize: '0.7rem' }}>
                        * Sử dụng sản phẩm cá nhân có sẵn
                      </span>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

export default SkincareRoutine;
