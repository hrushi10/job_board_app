import { useState } from "react";
import api from "./axiosConfig";

const Signup = () => {
    const [formData, setFormData] = useState({ email: "", name: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/signup", formData);
            alert(res.data.message);
        } catch (err) {
            alert(err.response.data.error);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
