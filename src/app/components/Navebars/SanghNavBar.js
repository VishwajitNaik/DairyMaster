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
      { href: "/home/AllDairies/MakeMilk", label: "दूध भरणे " },
      { href: "/home/Rates/AddRates", label: "दरपत्रक भरणे " },
      { href: "/home/AllDairies/AddKapatOption", label: " कपातीचे नावे भरणे " },
      { href: "/home/AllDairies/OrdersName", label: "ऑर्डर नावे भरणे" },
      { href: "/home/AllDairies/ExtraRate", label: "अतिरिक्त दर भरणे" },
      { href: "/home/AllDairies/Docter/AddTagType", label: "फिक्स SNF" },
    ],
    रीपोर्ट: [
      { href: "/home/Sabhasad_List", label: "उत्पादकाची यादी " },
      { href: "/home/BillData", label: "बील पेमेंट " },
      { href: "/home/Rates/GetRates", label: "दर पत्रक पाहणे  " },
      { href: "/home/AddOwnerOrders", label: "ऑर्डर करणे " },
      { href: "/home/orders/getOwnerOrders", label: "संघ ऑर्डर पाहणे " },
      { href: "/home/AdvanceSabhasad_List", label: "सभासद अडवांस पाहणे " },
      { href: "/home/BillKapatSabhasad_List", label: "बिल कपात पाहणे " },
      { href: "/home/AllUserBillKapat", label: "सर्व सभासद कपात पाहणे  " },
    ],
    इतर: [
      { href: "/home/AllUserOrders", label: "सर्व उत्पादक बाकी पाहणे" },
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
       
      <nav
        className="bg-gray-800 bg-opacity-70 backdrop-blur-md text-white"
        style={{ position: 'sticky', top: 0, zIndex: 40 }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Drawer Toggle Button */}
            <div className="flex items-center">
              <button onClick={toggleDrawer} className="text-xl font-bold cursor-pointer">
                <FontAwesomeIcon icon={faBars} size="lg" />
              </button>
            </div>

            {/* Dropdown Menu */}
            <div className="flex flex-row" ref={dropdownRef}>
              {Object.keys(dropdownItems).map((menu) => (
                <div key={menu} className="relative -ml-2">
                  <button
                    onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                    className="hover:bg-blue-300 px-4 sm:px-8 py-2 sm:mr-4 rounded-md text-sm font-medium border-b border-gray-300"
                  >
                    {menu}
                  </button>
                  {activeMenu === menu && (
                    <div className="absolute left-0 w-48 py-2 mt-2 rounded-md rounded-b-md shadow-xl">
                      {dropdownItems[menu].map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="block px-4 py-2 bg-blue-500 text-white border-b border-blue-200 text-sm  hover:bg-gray-200 hover:text-black z-20"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side (Avatar and Logout) */}
            <div className="flex items-center space-x-8">
              <button onClick={logout} className="text-gray-300 hover:text-white">
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
              </button>
              <Link
                href="/home/updateDetails/OnwerUpdate"
                className="hover:bg-gray-700 px-3 py-2 rounded-full"
              >
                <Image
                  className="rounded-full"
                  src="/assets/avatar.png"
                  alt="User"
                  width={30}
                  height={30}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
    </>
  );
}
