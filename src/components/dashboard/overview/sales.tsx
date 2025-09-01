'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface SalesProps {
  sx?: SxProps;
}

export function Sales({ sx }: SalesProps): React.JSX.Element {
  const chartOptions = useChartOptions();
  const [chartSeries, setChartSeries] = React.useState<{ name: string; data: number[] }[]>([]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/stats/year`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        // Real data for this year
        const thisYearData: number[] = data.data;

        // Random data for last year
        const lastYearData: number[] = Array.from(
          { length: 12 },
          () => Math.floor(Math.random() * 0) + 0
        );

        setChartSeries([
          { name: `This Year (${new Date().getFullYear()})`, data: thisYearData },
          { name: `Last Year (${new Date().getFullYear() - 1})`, data: lastYearData },
        ]);
      }
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}
            onClick={fetchStats} // 🔄 Refresh data
          >
            Sync
          </Button>
        }
        title="Statistics"
      />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }} />
    </Card>
  );
}

function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
    colors: [
      theme.palette.primary.main, // This year
      alpha(theme.palette.primary.main, 0.25), // Last year
    ],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: true, position: 'top' },
    plotOptions: { bar: { columnWidth: '40px' } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toString(),
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}
