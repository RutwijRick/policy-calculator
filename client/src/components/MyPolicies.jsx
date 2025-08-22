import { useEffect, useState } from "react";
import http from "../api/http";
import { useAuth } from "../context/AuthContext";
import IllustrationPage from "../pages/IllustrationPage";
import PolicyCalculationPage from "./PolicyCalculationPage";

export default function MyPolicies() {
    const { user } = useAuth();
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const fetchPolicies = async () => {
        try {
            const res = await http.get(`/policy/user/${user.id}`);
            setPolicies(res.data);
        } catch (err) {
            console.error(err);
            alert("Error fetching policies");
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, [selectedPolicy]);

    const handleClick = async (policyId) => {
        try {
            const res = await http.get(`/policy/${policyId}`);
            setSelectedPolicy(res.data);
        } catch (err) {
            console.error(err);
            alert("Error loading policy details");
        }
    };

    const deletePolicy = async (policyId) => {
        try {
            console.log(policyId)
            const res = await http.delete(`/policy/${policyId}`);
            fetchPolicies();
        } catch (err) {
            console.error(err);
            alert("Error loading policy details");
        }
    }

    return (
        <div>
            {!selectedPolicy ? (
                <>
                    <h2>Saved Policies </h2>
                    <ul>
                        {policies.map((p) => (
                            <li className="text-primary m-2" key={p.id} style={{ cursor: "pointer"}}>
                                <span onClick={() => handleClick(p.id)}>Policy #PBC/{p.id}/{p.policyType} – Sum Assured: {p.sumAssured}</span> <button className="badge bg-danger" onClick={() => deletePolicy(p.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <PolicyCalculationPage viewPolicy={handleClick}/>
                </>
            ) : (
                <>
                    <h3>Policy Details #PBC/{selectedPolicy.id}/{selectedPolicy.policyType} <button className="badge bg-dark" onClick={() => setSelectedPolicy(null)} style={{float: "right"}}>Back To Policy Page</button></h3>
                    <IllustrationPage savedPolicy={selectedPolicy} />
                </>
            )}
        </div>
    );
}
