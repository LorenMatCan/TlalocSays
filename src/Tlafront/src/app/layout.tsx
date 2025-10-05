import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';


export const metadata: Metadata = {
  title: "Historical Weather Likelihood Dashboard | NASA Earth Data for Event Planning",
  description: 'Check the likelihood of rain, wind, heat, sky clearness and frost day for any location and date based on decades of NASA Earth observation data. Plan your event with confidence!',
  icons: {
    icon: '/Tlaloc-Icon.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""></script>
      </head>
      <body 
        className="font-body antialiased bg-background"
      >
        <SidebarProvider>
          <div className="flex h-screen w-full">
            {children}
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
