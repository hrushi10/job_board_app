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
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p class="mt-2 text-center text-sm text-gray-600 max-w"> Or <a class = "font-medium text-stone-600 hover:text-stone-700" href='/Signup'>Create an account</a></p>
            </div>
            
            <div className="mt-6 bg-white p-8 rounded-lg shadow-lg w-96">
                
            <form onSubmit={handleSubmit}>
                <p class="block text-sm font-medium text-gray-700">Email address</p>
                <input type="email" name="email" placeholder="Enter your email address" onChange={handleChange} required className="w-full mb-2 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 mb-6"
                        />
                 <p class="block text-sm font-medium text-gray-700">Password</p>
                <input type="password" name="password" placeholder="Enter your Password" onChange={handleChange} className="w-full mb-2 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300  mb-6"
                        required />
                <div class="mb-4 flex items-center justify-between">
                    <input type="checkbox"  value="Remember me" class="mr-2" /> 
                    <label> Remember me</label>
                    <a href="#" class=" font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
                    </div>
                <button 
                        type="submit"
                        className="w-full bg-stone-500 text-white py-2 rounded-md hover:bg-stone-700 transition duration-200"
                    >
                        Sign In
                        </button>

            </form>
        </div>
        </div>
        </div>
    );
};

export default Login;
