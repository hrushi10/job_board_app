import {Link, useNavigate} from "react-router-dom"
import api from "../axiosConfig";
import { useEffect, useState } from "react"
import Dropdown from "./dropdown_menu.js";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();


useEffect(()=>{

    const profile = async () => {
        try{
            const res = await api.get("/auth/profile");
            setUser(res.data);
        }catch(err){
            setUser(null);
            console.log("err in navbar : ", err)
        }
        
    }

    profile();
}, [navigate]);

const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    navigate("/login");
};


return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between  items-center shadow-md">
        <div>
        <Link to="/" className="text-2xl font-bold">MyApp</Link>
        <Link to="/" className="px-8 hover:text-gray-300">Home</Link>
        </div>
        <div className="flex gap-6 items-center">
            
            {user ? (
                <>
                      
                    <img src={user.picture} alt="profile"  className="w-10 h-10 rounded-full object-cover"></img> 
                    <h2>{user.name}</h2>
                    
                    {/* <Link to="/profile" className="hover:text-pink-300">Profile</Link>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                    >
                        Logout
                    </button> */}

                    <Dropdown />
                </>
            ) : (
                <>
                    <Link to="/login" className="hover:text-pink-300">Login</Link>
                    <Link to="/signup" className="bg-blue-600 px-4 py-2 rounded hover:bg-pink-700 transition duration-200">
                        Signup
                    </Link>
                </>
            )}
        </div>
    </nav>
);
};

export default Navbar;