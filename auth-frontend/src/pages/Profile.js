
import { useEffect, useState } from "react";
import api from "./axiosConfig"; 
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/auth/profile", {
                    withCredentials: true, 
                }); 
                setUser(res.data);
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

    return user ? (
        <div>
            <h2>Welcome, {user.name}</h2>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    ) : (
        <p>Loading...</p>
    );
};

export default Profile;

