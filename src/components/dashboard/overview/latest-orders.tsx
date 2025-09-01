'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';

const waiverMap = {
  pending: { label: 'Pending', color: 'warning' },
  signed: { label: 'Signed', color: 'success' },
  expired: { label: 'Expired', color: 'error' },
} as const;

export interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  waiverStatus: 'pending' | 'signed' | 'expired' | null;
  createdAt: Date | null;
}

export interface LatestCustomersProps {
  sx?: SxProps;
}

export function LatestCustomers({ sx }: LatestCustomersProps): React.JSX.Element {
  const [customers, setCustomers] = React.useState<Customer[]>([]);

  React.useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/latest`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setCustomers(
            data.users.map((u: any) => ({
              id: u._id,
              firstName: u.firstName,
              lastName: u.lastName,
              email: u.email,
              waiverStatus: u.waiverStatus,
              createdAt: u.createdAt,
            }))
          );
        }
      } catch (error) {
        console.error('❌ Error fetching latest customers:', error);
      }
    };

    fetchLatest();
  }, []);

  return (
    <Card sx={sx}>
      <CardHeader title="Latest Customers" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Waiver Status</TableCell>
              <TableCell>Date Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((cust) => {
              const { label, color } =
                cust.waiverStatus && waiverMap[cust.waiverStatus]
                  ? waiverMap[cust.waiverStatus]
                  : { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={cust.id}>
                  <TableCell>
                    {cust.firstName || cust.lastName
                      ? `${cust.firstName ?? ''} ${cust.lastName ?? ''}`.trim()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{cust.email}</TableCell>
                  <TableCell>
                    <Chip color={color as any} label={label} size="small" />
                  </TableCell>
                  <TableCell>
                    {cust.createdAt ? dayjs(cust.createdAt).format('MMM D, YYYY') : 'N/A'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
