const express = require("express");
const playdl = require("play-dl");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Ruta para descargar solo audio utilizando play-dl
router.get("/", async (req, res) => {
  const { url } = req.query;

  console.log("Solicitud recibida en /playdl-audio");
  console.log(`URL recibida: ${url}`);

  if (!url || !playdl.yt_validate(url)) {
    console.log("Error: URL inválida o no es un enlace de YouTube.");
    return res.status(400).json({ error: "URL inválida" });
  }

  try {
    console.log(`Procesando audio con play-dl para la URL: ${url}`);

    // Obtener información básica del video
    console.log("Obteniendo información básica del video...");
    const info = await playdl.video_basic_info(url);
    const title = info.video_details.title.replace(/[<>:"/\\|?*]+/g, ""); // Limpiar caracteres inválidos para el nombre del archivo
    console.log("Información del video obtenida:", title);

    // Obtener flujo de audio
    console.log("Obteniendo flujo de audio...");
    const stream = await playdl.stream(url, { quality: 2 });

    // Ruta para guardar el archivo temporalmente
    const filePath = path.join(__dirname, "..", "public", `${title}.mp3`);

    // Guardar el flujo en el archivo
    const writeStream = fs.createWriteStream(filePath);
    stream.stream.pipe(writeStream);

    // Esperar hasta que el archivo esté completamente guardado
    writeStream.on("finish", () => {
      console.log(`Archivo guardado en: ${filePath}`);
      const downloadUrl = `${req.protocol}://${req.get("host")}/public/${title}.mp3`;
      console.log(`Enlace de descarga generado: ${downloadUrl}`);
      res.json({ downloadUrl }); // Enviar el enlace de descarga al cliente
    });

    writeStream.on("error", (err) => {
      console.error("Error al guardar el archivo:", err.message);
      res.status(500).json({ error: "Error al guardar el archivo de audio" });
    });
  } catch (err) {
    console.error("Error al procesar el audio con play-dl:", err.message);
    res.status(500).json({ error: "Error al obtener el audio" });
  }
});

module.exports = router;