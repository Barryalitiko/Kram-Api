const express = require("express");
const playdl = require("play-dl");
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
    console.log("Información del video obtenida:", info.video_details.title);

    // Obtener flujo de audio
    console.log("Obteniendo flujo de audio...");
    const stream = await playdl.stream(url, { quality: 2 });

    // Aquí imprimimos el enlace de descarga en el console.log
    console.log("Enlace de descarga del audio: ", stream.url);

    // Enviar respuesta al cliente
    res.header("Content-Disposition", 'attachment; filename="audio.mp3"');
    stream.stream.pipe(res);
    console.log("Audio enviado con éxito.");
  } catch (err) {
    console.error("Error al procesar el audio con play-dl:", err.message);
    res.status(500).json({ error: "Error al obtener el audio" });
  }
});

module.exports = router;