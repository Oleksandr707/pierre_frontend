export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in'},
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    settings: '/dashboard/settings',
  },
} as const;
