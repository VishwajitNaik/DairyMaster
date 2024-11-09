'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const SanghNavBar = () => {
  const [owner, setOwner] = useState([]);
  const [sanghName, setSanghName] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch owner data
  useEffect(() => {
    async function getOwners() {
      try {
        const res = await axios.get("/api/sangh/getOwners");
        console.log("sangh Data", res.data.data);
        setOwner(res.data.data);
        
        // Assuming you want the sangh of the first owner for now
        if (res.data.data.length > 0) {
          setSanghName(res.data.data[0].sangh);
        }
      } catch (error) {
        console.log("Failed to fetch users:", error.message);
      }
    }
    getOwners();
  }, []);

  return (
    <div>
      {/* Top Navbar */}
      <nav className="bg-blue-600 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Drawer Toggle Button */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="text-white mr-4 focus:outline-none"
          >
            ☰
          </button>
          {/* Display the Sangh name dynamically if available, else fallback to a default */}
          <div className="text-white font-bold text-xl">
            {sanghName || 'Welcome'}
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
              Home
            </Link>
            <Link href="/home/AllDairies/OrdersName" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
              Add Product Name 
            </Link>
            <Link href="/home/AllDairies/MakeMilk" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
              Add Milk
            </Link>
            <Link href="/home/AllDairies/Orders/GetOwnerOrders" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
              Order History
            </Link>
            <Link href="/logout" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Left Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-blue-300 shadow-lg z-50 transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
        style={{ width: '250px' }}
      >
        <button
          onClick={() => setIsDrawerOpen(false)}
          className="text-white p-4 focus:outline-none"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" /> {/* Close icon */}
        </button>
        <div className="flex flex-col mt-4 text-white space-y-4">
          <Link href="/home/AllDairies/getAllMilk" className="hover:bg-blue-700 px-3 py-2 rounded">
            All Milks
          </Link>
          <Link href="/home/AllDairies/OwnerMilks" className="hover:bg-blue-700 px-3 py-2 rounded">
            Owner wise Milk 
          </Link>
          <Link href="/home/AllDairies/MakeMilk" className="hover:bg-blue-700 px-3 py-2 rounded">
            Add Milk
          </Link>
          <Link href="/home/AllDairies/Orders/GetOwnerOrders" className="hover:bg-blue-700 px-3 py-2 rounded">
            Order History
          </Link>
          <Link href="/logout" className="hover:bg-blue-700 px-3 py-2 rounded">
            Logout
          </Link>
        </div>
      </div>
      
      {/* Optional Overlay to close the drawer when clicking outside */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
};

export default SanghNavBar;
