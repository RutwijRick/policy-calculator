import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function IllustrationTable({ data, columns }) {
    const downloadCSV = () => {
        const csvRows = [];
        csvRows.push(columns.join(","));
        data.forEach(row => {
            csvRows.push(columns.map(col => row[col]).join(","));
        });
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "illustration.csv";
        a.click();
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Benefit Illustration", 14, 16);
        doc.autoTable({
            head: [columns],
            body: data.map(row => columns.map(col => row[col])),
        });
        doc.save("illustration.pdf");
    };

    return (
        <div>
            <div className="mb-3">
                <button className="btn btn-primary me-2" onClick={downloadCSV}>Download CSV</button>
                <button className="btn btn-secondary" onClick={downloadPDF}>Download PDF</button>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            {columns.map((col, i) => (
                                <td key={i}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default IllustrationTable;
