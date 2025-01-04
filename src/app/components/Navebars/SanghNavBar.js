'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Drawer from '../../components/Models/drawerSanghodel';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const dropdownRef = useRef(null);

  const router = useRouter();

  const logout = async () => {
    try {
      await axios.get('/api/owner/logout');
      router.push('/');
    } catch (error) {
      console.log('Logout failed: ', error.message);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const dropdownItems = {
    माहिती_भरणे: [
      { href: "/home/AllDairies/OrdersName", label: "Product Name " },
      { href: "/home/AllDairies/MakeMilk", label: "Add Milks " },
      { href: "/home/SthirKapat", label: " कपातीचे नावे भरणे " },
      { href: "/home/AllDairies/Docter/AddTagType", label: "Add Tag Type " },
      { href: "/home/AllDairies/Docter/Decieses", label: "Add Decises " },

    ],
    रीपोर्ट: [
      { href: "/home/AllDairies/Orders/GetOwnerOrders", label: "Order History " },
      { href: "/home/AllDairies/getAllMilk", label: "All Owner Milks " },
      { href: "/home/AllDairies/OwnerMilks", label: "Owner-wise Milks  " },
      { href: "/home/AllDairies/OwnerKapat", label: "Add Kapat " },
      { href: "/home/AllDairies/OwnerBills", label: "Owner Bills " },
      { href: "/home/AllDairies/ExtraRate", label: "extra Rate " },
      { href: "/home/AllDairies/Orders/GetOwnerOrders", label: " Order History " },
    ],
    इतर: [
      { href: "/home/AllDairies/Docter/GetTagType", label: "get tag Type" },
      { href: "/home/AllDairies/Docter/GetDecieses", label: "Get Decieses  names" },
      { href: "/home/milkRecords/OnwerBills", label: "संघ बिल पाहणे" },
      { href: "/home/Docter/GetDocterVisit", label: "डॉक्टर सेवा मागणी " }
    ],
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-gray-800 text-white" style={{ position: 'sticky', zIndex: 50 }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center">
              <button onClick={toggleDrawer} className="text-xl font-bold cursor-pointer">
              <FontAwesomeIcon icon={faBars} size="lg" />
              </button>
            </div>
            <div className="flex flex-row" ref={dropdownRef}>
              {Object.keys(dropdownItems).map((menu) => (
                <div key={menu} className="relative -ml-2">
                  <button
                    onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                    className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {menu}
                  </button>
                  {activeMenu === menu && (
                    <div className="absolute left-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl">
                      {dropdownItems[menu].map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={logout} className="text-gray-300 hover:text-white">
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
              </button>
              <Link
                href="/home/updateDetails/OnwerUpdate"
                className="hover:bg-gray-700 px-3 py-2 rounded-full"
              >
                <Image className="rounded-full" src="/assets/avatar.png" alt="User" width={30} height={30} />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Drawer for Mobile View */}
      <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer}>
        <div className="p-4">
          {Object.keys(dropdownItems).map((menu) => (
            <div key={menu} className="mb-4">
              <h2
                onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                className="font-bold text-lg cursor-pointer hover:text-gray-900"
              >
                {menu}
              </h2>
              {activeMenu === menu && (
                <ul className="mt-2">
                  {dropdownItems[menu].map((item, index) => (
                    <li key={index} className="py-1">
                      <Link href={item.href} className="text-sm text-gray-700 hover:text-gray-900">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Drawer>
    </>
  );
}
