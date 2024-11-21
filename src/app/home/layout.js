"use client";
import { usePathname } from 'next/navigation';
import LayOutCom from "@/app/components/HomePage/LayouCom";

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current path

  return (
    <html lang="en">
      <body>
        {pathname !== '/home' && <LayOutCom />} {/* Hide on /home */}
        {children}
      </body>
    </html>
  );
}
