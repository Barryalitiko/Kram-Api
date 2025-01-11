const fs = require("fs");
const path = require("path");
const express = require("express");
const playdl = require("play-dl");
const router = express.Router();

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
    const info = await playdl.video_basic_info(url);
    const sanitizedTitle = info.video_details.title.replace(/[<>:"/\\|?*]+/g, "");
    const fileName = `${sanitizedTitle}.mp3`;
    const filePath = path.join(__dirname, "../public", fileName);

    // Verificar si ya existe el archivo
    if (fs.existsSync(filePath)) {
      console.log("El archivo ya existe. Enviando enlace existente...");
      return res.json({ 
        message: "Archivo ya disponible.",
        file: `/public/${fileName}` 
      });
    }

    // Descargar directamente el audio
    console.log("Descargando audio...");
    const audioStream = await playdl.download(url, {
      quality: 2, // Mejor calidad disponible
      filter: "audioonly", // Solo audio
    });

    // Guardar el archivo descargado
    const writeStream = fs.createWriteStream(filePath);
    audioStream.pipe(writeStream);

    writeStream.on("finish", () => {
      console.log("Archivo descargado correctamente.");
      res.json({
        message: "Audio descargado con éxito.",
        file: `/public/${fileName}`,
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error al guardar el archivo:", err.message);
      res.status(500).json({ error: "Error al guardar el archivo." });
    });
  } catch (err) {
    console.error("Error al procesar el audio con play-dl:", err.message);
    res.status(500).json({ error: "Error al obtener el audio" });
  }
});

module.exports = router;