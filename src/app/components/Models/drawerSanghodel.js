import React , { useState } from "react";
import PopUp from "./AddUserModel"
import VikriPopUp from "./AddVikriUser"
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";


const Drawer = ({ isOpen, onClose }) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const router = useRouter();
  const [vikri, setVikri] = useState(false)

  if (!isOpen) return null;

  const handlePopUpOpen = () => {
    setIsPopUpOpen(true);
  };

  const handlePopUpClose = () => {
    setIsPopUpOpen(false);
  };

  const handleVikriOpen = () => {
    setVikri(true);
  };

  const handleVikriClose = () => {
    setVikri(false);
  };

 

  const handleClose = () => {
    setIsVisible(false); // Hide button
    setTimeout(() => onClose(), 300); // Call onClose after animation
  };


  return (
<div className="fixed inset-0 flex z-50">
  {/* Overlay */}
  <div
    className="fixed inset-0 bg-black opacity-50 transition-opacity duration-300 ease-in-out"
    onClick={onClose}
  ></div>

  {/* Drawer Container */}
  <div
    className={`relative w-64 h-full shadow-md rounded-md bg-violet-300 transform transition-transform duration-300 ease-in-out ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    {/* Close Button */}
    <button
      className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 ease-in-out"
      onClick={onClose}
    >
      ✖️
    </button>

    {/* Drawer Content */}
    <div className="p-4">
      {/* Logo */}
      <Image
        src="/assets/milkhub-512.png"
        alt="Logo"
        width={100}
        height={100}
        className="mb-4"
      />

      {/* Menu Items */}
      <ul className="max-w-lg h-[90vh] mx-auto p-6 bg-transparent backdrop-blur-md rounded-lg shadow-md overflow-x-auto overflow-y-auto m-2">
        <style jsx>{`
          .max-w-lg::-webkit-scrollbar {
            height: 8px; /* Adjust the height of the scrollbar */
            width: 6px;
          }
          .max-w-lg::-webkit-scrollbar-track {
            background: white; /* Optional: Change track background */
          }
          .max-w-lg::-webkit-scrollbar-thumb {
            background: linear-gradient(
              to bottom right,
              #4a90e2,
              #9013fe
            ); /* Set the scrollbar color to black */
            border-radius: 10px; /* Optional: Add rounded corners */
            width: 8px; /* Adjust the width of the scrollbar */
          }
        `}</style>

        {/* Menu Items */}
        {[
          { href: "/home/AllDairies/sabhasad_List", label: "सभासद लिस्ट" },
          { href: "/home/AllDairies/MakeMilk", label: "दूध भरणे" },
          { href: "/home/AllDairies/Rates/AddRates", label: "दरपत्रक भरणे" },
          { href: "/home/AllDairies/AddKapatOption", label: "कपातीचे नावे भरणे" },
          { href: "/home/AllDairies/Kapat", label: "बिल कपात करणे" },
          { href: "/home/AllDairies/OrdersNam", label: "ऑर्डर नावे भरणे" },
          { href: "/home/AllDairies/ExtraRate", label: "अतिरिक्त दर भरणे" },
          { href: "/home/AllDairies/Docter/AddTagType", label: "Tag चा प्रकार भरणे" },
          { href: "/home/AllDairies/Docter/Decieses", label: "आजाराचा प्रकार भरणे" },
          { href: "/home/AllDairies/getAllMilk", label: "सर्व दूध पाहणे" },
          { href: "/home/AllDairies/GetProduct", label: "प्रॉडक्ट नावे पाहणे" },
          { href: "/home/AllDairies/Orders/GetOwnerOrders", label: "ऑर्डर पाहणे" },
          { href: "/home/AllDairies/OwnerBills", label: "सभासद बिल भरणे" },
          { href: "/home/AllDairies/OwnerMilks", label: "ओनर दूध पाहणे" },
          { href: "/home/AllDairies/SavedBills", label: "बिल पाहणे" },
        ].map((item, index) => (
          <li
            key={index}
            className="mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded transition-all duration-200 ease-in-out hover:scale-105"
          >
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
  );
};

export default Drawer;

// fixed inset-0 flex items-center justify-center z-50