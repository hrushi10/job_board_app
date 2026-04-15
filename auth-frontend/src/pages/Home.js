
import { useEffect, useState } from "react";
import api from "./axiosConfig"; 
import { useNavigate } from "react-router-dom";

const Home = () => {

   const [isVisible, setIsVisible] = useState(false);
   const [jobpost, setJobPost] = useState([]);
   const [postDetails, setpostDetails] = useState([]);
   const navigate = useNavigate();
   let Id = null;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get("/allJobs/jobs", {
                   
                }); 
                setJobPost(res.data);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            }
        };
        fetchJobs();

      

    }, [navigate]);

        const viewDetails = async (id) => {
            
           Id = id ;
            
            setpostDetails(jobpost.find(findPost));
            setIsVisible(true);
            
        };

        const findPost = (value, index, array) => {

       return   value.jobId === Id;
          
             
            
        };

return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-3  justify-center min-h-screen bg-gray-100">
            <div class="col-span-1 mt-4 overflow-y-auto outline-style: solid; sm:mx-auto">

                {jobpost.length > 0 ? (

                    
                   
                    <ul className="space-y-2">
                        {jobpost.map((jobpost) => (
                            <li key={jobpost.jobId} className="p-2 border-2 border-indigo-500 bg-white rounded shadow-md" onClick={() => viewDetails(jobpost.jobId)}>
                                <h3 className="font-semibold text-lg">{jobpost.jobTitle} </h3>
                                <p className="text-gray-600">{jobpost.jobCompany}</p>
                                <p className="text-gray-500">{jobpost.companyAddress}</p>
                            </li>
                        ))}
                    </ul>
                
                    ) : (
                    <p>No jobs available.</p>
                )}
            </div>
    
    
            
           

            {isVisible && (
            <div class="col-span-2 mt-4  overflow-y-auto outline-style: solid sm:mx-auto ">
                        {/* <li key={postDetails.id} className="p-2 border-2 border-indigo-500 bg-white rounded shadow-md" >
                            <h3 className="font-semibold text-lg">{postDetails.jobTitle}</h3>
                            <p className="text-gray-600">{postDetails.jobCompany}</p>
                            <p className="text-gray-500">{postDetails.companyAddress}</p>
                            <p className="text-gray-500">{postDetails.jobDescriptions}</p>
                        </li> */}

                        <div class= "grid grid-rows-5 gap-4 outline-solid outline-2 outline-gray-300 bg-white rounded-lg p-4"> 
                                <div class="grid grid-cols-2 gap-2 border-b-2 border-gray-300">
                                    <img src="https://via.placeholder.com/150" alt="Company Logo" className="w-32 h-32 rounded-full mx-auto" />
                                   
                                    <div class="ml-2 ">
                                    <p className="text-gray-600">{postDetails.jobCompany}</p>
                                    <p className="text-gray-600">{postDetails.companyAddress}</p>
                                    <p className="text-gray-600">{postDetails.salary}</p>
                                    <button class="bg-blue-600 px-4 py-2 rounded text-white mt-2" type="submit">Apply</button>
                               
                                    </div>
                                </div>

                                <div class="border-b-2 border-gray-300">
                                  </div> 

                                <div class="border-b-2 border-gray-300">
                                    <p className="text-gray-500">{postDetails.jobDescriptions}</p>
                                </div>

                                <div class="border-b-2 border-gray-300">
                                    
                                </div> 

                        </div> 
            </div>
            )} 

    </div>    
</div>

);


};

export default Home;