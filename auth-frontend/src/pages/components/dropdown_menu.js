import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center"
      >
        Menu
        <ChevronDownIcon className="w-5 h-5 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute right-0 bg-gray-700 shadow-md rounded-md mt-2 w-40">
          <a href="/profile" className="block px-4 py-2 hover:bg-gray-300 hover:text-black">Profile</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-300 hover:text-black" >Settings</a>
          <a href="/logout" className="block px-4 py-2 hover:bg-gray-300 hover:text-red-800">Logout</a>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
