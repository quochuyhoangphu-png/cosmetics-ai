import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Spinner, Button, Card } from 'react-bootstrap';
import { BiArrowBack, BiGridAlt, BiShoppingBag, BiDna, BiHomeAlt } from 'react-icons/bi';
import { FaFlask } from 'react-icons/fa';
import RawDataSection from '../components/dashboard/RawDataSection';
import CommercialProducts from '../components/recommendations/CommercialProducts';
import MiniFactoryKit from '../components/formulation/MiniFactoryKit';
import AgentPipeline from '../components/agents/AgentPipeline';
import { getAnalysis } from '../services/api';

function DashboardPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoading(true);
        const response = await getAnalysis(id);
        if (response.success) {
          setAnalysisData(response.data.analysis);
        } else {
          setError(t('common.error'));
        }
      } catch (err) {
        console.error('Error fetching analysis details:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadAnalysis();
    }
  }, [id, t]);

  if (loading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <h4 className="mt-3 text-muted">{t('common.loading')}</h4>
      </Container>
    );
  }

  if (error || !analysisData) {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <h3 className="text-danger mb-3">{t('common.error')}</h3>
        <p className="text-muted mb-4">{t('dashboard.error_not_found', { id })}</p>
        <Link to="/upload">
          <Button variant="primary" className="px-4 py-2">
            {t('common.retry')}
          </Button>
        </Link>
      </Container>
    );
  }

  // Fallback for agentSteps processing time metadata (from demo response or mock)
  const agentSteps = analysisData.agentSteps || [
    { agent: 'orchestrator', status: 'complete', processingTimeMs: 120 },
    { agent: 'extraction', status: 'complete', processingTimeMs: 450 },
    { agent: 'planning', status: 'complete', processingTimeMs: 310 },
    { agent: 'formulation', status: 'complete', processingTimeMs: 520 },
    { agent: 'review', status: 'complete', processingTimeMs: 180 }
  ];

  const formattedDate = new Date(analysisData.createdAt).toLocaleDateString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="dashboard-page py-5 bg-light-subtle min-vh-100">
      <Container>
        {/* Navigation & Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 pb-3 border-bottom">
          <div className="mb-3 mb-md-0">
            <Link to="/upload" className="text-decoration-none text-muted d-inline-flex align-items-center mb-3">
              <BiArrowBack className="me-1" /> {t('common.back')}
            </Link>
            <h1 className="dashboard-page__title h2 fw-bold text-dark mb-1">
              {t('dashboard.title')} #{analysisData.id}
            </h1>
            <p className="text-muted small mb-0">
              📅 Ngày phân tích: {formattedDate} | File: {analysisData.pdfFilename}
            </p>
          </div>
          <div>
            <Button
              variant="outline-primary"
              className="d-flex align-items-center"
              onClick={() => window.print()}
            >
              📄 {t('common.download')} PDF Report
            </Button>
          </div>
        </div>

        {/* Overview Navigation Cards */}
        <Row className="g-4 mb-5 pb-4 border-bottom">
          <Col md={4}>
            <Card 
              className="h-100 shadow-sm border-0 text-center p-4 dashboard-card-hover" 
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: 'var(--color-surface)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onClick={() => { document.getElementById('raw-data').scrollIntoView({ behavior: 'smooth' }); }}
            >
              <div className="mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle" style={{ width: '80px', height: '80px' }}>
                  <BiGridAlt size={40} className="text-primary" />
                </div>
              </div>
              <Card.Title className="fw-bold mb-3">{t('dashboard.raw_data_title')}</Card.Title>
              <Card.Text className="text-muted small mb-4">
                {t('dashboard.overview_raw_data_desc')}
              </Card.Text>
              <div className="mt-auto">
                <Button variant="outline-primary" className="rounded-pill w-100">{t('common.view_details', 'Xem chi tiết')}</Button>
              </div>
            </Card>
          </Col>
          <Col md={4}>
            <Card 
              className="h-100 shadow-sm border-0 text-center p-4 dashboard-card-hover" 
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: 'var(--color-surface)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onClick={() => { document.getElementById('formulation').scrollIntoView({ behavior: 'smooth' }); }}
            >
              <div className="mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-warning bg-opacity-10 rounded-circle" style={{ width: '80px', height: '80px' }}>
                  <FaFlask size={40} className="text-warning" />
                </div>
              </div>
              <Card.Title className="fw-bold mb-3">{t('dashboard.kit_title')}</Card.Title>
              <Card.Text className="text-muted small mb-4">
                {t('dashboard.overview_kit_desc')}
              </Card.Text>
              <div className="mt-auto">
                <Button variant="outline-warning" className="rounded-pill w-100">{t('common.view_details', 'Xem chi tiết')}</Button>
              </div>
            </Card>
          </Col>
          <Col md={4}>
            <Card 
              className="h-100 shadow-sm border-0 text-center p-4 dashboard-card-hover" 
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: 'var(--color-surface)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onClick={() => { document.getElementById('products').scrollIntoView({ behavior: 'smooth' }); }}
            >
              <div className="mb-3">
                <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle" style={{ width: '80px', height: '80px' }}>
                  <BiShoppingBag size={40} className="text-success" />
                </div>
              </div>
              <Card.Title className="fw-bold mb-3">{t('dashboard.commercial_title')}</Card.Title>
              <Card.Text className="text-muted small mb-4">
                {t('dashboard.overview_products_desc')}
              </Card.Text>
              <div className="mt-auto">
                <Button variant="outline-success" className="rounded-pill w-100">{t('common.view_details', 'Xem chi tiết')}</Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Full Details Sections */}
        <div id="raw-data" className="pt-4 mt-2">
          <RawDataSection skinData={analysisData} />
        </div>
        
        <div id="formulation" className="pt-5 mt-4">
          <MiniFactoryKit analysisId={analysisData.id} />
        </div>
        
        <div id="products" className="pt-5 mt-4 mb-5">
          <CommercialProducts analysisId={analysisData.id} />
        </div>

        {/* Multi-Agent processing details */}
        <div className="mt-5 pt-3 border-top">
          <AgentPipeline agentSteps={agentSteps} />
        </div>
      </Container>
    </div>
  );
}

export default DashboardPage;
