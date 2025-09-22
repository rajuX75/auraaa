import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/theme';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ProfileQuery } from '../convex/query.config';
import { ConvexClientProvider } from '../providers/ConvexClientProvider';
import ReduxProvider from '../redux/provider';
import { ConvexUserRaw, normalizeProfile } from '../types/user';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Auraaa',
  description: 'Sketch To Designs Using AI',
  icons: {
    icon: '/file.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawProfile = await ProfileQuery();
  const profile = normalizeProfile(rawProfile._valueJSON as unknown as ConvexUserRaw | null);
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ReduxProvider preloadedState={{ profile }}>
                {children}
                <Toaster />
              </ReduxProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
