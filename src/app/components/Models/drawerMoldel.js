import React , { useState } from "react";
import PopUp from "./AddUserModel"
import VikriPopUp from "./AddVikriUser"
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";


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
      <div className="relative bg-white w-64 h-full shadow-lg">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          ✖️
        </button>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <ul>
            <li
              className="mb-2 flex items-center text-black hover:bg-gray-200 p-2 rounded cursor-pointer"
              onClick={handlePopUpOpen}
            >
              उत्पादक भरणे
            </li>
            <li 
            className="mb-2 flex items-center text-black hover:bg-gray-200 p-2 rounded"
            onClick={handleVikriOpen}
            >
              स्थानिक विक्री
            </li>
            <li 
            className="mb-2 flex items-center text-black hover:bg-gray-200 p-2 rounded">
              <Link href={"/home/Sabhasad_List"}> 
              सभासद लिस्ट
              </Link> 
            </li>
            <li 
            className="mb-2 flex items-center text-black hover:bg-gray-200 p-2 rounded">
              <Link href={"/home/SthirKapat"}> 
              कपाती भरणे 
              </Link> 
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/BillData" className="hover:underline text-black">
                बिल वितरण 
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/GetKapat" className="hover:underline text-black">
                कपातीचा डाटा पाहणे 
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/SavedBills" className="hover:underline text-black">
                मागील बील पाहणे 
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/GetAllMilks" className="hover:underline text-black">
                सर्व दूध पाहणे  
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/orders/getOwnerOrders " className="hover:underline text-black">
                संघ ऑर्डर पाहणे  
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/milkRecords/SanghMilks" className="hover:underline text-black">
                संघ दूध पाहणे   
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/Summary" className="hover:underline text-black">
               बील समरी रीपोर्ट 
              </Link>
            </li>
            <li className="mb-2 flex items-center">
              <Link href="/home/Bonus" className="hover:underline text-black">
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