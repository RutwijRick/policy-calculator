import React, { useState, useEffect } from "react";
import http from "../api/http";
import MyPolicies from "./MyPolicies";

const PolicyCalculationPage = ({ viewPolicy }) => {
    const [user, setUser] = useState({ name: "", dob: "", age: "", id: "" });
    const [form, setForm] = useState({
        policyType: "",
        gender: "",
        pt: "",
        ppt: "",
        premium: "",
        frequency: "",
        sumAssured: "",
        riders: [],
    });
    const [errors, setErrors] = useState({});
    const [result, setResult] = useState(null);



    const handleRiderChange = (e) => {
        const { value, checked } = e.target;
        setForm((prev) => {
            let updatedRiders = [...prev.riders];
            if (checked) {
                updatedRiders.push(value);
            } else {
                updatedRiders = updatedRiders.filter((r) => r !== value);
            }
            return { ...prev, riders: updatedRiders };
        });
    };

    useEffect(() => {
        http.get("/user/me").then((res) => {
            setUser(res.data);
        });
    }, []);

    const validate = () => {
        let errs = {};

        if (!form.pt || form.pt < 10 || form.pt > 20) {
            errs.pt = "Policy Term must be between 10 and 20 years.";
        }

        if (!form.ppt || form.ppt < 5 || form.ppt > 10) {
            errs.ppt = "Premium Payment Term must be between 5 and 10 years.";
        }

        if (parseInt(form.ppt) >= parseInt(form.pt)) {
            errs.ppt = "PPT must be less than Policy Term.";
        }

        if (!form.premium || form.premium < 10000 || form.premium > 50000) {
            errs.premium = "Premium must be between 10,000 and 50,000.";
        }

        const minSum = Math.max(form.premium * 10, 5000000);
        if (!form.sumAssured || form.sumAssured < minSum) {
            errs.sumAssured = `Sum Assured must be at least ${minSum}.`;
        }

        if (!form.frequency) {
            errs.frequency = "Please select a Premium Frequency.";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload = {
                userId: user.id,
                policyType: form.policyType,
                dob: user.dob,
                gender: form.gender,
                sumAssured: form.sumAssured,
                modalPremium: form.premium,
                premiumFrequency: form.frequency,
                pt: form.pt,
                ppt: form.ppt,
                riders: form.riders,
            };

            console.log(payload)

            const res = await http.post("/policy/save", payload);
            console.log(res)
            viewPolicy(res.data.policy.id);
            alert(res.data.message);
        } catch (err) {
            console.error(err);
            alert("Error saving policy.");
        }
    };

    const handleSavePolicy = async () => {
        try {
            const payload = {
                userId: user.id,
                policyType: form.policyType,
                dob: user.dob,
                gender: form.gender,
                sumAssured: form.sumAssured,
                modalPremium: form.premium,
                premiumFrequency: form.frequency,
                pt: form.pt,
                ppt: form.ppt,
                riders: form.riders,
            };

            console.log(payload)

            const res = await http.post("/policy/save", payload);
            alert(res.data.message);
        } catch (err) {
            console.error(err);
            alert("Error saving policy.");
        }
    };
    return (
        <div className="container mt-5">
            <h2>Policy Calculation</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row">
                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        <label>Name</label>
                        <input type="text" value={user.name} className="form-control" readOnly />
                    </div>
                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        <label>Date of Birth</label>
                        <input type="text" value={user.dob} className="form-control" readOnly />
                    </div>
                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        <label>Age</label>
                        <input type="text" value={user.age} className="form-control" readOnly />
                    </div>

                    {/* Policy Term */}
                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        <label>Policy Term (years)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={form.pt}
                            onChange={(e) => setForm({ ...form, pt: e.target.value })}
                        />
                        {errors.pt && <div className="text-danger">{errors.pt}</div>}
                    </div>

                    {/* Premium Payment Term */}
                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        <label>Premium Payment Term (years)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={form.ppt}
                            onChange={(e) => setForm({ ...form, ppt: e.target.value })}
                        />
                        {errors.ppt && <div className="text-danger">{errors.ppt}</div>}
                    </div>

                    {/* Premium Amount */}
                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        <label>Premium Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            value={form.premium}
                            onChange={(e) => setForm({ ...form, premium: e.target.value })}
                        />
                        {errors.premium && <div className="text-danger">{errors.premium}</div>}
                    </div>

                    {/* Premium Frequency */}
                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        <label>Premium Frequency</label>
                        <select
                            className="form-control"
                            value={form.frequency}
                            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                        >
                            <option value="">Select Frequency</option>
                            <option value="yearly">Yearly</option>
                            <option value="half-yearly">Half-Yearly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        {errors.frequency && <div className="text-danger">{errors.frequency}</div>}
                    </div>

                    {/* Sum Assured */}
                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        <label>Sum Assured</label>
                        <input
                            type="number"
                            className="form-control"
                            value={form.sumAssured}
                            onChange={(e) => setForm({ ...form, sumAssured: e.target.value })}
                        />
                        {errors.sumAssured && <div className="text-danger">{errors.sumAssured}</div>}
                    </div>

                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        <label>Sum Assured</label>
                        <select className="form-control" value={form.policyType} onChange={(e) => setForm({ ...form, policyType: e.target.value })}>
                            <option value="Term Plan">Term Plan</option>
                            <option value="Endowment">Endowment</option>
                        </select>
                    </div>

                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        <label>Gender</label>
                        <select className="form-control" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
                        {/* Riders */}
                        <div>
                            <h4>Select Riders</h4>
                            <label>
                                <input
                                    type="checkbox"
                                    value="Accident Cover"
                                    checked={form.riders.includes("Accident Cover")}
                                    onChange={handleRiderChange}
                                />
                                Accident Cover
                            </label>
                            <br />
                            <label>
                                <input
                                    type="checkbox"
                                    value="Critical Illness"
                                    checked={form.riders.includes("Critical Illness")}
                                    onChange={handleRiderChange}
                                />
                                Critical Illness
                            </label>
                            <br />
                            <label>
                                <input
                                    type="checkbox"
                                    value="Disability Benefit"
                                    checked={form.riders.includes("Disability Benefit")}
                                    onChange={handleRiderChange}
                                />
                                Disability Benefit
                            </label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">Save & Calculate</button>
            </form>

            {/* Results */}
            {/* {result && (
                <div className="mt-4">
                    <h4>Projected Benefits <button className="btn btn-success" onClick={handleSavePolicy}> Save Policy </button></h4>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )} */}
        </div>
    );
};

export default PolicyCalculationPage;
