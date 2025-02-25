import {Link, useNavigate} from "react-router-dom"
import api from "../axiosConfig";
import { useEffect, useState } from "react"

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
}, []);

const handleLogout = async () => {
    await api.get("/auth/logout");
    setUser(null);
    navigate("/login");
};


return (
    <nav style={styles.navbar}>
        <Link to="/" style={styles.logo}>MyApp</Link>
        <div style={styles.navLinks}>
            <Link to="/" style={styles.link}>Home</Link>
            {user ? (
                <>
                    <Link to="/profile" style={styles.link}>Profile</Link>
                    <button onClick={handleLogout} style={styles.button}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login" style={styles.link}>Login</Link>
                    <Link to="/signup" style={styles.link}>Signup</Link>
                </>
            )}
        </div>
    </nav>
);
};

const styles = {
navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#333",
    color: "#fff"
},
logo: {
    fontSize: "20px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold"
},
navLinks: {
    display: "flex",
    gap: "15px"
},
link: {
    textDecoration: "none",
    color: "#fff"
},
button: {
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
}
};

export default Navbar;