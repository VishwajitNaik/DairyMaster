import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Navbar = ({ setIsSignupOpen, setIsSigninOpen, setIsSanghSignup, setIsSanghSignin, setUserSignInOpen, scrollToSection }) => {
  const [isSignupDropdownOpen, setIsSignupDropdownOpen] = useState(false);
  const [isSigninDropdownOpen, setIsSigninDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const signupRef = useRef(null);
  const signinRef = useRef(null);

  const toggleSignupDropdown = () => {
    setIsSignupDropdownOpen(!isSignupDropdownOpen);
    setIsSigninDropdownOpen(false);
  };

  const toggleSigninDropdown = () => {
    setIsSigninDropdownOpen(!isSigninDropdownOpen);
    setIsSignupDropdownOpen(false);
  };

  

  const handleClickOutside = (event) => {
    if (signupRef.current && !signupRef.current.contains(event.target)) {
      setIsSignupDropdownOpen(false);
    }
    if (signinRef.current && !signinRef.current.contains(event.target)) {
      setIsSigninDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePageRefresh = () => {
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-gray-800 bg-opacity-60 text-white p-2">
      <div className="flex justify-between items-center">
        {/* Desktop and Mobile Links in One Row */}
        <div className="flex gap-2 items-center w-full">
          {/* Desktop Dropdowns */}
          <div className="hidden md:flex gap-4">
            {/* Sign Up Dropdown */}
            <div className="relative" ref={signupRef}>
              <button
                className="text-white py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300 border-b-2 hover:border-b-2 hover:border-blue-500 border-gray-300"
                onClick={toggleSignupDropdown}
              >
                Sign Up
              </button>
              {isSignupDropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-blue-900 bg-opacity-70 text-white rounded shadow-md shadow-gray-300">
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-200 hover:text-black text-sm border-b-2 border-white"
                    onClick={() => {
                      setIsSanghSignup(true);
                      setIsSignupDropdownOpen(false);
                    }}
                  >
                    Sangh Sign Up
                  </button>
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-200 hover:text-black text-sm border-b-2 border-white"
                    onClick={() => {
                      setIsSignupOpen(true);
                      setIsSignupDropdownOpen(false);
                    }}
                  >
                    Dairy Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Sign In Dropdown */}
            <div className="relative" ref={signinRef}>
              <button
                className="text-white py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300 border-b-2 hover:border-b-2 hover:border-blue-500 border-gray-300"
                onClick={toggleSigninDropdown}
              >
                Sign In
              </button>
              {isSigninDropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-blue-900 bg-opacity-70 text-white rounded shadow-md shadow-gray-300">
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-200 hover:text-black text-sm border-b-2 border-white"
                    onClick={() => {
                      setIsSanghSignin(true);
                      setIsSigninDropdownOpen(false);
                    }}
                  >
                    Sangh Login
                  </button>
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-200 hover:text-black text-sm border-b-2 border-white"
                    onClick={() => {
                      setIsSigninOpen(true);
                      setIsSigninDropdownOpen(false);
                    }}
                  >
                    Dairy Login
                  </button>
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-200 hover:text-black text-sm border-b-2 border-white"
                    onClick={() => {
                      setUserSignInOpen(true);
                      setIsSigninDropdownOpen(false);
                    }}
                  >
                    User Login
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="hidden md:flex gap-2">
            <Link href="/home">
              <button className="text-white py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300 border-b-2 hover:border-b-2 hover:border-blue-500 border-gray-300">
                Home
              </button>
            </Link>
            <Link href="/home/AllDairies">
              <button className="text-white py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300 border-b-2 hover:border-b-2 hover:border-blue-500 border-gray-300">
                sangh Home
              </button>
            </Link>
            <button
              className="text-white py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300 border-b-2 hover:border-b-2 hover:border-blue-500 border-gray-300"
              onClick={() => scrollToSection("testimonials")}
            >
              How to use
            </button>
            <button
              className="text-white py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300 border-b-2 hover:border-b-2 hover:border-blue-500 border-gray-300"
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </button>
            {/* Refresh Button with Font Awesome Icon */}
            <button
              className="text-white py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300 border-b-2 hover:border-b-2 hover:border-blue-500 border-gray-300"
              onClick={handlePageRefresh}
            >
              <i className="fas fa-sync-alt"></i>{" "}
              {/* Font Awesome Refresh Icon */}
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center px-4">
            {/* Refresh Button on the Left */}
            <button
              className="flex items-center text-white hover:bg-gray-200 shadow-md p-2 rounded cursor-pointer w-fit"
              onClick={handlePageRefresh}
            >
              <i className="fas fa-sync-alt"></i>{" "}
              {/* Font Awesome Refresh Icon */}
            </button>

            <Link href="/home">
              <button className="mb-2 ml-4 flex items-center text-white hover:bg-gray-700 shadow-md p-2 rounded cursor-pointer">
                Home
              </button>
            </Link>

            {/* Spacer to add space between the buttons */}
            <div className="flex-grow"></div>

            {/* Drawer Button on the Right */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="text-white text-2xl ml-44"
            >
              &#9776; {/* Hamburger Icon */}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isDrawerOpen && (
  <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-90 z-60 flex justify-end">
    <div className="relative w-80 h-full shadow-lg rounded-l-md bg-gradient-to-b from-violet-400 to-violet-600 p-6">
      <button
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-200 transition-colors duration-200"
        onClick={() => setIsDrawerOpen(false)}
      >
        &#10005;
      </button>

      <div className="flex flex-col space-y-4 mt-12">
        {/* Sign Up Dropdown */}
        <div className="relative group">
          <button className="w-full flex items-center justify-between text-white bg-violet-700 hover:bg-violet-800 shadow-md px-4 py-3 rounded-lg transition-colors duration-200">
            <span className="font-semibold">Sign Up</span>
            <span className="ml-2 transform transition-transform duration-200 group-hover:rotate-180">▼</span>
          </button>
          <div className="hidden group-hover:block absolute w-full bg-white shadow-lg rounded-md mt-2 z-10">
            <button
              className="block w-full text-left text-violet-700 hover:bg-violet-50 px-4 py-2 rounded-b-md transition-colors duration-200"
              onClick={() => {
                setIsSignupOpen(true);
                setIsDrawerOpen(false);
              }}
            >
              Dairy Sign Up
            </button>
          </div>
        </div>

        {/* Sign In Dropdown */}
        <div className="relative group">
          <button className="w-full flex items-center justify-between text-white bg-violet-700 hover:bg-violet-800 shadow-md px-4 py-3 rounded-lg transition-colors duration-200">
            <span className="font-semibold">Sign In</span>
            <span className="ml-2 transform transition-transform duration-200 group-hover:rotate-180">▼</span>
          </button>
          <div className="hidden group-hover:block absolute w-full bg-white shadow-lg rounded-md mt-2 z-10">
            <button
              className="block w-full text-left text-violet-700 hover:bg-violet-50 px-4 py-2 rounded-t-md transition-colors duration-200"
              onClick={() => {
                setIsSigninOpen(true);
                setIsDrawerOpen(false);
              }}
            >
              Owner Sign In
            </button>
            <button
              className="block w-full text-left text-violet-700 hover:bg-violet-50 px-4 py-2 rounded-b-md transition-colors duration-200"
              onClick={() => {
                setUserSignInOpen(true);
                setIsDrawerOpen(false);
              }}
            >
              User Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </nav>
  );
};

export default Navbar;