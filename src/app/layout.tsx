import { cn } from '@/lib/utils';

import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import { ToasterProvider } from '@/providers/toaster-provider';
import ReactQueryProvider from '@/providers/react-query-provider';

export const metadata = {
   title: 'Reddit',
   description: 'A Reddit clone built with Next.js and TypeScript.',
};

const font = Inter({ subsets: ['latin'] });
export default function RootLayout({
   children,
   authModal,
}: {
   children: React.ReactNode;
   authModal: React.ReactNode;
}) {
   return (
      <html
         lang="en"
         className={cn('bg-white text-slate-900 antialiased', font.className)}
      >
         <body className="min-h-screen pt-12 bg-slate-50 antialiased">
            <ReactQueryProvider>
               <ToasterProvider />
               {/* @ts-expect-error Server Component */}
               <Navbar />
               {authModal}
               <div className="container max-w-7xl mx-auto h-full pt-12">
                  {children}
               </div>
            </ReactQueryProvider>
         </body>
      </html>
   );
}
