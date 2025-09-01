import type { Metadata } from 'next';
import { config } from '@/config';
import CustomersClient from './customers-client';

export const metadata: Metadata = {
  title: `Customers | Dashboard | ${config.site.name}`,
};

export default function Page() {
  return <CustomersClient />;
}
