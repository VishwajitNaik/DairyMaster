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

    // Logout
    const logout = async () =>{
      try {
        await axios.get('/api/owner/logout');
        router.push('/')
      } catch (error) {
        console.log("Logout failed: ", error.message);
      }
    }

  return (
    <div className="fixed inset-0 flex z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative w-64 h-full shadow-md rounded-md bg-violet-300">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          ✖️
        </button>
        <div className="p-4">
          <Image src="/assets/milkhub-512.png" alt="Logo" width={100} height={100} />
          <ul className="max-w-lg h-[90vh] mx-auto p-6 bg-transparent backdrop-blur-md rounded-lg shadow-md overflow-x-auto overflow-y-auto m-2">
          <style jsx>{`
            .max-w-lg::-webkit-scrollbar {
              height: 8px; /* Adjust the height of the scrollbar */
              width: 6px
            }
            .max-w-lg::-webkit-scrollbar-track {
              background: white; /* Optional: Change track background */
            }
            .max-w-lg::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom right, #4a90e2, #9013fe); /* Set the scrollbar color to black */
              border-radius: 10px; /* Optional: Add rounded corners */
              width: 8px; /* Adjust the width of the scrollbar */
            }
          `}</style>
            <li
              className="mb-2 flex items-center text-black hover:bg-gray-200 shadow-md p-2 rounded cursor-pointer"
              onClick={handlePopUpOpen}
            >
              उत्पादक भरणे
            </li>
            <li 
            className="mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded"
            onClick={handleVikriOpen}
            >
              स्थानिक विक्री
            </li>
            <li 
            className="mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded">
              <Link href={"/home/Sabhasad_List"}> 
              सभासद लिस्ट
              </Link> 
            </li>
            <li 
            className="mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded">
              <Link href={"/home/SthirKapat"}> 
              कपाती भरणे 
              </Link> 
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/BillData" className="w-full mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded">
                बिल वितरण 
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/GetKapat" className="w-full mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded">
                कपातीचा डाटा पाहणे 
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/SavedBills" className="w-full mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded">
                मागील बील पाहणे 
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/GetAllMilks" className="w-full mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded">
                सर्व दूध पाहणे  
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/orders/getOwnerOrders " className="w-full mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded">
                संघ ऑर्डर पाहणे  
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/milkRecords/SanghMilks" className="w-full mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded">
                संघ दूध पाहणे   
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/Summary" className="w-full mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded">
               बील समरी रीपोर्ट 
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/Bonus" className="w-full mb-2 flex items-center text-black hover:bg-gray-200 p-2 shadow-md rounded">
               बोनस  
              </Link>
            </li>

            <button onClick={logout} className= " text-black font-bold rounded-md">
                    Logout
            </button>
          </ul>
        </div>
      </div>
      <PopUp isOpen={isPopUpOpen} onClose={handlePopUpClose} />
      <VikriPopUp isOpen={vikri} onClose={handleVikriClose} />
    </div>
  );
};

export default Drawer;

// fixed inset-0 flex items-center justify-center z-50