'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import React from 'react';
const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
   const queryClient = new QueryClient();
   return (
      <QueryClientProvider client={queryClient}>
         <SessionProvider>{children}</SessionProvider>
      </QueryClientProvider>
   );
};
export default ReactQueryProvider;
