import { useEffect, useState } from 'react';
import http from '../api/http';
import { useParams } from 'react-router-dom';

export default function Illustration() {
    const { policyId } = useParams();
    const [rows, setRows] = useState([]);
    useEffect(() => {
        http.get(`/illustration/${policyId}`).then(r => setRows(r.data.rows || []));
    }, [policyId]);

    return (
        <div style={{ maxWidth: 900, margin: '20px auto' }}>
            <h2>Illustration #{policyId}</h2>
            <table border="1" cellPadding="6" width="100%">
                <thead>
                    <tr>
                        <th>Year</th><th>Age</th><th>Premium</th><th>Charges</th>
                        <th>Fund @4%</th><th>Fund @8%</th><th>Death Benefit</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(r => (
                        <tr key={r.year}>
                            <td>{r.year}</td><td>{r.age}</td><td>{r.premium}</td><td>{r.charges}</td>
                            <td>{r.fundValue4}</td><td>{r.fundValue8}</td><td>{r.deathBenefit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
