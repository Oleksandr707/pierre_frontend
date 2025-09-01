'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface TrafficProps {
  sx?: SxProps;
}

export function Traffic({ sx }: TrafficProps): React.JSX.Element {
  const [chartSeries, setChartSeries] = React.useState<number[]>([]);
  const [labels, setLabels] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchTotals = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/stats/years-total`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setLabels([`This Year (${new Date().getFullYear()})`, `Last Year (${new Date().getFullYear() - 1})`]);
          setChartSeries([data.thisYear, data.lastYear]);
        }
      } catch (error) {
        console.error('❌ Error fetching yearly totals:', error);
      }
    };
    fetchTotals();
  }, []);

  const chartOptions = useChartOptions(labels);

  return (
    <Card sx={sx}>
      <CardHeader title="Customers (Year Comparison)" />
      <CardContent>
        <Stack spacing={2}>
          <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />
          <Stack direction="row" spacing={4} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            {chartSeries.map((item, index) => (
              <Stack key={labels[index]} spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="h6">{labels[index]}</Typography>
                <Typography color="text.secondary" variant="subtitle2">
                  {item}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent' },
    colors: [theme.palette.primary.main, theme.palette.warning.main],
    dataLabels: { enabled: false },
    labels,
    legend: { show: true, position: 'bottom' },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}
