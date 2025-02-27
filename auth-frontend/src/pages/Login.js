import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./axiosConfig";




const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
   

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", formData, {
                withCredentials: true, 
            });
             alert(res.data.message);
            
         navigate("/profile");
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                        />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                        required />
                <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Login
                        </button>

            </form>
        </div>
        </div>
        </div>
    );
};

export default Login;
