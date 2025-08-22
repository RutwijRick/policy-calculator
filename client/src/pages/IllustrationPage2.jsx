import React from "react";

export default function IllustrationPage2() {
    const data = JSON.parse(localStorage.getItem("illustration"));

    if (!data) return <p>No calculation found</p>;

    return (
        <div className="table-responsive">
            <h2 className="text-xl mb-4">Illustration</h2>
            <table border="1" className="table table-bordered">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Age</th>
                        <th>Premium</th>
                        <th>Charges</th>
                        <th>Fund @4%</th>
                        <th>Fund @8%</th>
                        <th>Death Benefit</th>
                    </tr>
                </thead>
                <tbody>
                    {data.illustration.map((row) => (
                        <tr key={row.id}>
                            <td>{row.year}</td>
                            <td>{row.age}</td>
                            <td>{row.premium}</td>
                            <td>{row.charges}</td>
                            <td>{row.fundValue4}</td>
                            <td>{row.fundValue8}</td>
                            <td>{row.deathBenefit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
