import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Spinner, Card, ListGroup, Badge } from 'react-bootstrap';
import ProductCard from './ProductCard';
import SkincareRoutine from './SkincareRoutine';
import { getRecommendations } from '../../services/api';

function CommercialProducts({ analysisId }) {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        const response = await getRecommendations(analysisId);
        if (response.success) {
          setRecommendations(response.data.recommendations);
        } else {
          setError(t('common.error'));
        }
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    }

    if (analysisId) {
      fetchRecommendations();
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
    <div className="commercial-products py-3">
      <Card className="dashboard__card border-0 shadow-sm p-4 mb-4">
        <Card.Body>
          <div className="mb-4 pb-3 border-bottom border-light">
            <h3 className="dashboard__section-title mb-1">
              {t('dashboard.commercial_title')}
            </h3>
            <p className="dashboard__section-subtitle text-muted mb-0">
              {t('dashboard.commercial_desc')}
            </p>
          </div>

          <Row className="gy-5">
            {Object.entries(recommendations).map(([category, products]) => {
              if (!products || products.length === 0) return null;
              
              const topProduct = products[0];
              const alternatives = products.slice(1);

              return (
                <Col key={category} xs={12} md={4} className="d-flex flex-column">
                  <h4 className="text-uppercase fs-6 fw-bold text-muted mb-3 pb-2 border-bottom">
                    {category === 'toner' ? t('products.toner') : category === 'serum' ? t('products.treatment') : t('products.moisturizer')}
                  </h4>
                  
                  {/* Top Recommended Product */}
                  <div className="mb-4 flex-grow-0">
                    <ProductCard product={topProduct} />
                  </div>

                  {/* Ranked Alternatives */}
                  {alternatives.length > 0 && (
                    <div className="mt-auto">
                      <h5 className="fs-6 fw-bold mb-3 d-flex align-items-center">
                        <span className="me-2">Sản phẩm thay thế tương tự</span>
                        <Badge bg="secondary" pill>{alternatives.length}</Badge>
                      </h5>
                      <ListGroup variant="flush" className="border rounded">
                        {alternatives.map((altProd, idx) => (
                          <ListGroup.Item key={altProd.id} className="p-3 d-flex align-items-start bg-light">
                            <span className="badge bg-secondary rounded-pill me-3 mt-1">#{idx + 2}</span>
                            <div>
                              <h6 className="mb-1 fw-bold fs-6">{altProd.name}</h6>
                              <small className="text-muted d-block mb-2">{altProd.brand}</small>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="text-primary fw-semibold small">{altProd.priceRange}</span>
                                <Badge bg="success" className="bg-opacity-10 text-success border border-success">
                                  Độ phù hợp: {altProd.matchScore || (10 - idx)}/10
                                </Badge>
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </Col>
              );
            })}
          </Row>

          <SkincareRoutine recommendations={Object.values(recommendations).map(list => list[0]).filter(Boolean)} />
        </Card.Body>
      </Card>
    </div>
  );
}

export default CommercialProducts;
