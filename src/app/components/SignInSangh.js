import { ToastContainer, toast as Toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

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
                <h2 className="text-2xl font-bold">Sign In</h2>
                <input
                    className="p-2 text-black border border-gray-300 rounded"
                    type="email"
                    placeholder="Email"
                    value={sangh.email}
                    onChange={(e) => setSangh({ ...sangh, email: e.target.value })}
                />
                <input
                    className="p-2 text-black border border-gray-300 rounded"
                    type="password"
                    placeholder="Password"
                    value={sangh.password}
                    onChange={(e) => setSangh({ ...sangh, password: e.target.value })}
                />
                <button
                    className={`bg-green-500 text-white p-2 rounded ${buttonDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    type="submit"
                    disabled={buttonDisabled || loading}
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default SignInSangh;
