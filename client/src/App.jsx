import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import IllustrationPage from "./pages/IllustrationPage";
import PolicyPage from "./pages/PolicyPage";


function App() {

    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <div className="container mt-4 vh-100">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/policy" element={<PolicyPage />} />
                            <Route path="/illustration" element={<IllustrationPage />}/>
                            {/* add more protected routes here */}
                            {/* <Route path="/profile" element={<Profile />} /> */}
                            {/* <Route path="/settings" element={<Settings />} /> */}
                        </Route>
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
