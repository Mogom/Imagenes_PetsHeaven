require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Token en .env
const REPO = "Mogom/Imagenes_PetsHeaven"; // Tu repo de imágenes

app.post('/api/subir-imagen', async (req, res) => {
  try {
    const { imagenBase64, nombreArchivo } = req.body;
    const rutaEnRepo = `uploads/${nombreArchivo}`;

    const respuesta = await axios.put(
      `https://api.github.com/repos/${REPO}/contents/${rutaEnRepo}`,
      {
        message: "Subiendo imagen desde PetsHeaven",
        content: imagenBase64,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const urlImagen = `https://raw.githubusercontent.com/${REPO}/main/${rutaEnRepo}`;
    res.json({ urlImagen });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));