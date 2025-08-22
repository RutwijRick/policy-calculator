import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
            <Link className="navbar-brand fw-bold" to="/">Benefit Calculator</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                    {user && (
                        <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                        </>
                    )}
                </ul>
                <ul className="navbar-nav d-flex gap-2">
                    {user ? (
                        <li className="nav-item">
                            <button 
                                className="btn btn-outline-danger"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </li>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="btn btn-outline-primary" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="btn btn-outline-primary" to="/register">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
