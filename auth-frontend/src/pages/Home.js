
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


        const applyJob = async () => {

            try {

            } catch (err) {
                console.error("Error applying for job:", err);
            }

        }


return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-3  justify-center min-h-screen bg-gray-100">
           
            <div class="h-dvh  col-span-1 mt-4 overflow-y-auto border-solid border-2 border-gray-300 rounded-lg p-4 sm:mx-auto">
            
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
            <div class="col-span-2 mt-4 h-dvh overflow-y-auto outline-style: solid sm:mx-auto max-w-6xl ">
                        {/* <li key={postDetails.id} className="p-2 border-2 border-indigo-500 bg-white rounded shadow-md" >
                            <h3 className="font-semibold text-lg">{postDetails.jobTitle}</h3>
                            <p className="text-gray-600">{postDetails.jobCompany}</p>
                            <p className="text-gray-500">{postDetails.companyAddress}</p>
                            <p className="text-gray-500">{postDetails.jobDescriptions}</p>
                        </li> */}

                        <div class= "grid grid-rows-5 gap-4  border-solid border-2 border-gray-300 bg-white rounded-lg p-4"> 
                                <div class="grid grid-cols-2 gap-2 border-b-2 border-gray-300">
                                    <img src={"https://www.shutterstock.com/image-vector/science-cloud-computing-concept-based-600nw-2390397167.jpg"} alt="Company Logo" className="size-60  mx-auto" />
                                   
                                    <div class="ml-2 mt-10 gap-2 flex flex-col justify-items-center items-center ">  {/* shows logo company name and location  */}
                                    <p className="font-medium text-gray-600">{postDetails.jobCompany}</p>
                                    <p className="font-medium text-gray-600">{postDetails.companyAddress}</p>
                                    <button class=" mt-6 bg-blue-600 px-4 py-2 rounded text-white mb-2 w-1/3" type="submit">Apply</button>
                               
                                 </div>
                                    
                                </div>  

                                <div class=" border-b-2  border-gray-300"> {/* (section 2) shows skills */} 
                                    <p className="text-gray-600 text-align: center"> <span class = "font-medium">Salary :  </span> ${postDetails.salary} per annum</p>
                                  </div> 

                                <div class=" border-b-2 border-gray-300">  {/* (section 3) shows job description */} 
                                    <p class="font-medium border-b-8">Job Description:</p>
                                   
                                    <p className="text-gray-500 text-justify">{postDetails.jobDescriptions}</p>
                                </div>

                                <div class="border-b-2  border-gray-300 ">  {/* (section 4) shows details of the job */} 
                                    <p className="text-gray-500  text-justify">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                        when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                                        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
                                        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software 
                                        like Aldus PageMaker including versions of Lorem Ipsum</p>
                                </div> 

                        </div> 
            </div>
            )} 

    </div>    
</div>

);


};

export default Home;