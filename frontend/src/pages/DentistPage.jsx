import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/DentistPage.css";

export default function DentistPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4000/api/scans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScans(res.data);
      } catch (err) {
        console.error("Error fetching scans:", err);
        alert(err.response?.data?.error || "Failed to fetch scans");
      }
    };

    fetchScans();
  }, []);

  const handleDownload = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/scans/${id}/report`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // important for PDFs
      });

      // Create blob URL and trigger download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `scan_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert(err.response?.data?.error || "Failed to download PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scans-container">
      <h2>Uploaded Scans</h2>
      <div className="scans-grid">
        {scans.map((scan) => (
          <div key={scan.id} className="scan-card">
            <img src={scan.imageUrl} alt="scan" />
            <p><b>Patient:</b> {scan.patientName}</p>
            <p><b>ID:</b> {scan.patientId}</p>
            <p><b>Type:</b> {scan.scanType}</p>
            <p><b>Region:</b> {scan.region}</p>
            <p><b>Date:</b> {scan.uploadDate}</p>
            <button onClick={() => handleDownload(scan.id)}>
              {loading ? "Downloading..." : "Download PDF"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
