"use client";
import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to include the CSS
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

const PopUp = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [kapat, setKapat] = useState([])
  const [selectedKapat, setSelectedKapat] = useState([]); // For tracking selected Sthir Kapat options


  useEffect(() => {
    async function getKapatOptions() {
      try {
        const res = await axios.get('/api/kapat/getKapat');
        const sthirKapat = res.data.data.filter(item => item.KapatType === 'Sthir Kapat');
       setKapat(sthirKapat)
      } catch (error) {
        console.log("Failed to fetch kapat options:", error.message);
      }
    }
    getKapatOptions();
  },[]);

  const [user, setUser] = useState({
    registerNo: '',
    name: '',
    milk: '',
    phone: '',
    bankName: '',
    accountNo: '',
    aadharNo: '',
    password: '',
  });

  const handleAddUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Add selectedKapat to the payload
      const payload = {
        ...user,
        selectedKapat, // Include the selected Kapat options
      };
  
      const res = await axios.post('/api/user/createUser', payload);
      console.log("User created successfully:", res.data.data);
  
      // Reset the form fields
      setUser({
        registerNo: '',
        name: '',
        milk: '',
        phone: '',
        bankName: '',
        accountNo: '',
        aadharNo: '',
        password: '',
      });
      setSelectedKapat([]); // Reset selected Kapat options
      Toast.success("User created successfully!");
    } catch (error) {
      console.log("Add User Failed:", error.message);
      Toast.error("नवीन सभासद तयार करताना ओनर लॉगिन आहे का तपासा");
    } finally {
      setLoading(false);
    }
  };
  

  const toggleKapatSelection = (kapatId) => {
    if (selectedKapat.includes(kapatId)) {
      setSelectedKapat(selectedKapat.filter((id) => id !== kapatId));
    } else {
      setSelectedKapat([...selectedKapat, kapatId]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white p-4 w-[40%] h-[80%] rounded shadow-lg">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:bg-red-500 hover:text-white hover:shadow-lg transition-all duration-200 p-2 rounded-md  `"
        onClick={onClose}
      >
        ✖️
      </button>

        <h2 className="text-2xl text-black font-bold mb-4">उत्पादक भरणे</h2>
        <form className="text-black flex flex-wrap -mx-2" onSubmit={handleAddUser}>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black"> उत्पादक नं . </label>
            <input 
              className="h-8 border border-gray-300 rounded w-full"
              type="number" 
              placeholder="रजिस्टर No"
              value={user.registerNo}
              onChange={(e) => setUser({...user, registerNo: e.target.value})}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">उत्पादकाचे नाव </label>
            <input 
              type="text" 
              placeholder="डेअरीचे नाव" 
              className="h-8 border border-gray-300 rounded w-full"
              value={user.name}
              onChange={(e) => setUser({...user, name: e.target.value})}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">दूध प्रकार</label>
            <select 
              className="border text-black border-gray-300 rounded w-full"
              value={user.milk}
              onChange={(e) => setUser({...user, milk: e.target.value})}
            >
              <option value="">Type... </option>
              <option value="गाय ">गाय </option>
              <option value="म्हैस ">म्हैस </option>
            </select>
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">फोन नंबर</label>
            <input 
              type="number" 
              placeholder="Phone Number" 
              className="h-8 border border-gray-300 rounded w-full"
              value={user.phone}
              onChange={(e) => setUser({...user, phone: e.target.value})}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">बँकेचे नाव </label>
            <input 
              type="text" 
              placeholder="Bank Name" 
              className="h-8 border border-gray-300 rounded w-full"
              value={user.bankName}
              onChange={(e) => setUser({...user, bankName: e.target.value})}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">बँक पासबूक नं. </label>
            <input 
              type="number" 
              placeholder="Bank Account Number" 
              className="h-8 border border-gray-300 rounded w-full"
              value={user.accountNo}
              onChange={(e) => setUser({...user, accountNo: e.target.value})}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">आधार नंबर </label>
            <input 
              type="Number" 
              className="h-8 border border-gray-300 rounded w-full"
              value={user.aadharNo}
              onChange={(e) => setUser({...user, aadharNo: e.target.value})}
            />
          </div>
          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="text-black">पासवर्ड</label>
            <input 
              type="password" 
              placeholder="Password" 
              className="p-2 h-8 border border-gray-300 rounded w-full"
              value={user.password}
              onChange={(e) => setUser({...user, password: e.target.value})}
            />
          </div>

          <div className="w-full px-2 mb-4">
              <h3 className="text-xl text-black font-semibold mb-2">स्थिर कपाट पर्याय</h3>
              <div className="flex flex-wrap gap-4">
                {kapat.map((item) => (
                  <div key={item._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`kapat-${item._id}`}
                      checked={selectedKapat.includes(item._id)}
                      onChange={() => toggleKapatSelection(item._id)}
                      className="mr-2"
                    />
                    <label htmlFor={`kapat-${item._id}`} className="text-black">
                      {item.kapatName} - ₹{item.kapatRate}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          <div className="w-full px-2">

          <div className="flex justify-center items-center mt-4">
            <button 
              type="submit" 
              className="bg-green-500 text-white p-2 rounded w-36"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          </div>
          <ToastContainer />
        </form>
        
      </div>
      
    </div>
  );
};

export default PopUp;
