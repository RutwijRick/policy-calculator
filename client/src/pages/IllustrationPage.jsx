import React from "react";
import { useState } from "react";
import http from "../api/http";
import { useEffect } from "react";

export default function IllustrationPage({ savedPolicy }) {
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (savedPolicy) {

            // auto-fetch illustration
            (async () => {
                try {
                    const res = await http.get(`/calculate/${savedPolicy.id}`);
                    setResult(res.data);
                    console.log(res.data)
                } catch (err) {
                    console.error(err);
                }
            })();
        }
    }, [savedPolicy]);


    return (
        <div>
            <hr />
            {/* Results Table */}
            {result && (
                <div className="table-responsive ">
                    <p>
                        <strong>Total Premium Paid:</strong> <span className="text-primary">{result.summary.totalPremiumPaid}</span> | 
                        <strong>Maturity Benefit:</strong> <span className="text-primary">{result.summary.maturityBenefit}</span> | 
                        <strong>IRR:</strong> <span className="text-primary">{result.irr}</span>
                    </p>
                    <p>
                        <strong>Riders:</strong> {result.riders.map((rider) => `${rider} `)}
                    </p>

                    <h3>Yearly Projection</h3>
                    <table className="table table-bordered" border="1" cellPadding="8">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Premium</th>
                                <th>Sum Assured</th>
                                <th>Bonus Rate</th>
                                <th>Bonus Amount</th>
                                <th>Total Benefit</th>
                                <th>Rider Benefit</th>
                                <th>Rider Premium</th>
                                <th>Net Cashflows</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.illustration.map((row) => (
                                <tr key={row.year}>
                                    <td>{row.year}</td>
                                    <td>{row.premium}</td>
                                    <td>{row.sumAssured}</td>
                                    <td>{row.bonusRate}</td>
                                    <td>{row.bonusAmount}</td>
                                    <td>{row.totalBenefit}</td>
                                    <td>{row.riderBenefit}</td>
                                    <td>{row.riderPremium}</td>
                                    <td>{row.netCashflow}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
