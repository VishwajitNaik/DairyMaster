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
      { href: "/home/AllDairies/Rates/AddRates", label: "दरपत्रक भरणे " },
      { href: "/home/AllDairies/AddKapatOption", label: " कपातीचे नावे भरणे " },
      { href: "/home/AllDairies/OrdersName", label: "ऑर्डर नावे भरणे" },
      { href: "/home/AllDairies/ExtraRate", label: "अतिरिक्त दर भरणे" },
      { href: "/home/AllDairies/Docter/AddTagType", label: "Tag चा प्रकार भरणे" },
      { href: "/home/AllDairies/Docter/Decieses", label: "आजाराचा प्रकार भरणे " },
      { href: "/home/AllDairies/Kapat", label: "बिल कपात करणे " },
    ],
    रीपोर्ट: [
      { href: "/home/AllDairies/getAllMilk", label: "सर्व दूध पाहणे " },
      { href: "/home/AllDairies/GetProduct", label: "प्रॉडक्ट नावे पाहणे " },
      { href: "/home/AllDairies/Orders/GetOwnerOrders", label: "ऑर्डर पाहणे " },
      { href: "/home/AllDairies/OwnerBills", label: "सभासद बिल भरणे " },
      { href: "/home/AllDairies/OwnerMilks", label: "ओनर दूध पाहणे  " },
      { href: "/home/AllDairies/SavedBills", label: "बिल पाहणे " },
      { href: "/home/AllDairies", label: "सर्व सभासद कपात पाहणे  " },
      { href: "/home/AllDairies/Rates/GetRates", label: "दरपत्रक पाहणे " },
      { href: "/home/AllDairies/Docter/GetDecieses", label: " आजाराचा प्रकार पाहणे " },
      { href: "/home/AllDairies/Docter/GetTagType", label: "Tag प्रकार पाहणे " },
    ],
    इतर: [
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
        className="bg-gradient-to-r from-gray-800 to-gray-900 bg-opacity-90 backdrop-blur-md text-white shadow-lg"
        style={{ position: 'sticky', top: 0, zIndex: 40 }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Drawer Toggle Button */}
            <div className="flex items-center">
              <button 
                onClick={toggleDrawer} 
                className="text-xl font-bold cursor-pointer hover:bg-gray-700 p-2 rounded-full transition duration-300"
              >
                <FontAwesomeIcon icon={faBars} size="lg" />
              </button>
            </div>

            {/* Dropdown Menu */}
            <div className="flex flex-row" ref={dropdownRef}>
              {Object.keys(dropdownItems).map((menu) => (
                <div key={menu} className="relative -ml-2">
                  <button
                    onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                    className="hover:bg-blue-600 px-4 sm:px-8 py-2 sm:mr-4 rounded-md text-sm font-medium border-b border-gray-300 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    {menu}
                  </button>
                  {activeMenu === menu && (
                    <div className="absolute left-0 w-48 py-2 mt-2 rounded-md rounded-b-md shadow-xl bg-gradient-to-b from-gray-700 to-gray-800">
                      {dropdownItems[menu].map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="block px-4 py-2 text-white text-sm hover:bg-gray-600 hover:text-white transition duration-200 ease-in-out"
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
              <button 
                onClick={logout} 
                className="text-gray-300 hover:text-white transition duration-300 ease-in-out transform hover:scale-110"
              >
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
              </button>
              <Link
                href="/home/updateDetails/OnwerUpdate"
                className="hover:bg-gray-700 px-3 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-110"
              >
                <Image
                  className="rounded-full border-2 border-gray-300 hover:border-white transition duration-300"
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