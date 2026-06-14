import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { BiNetworkChart, BiDna, BiLayer, BiSupport } from 'react-icons/bi';

function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="about-page py-5 bg-light-subtle min-vh-100">
      <Container>
        {/* Banner Section */}
        <div className="text-center mb-5 pb-3">
          <h1 className="about-page__title fw-bold text-dark font-heading mb-2">
            {t('about.title')}
          </h1>
          <p className="about-page__subtitle text-muted lead">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission & Technology */}
        <Row className="gy-4 mb-5">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100 p-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3 fs-3">
                    <BiDna />
                  </div>
                  <h3 className="fs-4 fw-bold mb-0">{t('about.mission_title')}</h3>
                </div>
                <p className="text-muted leading-relaxed">
                  {t('about.mission_desc')} Nền tảng hướng tới mục tiêu cung cấp giải pháp làm đẹp siêu cá nhân hóa (hyper-personalization) dựa trên nền tảng y học và công nghệ AI Agents tiên phong.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm h-100 p-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3 fs-3">
                    <BiNetworkChart />
                  </div>
                  <h3 className="fs-4 fw-bold mb-0">{t('about.tech_title')}</h3>
                </div>
                <p className="text-muted leading-relaxed">
                  {t('about.tech_desc')} Chúng tôi sử dụng các mô hình học máy chấm điểm khép kín, tối ưu hóa công thức pha chế trực tiếp tại hệ thống nhà máy thu nhỏ, tuân thủ nghiêm ngặt các quy định pháp lý an toàn mỹ phẩm.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Architecture Section */}
        <Card className="border-0 shadow-sm p-4 mb-5">
          <Card.Body>
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3 fs-3">
                <BiLayer />
              </div>
              <h3 className="fs-4 fw-bold mb-0">{t('about.architecture_title')}</h3>
            </div>

            {/* CSS-based visual architecture flow */}
            <div className="about-page__arch-flow p-4 bg-light rounded text-center">
              <Row className="justify-content-center align-items-center g-3">
                <Col xs={12} md={3}>
                  <div className="p-3 bg-white border rounded shadow-sm">
                    <Badge bg="primary" className="mb-2">Frontend</Badge>
                    <h6 className="fw-bold mb-1">React + Bootstrap</h6>
                    <p className="text-muted mb-0 small">Responsive UI, Radar Charts, Uploader, Glassmorphism</p>
                  </div>
                </Col>

                <Col md={1} className="d-none d-md-block fs-3 text-muted">➔</Col>

                <Col xs={12} md={4}>
                  <div className="p-3 bg-white border rounded shadow-sm">
                    <Badge bg="dark" className="mb-2">Backend Services</Badge>
                    <h6 className="fw-bold mb-1">Node.js + Express + Sequelize</h6>
                    <p className="text-muted mb-2 small">5-Agent AI Orchestrator & PDF Parser</p>
                    <div className="d-flex flex-wrap gap-1 justify-content-center">
                      <Badge bg="secondary" style={{ fontSize: '0.6rem' }}>Extraction</Badge>
                      <Badge bg="secondary" style={{ fontSize: '0.6rem' }}>Validation</Badge>
                      <Badge bg="secondary" style={{ fontSize: '0.6rem' }}>Planning</Badge>
                      <Badge bg="secondary" style={{ fontSize: '0.6rem' }}>Formulation</Badge>
                      <Badge bg="secondary" style={{ fontSize: '0.6rem' }}>Review</Badge>
                    </div>
                  </div>
                </Col>

                <Col md={1} className="d-none d-md-block fs-3 text-muted">➔</Col>

                <Col xs={12} md={3}>
                  <div className="p-3 bg-white border rounded shadow-sm">
                    <Badge bg="success" className="mb-2">Database Layer</Badge>
                    <h6 className="fw-bold mb-1">PostgreSQL</h6>
                    <p className="text-muted mb-0 small">Users, SkinAnalyses, Formulations, Products, Ingredients</p>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>

        {/* Team & Contact info */}
        <Row className="gy-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100 p-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3 fs-3">
                    <BiSupport />
                  </div>
                  <h3 className="fs-4 fw-bold mb-0">{t('about.team_title')}</h3>
                </div>
                <p className="text-muted leading-relaxed">
                  {t('about.team_desc')} Đội ngũ nòng cốt gồm các kỹ sư AI tốt nghiệp từ các trường đại học hàng đầu và các dược sĩ giàu kinh nghiệm trong lĩnh vực hóa mỹ phẩm.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm h-100 p-4">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3 fs-3">
                    <BiSupport />
                  </div>
                  <h3 className="fs-4 fw-bold mb-0">{t('about.contact_title')}</h3>
                </div>
                <p className="text-muted mb-3 leading-relaxed">
                  Liên hệ hợp tác chuyển giao công nghệ, cung cấp giải pháp máy soi da liên kết API hoặc đặt hàng bộ kit thử nghiệm:
                </p>
                <span className="fw-bold text-primary fs-5">
                  📧 Email: {t('about.contact_email')}
                </span>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutPage;
