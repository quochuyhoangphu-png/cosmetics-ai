import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BiGlobe } from 'react-icons/bi';

function NavbarCustom() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`navbar-custom ${scrolled ? 'navbar-custom--scrolled' : ''}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-custom__brand">
          DermAI
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center gap-1">
            <Nav.Link
              as={Link}
              to="/"
              className={`navbar-custom__link ${isActive('/') ? 'navbar-custom__link--active' : ''}`}
            >
              {t('nav.home')}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/upload"
              className={`navbar-custom__link ${isActive('/upload') ? 'navbar-custom__link--active' : ''}`}
            >
              {t('nav.upload')}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              className={`navbar-custom__link ${isActive('/about') ? 'navbar-custom__link--active' : ''}`}
            >
              {t('nav.about')}
            </Nav.Link>
            <button
              className="navbar-custom__lang-toggle ms-lg-2"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              <BiGlobe className="navbar-custom__lang-toggle-icon" />
              {t('nav.language')}
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarCustom;
