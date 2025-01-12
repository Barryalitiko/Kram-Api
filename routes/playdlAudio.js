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

    // Verificar si el archivo ya existe
    if (fs.existsSync(filePath)) {
      console.log("El archivo ya existe. Enviando enlace existente...");
      return res.json({
        message: "Archivo ya disponible.",
        downloadUrl: `/public/${fileName}`, // Enlace público
      });
    }

    // Obtener el flujo de audio con play-dl
    console.log("Obteniendo flujo de audio...");
    const stream = await playdl.stream(url, { quality: 2 });

    // Crear un archivo de escritura en la carpeta public
    console.log("Creando archivo MP3...");
    const writeStream = fs.createWriteStream(filePath);
    stream.stream.pipe(writeStream);

    // Esperar a que termine la escritura
    writeStream.on("finish", () => {
      console.log("Archivo MP3 creado exitosamente.");
      res.json({
        message: "Audio descargado y almacenado con éxito.",
        downloadUrl: `/public/${fileName}`, // Enlace público
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error durante la escritura del archivo:", err.message);
      res.status(500).json({ error: "Error al guardar el archivo." });
    });
  } catch (err) {
    console.error("Error al procesar el audio con play-dl:", err.message);
    res.status(500).json({ error: "Error al obtener el audio." });
  }
});

module.exports = router;