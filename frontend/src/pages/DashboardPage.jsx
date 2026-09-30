import React, { useEffect, useState, useRef } from 'react';
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

// ============================================================
// DỮ LIỆU MẪU TÍCH HỢP SẴN - Hoạt động khi backend offline
// Built-in mock data - works even when Render backend is sleeping
// ============================================================
const DEMO_MOCK_DATA = {
  id: 'demo-001',
  pdfFilename: 'bao-cao-da-demo.pdf',
  createdAt: new Date().toISOString(),
  skinType: 'oily',
  ageGroup: 'under_25',
  tzoneSebum: 72.5,
  tzonePoreSize: 55.3,
  tzonePoreDepth: 42.1,
  uzoneMoisture: 35.8,
  uzonePigmentation: 28.4,
  overallSensitivity: 45.2,
  acneSeverity: 3,
  dataValidated: true,
  validationNotes: 'Dữ liệu đã được kiểm duyệt bởi hệ thống AI chuyên gia. Da dầu mụn trung bình, nhóm tuổi dưới 25.',
  rawPdfText: '[DEMO] Báo cáo phân tích da mẫu. Hồ sơ: Dưới 25 tuổi, da dầu/hỗn hợp với mụn trung bình.',
  agentSteps: [
    { agent: 'orchestrator', status: 'complete', processingTimeMs: 120 },
    { agent: 'extraction', status: 'complete', processingTimeMs: 450 },
    { agent: 'planning', status: 'complete', processingTimeMs: 310 },
    { agent: 'formulation', status: 'complete', processingTimeMs: 520 },
    { agent: 'review', status: 'complete', processingTimeMs: 180 },
  ],
};

// Floating sidebar navigation styles (inline for simplicity)
const floatNavStyles = {
  wrapper: (visible) => ({
    position: 'fixed',
    left: '16px',
    top: '50%',
    transform: visible ? 'translateY(-50%)' : 'translateY(-50%) translateX(-80px)',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: 'opacity 0.35s ease, transform 0.35s ease',
  }),
  btn: (active, color) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: active
      ? `0 4px 16px ${color}55`
      : '0 2px 8px rgba(0,0,0,0.12)',
    background: active ? color : '#ffffff',
    color: active ? '#ffffff' : color,
    fontSize: '10px',
    fontWeight: 600,
    gap: '3px',
    padding: '6px 2px 4px',
  }),
};

function DashboardPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('raw-data');
  const [showFloatNav, setShowFloatNav] = useState(false);
  const overviewCardsRef = useRef(null);

  useEffect(() => {
    async function loadAnalysis() {
      // ✅ Chế độ Demo: dùng dữ liệu tích hợp sẵn, không cần backend
      if (id === 'demo-001') {
        setAnalysisData(DEMO_MOCK_DATA);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getAnalysis(id);
        if (response.success) {
          setAnalysisData(response.data.analysis);
        } else {
          // Nếu backend lỗi, fallback về dữ liệu demo
          console.warn('Backend error, falling back to demo data');
          setAnalysisData(DEMO_MOCK_DATA);
        }
      } catch (err) {
        console.error('Error fetching analysis details:', err);
        // Nếu không kết nối được backend, fallback về dữ liệu demo
        console.warn('Backend unreachable, using demo data');
        setAnalysisData(DEMO_MOCK_DATA);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadAnalysis();
    }
  }, [id, t]);

  // Show floating nav only after scrolling past the overview cards
  useEffect(() => {
    if (!analysisData) return;
    const trigger = overviewCardsRef.current;
    if (!trigger) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        // When the cards go OUT of view (scrolled past them), show the nav
        setShowFloatNav(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    obs.observe(trigger);
    return () => obs.disconnect();
  }, [analysisData]);

  // Track which section is currently visible using IntersectionObserver
  useEffect(() => {
    if (!analysisData) return;
    const sections = ['raw-data', 'formulation', 'products'];
    const observers = [];

    sections.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId);
          }
        },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [analysisData]);

  const scrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

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

  const navItems = [
    { id: 'raw-data', icon: <BiGridAlt size={22} />, label: 'Phân Tích', color: '#0d6efd' },
    { id: 'formulation', icon: <FaFlask size={20} />, label: 'Bộ Kit', color: '#ffc107' },
    { id: 'products', icon: <BiShoppingBag size={22} />, label: 'Sản Phẩm', color: '#198754' },
  ];

  return (
    <div className="dashboard-page py-5 bg-light-subtle min-vh-100">

      {/* ===== Floating Sidebar Navigation (hiện sau khi lướt qua 3 card) ===== */}
      <div style={floatNavStyles.wrapper(showFloatNav)} aria-label="Điều hướng nhanh">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`float-nav-${item.id}`}
            title={item.label}
            onClick={() => scrollTo(item.id)}
            style={floatNavStyles.btn(activeSection === item.id, item.color)}
            aria-label={`Đi đến mục ${item.label}`}
          >
            {item.icon}
            <span style={{ fontSize: '9px', lineHeight: 1 }}>{item.label}</span>
          </button>
        ))}
      </div>

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

        {/* Overview Navigation Cards - ref used to detect when user scrolls past this */}
        <Row ref={overviewCardsRef} className="g-4 mb-5 pb-4 border-bottom">
          <Col md={4}>
            <Card 
              className="h-100 shadow-sm border-0 text-center p-4 dashboard-card-hover" 
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', backgroundColor: 'var(--color-surface)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              onClick={() => scrollTo('raw-data')}
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
              onClick={() => scrollTo('formulation')}
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
              onClick={() => scrollTo('products')}
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
