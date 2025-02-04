"use client";
import { usePathname } from 'next/navigation';
import LayOutCom from "@/app/components/HomePage/LayoutComeSangh";

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current path

  // Define the base path where the layout should apply
  const basePath = '/home/AllDairies';
  const isIncludedInBasePath = pathname.startsWith(basePath);

  return (
    <html lang="en">
      <body>
      <div className='gradient-bg flex flex-col min-h-screen'>
        {/* Render layout only if the current path starts with '/home/AllDairies' */}
        {isIncludedInBasePath && <LayOutCom />}
        {children}
        </div>
      </body>
    </html>
  );
}
