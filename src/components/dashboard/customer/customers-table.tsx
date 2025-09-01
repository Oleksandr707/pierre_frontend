'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Stack,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react/dist/ssr';
import dayjs from 'dayjs';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  waiverStatus: string;
  waiverSignedAt: Date | null;
  avatar: string;
}

interface CustomersTableProps {
  count: number;
  page: number;
  rows: Customer[];
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  refresh: () => void; // 👈 new: reload data after edit/delete
}

export function CustomersTable({
  count,
  page,
  rows,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  refresh,
}: CustomersTableProps): React.JSX.Element {
  // DELETE handler
  const handleDelete = async (cust: Customer) => {
    if (!confirm(`Delete ${cust.name}?`)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${cust.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('✅ User deleted');
        refresh(); // reload customer list
      } else {
        alert('❌ ' + data.error);
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
    }
  };

  // EDIT handler (simple example: just update waiverStatus)
  const handleEdit = async (cust: Customer) => {
    const newStatus = prompt(`Enter new waiver status for ${cust.name}`, cust.waiverStatus);
    if (!newStatus) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${cust.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
        },
        body: JSON.stringify({ waiverStatus: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('✅ User updated');
        refresh(); // reload customer list
      } else {
        alert('❌ ' + data.error);
      }
    } catch (error) {
      console.error('❌ Update error:', error);
    }
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Waiver Status</TableCell>
            <TableCell>Waiver Signed At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={row.avatar} alt={row.name} />
                  <Typography variant="body2" fontWeight={500}>
                    {row.name}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.city}</TableCell>
              <TableCell>{row.waiverStatus}</TableCell>
              <TableCell>
                {row.waiverSignedAt
                  ? dayjs(row.waiverSignedAt).format('YYYY-MM-DD')
                  : 'N/A'}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Tooltip title="Edit">
                    <IconButton size="small" color="primary" onClick={() => handleEdit(row)}>
                      <PencilSimpleIcon fontSize="var(--icon-fontSize-md)" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
                      <TrashIcon fontSize="var(--icon-fontSize-md)" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </>
  );
}
