import React from 'react';

import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import App from '@/App';
import { ROUTER_FUTURE_FLAGS } from '@/config/router';
import AppProviders from '@/contexts/AppProviders';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <HashRouter future={ROUTER_FUTURE_FLAGS}>
        <App />
      </HashRouter>
    </AppProviders>
  </React.StrictMode>,
);
