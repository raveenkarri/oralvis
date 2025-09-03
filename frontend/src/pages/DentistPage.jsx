import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/DentistPage.css";

export default function DentistPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupImage, setPopupImage] = useState(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://oralvis-backend-jfma.onrender.com/api/scans`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
      const res = await axios.get(
        `https://oralvis-backend-jfma.onrender.com/api/scans/${id}/report`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );

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
      <h2 className="health-quote">
        "Healthy teeth, healthy life. Take care of your oral health every day!"
      </h2>

      <div className="scans-grid">
        {scans.map((scan, index) => (
          <div key={scan.id} className="scan-card">
            <div className="serial-number">{index + 1}.</div>

            <img
              src={scan.imageUrl}
              alt="scan"
              className="thumbnail"
              onClick={() => setPopupImage(scan.imageUrl)}
            />

            <div className="scan-details">
              <p><b>Patient:</b> <span>{scan.patientName}</span></p>
              <p><b>ID:</b> <span>{scan.patientId}</span></p>
              <p><b>Type:</b> <span>{scan.scanType}</span></p>
              <p><b>Region:</b> <span>{scan.region}</span></p>
              <p><b>Date:</b> <span>{scan.uploadDate}</span></p>
              <button onClick={() => handleDownload(scan.id)}>
                {loading ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup modal */}
      {popupImage && (
        <div className="popup-overlay" onClick={() => setPopupImage(null)}>
          <img src={popupImage} alt="full scan" className="popup-image" />
        </div>
      )}
    </div>
  );
}
