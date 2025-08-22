import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function IllustrationForm() {
    const [formData, setFormData] = useState({
        ppt: "",
        pt: "",
        premium: "",
        frequency: "",
        sumAssured: "",
        dob: "",
    });

    const [errors, setErrors] = useState({});
    const [tableData, setTableData] = useState([]);

    const calculateAge = (dob) => {
        if (!dob) return 0;
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const validate = () => {
        let newErrors = {};
        const age = calculateAge(formData.dob);

        // 1. PPT, PT, Premium ranges
        if (formData.ppt < 5 || formData.ppt > 10) {
            newErrors.ppt = "PPT must be minimum 5 and maximum 10 years.";
        }
        if (formData.pt < 10 || formData.pt > 20) {
            newErrors.pt = "PT must be minimum 10 and maximum 20 years.";
        }
        if (formData.premium < 10000 || formData.premium > 50000) {
            newErrors.premium =
                "Premium must be minimum 10000 and maximum 50000.";
        }

        // 2. PT > PPT
        if (Number(formData.pt) <= Number(formData.ppt)) {
            newErrors.ptppt = "PT must be greater than PPT.";
        }

        // 3. Premium Frequency
        const validFreq = ["Yearly", "Half-Yearly", "Monthly"];
        if (!validFreq.includes(formData.frequency)) {
            newErrors.frequency =
                "Premium Frequency must be Yearly, Half-Yearly, or Monthly.";
        }

        // 4. Sum Assured
        const minSA = Math.max(formData.premium * 10, 5000000);
        if (Number(formData.sumAssured) < minSA) {
            newErrors.sumAssured = `Sum Assured must be minimum of 10 times Premium or 5000000, whichever is higher. (Min required: ${minSA})`;
        }

        // 5. Age between 23 and 56
        if (age < 23 || age > 56) {
            newErrors.age = "Age must be between 23 and 56 years.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // dummy benefit illustration calculation
        const results = [
            {
                year: 1,
                premium: formData.premium,
                fundValue: formData.premium * 1.1,
            },
            {
                year: formData.pt,
                premium: formData.premium * formData.ppt,
                fundValue: formData.premium * formData.ppt * 1.5,
            },
        ];

        setTableData(results);
    };

    const exportCSV = () => {
        const csvRows = [
            ["Year", "Premium Paid", "Fund Value"],
            ...tableData.map((row) => [row.year, row.premium, row.fundValue]),
        ];
        const csv = csvRows.map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "illustration.csv";
        a.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Benefit Illustration", 14, 10);
        doc.autoTable({
            head: [["Year", "Premium Paid", "Fund Value"]],
            body: tableData.map((row) => [
                row.year,
                row.premium,
                row.fundValue,
            ]),
        });
        doc.save("illustration.pdf");
    };

    return (
        <div className="container">
            <h2>Benefit Illustration</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>PPT: </label>
                    <input
                        type="number"
                        value={formData.ppt}
                        onChange={(e) =>
                            setFormData({ ...formData, ppt: e.target.value })
                        }
                    />
                    {errors.ppt && (
                        <small style={{ color: "red" }}>{errors.ppt}</small>
                    )}
                </div>

                <div>
                    <label>PT: </label>
                    <input
                        type="number"
                        value={formData.pt}
                        onChange={(e) =>
                            setFormData({ ...formData, pt: e.target.value })
                        }
                    />
                    {errors.pt && (
                        <small style={{ color: "red" }}>{errors.pt}</small>
                    )}
                    {errors.ptppt && (
                        <small style={{ color: "red" }}>{errors.ptppt}</small>
                    )}
                </div>

                <div>
                    <label>Premium: </label>
                    <input
                        type="number"
                        value={formData.premium}
                        onChange={(e) =>
                            setFormData({ ...formData, premium: e.target.value })
                        }
                    />
                    {errors.premium && (
                        <small style={{ color: "red" }}>{errors.premium}</small>
                    )}
                </div>

                <div>
                    <label>Premium Frequency: </label>
                    <select
                        value={formData.frequency}
                        onChange={(e) =>
                            setFormData({ ...formData, frequency: e.target.value })
                        }
                    >
                        <option value="">--Select--</option>
                        <option value="Yearly">Yearly</option>
                        <option value="Half-Yearly">Half-Yearly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                    {errors.frequency && (
                        <small style={{ color: "red" }}>{errors.frequency}</small>
                    )}
                </div>

                <div>
                    <label>Sum Assured: </label>
                    <input
                        type="number"
                        value={formData.sumAssured}
                        onChange={(e) =>
                            setFormData({ ...formData, sumAssured: e.target.value })
                        }
                    />
                    {errors.sumAssured && (
                        <small style={{ color: "red" }}>{errors.sumAssured}</small>
                    )}
                </div>

                <div>
                    <label>Date of Birth: </label>
                    <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) =>
                            setFormData({ ...formData, dob: e.target.value })
                        }
                    />
                    {errors.age && (
                        <small style={{ color: "red" }}>{errors.age}</small>
                    )}
                </div>

                <button type="submit">Generate Illustration</button>
            </form>

            {tableData.length > 0 && (
                <div>
                    <h3>Illustration Table</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Premium Paid</th>
                                <th>Fund Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.year}</td>
                                    <td>{row.premium}</td>
                                    <td>{row.fundValue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={exportCSV}>Export CSV</button>
                    <button onClick={exportPDF}>Export PDF</button>
                </div>
            )}
        </div>
    );
}

export default IllustrationForm;
