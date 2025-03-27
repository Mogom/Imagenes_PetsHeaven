const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const port = 5000; // Cambiado a 5000 para coincidir con el frontend
const repoPath = path.resolve(__dirname); // Ruta del repo secundario

// Configurar almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(repoPath, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// Endpoint para subir imágenes y hacer commit automático
app.post("/api/upload", upload.single("foto"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No se subió ninguna imagen" });
  }

  const imageUrl = `https://raw.githubusercontent.com/Mogom/Imagenes_PetsHeaven/main/uploads/${req.file.filename}`;

  // Comandos para hacer commit y push
  const gitCommands = `
    cd ${repoPath} &&
    git add uploads/${req.file.filename} &&
    git commit -m "Subida de imagen: ${req.file.filename}" &&
    git push origin main
  `;

  exec(gitCommands, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error en Git: ${stderr}`);
      return res.status(500).json({ success: false, message: "Error al subir la imagen a Git" });
    }
    res.json({ success: true, imageUrl });
  });
});

// Servir imágenes estáticas (para pruebas locales)
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
