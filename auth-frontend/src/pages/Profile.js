
import { useEffect, useState } from "react";
import api from "./axiosConfig"; 
import { useNavigate } from "react-router-dom";


const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [updateData, setupdateData] = useState({ fullName: "", jobTitle: "" ,address: "", email:"", phone: ""});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const resP = await api.get("/auth/profile", {
                    withCredentials: true, 
                }); 
                setUserProfile(resP.data);

             
            } catch (err) {
                console.error("Error fetching profile:", err);
                navigate("/login");
            }
        };
        fetchProfile();
    }, [navigate]);



  
    const handleEdit =  () => {
       
        let saveButton = document.getElementById("saveButton");
        let editButton = document.getElementById("editButton");
        let cancelButton = document.getElementById("cancelButton");

        document.querySelectorAll("#inputElement").forEach(inputs => {
            setIsEditable(true);          
        });
        saveButton.hidden = false;
        editButton.hidden = true;
        cancelButton.hidden = false;



        setupdateData(userProfile);



    };

    const handleCancel =  () => {
       
        let saveButton = document.getElementById("saveButton");
        let editButton = document.getElementById("editButton");
        let cancelButton = document.getElementById("cancelButton");

        document.querySelectorAll("#inputElement").forEach(inputs => {
            setIsEditable(true);          
        });
        saveButton.hidden = true;
        editButton.hidden = false;
        cancelButton.hidden = true;

    };

    const handleChange = (e) => {
       
        setupdateData({ ...updateData, [e.target.name]: e.target.value });

       
    };

  

    const handelSave = async () => {
        let saveButton = document.getElementById("saveButton");
        let editButton = document.getElementById("editButton");
        let cancelButton = document.getElementById("cancelButton");

        saveButton.hidden = true;
        editButton.hidden = false;
        cancelButton.hidden = true;

        document.querySelectorAll("#inputElement").forEach(input => {
            setIsEditable(false);
        });
           
        try{
            console.log("this is sent to server: ", updateData);
           await api.post("/auth/saveProfile", updateData,{
                withCredentials: true, 
            }); 
        }catch(err) {
            console.log("err while sending the updated data", err);
        }

        setupdateData(updateData);
    };

    return userProfile ? (
        <div class="grid grid-cols-1 md:grid-cols-3  p-12 bg-gray-200 gap-8 min-h-screen">

            <div class=" justify-items-center outline-3 outline-offset-2 outline-double m-2 bg-white rounded-lg">
                <a href="/upload" target="_self" class="relative block w-40 h-40 rounded-full overflow-hidden group">
 
                    <img src={userProfile.picture} alt={userProfile.picture} class="p-2 size-48 rounded-full object-cover  transition duration-300 group-hover:opacity-75 "></img>
                    <button class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-50 text-white text-sm font-semibold py-1 px-2 rounded">
                        Click to Edit
                    </button>
                </a>
                <p class="p-2 font-medium">{userProfile.fullName}</p>
                <p class="text-gray-600/75">{userProfile.jobTitle}</p>
                <p class="text-gray-600/75">{userProfile.company}</p>
                {/* <p class="text-gray-600/75">{userProfile.comAddress}</p> */}
            </div>
           
            <div class="col-span-2 md:col-start-2 [&_*]:mt-2 [&_*]:p-2 bg-white p-4 rounded-lg" >
               
                <div class="grid  grid-cols-1 md:grid-cols-3 border-b-2 border-gray-300 " >
                    <p>Full Name</p>
                    <input name="fullName" readOnly={!isEditable} id="inputElement" type="text" placeholder= {userProfile.fullName} onChange={handleChange}  class="col-span-2 text-gray-400 border-none focus:outline-none" />
                </div>
            
                <div class="grid  grid-cols-1 md:grid-cols-3 border-b-2 border-gray-300 ">
                    <p>Job Title</p> 
                    <input name="jobTitle" readOnly={!isEditable} id="inputElement" type="text" placeholder= {userProfile.jobTitle} onChange={handleChange} class="col-span-2 text-gray-400 border-none focus:outline-none"/>
                </div>
                
                 <div class=" grid  grid-cols-1 md:grid-cols-3 border-b-2 border-gray-300 ">
                    <p>Address</p>
                    <textarea name="address"  readOnly={!isEditable} id="inputElement" placeholder= {userProfile.address} onChange={handleChange} class="col-span-2 text-gray-400 border-none focus:outline-none" type="text" />
                </div>


                <div class="grid  grid-cols-1 md:grid-cols-3 border-b-2 border-gray-300 ">
                    <p>Email</p>
                    <input name="email" readOnly={!isEditable} id="inputElement" placeholder= {userProfile.email} onChange={handleChange} class="col-span-2 text-gray-400 border-none focus:outline-none" type="text" />    
                </div>

                <div class="grid  grid-cols-1 md:grid-cols-3 mb-4  border-b-2 border-gray-300">
                    <p>Mobile</p>
                    <input name="phone" readOnly={!isEditable} id="inputElement" placeholder= {userProfile.phone} onChange={handleChange} class="col-span-2 text-gray-400 border-none focus:outline-none" type="text" />    
                </div>

                <div class="grid">
                 <button onClick={handleEdit} id="editButton" class="row-start-1 w-20 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600"> Edit </button>
                 <button onClick={handleCancel} id="cancelButton" class="row-start-1  w-20 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" hidden> Cancel </button>
                
                  <button onClick={handelSave} id="saveButton" class="row-start-1 justify-self-end w-20 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" hidden> Save </button>
                 
                </div>
            </div> 
 
        </div>
    ) : (
        <p>Loading...</p>
    );
};

export default Profile;

