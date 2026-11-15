import React from 'react';

import { render } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';

import { ROUTER_FUTURE_FLAGS } from '@/config/router';
import AppProviders from '@/contexts/AppProviders';

export const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <AppProviders>
      <HashRouter future={ROUTER_FUTURE_FLAGS}>{ui}</HashRouter>
    </AppProviders>,
  );
