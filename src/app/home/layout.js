"use client";
import { usePathname } from 'next/navigation';
import LayOutCom from "@/app/components/HomePage/LayouCom";

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current path

  // Check for excluded paths and patterns
  const excludePaths = ['/home', '/home/AllDairies'];
  const isExcludedDynamicPath =
    pathname.startsWith('/home/milkRecords/getMilksUserSide') ||
    pathname.startsWith('/home/AllDairies/') ||
    pathname.startsWith('/home/BillData') ||
    pathname.startsWith('/home/orders/getOrdersUserside') || 
    pathname.startsWith('/home/GetKapatUserSide');

  return (
    <html lang="en">
      <body>
        {!excludePaths.includes(pathname) && !isExcludedDynamicPath && <LayOutCom />}
        {children}
      </body>
    </html>
  );
}
