'use client';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const router = useRouter();
  const { id } = useParams(); // Assuming userId is retrieved from URL params
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State for drawer menu

  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await axios.get(`/api/user/getUsers/${id}`);
      setUser(res.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error.message);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id, fetchUserDetails]);

  const handleOrdersClick = async () => {
    try {
      await fetchUserDetails();
      if (user) {
        router.push(`/home/orders/getOrdersUserside/${id}`);
      } else {
        console.error("User ID is not available.");
      }
    } catch (error) {
      console.error("Error handling orders click:", error.message);
    }
  };

  const handleAdvanceClick = async () => {
    try {
      await fetchUserDetails();
      if (user) {
        router.push(`/home/getAdvanceUserSide/${id}`);
      } else {
        console.error("User ID is not available.");
      }            
    } catch (error) {
      console.error("Error handling advance click:", error.message);
    }
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-md shadow-blue-900">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Aligned Hamburger Menu */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="text-white focus:outline-none md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {/* Logo */}
          <div className="text-white text-lg font-bold">DairyMaster</div>
        </div>

        {/* Drawer Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-800 p-4 transform ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out z-50`}
        >
          {/* Close Button */}
          <button 
            onClick={() => setMenuOpen(false)} 
            className="text-white mb-4 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
          <ul className="space-y-4">
            <li>
              <button
                onClick={handleOrdersClick}
                className="text-white hover:bg-blue-700 p-2 rounded block"
              >
                Orders
              </button>
            </li>
            <li>
              <button
                onClick={handleAdvanceClick}
                className="text-white hover:bg-blue-700 p-2 rounded block"
              >
                Advance
              </button>
            </li>
            <li>
              <Link
                href="/services"
                className="text-white hover:bg-blue-700 p-2 rounded block"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-white hover:bg-blue-700 p-2 rounded block"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Full Menu for Desktop */}
        <div className="hidden md:flex md:space-x-4">
          <button
            onClick={handleOrdersClick}
            className="text-white hover:bg-blue-700 p-2 rounded"
          >
            Orders
          </button>
          <button
            onClick={handleAdvanceClick}
            className="text-white hover:bg-blue-700 p-2 rounded"
          >
            Advance
          </button>
          <Link
            href="/services"
            className="text-white hover:bg-blue-700 p-2 rounded"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="text-white hover:bg-blue-700 p-2 rounded"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
