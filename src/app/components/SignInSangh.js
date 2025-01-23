import { ToastContainer, toast as Toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const SignInSangh = () => {
    const router = useRouter();
    const [sangh, setSangh] = useState({
        email: "",
        password: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const onLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            setLoading(true);
            const res = await axios.post("/api/sangh/signin", sangh);
            if (res.data.success) {
                Toast.success("Sangh logged in successfully");
                router.push("/home/AllDairies");
            } else {
                Toast.error(res.data.error || "Login failed");
            }
        } catch (error) {
            Toast.error(error.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setButtonDisabled(!(sangh.email && sangh.password));
    }, [sangh]);

    return (
        <div>
            <form className="flex flex-col space-y-4" onSubmit={onLogin}>
                <h2 className="text-2xl font-bold text-black text-center">Sign In</h2>
                <input
                    className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                    type="email"
                    placeholder="Email"
                    value={sangh.email}
                    onChange={(e) => setSangh({ ...sangh, email: e.target.value })}
                />
                <input
                    className="text-black p-2 border-b-2 border-gray-600 focus:border-blue-500 focus:outline-none w-full bg-gray-200 rounded-md"
                    type="password"
                    placeholder="Password"
                    value={sangh.password}
                    onChange={(e) => setSangh({ ...sangh, password: e.target.value })}
                />
                <button
                    className={`w-full py-2 px-4 bg-blue-400 text-white rounded-md text-sm font-semibold hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="submit"
                    disabled={buttonDisabled || loading}
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>
                <Link href="/home/AllDairies/reset" className='text-black'>
                sangh पासवर्ड विसरला असेल तर <span className='text-blue-500'> पासवर्ड बदला </span>
                </Link>
            </form>
            <ToastContainer />
        </div>
    );
}

export default SignInSangh;
