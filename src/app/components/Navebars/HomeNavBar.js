import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

const Navbar = ({ setIsSignupOpen, setIsSigninOpen, setIsSanghSignup, setIsSanghSignin, setUserSignInOpen, scrollToSection }) => {
  const [isSignupDropdownOpen, setIsSignupDropdownOpen] = useState(false);
  const [isSigninDropdownOpen, setIsSigninDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer visibility

  const signupRef = useRef(null);
  const signinRef = useRef(null);

  const toggleSignupDropdown = () => {
    setIsSignupDropdownOpen(!isSignupDropdownOpen);
    setIsSigninDropdownOpen(false); // Close other dropdown if open
  };

  const toggleSigninDropdown = () => {
    setIsSigninDropdownOpen(!isSigninDropdownOpen);
    setIsSignupDropdownOpen(false); // Close other dropdown if open
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 text-white p-2">
      <div className="flex justify-between items-center">
        {/* Desktop and Mobile Links in One Row */}
        <div className="flex gap-2 items-center w-full">
          {/* Desktop Dropdowns */}
          <div className="hidden md:flex gap-4">
            {/* Sign Up Dropdown */}
            <div className="relative" ref={signupRef}>
              <button
                className="bg-white text-black py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300"
                onClick={toggleSignupDropdown}
              >
                Sign Up
              </button>
              {isSignupDropdownOpen && (
                <div className="absolute left-0 mt-1 w-40 bg-white text-black rounded shadow-lg">
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-200 text-sm"
                    onClick={() => {
                      setIsSignupOpen(true);
                      setIsSignupDropdownOpen(false);
                    }}
                  >
                    Owner Sign Up
                  </button>
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-200 text-sm"
                    onClick={() => {
                      setIsSanghSignup(true);
                      setIsSignupDropdownOpen(false);
                    }}
                  >
                    Sangh Sign Up
                  </button>
                  <button className="block w-full text-left px-3 py-1 hover:bg-gray-200 text-sm">
                    <Link href="/home/CreateUser/AddUser">SignUp user</Link>
                  </button>
                </div>
              )}
            </div>

            {/* Sign In Dropdown */}
            <div className="relative" ref={signinRef}>
              <button
                className="bg-white text-black py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300"
                onClick={toggleSigninDropdown}
              >
                Sign In
              </button>
              {isSigninDropdownOpen && (
                <div className="absolute left-0 mt-1 w-40 bg-white text-black rounded shadow-lg">
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-200 text-sm"
                    onClick={() => {
                      setIsSigninOpen(true);
                      setIsSigninDropdownOpen(false);
                    }}
                  >
                    Owner Sign In
                  </button>
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-200 text-sm"
                    onClick={() => {
                      setIsSanghSignin(true);
                      setIsSigninDropdownOpen(false);
                    }}
                  >
                    Sangh Sign In
                  </button>
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-200 text-sm"
                    onClick={() => {
                      setUserSignInOpen(true);
                      setIsSigninDropdownOpen(false);
                    }}
                  >
                    User Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="hidden md:flex gap-2">
            <Link href="/home">
              <button className="bg-white text-black py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300">
                Home
              </button>
            </Link>
            <button
              className="bg-white text-black py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300"
              onClick={() => scrollToSection('testimonials')}
            >
              How to use
            </button>
            <button
              className="bg-white text-black py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300"
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
            <button
              className="bg-white text-black py-1 px-3 rounded text-sm hover:bg-gray-800 hover:text-white transition duration-300"
              onClick={() => scrollToSection('faq')}
            >
              FAQ
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="text-white text-2xl"
            >
              &#9776; {/* Hamburger Icon */}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isDrawerOpen && (
  <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-90 z-50 flex justify-end">
    <div className="bg-white w-64 p-4">
      <button
        className="text-black text-2xl mb-4"
        onClick={() => setIsDrawerOpen(false)} // Close the drawer when clicked
      >
        &#10005; {/* Close icon */}
      </button>
      <div className="flex flex-col gap-4">
        <button
          className="text-black py-1 px-3 rounded text-sm hover:bg-gray-200 transition duration-300"
          onClick={() => {
            setIsSignupOpen(true);
            setIsDrawerOpen(false); // Close the drawer after clicking
          }}
        >
          Owner Sign Up
        </button>
        <button
          className="text-black py-1 px-3 rounded text-sm hover:bg-gray-200 transition duration-300"
          onClick={() => {
            setIsSanghSignup(true);
            setIsDrawerOpen(false); // Close the drawer after clicking
          }}
        >
          Sangh Sign Up
        </button>
        <button
          className="text-black py-1 px-3 rounded text-sm hover:bg-gray-200 transition duration-300"
          onClick={() => {
            setIsSigninOpen(true);
            setIsDrawerOpen(false); // Close the drawer after clicking
          }}
        >
          Owner Sign In
        </button>
        <button
          className="text-black py-1 px-3 rounded text-sm hover:bg-gray-200 transition duration-300"
          onClick={() => {
            setUserSignInOpen(true);
            setIsDrawerOpen(false); // Close the drawer after clicking
          }}
        >
          User Sign In
        </button>
        <Link href="/home/CreateUser/AddUser">
          <button
            className="text-black py-1 px-3 rounded text-sm hover:bg-gray-200 transition duration-300"
            onClick={() => setIsDrawerOpen(false)} // Close the drawer after clicking
          >
            Sign Up User
          </button>
        </Link>
        <Link href="/home/CreateUser/LoginUser">
          <button
            className="text-black py-1 px-3 rounded text-sm hover:bg-gray-200 transition duration-300"
            onClick={() => setIsDrawerOpen(false)} // Close the drawer after clicking
          >
            Sign In User
          </button>
        </Link>
      </div>
    </div>
  </div>
)}

    
      </div>
    </nav>
  );
};

export default Navbar;
