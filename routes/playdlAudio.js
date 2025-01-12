const fs = require("fs");
const path = require("path");
const express = require("express");
const playdl = require("play-dl");
const ffmpeg = require("fluent-ffmpeg");
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

    // Verificar si el archivo ya existe
    if (fs.existsSync(filePath)) {
      console.log("El archivo ya existe. Enviando enlace existente...");
      return res.json({
        message: "Archivo ya disponible.",
        file: `/public/${fileName}`,
      });
    }

    // Obtener el flujo de audio con play-dl
    console.log("Obteniendo flujo de audio...");
    const stream = await playdl.stream(url, { quality: 2 });

    // Convertir el flujo a MP3 utilizando FFmpeg
    console.log("Convirtiendo flujo a MP3...");
    const ffmpegStream = ffmpeg(stream.stream)
      .audioCodec("libmp3lame") // Codec de audio para MP3
      .format("mp3") // Formato de salida
      .on("error", (err) => {
        console.error("Error durante la conversión:", err.message);
        res.status(500).json({ error: "Error al convertir el audio." });
      })
      .on("end", () => {
        console.log("Archivo MP3 creado exitosamente.");

        // Obtener tamaño del archivo
        const stats = fs.statSync(filePath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2); // Tamaño en MB

        // Obtener duración del contenido con ffmpeg
        ffmpeg.ffprobe(filePath, (err, metadata) => {
          if (err) {
            console.error("Error al obtener la duración:", err.message);
            return res.status(500).json({ error: "Error al obtener la duración del contenido" });
          }

          const duration = metadata.format.duration; // Duración en segundos
          const durationInMinutes = (duration / 60).toFixed(2); // Duración en minutos

          // Imprimir toda la información en la consola
          console.log("Enlace de descarga directo: ", `/public/${fileName}`);
          console.log("Tamaño del archivo: ", `${fileSizeInMB} MB`);
          console.log("Duración del contenido: ", `${durationInMinutes} minutos`);

          // Enviar la respuesta con el enlace de descarga
          res.json({
            message: "Audio descargado y convertido con éxito.",
            file: `/public/${fileName}`,
          });
        });
      })
      .save(filePath); // Guardar el archivo convertido en la carpeta public
  } catch (err) {
    console.error("Error al procesar el audio con play-dl:", err.message);
    res.status(500).json({ error: "Error al obtener el audio" });
  }
});

module.exports = router;