import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <Container>
        <Row className="g-4">
          <Col lg={4} md={6}>
            <div className="footer__brand">
              <h3 className="footer__brand-name">DermAI</h3>
              <p className="footer__brand-desc">{t('footer.brand_desc')}</p>
            </div>
          </Col>
          <Col lg={2} md={6} xs={6}>
            <h6 className="footer__column-title">{t('footer.product')}</h6>
            <ul className="footer__links">
              <li>
                <Link to="/upload" className="footer__link">
                  {t('footer.skin_analysis')}
                </Link>
              </li>
              <li>
                <Link to="/upload" className="footer__link">
                  {t('footer.recommendations')}
                </Link>
              </li>
              <li>
                <Link to="/upload" className="footer__link">
                  {t('footer.mini_factory')}
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  {t('footer.pricing')}
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg={2} md={6} xs={6}>
            <h6 className="footer__column-title">{t('footer.company')}</h6>
            <ul className="footer__links">
              <li>
                <Link to="/about" className="footer__link">
                  {t('footer.about_us')}
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  {t('footer.careers')}
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  {t('footer.blog')}
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  {t('footer.press')}
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg={2} md={6} xs={6}>
            <h6 className="footer__column-title">{t('footer.support')}</h6>
            <ul className="footer__links">
              <li>
                <Link to="/" className="footer__link">
                  {t('footer.help_center')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer__link">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/" className="footer__link">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <div className="footer__bottom">
          <p className="footer__copyright">{t('footer.copyright')}</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
