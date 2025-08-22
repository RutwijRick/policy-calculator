import { useState } from 'react';
import http from '../api/http';

export default function PolicyCalc() {
    const [form, setForm] = useState({
        dob: '', gender: 'M', sumAssured: '', modalPremium: '', premiumFrequency: 'Yearly', pt: '', ppt: ''
    });
    const [policyId, setPolicyId] = useState(null);
    const [errors, setErrors] = useState([]);

    const set = (k, v) => setForm(s => ({ ...s, [k]: v }));
    const createPolicy = async (e) => {
        e.preventDefault();
        try {
            const { data } = await http.post('/policy', {
                ...form,
                sumAssured: Number(form.sumAssured),
                modalPremium: Number(form.modalPremium),
                pt: Number(form.pt),
                ppt: Number(form.ppt),
            });
            setPolicyId(data.policy.id);
            setErrors([]);
        } catch (err) {
            setErrors(err.response?.data?.errors || ['Failed']);
        }
    };
    const generate = async () => {
        if (!policyId) return;
        await http.post(`/illustration/${policyId}/generate`);
        window.location.href = `/illustration/${policyId}`;
    };

    return (
        <div style={{ maxWidth: 640, margin: '20px auto' }}>
            <h2>Policy Calculation</h2>
            {errors.length > 0 && <div style={{ color: 'crimson' }}>{errors.map((e, i) => <div key={i}>{e}</div>)}</div>}
            <form onSubmit={createPolicy}>
                <label>DOB <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} /></label>
                <label>Gender
                    <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                        <option>M</option><option>F</option><option>O</option>
                    </select>
                </label>
                <label>Sum Assured <input type="number" value={form.sumAssured} onChange={e => set('sumAssured', e.target.value)} /></label>
                <label>Modal Premium <input type="number" value={form.modalPremium} onChange={e => set('modalPremium', e.target.value)} /></label>
                <label>Premium Frequency
                    <select value={form.premiumFrequency} onChange={e => set('premiumFrequency', e.target.value)}>
                        <option>Yearly</option><option>Half-Yearly</option><option>Monthly</option>
                    </select>
                </label>
                <label>PT <input type="number" value={form.pt} onChange={e => set('pt', e.target.value)} /></label>
                <label>PPT <input type="number" value={form.ppt} onChange={e => set('ppt', e.target.value)} /></label>
                <button type="submit">Save Policy</button>
            </form>
            <button disabled={!policyId} onClick={generate} style={{ marginTop: 12 }}>Generate Illustration</button>
        </div>
    );
}
