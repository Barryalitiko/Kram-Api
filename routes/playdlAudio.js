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
    console.log("Información del video obtenida:", info.video_details.title);

    // Obtener flujo de audio
    const stream = await playdl.stream(url, { quality: 2 });

    // Ruta del archivo
    const fileName = `${info.video_details.title}.mp3`.replace(/[<>:"/\\|?*]+/g, ""); // Limpieza del nombre
    const filePath = path.join(__dirname, "../public", fileName);

    console.log(`Guardando audio en: ${filePath}`);

    // Escribir el flujo en un archivo
    const writeStream = fs.createWriteStream(filePath);
    stream.stream.pipe(writeStream);

    // Esperar a que termine de escribir
    writeStream.on("finish", () => {
      console.log("Archivo guardado con éxito.");
      res.json({ message: "Audio descargado con éxito.", file: `/public/${fileName}` });
    });

    writeStream.on("error", (err) => {
      console.error("Error al escribir el archivo:", err.message);
      res.status(500).json({ error: "Error al guardar el archivo." });
    });
  } catch (err) {
    console.error("Error al procesar el audio con play-dl:", err.message);
    res.status(500).json({ error: "Error al obtener el audio" });
  }
});

module.exports = router;