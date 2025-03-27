const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Configurar almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath); // El destino donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nombre único basado en la fecha
  },
});

const upload = multer({ storage: storage });

// Endpoint para manejar la carga de imágenes
app.post("/api/upload", upload.single("foto"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No se ha subido ninguna imagen" });
  }

  const imageUrl = `/uploads/${req.file.filename}`; // URL de la imagen almacenada

  // Aquí puedes guardar la URL de la imagen en tu base de datos o en un archivo
  res.json({ success: true, imageUrl });
});

// Servir las imágenes estáticas desde el directorio de uploads
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
