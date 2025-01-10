const express = require("express");
const {
  getYouTubeVideoInfo,
  selectBestVideoFormat,
} = require("../services/youtubeService");
const ytdl = require("ytdl-core");
const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;

  try {
    if (!url) {
      throw new Error("No se proporcionó una URL");
    }

    // Obtener información del video
    const info = await getYouTubeVideoInfo(url);

    // Seleccionar el mejor formato disponible
    const videoFormat = selectBestVideoFormat(info.formats);

    console.log(`Video encontrado: ${info.videoDetails.title}`);
    console.log(`URL del video: ${url}`);
    console.log(`Formato seleccionado: ${videoFormat.mimeType}`);

    res.header("Content-Disposition", 'attachment; filename="video.mp4"');
    ytdl(url, { format: videoFormat }).pipe(res);
  } catch (error) {
    console.error("Error al obtener el video:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;