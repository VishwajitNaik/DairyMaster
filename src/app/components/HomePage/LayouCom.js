'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Drawer from '../Models/drawerMoldel';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    माहिती_भरणे: false,
    रीपोर्ट: false,
    इतर: false,
  });

  const router = useRouter();
  const navbarRef = useRef(null);

  // Logout
  const logout = async () => {
    try {
      await axios.get('/api/owner/logout');
      router.push('/');
    } catch (error) {
      console.log('Logout failed: ', error.message);
    }
  };

  const toggleDropdown = (menu) => {
    setDropdownOpen((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === menu ? !prevState[key] : false;
        return acc;
      }, {}),
    }));
  };

  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setDropdownOpen({
        माहिती_भरणे: false,
        रीपोर्ट: false,
        इतर: false,
      });
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handlePrevious = () => {
    router.back();
  };

  const handleNext = () => {
    router.forward();
  };

  const dropdownItems = {
    माहिती_भरणे: [
      { href: "/home/GetKapat", label: "कपाती पाहणे " },
      { href: "/home/Rates/AddRates", label: "दरपत्रक भरणे " },
      { href: "/home/SthirKapat", label: " कपातीचे नावे भरणे " },
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
      { href: "/home/AllUserBillKapat", label: "सर्व उत्पादक बिल कपात पाहणे " },
      { href: "/home/milkRecords/OnwerBills", label: "संघ बिल पाहणे" },
      { href: "/home/Docter/GetDocterVisit", label: "डॉक्टर सेवा मागणी " }
    ],
  };

  return (
    <>
      <nav className="bg-gray-800 text-white" style={{ position: 'sticky', zIndex: 100 }} ref={navbarRef}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center">
              <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
              <h1 onClick={toggleDrawer} className="text-xl font-bold cursor-pointer">MyApp</h1>
            </div>
            <div className="hidden sm:flex space-x-4">
              {Object.keys(dropdownItems).map((menu) => (
                <div key={menu} className="relative">
                  <button
                    onClick={() => toggleDropdown(menu)}
                    className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {menu.charAt(0).toUpperCase() + menu.slice(1)}
                  </button>
                  {dropdownOpen[menu] && (
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
              <button onClick={handlePrevious} className="hover:text-gray-300">
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
              </button>
              <button onClick={handleNext} className="hover:text-gray-300">
                <FontAwesomeIcon icon={faArrowRight} size="lg" />
              </button>
              <button onClick={logout} className="text-gray-300 hover:text-white">
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
              </button>
              <Link
                href="/home/updateDetails/OnwerUpdate"
                className="hover:bg-gray-700 px-3 py-2 rounded-full"
              >
                <Image className="rounded-full" src="/assets/avatar.jpg" alt="User" width={30} height={30} />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
