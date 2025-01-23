import { ToastContainer, toast as Toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SignupSangh = () => {
    const router = useRouter();
    const [sangh, setSangh] = useState({
        SanghName: "",
        email: "",
        phone: "",
        password: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

            const res = await axios.post("/api/sangh/signup", sangh);
            Toast.success("Sangh signup successfully, please login now");
            console.log("SignUp Success", res.data);
            setSangh({ SanghName: "", email: "", phone: "", password: "" });
            router.push("/");
        } catch (error) {
            console.error("SignUp Error", error);
            setError(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10) {
            setSangh({ ...sangh, phone: value });
        }
    };

    useEffect(() => {
        const allFieldsFilled = Object.values(sangh).every(field => field.length > 0);
        setButtonDisabled(!allFieldsFilled);
    }, [sangh]);

    return (
        <div className="max-w-lg h-[60vh] mx-auto p-6 bg-transparent backdrop-blur-md rounded-lg shadow-md overflow-x-auto overflow-y-auto m-2">
            <style jsx>{`
            .max-w-lg::-webkit-scrollbar {
                height: 8px; /* Adjust the height of the scrollbar */
            }
            .max-w-lg::-webkit-scrollbar-track {
                background: transparent; /* Optional: Change track background */
            }
            .max-w-lg::-webkit-scrollbar-thumb {
                background: linear-gradient(to bottom right, #4a90e2, #9013fe); /* Set the scrollbar color to black */
                border-radius: 10px; /* Optional: Add rounded corners */
            }
            `}</style>
            <form className="w-full max-w-md rounded-lg shadow-lg p-6 space-y-4" onSubmit={onSignup}>
                <h2 className="text-2xl font-bold text-center text-black">Sign Up</h2>

                <div>
                    <label className='block text-sm font-medium text-black mb-1'>संघाचे नाव</label>
                    <input
                        className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                        type="text"
                        placeholder="Username"
                        value={sangh.SanghName}
                        onChange={(e) => setSangh({ ...sangh, SanghName: e.target.value })}
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-black mb-1'>फोन नंबर</label>
                    <input
                        type="text"
                        placeholder="Phone Number"
                        className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                        value={sangh.phone}
                        onChange={handlePhoneChange}
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-black mb-1'>ईमेल</label>
                    <input
                        type="email"
                        placeholder="abc@gmail.com"
                        className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                        value={sangh.email}
                        onChange={(e) => setSangh({ ...sangh, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-black mb-1'>पासव्र्ड</label>
                    <input
                        type="password"
                        placeholder="Password"
                        className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                        value={sangh.password}
                        onChange={(e) => setSangh({ ...sangh, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full py-2 px-4 bg-blue-400 text-white rounded-md text-sm font-semibold hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={buttonDisabled || loading}
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </form>
            <ToastContainer />
        </div>
    );
};

export default SignupSangh;
