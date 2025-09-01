'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';

export default function CustomersClient(): React.JSX.Element {
    const [customers, setCustomers] = React.useState<Customer[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [total, setTotal] = React.useState(0);
    const [search, setSearch] = React.useState("");
  
    const fetchCustomers = React.useCallback(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/all?page=${page}&limit=${rowsPerPage}&search=${encodeURIComponent(search)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}`,
            },
          }
        );
  
        if (!res.ok) throw new Error('Failed to fetch customers');
  
        const data = await res.json();

        console.log("📡 Fetching from:", `${process.env.NEXT_PUBLIC_API_URL}/api/users/all?page=${page}&limit=${rowsPerPage}&search=${search}`);

  
        const mapped: Customer[] = data.users.map((user: any) => ({
            id: user._id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || user.email,
            email: user.email,
            phone: user.phoneNumber || 'N/A',
            address: user.address || 'N/A',
            city: user.city || 'N/A',
            waiverStatus: user.waiverStatus || 'pending',
            waiverSignedAt: user.waiverSignedAt ? dayjs(user.waiverSignedAt).toDate() : null,
            avatar: user.profilePhoto || '/assets/avatar-1.png',  // ✅ include avatar
          }));
          
  
        setCustomers(mapped);
        setTotal(data.total);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    }, [page, rowsPerPage, search]);
  
    React.useEffect(() => {
      fetchCustomers();
    }, [fetchCustomers]);
  
    return (
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Customers</Typography>
          </Stack>
        </Stack>
  
        {/* ✅ Pass search state */}
        <CustomersFilters search={search} onSearchChange={setSearch} />
  
        <CustomersTable
          count={total}
          page={page}
          rows={customers}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          refresh={fetchCustomers}
        />
      </Stack>
    );
  }
  
