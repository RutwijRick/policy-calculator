import React from "react";
import { useState } from "react";
import http from "../api/http";

export default function IllustrationPage() {
    const [form, setForm] = useState({
        age: 30,
        premium: 10000,
        policyTerm: 10,
        rider: true,
        fundGrowthRate: 6,
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : Number(value),
        });
    };

    const handleSubmit = async () => {
        try {
            const res = await http.post("/calculate", form);
            setResult(res.data);
        } catch (err) {
            alert(err.response?.data?.error || "Error in calculation");
        }
    };


    return (
        <div>
            <div className="row">
                <div className="col-xs-12">
                    <h2>Insurance Benefit Illustration</h2>
                </div>
            </div>

            {/* Simple Inputs */}
            <input name="age" value={form.age} onChange={handleChange} type="number" placeholder="Age" />
            <input name="premium" value={form.premium} onChange={handleChange} type="number" placeholder="Premium" />
            <input name="policyTerm" value={form.policyTerm} onChange={handleChange} type="number" placeholder="Policy Term" />
            <input name="fundGrowthRate" value={form.fundGrowthRate} onChange={handleChange} type="number" placeholder="Fund Growth %" />
            <label>
                <input name="rider" type="checkbox" checked={form.rider} onChange={handleChange} /> Include Rider
            </label>

            <button onClick={handleSubmit}>Calculate</button>

            {/* Results Table */}
            {result && (
                <div className="table-responsive">
                    <h3>Summary</h3>
                    <p>Total Premium Paid: {result.summary.totalPremiumPaid}</p>
                    <p>Total Fund Value: {result.summary.totalFundValue}</p>

                    <h3>Yearly Projection</h3>
                    <table border="1" cellPadding="8">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Premium Paid</th>
                                <th>Rider Charge</th>
                                <th>Mortality Charge</th>
                                <th>Fund Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.illustration.map((row) => (
                                <tr key={row.year}>
                                    <td>{row.year}</td>
                                    <td>{row.premiumPaid}</td>
                                    <td>{row.riderCharge}</td>
                                    <td>{row.mortalityCharge}</td>
                                    <td>{row.fundValue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
