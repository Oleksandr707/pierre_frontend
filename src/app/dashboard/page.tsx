import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Grid';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestCustomers } from '@/components/dashboard/overview/latest-orders';
import { Sales } from '@/components/dashboard/overview/sales';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { Traffic } from '@/components/dashboard/overview/traffic';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid
        size={{
          lg: 6,
          sm: 6,
          xs: 12,
        }}
      >
        <Budget diff={12} trend="up" sx={{ height: '100%' }} />
      </Grid>
      <Grid
        size={{
          lg: 6,
          sm: 6,
          xs: 12,
        }}
      >
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }}/>
      </Grid>
      <Grid
        size={{
          lg: 8,
          sm: 6,
          xs: 12,
        }}
      >
        <Sales
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid
        size={{
          lg: 4,
          md: 6,
          xs: 12,
        }}
      >
        <Traffic />
      </Grid>
      <Grid
        size={{
          lg: 12,
          md: 12,
          xs: 12,
        }}
      >
      <LatestCustomers sx={{ height: '100%' }} />

      </Grid>
    </Grid>
  );
}
