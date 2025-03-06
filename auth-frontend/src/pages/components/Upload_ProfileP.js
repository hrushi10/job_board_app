import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";


const UploadPicture = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
       await api.post("/auth/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      navigate('/profile');
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md w-80 text-center">
      <h2 className="text-lg font-semibold mb-3">Upload Profile Picture</h2>
      
      {preview ? (
        <img src={preview} alt="Preview" className="w-32 h-32 mx-auto rounded-full object-cover" />
      ) : (
        <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <input type="file" onChange={handleImageChange} className="mt-3" />

      <button onClick={handleUpload} className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600">
        Upload
      </button>
    </div>
  );
};

export default UploadPicture;


// import { useState } from "react";

// const UploadPicture = () => {
//     const [image, setImage] = useState(null);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImage(URL.createObjectURL(file));
//         }
//         const uploadImage = ()=> {

//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center p-6 border border-gray-300 rounded-lg w-80">
//             <label className="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
//                 {image ? (
//                     <img src={image} alt="Uploaded Preview" className="h-full object-cover rounded-lg" />
//                 ) : (
//                     <span className="text-gray-500">Click to upload</span>
//                 )}
//                 <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
//             </label>
//             <button onClick={uploadImage} className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600">
//                 Upload
//             </button>
//         </div>
//     );
// };

// export default UploadPicture;