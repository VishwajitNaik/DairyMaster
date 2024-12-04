'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Drawer from '../components/Models/drawerMoldel';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import CheckKapat from "../components/CheckKapat"
import AvakDudhNond from './AvakDudhachiNondani/page';
import AddUserOrder from "../components/AddUserOrder"
import Addadvance from "../components/AddAdvance"
import AddBillKapat from "../components/AddBillKapat"

export default function Navbar() {
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    माहिती_भरणे: false,
    रीपोर्ट: false,
    इतर: false,
  });

  const router = useRouter()

  // Logout
  const logout = async () =>{
    try {
      await axios.get('/api/owner/logout');
      router.push('/')
    } catch (error) {
      console.log("Logout failed: ", error.message);
    }
  }

  const navbarRef = useRef(null);

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


  const dropdownItems = {
    माहिती_भरणे: [
      { href: "/home/AvakDudhachiNondani", label: "आवक दुधाची नोंदणी " },
      { href: "/home/2", label: "स्थानिक दूध विक्री नोंद " },
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
    ],
    इतर: [
      { href: "/about/link-1", label: "Link 1" },
      { href: "/about/link-2", label: "Link 2" },
      { href: "/about/link-3", label: "Link 3" },
    ],
  };

  return (
    <>
    <nav className="bg-gray-800 text-white" style={{ position: 'Sticky', zIndex: 100 }} ref={navbarRef}>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={() => toggleDropdown('services')}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
            <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
               <h1 onClick={toggleDrawer}>  MyApp </h1>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
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
                <Link
                  href="/home/updateDetails/OnwerUpdate"
                  className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  MyProfile
                </Link>

                <button onClick={logout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md">
                    Logout
                </button>
                <button>दूध लिहा</button>

              <Link 
              href="/home/AddOwnerOrders"
              >
                New Order
              </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div>
    <AvakDudhNond />
    </div>

    </>


  );
}