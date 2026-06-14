import { Routes, Route } from 'react-router-dom';
import NavbarCustom from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <div className="app">
      <NavbarCustom />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard/:id" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
