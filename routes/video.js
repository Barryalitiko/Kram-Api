const express = require("express");
const path = require("path");
const fs = require("fs");
const playdl = require("play-dl");
const ffmpeg = require("fluent-ffmpeg");
const router = express.Router();

// Ruta para descargar video
router.get("/", async (req, res) => {
  const { url } = req.query;

  console.log("Solicitud recibida en /video");
  console.log(`URL recibida: ${url}`);

  if (!url || !playdl.yt_validate(url)) {
    console.log("Error: URL inválida o no es un enlace de YouTube.");
    return res.status(400).json({ error: "URL inválida" });
  }

  try {
    console.log(`Procesando video con play-dl para la URL: ${url}`);

    // Obtener información básica del video
    const info = await playdl.video_basic_info(url);
    const sanitizedTitle = info.video_details.title.replace(/[<>:"/\\|?*]+/g, "");
    const fileName = `${sanitizedTitle}.mp4`;
    const filePath = path.join(__dirname, "../public", fileName);

    // Verificar si el archivo ya existe
    if (fs.existsSync(filePath)) {
      console.log("El archivo ya existe. Enviando enlace existente...");
      return res.json({
        message: "Archivo ya disponible.",
        file: `/public/${fileName}`,
      });
    }

    // Obtener el flujo de video con play-dl
    console.log("Obteniendo flujo de video...");
    const stream = await playdl.stream(url, { quality: 1 });

    // Convertir el flujo a MP4 utilizando FFmpeg
    console.log("Convirtiendo flujo a MP4...");
    const ffmpegStream = ffmpeg(stream.stream)
      .videoCodec("libx264") // Codec de video para MP4
      .audioCodec("aac") // Codec de audio para MP4
      .format("mp4") // Formato de salida
      .on("error", (err) => {
        console.error("Error durante la conversión:", err.message);
        res.status(500).json({ error: "Error al convertir el video." });
      })
      .on("end", () => {
        console.log("Archivo MP4 creado exitosamente.");
        res.json({
          message: "Video descargado y convertido con éxito.",
          file: `/public/${fileName}`,
        });
      })
      .save(filePath); // Guardar el archivo convertido en la carpeta public
  } catch (err) {
    console.error("Error al procesar el video con play-dl:", err.message);
    res.status(500).json({ error: "Error al obtener el video" });
  }
});

module.exports = router;