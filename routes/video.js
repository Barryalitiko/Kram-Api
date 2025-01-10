const express = require("express");
const ytdl = require("ytdl-core");
const router = express.Router();

// Ruta para descargar video completo
router.get("/", async (req, res) => {
  const { url } = req.query;
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "URL inválida" });
  }

  try {
    // Obtener información del video usando ytdl-core
    const info = await ytdl.getInfo(url);
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });

    if (!videoFormat) {
      return res.status(404).json({ error: "No se encontró un formato de video válido" });
    }

    console.log(`Video encontrado: ${info.videoDetails.title} (${url})`);
    console.log(`Formato seleccionado: ${videoFormat.mimeType}`);

    res.header("Content-Disposition", 'attachment; filename="video.mp4"');
    ytdl(url, { format: videoFormat }).pipe(res);
  } catch (err) {
    console.error("Error al obtener el video:", err.message);
    res.status(500).json({ error: "Error al obtener el video" });
  }
});

module.exports = router;