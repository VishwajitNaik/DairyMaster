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
            router.push("/");
        } catch (error) {
            console.error("SignUp Error", error);
            setError(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const allFieldsFilled = Object.values(sangh).every(field => field.length > 0);
        setButtonDisabled(!allFieldsFilled);
    }, [sangh]);

    return (
        <div>
            <form className="text-black flex flex-col space-y-4" onSubmit={onSignup}>
                <h2 className="text-2xl font-bold">Sign Up</h2>
                <label className='text-black'>संघाचे नाव </label>
                <input
                    className="border border-gray-300 rounded"
                    type="text"
                    placeholder="Username"
                    value={sangh.SanghName}
                    onChange={(e) => setSangh({ ...sangh, SanghName: e.target.value })}
                />
                <label className='text-black'>फोन नंबर</label>
                <input
                    type="text"
                    placeholder="Phone Number"
                    className="border border-gray-300 rounded"
                    value={sangh.phone}
                    onChange={(e) => setSangh({ ...sangh, phone: e.target.value })}
                />
                <label className='text-black'>ईमेल</label>
                <input
                    type="email"
                    placeholder="abc@gmail.com"
                    className="border border-gray-300 rounded"
                    value={sangh.email}
                    onChange={(e) => setSangh({ ...sangh, email: e.target.value })}
                />
                <label className='text-black'>पासवर्ड</label>
                <input
                    type="password"
                    placeholder="Password"
                    className="p-2 border border-gray-300 rounded"
                    value={sangh.password}
                    onChange={(e) => setSangh({ ...sangh, password: e.target.value })}
                />
                <button
                    type="submit"
                    className={`bg-blue-500 text-white p-2 rounded ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={buttonDisabled || loading}
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
            <ToastContainer />
        </div>
    );
}

export default SignupSangh;
