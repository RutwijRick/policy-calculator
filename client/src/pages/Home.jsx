import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user } = useAuth();
    return (
        <div className="text-center">
            <h1>Welcome to Benefit Calculator</h1>
            <br />
            {user?.name ? <p>Welcome {user?.name} <Link to="/dashboard">Click Here</Link> to access your dashboard.</p>
            : (<p><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to access your dashboard.</p>)}
        </div>
    );
}

export default Home;
