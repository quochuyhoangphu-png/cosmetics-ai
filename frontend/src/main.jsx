import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import './styles/global.css';
import './styles/components/navbar.css';
import './styles/components/hero.css';
import './styles/components/upload.css';
import './styles/components/dashboard.css';
import './styles/components/kit.css';
import './styles/components/agents.css';
import './styles/components/products.css';
import './App.css';
import './i18n';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
