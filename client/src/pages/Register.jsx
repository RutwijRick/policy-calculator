import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";

export default function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        dob: "",
        mobile: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            return "Valid email is required";
        }
        if (!formData.password || formData.password.length < 6) {
            return "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match";
        }
        if (!formData.name.trim()) {
            return "Name is required";
        }
        if (!formData.dob) {
            return "Date of birth is required";
        }
        if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
            return "Valid 10-digit mobile number is required";
        }



        const today = new Date();
        const dob = new Date(formData.dob);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        if (age < 23 || age > 56) {
            return "Age must be between 23 and 56 years to register";
        }

        if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
            return "Valid 10-digit mobile number is required";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            const res = await http.post("/auth/register", {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                dob: formData.dob,
                mobile: formData.mobile,
            });
            alert("Registered");
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
            <div className="card shadow p-4">
                <h3 className="text-center mb-4">Register</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-xs-12 col-md-6 col-lg-4 mb-2">
                            <label>Email *</label>
                            <input type="email" name="email" className="form-control"
                                value={formData.email} onChange={handleChange} required placeholder="Email" />
                        </div>
                        <div className="col-xs-12 col-md-6 col-lg-4 mb-2">
                            <label>Password * <span className="text-muted">(Atleast 6 Characters)</span></label>
                            <input type="password" name="password" className="form-control"
                                value={formData.password} onChange={handleChange} required placeholder="Password" />
                        </div>
                        <div className="col-xs-12 col-md-6 col-lg-4 mb-2">
                            <label>Confirm Password *</label>
                            <input type="password" name="confirmPassword" className="form-control"
                                value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" />
                        </div>
                        <div className="col-xs-12 col-md-6 col-lg-4 mb-2">
                            <label>Full Name *</label>
                            <input type="text" name="name" className="form-control"
                                value={formData.name} onChange={handleChange} required placeholder="Name" />
                        </div>
                        <div className="col-xs-12 col-md-6 col-lg-4 mb-2">
                            <label>Date of Birth <span className="text-muted">(Age Should Be Between 23 to 58)</span></label>
                            <input type="date" name="dob" className="form-control"
                                value={formData.dob} onChange={handleChange} required />
                        </div>
                        <div className="col-xs-12 col-md-6 col-lg-4 mb-2">
                            <label>Mobile * <span className="text-muted">(10 Digit)</span></label>
                            <input type="text" name="mobile" className="form-control"
                                value={formData.mobile} onChange={handleChange} required placeholder="Mobile" /></div >
                        <div className="col-xs-12 col-md-12 col-lg-12">

                            <button type="submit" className="btn btn-primary w-100">
                                Register
                            </button>
                        </div>
                    </div>
                </form>
                <p className="mt-3 text-center">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}
