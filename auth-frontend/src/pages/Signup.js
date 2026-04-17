import {  useState } from "react";
import api from "./axiosConfig";
import "../index.css";
import { useNavigate } from "react-router-dom";



const Signup = () => {
    const [formData, setFormData] = useState({ });
    const [isVisible1, setIsVisible1] = useState(true);
    const [isVisible2, setIsVisible2] = useState(false);
    const [isVisible3, setIsVisible3] = useState(false);
    const [isVisible4, setIsVisible4] = useState(false);
    const [viewCompany, setviewCompany] = useState(false);
    
    const [profilePicture, setProfilePicture] = useState(null);
    let backB= false;

    const [preview, setPreview] = useState(null);

    const navigate = useNavigate();

    const signupType = (e) => {
        const action = e.target.dataset.action; // getting the value of the button clicked (employee, recruiter or company)
        
        setFormData( ({ ...formData, userType: e.target.value }));
        

        switch (action) {
          case "employee":
            display2();
            
            console.log("employee...");
            break;
          case "recruiter":
            display2();
            console.log("recruiter...");
            break;
          case "company":
            display2();
            console.log("company...");
            break;
          default:
            console.log("Unknown action");
        }

        
      };

      

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateVisibleInputs = () => {
        const visibleInputs = Array.from(
          document.querySelectorAll("input:required, textarea:required, select:required")
        ).filter((input) => input.offsetParent !== null); // visible only
      
        for (let input of visibleInputs) {
          if (!input.checkValidity()) {
            input.reportValidity();
            return false; // stop at first invalid input
          }
        }
        return true; // all valid
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try {
           
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
                });

                if (profilePicture) {
                data.append("profilePicture", profilePicture);
  }
           
           
            const res = await api.post("/auth/signup", data);
            console.log("reached here2");
            alert(res.data.message);
            navigate("/login");

        } catch (err) {
            console.log("this is the error during signup: ", err)
            alert(err.response.data.error);
        }
    };

    const handleNoCompany = () => {
        setviewCompany(false);
    }

    const handleCompany = () => {
        setviewCompany(true);
    }
    const checkBack = () => {
        backB= true;
        
    }

    const display2 = () => {
        
        if (!validateVisibleInputs() &&  !backB) return;
        setIsVisible2(true);
        setIsVisible1(false);
        setIsVisible3(false);
        setIsVisible4(false);
        backB = false;
        
        
    };

    const display4 = () => {
        console.log(formData.workStatus);
        if (!validateVisibleInputs() &&  !backB) return;
       
        setIsVisible2(false);
        setIsVisible1(false);
        setIsVisible3(false);
        setIsVisible4(true);
    };

    const display1 = () => {
        if (!validateVisibleInputs() &&  !backB) return;
        setIsVisible1(true);
        setIsVisible2(false);
        setIsVisible4(false);
        setIsVisible3(false);
    };

    const display3 = () => {
        if (!validateVisibleInputs() &&  !backB) return;
        
        if(formData.password !== formData.ConfirmPassword){
            alert("Password does not match");
           
            
            return;
        }

        setIsVisible1(false);
        setIsVisible2(false);
        setIsVisible3(true);
        setIsVisible4(false); 
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
         
          setPreview(URL.createObjectURL(file));
          setProfilePicture(file);
          
        }else{
            alert("Please select an Profile Picture");
        }
      };

  

    

    return (
        <div>

            <form onSubmit={handleSubmit}>

                <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">

                    <div class="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-800">Siging Up ... </h2>
                    </div>

                    <div class="w-full max-w-lg bg-white  shadow-lg rounded-lg p-8">

                        {isVisible1 && (
                            <div id="step-1" class="grid grid-cols-3  gap-2 bg-white rounded-lg">
                                <div class="justify-self-center">
                                    <button name ="userType" id = "employee" value ="Employee" data-action="employee" onClick={signupType} class="bg-stone-500 px-4 py-2 rounded text-white hover:bg-stone-600 " >Employee</button>
                                </div>
                                <div class="justify-self-center">
                                    <button name ="userType" id = "recruiter" value ="Recruiter" data-action="recruiter" onClick={signupType} class="bg-stone-500 px-4 py-2 rounded text-white hover:bg-stone-600 " >Recruiter</button>
                                </div>
                                <div class="justify-self-center">
                                    <button name ="userType" id = "company" value ="Company" data-action="company" onClick={signupType} class="bg-stone-500 px-4 py-2 rounded text-white hover:bg-stone-600 " >Company</button>
                                </div>

                            </div>
                        )}

                        {isVisible2 && (


                            <div id="step-2" class=" grid gap-4  bg-white rounded-lg">
                                <label class="block text-lg justify-self-center font-medium text-gray-700">Personal Information</label>
                                <hr></hr>
                                <div>
                                    <input
                                        type="input"
                                        name="fName"
                                        value={formData.fName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        required
                                        className="styleInput"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="input"
                                        name="lName"
                                        value={formData.lName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        required
                                        className="styleInput"
                                    />
                                </div>


                                <div>
                                    <input
                                        type="input"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        required
                                        className="styleInput"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        required
                                        className="styleInput"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        required
                                        className="styleInput" />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        name="ConfirmPassword"
                                        value={formData.ConfirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm Password"
                                        required
                                        className="styleInput" />
                                </div>

                                <div class="flex flex-row justify-between ">
                                    <button onClick={() => {checkBack(); display1(); }} class="bg-stone-400  px-4 py-2 rounded text-white hover:bg-stone-500 " type="button">Back</button>
                                    <button onClick={display3} class="bg-stone-500  px-4 py-2 rounded text-white hover:bg-stone-400 " type="button">Next</button>
                                </div>


                            </div>
                        )}

                        {isVisible3 && (


                            <div id="step-3" class=" grid gap-4  bg-white rounded-lg">
                                <label class="block text-lg justify-self-center font-medium text-gray-700">Current Work Status</label>
                                <hr></hr>
                                <div class="grid grid-rows-2 gap-2 ">
                                    <div class="hover:bg-zinc-100 rounded-lg font-medium p-4">
                                        <label htmlFor="working" class="flex flex-row justify-between" >Currently Working
                                            <input
                                                type="radio"
                                                name="workStatus"
                                                id="working"
                                                value={"Working"}
                                                onChange={handleChange}
                                                onClick={handleCompany}
                                            />
                                        </label>
                                    </div>
                                    <div className="hover:bg-zinc-100 rounded-lg font-medium p-4   ">
                                        <label htmlFor="notWorking" class="flex flex-row justify-between">
                                            Not Working
                                            <input
                                                type="radio"
                                                name="workStatus"
                                                id="notWorking"    
                                                value={"notWorking"}
                                                onChange={handleChange}
                                                onClick={handleNoCompany}


                                            />
                                        </label>


                                    </div>

                                </div>
                                {viewCompany && (

                                    <><div>

                                        <input
                                            type="input"
                                            name="companyName"
                                            value={formData.comName}
                                            onChange={handleChange}
                                            placeholder="Name of the Company"
                                            required
                                            className="styleInput" />
                                    </div>
                                        <div>
                                            <input
                                                type="input"
                                                name="jobTitle"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="Job Title"
                                                required
                                                className="styleInput" />
                                        </div></>

                                )}


                                <div class="flex flex-row justify-between ">
                                <button onClick={() => {checkBack(); display2(); }} class="bg-stone-400  px-4 py-2 rounded text-white hover:bg-stone-500 " type="button">Back</button>
                                <button onClick={display4} class="bg-stone-500  px-4 py-2 rounded text-white hover:bg-stone-400 " type="button">Next</button>
                                </div>


                            </div>
                        )}

                        {isVisible4 && (
                            <div id="step-4" className="grid gap-4 bg-white rounded-lg p-4">
                                <label className="block text-lg justify-self-center font-medium text-gray-700">
                                    Profile Picture
                                </label>
                                <hr />

                                {/*  Image Preview */}
                                {preview && (
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 justify-self-center">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/*  File Upload Input */}
                                <div className="justify-self-center">
                                    <label className="cursor-pointer bg-stone-500 text-white px-4 py-2 rounded hover:bg-stone-400 transition">
                                        Upload Picture
                                        <input
                                            type="file"
                                            name="profilePicture"
                                            accept="image/*"
                                            onChange={handleImageChange}                                         
                                            className="hidden"
                                            required
                                        />
                                        
                                        
                                    </label>
                                </div>


                                <div className="flex flex-row justify-between">
                                <button onClick={() => {checkBack(); display3(); }} class="bg-stone-400  px-4 py-2 rounded text-white hover:bg-stone-500 " type="button">Back</button>
                                
                                    <button
                                       
                                        className="bg-stone-500 px-4 py-2 rounded text-white hover:bg-stone-400"
                                        type="submit"
                                    >
                                        Complete
                                    </button>
                                </div>
                            </div>
                        )}



                    </div>
                </div>


            </form>
        </div>
    );
};

export default Signup;
