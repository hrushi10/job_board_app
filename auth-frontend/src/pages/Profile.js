
import { useEffect, useState } from "react";
import api from "./axiosConfig"; 
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const resP = await api.get("/auth/profile", {
                    withCredentials: true, 
                }); 
                setUserProfile(resP.data);
              

                const res = await api.get("/auth/profileData", {
                    withCredentials: true, 
                }); 
                setUser(res.data);
                // setUserProfile(resP.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                navigate("/login");
            }
        };
        fetchProfile();
    }, [navigate]);



    const handleLogout = async () => {
        await api.post("/auth/logout");
        navigate("/login");
    };
    const handleEdit = async () => {
        await api.post("/auth/edit");
        navigate("/login");
    };

    return user ? (
        <div class="grid grid-flow-col grid-cols-3 grid-rows-2  p-5 bg-gray-200 gap-4 ">

            <div class=" row-end-2 justify-items-center outline-3 outline-offset-2 outline-double m-2 bg-white">
                 <img src={userProfile.img} alt="profile_pic" class="p-2 size-48 rounded-full object-cover"></img>
                 <p class="p-2 font-medium">{userProfile.name}</p>
                 <p class="text-gray-600/75">{user.title}</p>
                 <p class="text-gray-600/75">{user.company}</p>
                 <p class="text-gray-600/75">{user.address}</p>
            </div>
           
            <div class="col-start-2 [&_*]:mt-2 [&_*]:p-2 bg-white p-4" >
               
                <div class="grid grid-cols-3 border-b-2 border-gray-300 ">
                    <p>Full Name</p>
                    <input  type="text" value= {userProfile.name}   class="border-none focus:outline-none  " />
                </div>
            
                <div class="grid grid-cols-3 border-b-2 border-gray-300 ">
                    <p>Job Title</p> 
                    <input type="text" value= {user.title}/>
                </div>
                
                 <div class=" grid grid-cols-3 border-b-2 border-gray-300 ">
                    <p>Address</p>
                    <textarea  value= {user.pAddress}  type="text" />
                </div>


                <div class="grid grid-cols-3 border-b-2 border-gray-300 ">
                    <p>Email</p>
                    <input value= {userProfile.email}  type="text" />    
                </div>

                <div class="grid grid-cols-3 mb-4  border-b-2 border-gray-300">
                    <p>Mobile</p>
                    <input value= {user.pNumber}  type="text" />    
                </div>

                <button class="w-20 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600"> Edit </button>
            </div> 
 
        </div>
    ) : (
        <p>Loading...</p>
    );
};

export default Profile;

