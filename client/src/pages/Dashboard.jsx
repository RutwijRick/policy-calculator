import MyPolicies from "../components/MyPolicies";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();

    return (
        <div>
            <MyPolicies/>
        </div>
    );
}

export default Dashboard;
