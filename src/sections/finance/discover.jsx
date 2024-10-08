import React from 'react';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import DashboardFinance from 'src/sections/admin/finance/Dashboard';
// const DashboardFinance = lazy(() => import('./finance/Dashboard'));

function FianaceDiscover() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Fianace"
        links={[
          { name: 'Dashboard', href: paths.dashboard.finance.root },
          {
            name: 'Fianace',
            href: paths.dashboard.finance.root,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DashboardFinance />
    </Container>
  );
}

export default FianaceDiscover;
