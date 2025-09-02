// routes/scans.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const {  v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { jsPDF } = require("jspdf");
const axios = require("axios");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Middleware to check token + role

function authMiddleware(requiredRole) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid or expired token" });

      if (requiredRole && decoded.role !== requiredRole) {
        let msg = "";
        if (requiredRole === "Technician") msg = "Only Technician can upload scans";
        if (requiredRole === "Dentist") msg = "Only Dentist can view scans";
        return res.status(403).json({ error: msg });
      }

      req.user = decoded;
      next();
    });
  };
}


// Multer setup (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create Scan (Technician only)
router.post("/", authMiddleware("Technician"), upload.single("scanImage"), async (req, res) => {
  const { patientName, patientId, scanType, region } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No file uploaded" });

  try {
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      { resource_type: "image", public_id: `scans/${v4()}` },
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const sql = `INSERT INTO scans (patientName, patientId, scanType, region, imageUrl, uploadDate)
                     VALUES (?, ?, ?, ?, ?, datetime('now'))`;

        db.run(sql, [patientName, patientId, scanType, region, result.secure_url], function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id: this.lastID, message: "Scan uploaded successfully" });
        });
      }
    );
    uploadResult.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all scans (Dentist only)
router.get("/", authMiddleware("Dentist"), (req, res) => {
  db.all("SELECT * FROM scans ORDER BY uploadDate DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single scan by ID (Dentist only)
router.get("/:id", authMiddleware("Dentist"), (req, res) => {
  db.get("SELECT * FROM scans WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Scan not found" });
    res.json(row);
  });
});

// Delete scan (Technician only)
router.delete("/:id", authMiddleware("Technician"), (req, res) => {
  db.run("DELETE FROM scans WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Scan deleted successfully" });
  });
});

// Generate PDF per scan
router.get("/:id/report", authMiddleware("Dentist"), async (req, res) => {
  db.get("SELECT * FROM scans WHERE id = ?", [req.params.id], async (err, scan) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!scan) return res.status(404).json({ error: "Scan not found" });

    try {
      // Fetch image as base64
      const response = await axios.get(scan.imageUrl, { responseType: "arraybuffer" });
      const imageBase64 = Buffer.from(response.data, "binary").toString("base64");

      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("Scan Report", 10, 10);
      doc.text(`Patient Name: ${scan.patientName}`, 10, 20);
      doc.text(`Patient ID: ${scan.patientId}`, 10, 30);
      doc.text(`Scan Type: ${scan.scanType}`, 10, 40);
      doc.text(`Region: ${scan.region}`, 10, 50);
      doc.text(`Upload Date: ${scan.uploadDate}`, 10, 60);

      doc.addImage(`data:image/jpeg;base64,${imageBase64}`, "JPEG", 10, 70, 180, 100);

      const pdfBuffer = doc.output("arraybuffer");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=scan_${scan.id}.pdf`);
      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

module.exports = router;
