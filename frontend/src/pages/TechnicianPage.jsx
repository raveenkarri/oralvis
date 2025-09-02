import React, { useState } from "react";
import axios from "axios";
import "../css/TechnicianPage.css";

export default function TechnicianPage() {
  const [form, setForm] = useState({
    patientName: "",
    patientId: "",
    scanType: "RGB",
    region: "Frontal",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a scan image");

    const formData = new FormData();
    formData.append("patientName", form.patientName);
    formData.append("patientId", form.patientId);
    formData.append("scanType", form.scanType);
    formData.append("region", form.region);
    formData.append("scanImage", file);

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:4000/api/scans`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);
      alert("Scan uploaded successfully!");
      setForm({ patientName: "", patientId: "", scanType: "RGB", region: "Frontal" });
      setFile(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Upload Scan</h2>
        <input
          type="text"
          placeholder="Patient Name"
          value={form.patientName}
          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Patient ID"
          value={form.patientId}
          onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          required
        />

        <select value={form.scanType} onChange={(e) => setForm({ ...form, scanType: e.target.value })}>
          <option value="RGB">RGB</option>
        </select>

        <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
          <option value="Frontal">Frontal</option>
          <option value="Upper Arch">Upper Arch</option>
          <option value="Lower Arch">Lower Arch</option>
        </select>

        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
