import { Link, useNavigate } from "react-router-dom"
import api from "../axiosConfig";
import { useEffect, useState } from "react"
import Dropdown from "./dropdown_menu.js";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const currentUrl = window.location;



    useEffect(() => {

        const profile = async () => {
            try {
                const res = await api.get("/auth/profile",{
                    withCredentials: true,
                });               
                setUser(res.data);
            } catch (err) {
                setUser(null);
                console.log("err in navbar : ", err)
            }

        }

        profile();
    }, [navigate]);

   

    return (
        <nav className="bg-stone-500 text-white px-6 py-4 flex justify-between  items-center shadow-md">
            <div>
                <Link to="/" className="text-2xl font-bold">MyApp</Link>
                <Link to="/" className="px-8 hover:text-stone-700">Home</Link>
            </div>
            <div className="flex gap-6 items-center">

                {user ? (
                    <>

                        <img src={user.picture} alt="profile" className="w-10 h-10 rounded-full object-cover"></img>
                        <h2>{user.name}</h2>



                        <Dropdown />
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-stone-600">Login</Link>

                        {currentUrl.pathname !== "/signup" && (
                            <Link to="/signup" className="bg-stone-600 px-4 py-2 rounded hover:text-stone-700 transition duration-200">
                                Signup
                            </Link>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;